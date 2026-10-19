import { createUIMessageStream, createUIMessageStreamResponse } from "ai";
import { validateInput, filterOutput } from "@/lib/chat-security";

const WEBHOOK_URL =
  process.env.N8N_WEBHOOK_URL ??
  "http://localhost:5678/webhook/qall";

/**
 * Shared secret for the n8n webhook, sent server-side only.
 *
 * The n8n `QALL Webhook` node uses Header Auth. This value must match that
 * credential's value exactly. Never expose it to the browser: there is no
 * `NEXT_PUBLIC_` prefix here, so it stays inside the server runtime and the
 * public `/api/chat` route remains the only caller of n8n.
 */
const WEBHOOK_AUTH_HEADER = "X-QALL-Key";
const WEBHOOK_API_KEY = process.env.QALL_WEBHOOK_API_KEY;

if (!WEBHOOK_API_KEY) {
  console.warn(
    "[qall] QALL_WEBHOOK_API_KEY is not set; n8n requests will be sent unauthenticated."
  );
}

const REQUEST_TIMEOUT_MS = 60_000;

const CHUNK_DELAY_MS = 14;
const CHARS_PER_SECOND = 90;
const MIN_REVEAL_MS = 350;
const MAX_REVEAL_MS = 5_000;

const SESSION_ID_PATTERN = /^[\w-]{1,128}$/;

type IncomingMessage = {
  role?: string;
  parts?: Array<{ type?: string; text?: string }>;
};

type IncomingBody = {
  messages?: IncomingMessage[];
  sessionId?: unknown;
};

function getPartText(part: { type?: string; text?: string }): string {
  return part.type === "text" ? part.text ?? "" : "";
}

function getMessageText(message: IncomingMessage): string {
  return (message.parts ?? []).map(getPartText).join("");
}

function getReplyText(json: unknown): string {
  if (json == null || typeof json !== "object" || Array.isArray(json)) {
    return "";
  }
  const reply = (json as Record<string, unknown>).response;
  return typeof reply === "string" ? reply : "";
}

