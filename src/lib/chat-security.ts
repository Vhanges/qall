// Injection patterns to block
const INJECTION_PATTERNS = [
  /ignore\s+(all\s+)?previous\s+instructions/i,
  /ignore\s+(all\s+)?prior\s+instructions/i,
  /disregard\s+(all\s+)?previous/i,
  /forget\s+(all\s+)?previous/i,
  /override\s+(all\s+)?instructions/i,
  /system\s*prompt/i,
  /you\s+are\s+now/i,
  /act\s+as\s+(if\s+you\s+are\s+)?a\s+different/i,
  /pretend\s+(to\s+be|you\s+are)/i,
  /role[\s-]*play\s+as/i,
  /jailbreak/i,
  /do\s+anything\s+now/i,
  /\bdan\s+mode\b/i,
  /developer\s+mode/i,
  /\[system\]/i,
  /\[assistant\]/i,
  /\[user\]/i,
  /<<\s*sys\s*>>/i,
  /reveal\s+(your\s+)?(system|hidden|secret)\s+(prompt|instructions)/i,
  /what\s+are\s+your\s+(system\s+)?instructions/i,
  /show\s+(me\s+)?your\s+(system\s+)?prompt/i,
  /repeat\s+(your\s+)?(system|initial)\s+(prompt|instructions|message)/i,
];

const MAX_MESSAGE_LENGTH = 500;

// System prompt fragments that should never appear in output
const SYSTEM_PROMPT_FRAGMENTS = [
  "you are qall",
  "anti-injection",
  "never reveal",
  "never break character",
  "system prompt",
  "boundary instruction",
  "role boundaries",
];

interface RateLimitEntry {
  timestamps: number[];
  totalMessages: number;
}

// In-memory rate limit store (keyed by IP)
const rateLimitStore = new Map<string, RateLimitEntry>();

// Clean up stale entries every 10 minutes
const CLEANUP_INTERVAL = 10 * 60 * 1000;
let lastCleanup = Date.now();

function cleanupStaleEntries() {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL) return;
  lastCleanup = now;

  const cutoff = now - 60 * 60 * 1000; // 1 hour
  for (const [ip, entry] of rateLimitStore) {
    if (entry.timestamps.length === 0 || entry.timestamps[entry.timestamps.length - 1] < cutoff) {
      rateLimitStore.delete(ip);
    }
  }
}

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Validate and sanitize user input
 */
export function validateInput(message: string): ValidationResult {
  if (!message || typeof message !== "string") {
    return { valid: false, error: "Message is required." };
  }

  const trimmed = message.trim();

  if (trimmed.length === 0) {
    return { valid: false, error: "Message cannot be empty." };
  }

  if (trimmed.length > MAX_MESSAGE_LENGTH) {
    return {
      valid: false,
      error: `Message too long. Maximum ${MAX_MESSAGE_LENGTH} characters.`,
    };
  }

  for (const pattern of INJECTION_PATTERNS) {
    if (pattern.test(trimmed)) {
      return {
        valid: false,
        error: "I can only help with questions about Qall and insurance CRM solutions. How can I assist you today?",
      };
    }
  }

  return { valid: true };
}

/**
 * Check rate limits for an IP address
 */
export function checkRateLimit(ip: string): ValidationResult {
  cleanupStaleEntries();

  const now = Date.now();
  const entry = rateLimitStore.get(ip) || { timestamps: [], totalMessages: 0 };

  // Filter to timestamps within the last minute
  const oneMinuteAgo = now - 60 * 1000;
  entry.timestamps = entry.timestamps.filter((t) => t > oneMinuteAgo);

  // Check per-minute limit (5 messages/minute)
  if (entry.timestamps.length >= 5) {
    return {
      valid: false,
      error: "You're sending messages too quickly. Please wait a moment before trying again.",
    };
  }

  // Check session limit (20 messages total)
  if (entry.totalMessages >= 20) {
    return {
      valid: false,
      error: "You've reached the conversation limit. Please contact us at team@theqall.com or book a demo for more help.",
    };
  }

  // Record this message
  entry.timestamps.push(now);
  entry.totalMessages += 1;
  rateLimitStore.set(ip, entry);

  return { valid: true };
}

/**
 * Filter output to strip any leaked system prompt fragments
 */
export function filterOutput(text: string): string {
  const lower = text.toLowerCase();
  for (const fragment of SYSTEM_PROMPT_FRAGMENTS) {
    if (lower.includes(fragment)) {
      return "I'm here to help you learn about Qall and how it can benefit your insurance brokerage. What would you like to know?";
    }
  }
  return text;
}
