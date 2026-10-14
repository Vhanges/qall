# Plan: Migrate Qall Marketing Site Chat to n8n Workflow

**Date:** 2026-10-14
**Reference implementation:** `J:\Front Ends\bobba-union` (proven n8n chat integration)
**Goal:** Replace the internal OpenAI handling in `qall_marketing_site` with an n8n webhook proxy, following the exact process bobba-union uses. All AI logic (system prompt, LLM call, conversation memory) moves to n8n; the Next.js app becomes a thin, validated proxy.

---

## 1. Current State

### qall_marketing_site (this project) — internal AI handling
| File | Role |
|---|---|
| `src/app/api/chat/route.ts` | Calls `openai("gpt-4.1-nano")` directly via AI SDK `streamText`. Sends full conversation (trimmed to last 10 messages) + `QALL_SYSTEM_PROMPT` on every request. |
| `src/lib/chat-prompt.ts` | `QALL_SYSTEM_PROMPT` — the chatbot persona/rules. |
| `src/lib/chat-security.ts` | IP rate limiting (5/min, 20/session), prompt-injection pattern blocking, output filtering, conversation trimming. |
| `src/components/shared/ChatWidget.tsx` | `useChat()` with default transport — no sessionId, no custom transport. |

Dependencies: `ai@^6.0.86`, `@ai-sdk/react@^3.0.88`, `@ai-sdk/openai@^3.0.29`. Next 16.1.6.

### bobba-union (reference) — n8n proxy pattern
| File | Role |
|---|---|
| `src/app/api/chat/route.ts` | Validates `sessionId` (`/^[\w-]{1,128}$/`), extracts the **last user message only**, POSTs `{ sessionId, message }` to `N8N_WEBHOOK_URL` (60s timeout), parses `{ response: string }`, then re-emits the full reply as progressive `text-delta` chunks via `createUIMessageStream` (simulated streaming: 14ms/chunk, ~90 chars/sec, clamped 350ms–5s). Friendly fallback text on timeout/empty/error. Honors `req.signal` aborts ("Stop generating"). |
| `src/lib/ai.ts` | Session ID in localStorage (`bobba-union.chat.sessionId`), `DefaultChatTransport` with `prepareSendMessagesRequest` that injects `sessionId` into every request body. |
| `src/components/chat/chat-widget.tsx` | `useChat({ transport: chatTransport })`. |

Dependencies: `ai@^7`, `@ai-sdk/react@^4`. No `@ai-sdk/openai` — no direct LLM dependency at all.

**Key insight:** bobba-union's contract is minimal — `{ sessionId, message }` in, `{ response }` out. Conversation memory and the system prompt live **inside n8n**, keyed by sessionId. The client only ever sends the latest user message.

---

## 2. Target Architecture

```
Browser (ChatWidget)
  │  useChat({ transport: chatTransport })   ← sends { messages, sessionId }
  ▼
Next.js /api/chat  (thin proxy — keeps qall's security layers)
  │  1. Rate limit by IP (existing checkRateLimit)
  │  2. Injection-pattern validation (existing validateInput)
  │  3. sessionId format validation (new, from bobba-union)
  │  4. POST { sessionId, message } → n8n webhook (60s timeout)
  │  5. Parse { response }, apply filterOutput guard
  │  6. Re-emit as progressive text-delta stream (bobba-union's chunking)
  ▼
n8n workflow  (owns ALL AI logic)
  │  Webhook node → memory (keyed by sessionId) → system prompt → LLM → Respond { response }
  ▼
{ "response": "..." }  ← single JSON body back to Next.js
```

**Design decisions (stated, not open questions):**

1. **Keep qall's security layers in the Next.js route.** bobba-union has none; qall is a public marketing site and these guards (rate limit, injection blocking) fail fast *before* burning an n8n execution. This is a deliberate improvement over the reference, not a deviation from its contract.
2. **Adopt the bobba-union wire contract verbatim:** `{ sessionId, message }` → `{ response }`. No message history, no system prompt on the wire. Memory moves to n8n.
3. **No dependency upgrades.** `ai@^6` already has `createUIMessageStream`, `DefaultChatTransport`, and `prepareSendMessagesRequest` — everything the pattern needs. Upgrading to `ai@^7` mid-migration adds risk for zero benefit. `@ai-sdk/openai` gets removed at cleanup.
4. **`chat-prompt.ts` stays in the repo as the source of truth** for the persona, but its content is copied into the n8n workflow's system-prompt node. (Single source of truth is n8n after cutover; the file remains as documentation/reference for edits.)

---

## 3. Implementation Steps

### Step 1 — n8n workflow (prerequisite, outside this repo)
Create (or clone from the bobba-union workflow) an n8n workflow with webhook path `qall-marketing`:

- **Webhook node:** POST `http://<n8n-host>:5678/webhook/qall-marketing`, accepts `{ sessionId, message }`.
- **Memory:** per-session chat memory keyed by `sessionId` (same mechanism as the bobba-union workflow — Window Buffer Memory with session key).
- **System prompt:** copy the full text of `QALL_SYSTEM_PROMPT` from `src/lib/chat-prompt.ts` into the LLM node's system message.
- **Respond node:** returns `{ "response": "<reply text>" }` as JSON. Must return 200 with the body even on partial failures where possible; note that n8n returns 200 + empty body when a node fails before Respond (the route handles this — see Step 3).
- **Error handling:** configure the LLM node's `onError` so a hard failure still reaches a Respond node with a graceful message.

