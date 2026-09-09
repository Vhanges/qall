import React from "react";

/**
 * Replaces every occurrence of "Qall" in a string with an orange (or custom-colored) span.
 */
export function highlightQall(
  text: string,
  className: string = "text-orange-500"
): React.ReactNode {
  const parts = text.split(/(Qall)/g);
  if (parts.length === 1) return text;
  return parts.map((part, i) =>
    part === "Qall" ? (
      <span key={i} className={className}>
        {part}
      </span>
    ) : (
      part
    )
  );
}
