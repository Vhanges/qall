"use client";

import { useState, useRef, useEffect, type FormEvent } from "react";
import { useChat } from "@ai-sdk/react";
import { chatTransport } from "@/lib/ai";

function getMessageText(message: { parts: Array<{ type: string; text?: string }> }): string {
  const text = message.parts
    .filter((part) => part.type === "text")
    .map((part) => part.text ?? "")
    .join("");

  // Guard against raw API error JSON leaking into message content
  if (text.trimStart().startsWith('{"type":"error"')) {
    return "Sorry, something went wrong. Please try again or contact us at team@qall.co.uk.";
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

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { messages, sendMessage, status, error } = useChat({ transport: chatTransport });

  const isBusy = status === "submitted" || status === "streaming";

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input when panel opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
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
                <h3 className="text-sm font-semibold text-dark-50 font-heading">
                  Chat with Chuck
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
            className="flex-1 overflow-y-auto px-4 py-4 space-y-3"
            data-lenis-prevent
          >
            {/* Welcome message */}
            {messages.length === 0 && (
              <div className="flex gap-2.5">
                <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-orange-500/20">
                  <div className="h-1.5 w-1.5 rounded-full bg-orange-500" />
                </div>
                <div className="rounded-xl rounded-tl-sm bg-white/5 px-3.5 py-2.5 text-sm text-dark-200 leading-relaxed max-w-[85%]">
                  Hi there! I&apos;m Chuck, the Qall assistant. I can help you
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
                  className={`rounded-xl px-3.5 py-2.5 text-sm leading-relaxed max-w-[85%] ${
                    message.role === "user"
                      ? "rounded-tr-sm bg-orange-500 text-white"
                      : "rounded-tl-sm bg-white/5 text-dark-200"
                  }`}
                >
                  {getMessageText(message)}
                </div>
              </div>
            ))}

            {/* Streaming indicator */}
            {status === "submitted" && (
              <div className="flex gap-2.5">
                <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-orange-500/20">
                  <div className="h-1.5 w-1.5 rounded-full bg-orange-500" />
                </div>
                <div className="rounded-xl rounded-tl-sm bg-white/5 px-3.5 py-2.5">
                  <div className="flex gap-1">
                    <span
                      className="h-1.5 w-1.5 rounded-full bg-dark-400 animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    />
                    <span
                      className="h-1.5 w-1.5 rounded-full bg-dark-400 animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    />
                    <span
                      className="h-1.5 w-1.5 rounded-full bg-dark-400 animate-bounce"
                      style={{ animationDelay: "300ms" }}
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
                <div className="rounded-xl rounded-tl-sm bg-red-500/10 px-3.5 py-2.5 text-sm text-red-300 max-w-[85%]">
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