### Step 2 — `src/lib/ai.ts` (new file, ported from bobba-union)
Port `J:\Front Ends\bobba-union\src\lib\ai.ts` with these changes:
- `SESSION_KEY` → `"qall.chat.sessionId"`.
- Keep `getSessionId`, `resetSessionId`, `createSessionId`, `chatTransport` (`DefaultChatTransport`, `api: "/api/chat"`, `prepareSendMessagesRequest` injecting `sessionId`).
- Skip porting `createChat`/`createId` builder helpers — qall's ChatWidget doesn't use initial messages (it renders a static welcome bubble).

### Step 3 — rewrite `src/app/api/chat/route.ts`
Replace the OpenAI call with the bobba-union proxy pattern, **keeping qall's security layers**. New route flow:

1. IP extraction + `checkRateLimit(ip)` → 429 on failure (existing).
2. Parse body; validate `sessionId` against `/^[\w-]{1,128}$/` → 400 (from bobba-union).
3. Extract last user message text from `messages` parts → `validateInput(text)` → 400 with the existing friendly error (existing).
4. `fetch(N8N_WEBHOOK_URL, { method: POST, body: { sessionId, message }, signal: AbortController(60s) })`.
5. Parse response: JSON `{ response }` (fall back to raw text). Empty reply → friendly fallback message (bobba-union behavior).
6. Apply `filterOutput(replyText)` from `chat-security.ts` as a final leak guard before streaming (qall-specific addition).
7. Re-emit via `createUIMessageStream` with bobba-union's chunk-planning (`planChunkSize`, 14ms delay, 90 chars/sec, 350ms–5s clamp) and `req.signal.aborted` checks.

Error fallbacks (ported): timeout → "took too long" message; network error → "couldn't reach the assistant / make sure the n8n workflow is running" message (rebranded to Qall tone, keep `team@qall.co.uk` contact).

**Removed from this route:** `streamText`, `convertToModelMessages`, `@ai-sdk/openai` import, `trimConversation` (memory is n8n's job now), `QALL_SYSTEM_PROMPT` import.

### Step 4 — update `src/components/shared/ChatWidget.tsx`
- Import `chatTransport` from `@/lib/ai`.
- `useChat({ transport: chatTransport })` instead of `useChat()`.
- Keep the existing UI entirely (welcome bubble, error rendering, streaming dots). No visual changes.
- `getFriendlyError` stays as-is — it already handles generic failures.

### Step 5 — environment configuration
- **Dev:** create `.env.local` with `N8N_WEBHOOK_URL=http://localhost:5678/webhook/qall-marketing` (default fallback in code mirrors bobba-union: same URL as code default).
- **Production:** add `N8N_WEBHOOK_URL` to the `env` block in `ecosystem.config.js` (PM2) pointing at the production n8n instance, then `pm2 restart qall --update-env`.
- **Remove** `OPENAI_API_KEY` from the production server env during cleanup (Step 7) — nothing reads it after migration.

### Step 6 — verification
1. `npm run dev` with n8n running; open the site, chat via the widget.
2. Confirm: reply streams progressively; conversation context persists across turns (proves n8n memory + sessionId work).
3. Failure paths (n8n stopped, webhook path wrong, LLM node erroring): confirm friendly fallback text renders in the widget, no raw JSON leaks.
4. Rate limit: 6 rapid messages → 429 friendly message.
5. Injection attempt ("ignore previous instructions") → blocked client-visible message, n8n never called.
6. `npm run build` passes; no `@ai-sdk/openai` imports remain.

### Step 7 — cleanup (after verification)
- `npm uninstall @ai-sdk/openai`.
- Add a header comment to `chat-prompt.ts`: "Reference copy — the live system prompt is maintained in the n8n `qall-marketing` workflow."
- `chat-security.ts`: keep `validateInput`, `checkRateLimit`, `filterOutput`; delete now-unused `trimConversation` and the `SYSTEM_PROMPT_FRAGMENTS` list stays (used by `filterOutput`).
- Update `DEPLOYMENT.md` with the new `N8N_WEBHOOK_URL` env var and the n8n dependency.

---

## 4. File Change Summary

| File | Action |
|---|---|
| `src/lib/ai.ts` | **Create** — sessionId + transport (ported from bobba-union, qall storage key) |
| `src/app/api/chat/route.ts` | **Rewrite** — n8n proxy replacing direct OpenAI call; keeps security layers |
| `src/components/shared/ChatWidget.tsx` | **Edit** — wire `chatTransport` into `useChat` |
| `.env.local` | **Create** — `N8N_WEBHOOK_URL` |
| `ecosystem.config.js` | **Edit** — add `N8N_WEBHOOK_URL` to PM2 env |
| `src/lib/chat-prompt.ts` | **Edit** — header comment marking it as reference copy |
| `src/lib/chat-security.ts` | **Edit** — remove `trimConversation` |
| `package.json` | **Edit** — remove `@ai-sdk/openai` |
| `DEPLOYMENT.md` | **Edit** — document n8n dependency + env var |
| n8n | **Create workflow** — `qall-marketing` webhook (outside repo) |

## 5. Risks & Notes

- **n8n single-point-of-failure:** if n8n is down, chat shows the fallback message. Same trade-off bobba-union accepted; acceptable for a marketing-site assistant.
- **Memory location change:** conversation history now lives in n8n's memory store, not in the request. If n8n's memory store is in-memory (not Redis), restarts lose sessions — same as bobba-union; fine for pre-sales chat.
- **`ai` v6 vs v7 API drift:** `createUIMessageStream` / `DefaultChatTransport` / `prepareSendMessagesRequest` all exist in v6 with compatible signatures. If TypeScript surfaces a signature mismatch during implementation, adapt the call site — do not upgrade mid-migration.
- **Latency:** n8n adds a hop; the 60s timeout and progressive reveal keep perceived latency fine.
- **Rollback:** revert the route + widget commits and restore `OPENAI_API_KEY` env — the old path is fully removed only in Step 7, so rollback before cleanup is a single `git revert`.
