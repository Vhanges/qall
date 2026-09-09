import { streamText, convertToModelMessages, type UIMessage } from "ai";
import { openai } from "@ai-sdk/openai";
import { QALL_SYSTEM_PROMPT } from "@/lib/chat-prompt";
import {
  validateInput,
  checkRateLimit,
  trimConversation,
} from "@/lib/chat-security";
import { headers } from "next/headers";

function extractText(message: UIMessage): string {
  return message.parts
    .filter((p): p is { type: "text"; text: string } => p.type === "text")
    .map((p) => p.text)
    .join("");
}

function errorResponse(message: string, status: number) {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export async function POST(req: Request) {
  try {
    const headersList = await headers();
    const ip =
      headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      headersList.get("x-real-ip") ||
      "unknown";

    // Rate limit check
    const rateCheck = checkRateLimit(ip);
    if (!rateCheck.valid) {
      return errorResponse(rateCheck.error!, 429);
    }

    const body = await req.json();
    const { messages } = body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return errorResponse("Messages are required.", 400);
    }

    // Validate the latest user message (extract text from parts)
    const lastMessage = messages[messages.length - 1] as UIMessage;
    if (lastMessage?.role === "user") {
      const text = extractText(lastMessage);
      const validation = validateInput(text);
      if (!validation.valid) {
        return errorResponse(validation.error!, 400);
      }
    }

    // Trim conversation to last 10 messages to cap token usage
    const trimmedMessages = trimConversation(messages as UIMessage[], 10);

    // Convert UIMessages (parts format) to ModelMessages (content format)
    const modelMessages = await convertToModelMessages(trimmedMessages);

    const result = streamText({
      model: openai("gpt-4.1-nano"),
      system: QALL_SYSTEM_PROMPT,
      messages: modelMessages,
    });

    return result.toUIMessageStreamResponse({
      sendReasoning: false,
    });
  } catch (err: unknown) {
    // Map OpenAI API errors to friendly messages
    const message =
      err instanceof Error && err.message?.includes("insufficient_quota")
        ? "The assistant is temporarily unavailable. Please try again later or contact us at team@qall.co.uk."
        : "An error occurred. Please try again.";

    return errorResponse(message, 500);
  }
}
