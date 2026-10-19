"use client";

import { useState, useRef, useEffect, type FormEvent, type ReactNode } from "react";
import { useChat } from "@ai-sdk/react";
import { chatTransport } from "@/lib/ai";

function getMessageText(message: { parts: Array<{ type: string; text?: string }> }): string {
  const text = message.parts
    .filter((part) => part.type === "text")
    .map((part) => part.text ?? "")
    .join("");

  // Guard against raw API error JSON leaking into message content
  if (text.trimStart().startsWith('{"type":"error"')) {
    return "Sorry, something went wrong. Please try again or contact us at team@theqall.com.";
  }

  return text;
}

function getFriendlyError(error: Error): string {
  const msg = error.message || "";
  if (msg.includes("rate_limit") || msg.includes("429")) {
    return "Too many requests. Please wait a moment and try again.";
  }
  return "Something went wrong. Please try again.";
}

function renderInlineText(text: string, keyPrefix: string): ReactNode[] {
  const tokens = text.split(/(\[[^\]]+\]\(https?:\/\/[^)\s]+\)|\*\*[^*]+\*\*|`[^`]+`|\*[^*]+\*)/g);

  return tokens.map((token, index) => {
    const key = `${keyPrefix}-${index}`;
    const link = token.match(/^\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)$/);
    if (link) {
      return (
        <a
          key={key}
          href={link[2]}
          target="_blank"
          rel="noreferrer"
          className="text-orange-300 underline decoration-orange-300/50 underline-offset-2 hover:text-orange-200"
        >
          {link[1]}
        </a>
      );
    }
    if (token.startsWith("**") && token.endsWith("**")) {
      return <strong key={key} className="font-semibold text-dark-50">{token.slice(2, -2)}</strong>;
    }
    if (token.startsWith("`") && token.endsWith("`")) {
      return <code key={key} className="rounded bg-black/30 px-1 py-0.5 font-mono text-xs text-orange-200">{token.slice(1, -1)}</code>;
    }
    if (token.startsWith("*") && token.endsWith("*")) {
      return <em key={key}>{token.slice(1, -1)}</em>;
    }
    return token;
  });
}

function renderStyledText(text: string): ReactNode {
  const lines = text.split("\n");
  const blocks: ReactNode[] = [];
  let listItems: string[] = [];

  const flushList = () => {
    if (listItems.length === 0) return;
    blocks.push(
      <ul key={`list-${blocks.length}`} className="my-2 list-disc space-y-1.5 pl-5 first:mt-0 last:mb-0">
        {listItems.map((item, index) => (
          <li key={`item-${index}`}>{renderInlineText(item, `item-${index}`)}</li>
        ))}
      </ul>,
    );
    listItems = [];
  };

  lines.forEach((line, index) => {
    const listItem = line.match(/^\s*[-*]\s+(.+)$/);
    if (listItem) {
      listItems.push(listItem[1]);
      return;
    }

    flushList();
    if (!line.trim()) return;

    const heading = line.match(/^#{1,3}\s+(.+)$/);
    blocks.push(
      heading ? (
        <strong key={`line-${index}`} className="mb-1.5 mt-2 block font-semibold text-dark-50 first:mt-0">
          {renderInlineText(heading[1], `line-${index}`)}
        </strong>
      ) : (
        <p key={`line-${index}`} className="my-1.5 first:mt-0 last:mb-0">
          {renderInlineText(line, `line-${index}`)}
        </p>
      ),
    );
  });

  flushList();
  return blocks;
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const openButtonRef = useRef<HTMLButtonElement>(null);

  const { messages, sendMessage, status, error } = useChat({ transport: chatTransport });

  const isBusy = status === "submitted" || status === "streaming";

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input when panel opens
  useEffect(() => {
    if (isOpen) {
      const focusTimeout = setTimeout(() => inputRef.current?.focus(), 100);
      return () => clearTimeout(focusTimeout);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      openButtonRef.current?.focus();
    }
  }, [isOpen]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isBusy) return;
    sendMessage({ text: trimmed });
    setInput("");
  };

  return (
    <>
      {/* Chat Bubble */}
      {!isOpen && (
        <button
          ref={openButtonRef}
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-orange-500 text-white shadow-lg transition-all duration-300 hover:bg-orange-400 hover:scale-105 cursor-pointer"
          aria-label="Open chat"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ transform: "scaleX(-1)" }}
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          {/* Pulse ring */}
          <span className="absolute inset-0 rounded-full bg-orange-500 opacity-30 animate-ping" />
        </button>
      )}

      {/* Chat Panel */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="chat-title"
          className="fixed bottom-0 right-0 z-50 flex flex-col sm:bottom-6 sm:right-6 sm:h-[520px] sm:w-[380px] sm:rounded-2xl h-full w-full rounded-none overflow-hidden shadow-2xl border border-white/10"
          style={{
            background: "rgba(10, 14, 23, 0.97)",
            backdropFilter: "blur(20px)",
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-500/20">
                <div className="h-2.5 w-2.5 rounded-full bg-orange-500" />
              </div>
              <div>
                <h3 id="chat-title" className="text-sm font-semibold text-dark-50 font-heading">
                  Chat with Qall AI
                </h3>
                <p className="text-xs text-white">
                  We typically reply instantly
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-white transition-colors hover:bg-white/5 hover:text-dark-200 cursor-pointer"
              aria-label="Close chat"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div
            className="flex-1 overflow-y-auto bg-black/10 px-4 py-5 space-y-4"
            data-lenis-prevent
            role="log"
            aria-live="polite"
            aria-relevant="additions text"
            aria-busy={isBusy}
          >
            {/* Welcome message */}
            {messages.length === 0 && (
              <div className="flex gap-2.5">
                <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-orange-500/20">
                  <div className="h-1.5 w-1.5 rounded-full bg-orange-500" />
                </div>
                <div className="max-w-[90%] rounded-2xl rounded-tl-md border border-white/[0.06] bg-white/[0.07] px-4 py-3 text-[13px] leading-5 text-dark-200 shadow-sm">
                  Hi there! I&apos;m Qall AI, the Qall assistant. I can help you
                  learn about our insurance brokerage CRM platform. What would
                  you like to know?
                </div>
              </div>
            )}

            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-2.5 ${
                  message.role === "user" ? "flex-row-reverse" : ""
                }`}
              >
                {message.role === "assistant" && (
                  <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-orange-500/20">
                    <div className="h-1.5 w-1.5 rounded-full bg-orange-500" />
                  </div>
                )}
                <div
                  className={`max-w-[88%] break-words rounded-2xl px-4 py-3 text-[13px] leading-5 shadow-sm ${
                    message.role === "user"
                      ? "rounded-tr-md bg-gradient-to-br from-orange-500 to-orange-600 text-white"
                      : "rounded-tl-md border border-white/[0.06] bg-white/[0.07] text-dark-200"
                  }`}
                >
                  <div className={message.role === "user" ? "whitespace-pre-wrap" : undefined}>
                    {message.role === "assistant"
                      ? renderStyledText(getMessageText(message))
                      : getMessageText(message)}
                  </div>
                </div>
              </div>
            ))}

            {/* Streaming indicator */}
            {isBusy && (
              <div className="flex gap-2.5">
                <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-orange-500/20">
                  <div className="h-1.5 w-1.5 rounded-full bg-orange-500" />
                </div>
                <div
                  className="rounded-2xl rounded-tl-md border border-white/[0.06] bg-white/[0.07] px-4 py-3 shadow-sm"
                  role="status"
                  aria-label="Qall AI is typing"
                >
                  <div className="flex gap-1">
                    <span
                      className="chat-typing-dot h-1.5 w-1.5 rounded-full bg-dark-400"
                    />
                    <span
                      className="chat-typing-dot h-1.5 w-1.5 rounded-full bg-dark-400"
                    />
                    <span
                      className="chat-typing-dot h-1.5 w-1.5 rounded-full bg-dark-400"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Error message */}
            {error && (
              <div className="flex gap-2.5">
                <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-500/20">
                  <div className="h-1.5 w-1.5 rounded-full bg-red-500" />
                </div>
                <div
                  className="max-w-[88%] rounded-2xl rounded-tl-md border border-red-400/20 bg-red-500/10 px-4 py-3 text-[13px] leading-5 text-red-300 shadow-sm"
                  role="alert"
                >
                  {getFriendlyError(error)}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form
            onSubmit={handleSubmit}
            className="border-t border-white/10 px-4 py-3"
          >
            <div className="flex gap-2">
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about Qall..."
                aria-label="Message for Qall AI"
                maxLength={500}
                disabled={isBusy}
                className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-dark-50 placeholder:text-white outline-none transition-colors focus:border-orange-500/50 focus:bg-white/[0.07] disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={isBusy || !input.trim()}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-500 text-white transition-all hover:bg-orange-400 disabled:opacity-40 disabled:hover:bg-orange-500 cursor-pointer"
                aria-label="Send message"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
