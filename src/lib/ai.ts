import { DefaultChatTransport } from "ai";

const SESSION_KEY = "qall.chat.sessionId";

function createSessionId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `sess-${crypto.randomUUID()}`;
  }
  return `sess-${createId()}${createId()}`;
}

export function getSessionId(): string {
  if (typeof window === "undefined") {
    return "server";
  }

  try {
    const existing = window.localStorage.getItem(SESSION_KEY);
    if (existing) return existing;

    const next = createSessionId();
    window.localStorage.setItem(SESSION_KEY, next);
    return next;
  } catch {
    return createSessionId();
  }
}

export function resetSessionId(): string {
  const next = createSessionId();
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(SESSION_KEY, next);
    } catch {
      // ignore storage failures (private mode, quota)
    }
  }
  return next;
}

export const chatTransport = new DefaultChatTransport({
  api: "/api/chat",
  prepareSendMessagesRequest: ({ id, messages, trigger, messageId, body }) => ({
    body: {
      ...body,
      id,
      messages,
      trigger,
      messageId,
      sessionId: getSessionId(),
    },
  }),
});

function createId(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}