function errorResponse(message: string, status: number) {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

const CONTACT_LINE = "contact us at team@theqall.com";

/**
 * Curated, visitor-facing copy for upstream failures. Status codes and n8n
 * internals must never reach a visitor — see N8N_INTEGRATION.md mismatch #5.
 */
function friendlyErrorForStatus(status: number): string {
  if (status === 400 || status === 422) {
    return "I wasn't able to understand that request. Could you rephrase your question about QALL?";
  }
  if (status === 401 || status === 403) {
    return `The assistant is temporarily unavailable while it's being set up. Please try again in a few minutes, or ${CONTACT_LINE}.`;
  }
  if (status === 404) {
    return `The assistant isn't available at the moment. Please try again shortly, or ${CONTACT_LINE}.`;
  }
  if (status === 413) {
    return "That message is a little too long for me. Could you shorten it and try again?";
  }
  if (status === 408 || status === 504) {
    return "The assistant is taking a little longer than usual to answer. Please try again in a moment.";
  }
  if (status === 429) {
    return "You're sending messages a little too quickly. Please wait a moment before trying again.";
  }
  if (status >= 500) {
    return `Sorry — the assistant is having trouble answering right now. Please try again in a moment, or ${CONTACT_LINE}.`;
  }
  return `Sorry, I couldn't get an answer just now. Please try again shortly, or ${CONTACT_LINE}.`;
}

const MAX_UPSTREAM_MESSAGE_LENGTH = 300;

/**
 * n8n's authored error branches return `{ response, error: true }` carrying
 * human-written copy, which beats anything we would invent. Anything else it
 * returns on an error — plain-text infrastructure strings such as
 * "Authorization data is wrong!", HTML, or a serialised error object — is
 * rejected, so only the documented `{ response }` shape is ever shown.
 */
function getSafeUpstreamMessage(json: unknown): string {
  // Deliberately no raw-body fallback: a non-JSON body is n8n plumbing, not copy.
  const text = getReplyText(json).trim();

  if (!text || text.length > MAX_UPSTREAM_MESSAGE_LENGTH) return "";
  if (/^\s*[[{<]/.test(text)) return ""; // serialised JSON or HTML
  if (/\n\s*at\s/.test(text)) return ""; // stack trace frames
  if (
    /\b(stack ?trace|credential|authorization|unauthorized|forbidden|ECONNREFUSED|ENOTFOUND|ECONNRESET|ETIMEDOUT|fetch failed|undefined|null|Exception|node id|webhook)\b/i.test(
      text,
    )
  ) {
    return "";
  }

  return text;
}

function planChunkSize(length: number): number {
  if (length <= 0) return 0;

  const targetMs = Math.min(
    MAX_REVEAL_MS,
    Math.max(MIN_REVEAL_MS, (length / CHARS_PER_SECOND) * 1000)
  );
  const chunkCount = Math.max(1, Math.ceil(targetMs / CHUNK_DELAY_MS));

  return Math.max(1, Math.ceil(length / chunkCount));
}

function createAssistantResponse(req: Request, replyText: string) {
  const chunkSize = planChunkSize(replyText.length);

  const stream = createUIMessageStream({
    async execute({ writer }) {
      writer.write({ type: "text-start", id: "assistant-response" });

      for (let i = 0; i < replyText.length; i += chunkSize) {
        if (req.signal.aborted) break;

        writer.write({
          type: "text-delta",
          id: "assistant-response",
          delta: replyText.slice(i, i + chunkSize),
        });

        await new Promise((resolve) => setTimeout(resolve, CHUNK_DELAY_MS));
      }

      writer.write({ type: "text-end", id: "assistant-response" });
    },
  });

  return createUIMessageStreamResponse({ stream });
}

export async function POST(req: Request) {
  let body: IncomingBody = {};
  try {
    body = await req.json();
  } catch {
    // fall through with empty body
  }

  const sessionId =
    typeof body.sessionId === "string" ? body.sessionId.trim() : "";

  if (!SESSION_ID_PATTERN.test(sessionId)) {
    return Response.json(
      { error: "A valid sessionId is required." },
      { status: 400 }
    );
  }

  const messages = body.messages ?? [];
  const lastUserMessage = [...messages]
    .reverse()
    .find((message) => message.role === "user");
  const userMessage = lastUserMessage ? getMessageText(lastUserMessage) : "";

  if (!userMessage.trim()) {
    return Response.json(
      { error: "A user message is required." },
      { status: 400 }
    );
  }

  const validation = validateInput(userMessage);
  if (!validation.valid) {
    return createAssistantResponse(
      req,
      validation.error ??
        "I can only help with questions about Qall and insurance CRM solutions."
    );
  }

  let replyText = "";
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(WEBHOOK_API_KEY
          ? { [WEBHOOK_AUTH_HEADER]: WEBHOOK_API_KEY }
          : {}),
      },
      body: JSON.stringify({ sessionId, message: userMessage }),
      signal: controller.signal,
    });

    const text = await response.text();
    let json: unknown = text;
    try {
      json = JSON.parse(text);
    } catch {
      // keep raw text
    }

    if (!response.ok) {
      // Prefer n8n's own human-written copy; fall back to ours. Either way the
      // visitor never sees the status code or the raw body.
      const upstream = getSafeUpstreamMessage(json);
      replyText = upstream || friendlyErrorForStatus(response.status);
      console.error(
        `[qall] n8n responded ${response.status}${upstream ? " (used upstream copy)" : " (used fallback copy)"}`
      );
    } else {
      replyText = getReplyText(json);

      if (!replyText.trim()) {
        throw new Error("The assistant returned an empty response");
      }
    }
  } catch (error) {
    const isAbort = error instanceof Error && error.name === "AbortError";
    const isEmptyReply =
      error instanceof Error &&
      error.message === "The assistant returned an empty response";

    console.error("[qall] n8n request failed:", error);

    if (isAbort) {
      replyText =
        "The assistant is taking a little longer than usual to answer. Please try again in a moment.";
    } else if (isEmptyReply) {
      replyText =
        "Sorry, the assistant couldn't complete that request. Please try again in a moment.";
    } else {
      // Deliberately opaque: error.message here is Node internals ("fetch
      // failed", socket errors) and must never reach a visitor.
      replyText = `Sorry, I couldn't reach the assistant right now. Please try again shortly, or ${CONTACT_LINE}.`;
    }
  } finally {
    clearTimeout(timeout);
  }

  replyText = filterOutput(replyText);

  return createAssistantResponse(req, replyText);
}