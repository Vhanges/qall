"use client";

import { useEffect } from "react";
import { ScrollTrigger } from "@/lib/gsap-config";

/**
 * Kills all GSAP ScrollTrigger instances before navigation starts.
 *
 * GSAP's pin: true wraps elements in pin-spacer divs that React
 * doesn't know about. When React unmounts during navigation, it
 * calls removeChild on the wrong parent. By killing ScrollTriggers
 * on a capture-phase click (before navigation begins), the DOM is
 * restored before React touches it.
 */
export function ScrollTriggerCleanup() {
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest("a");
      if (anchor && anchor.href && !anchor.href.startsWith("#")) {
        ScrollTrigger.getAll().forEach((st) => st.kill());
      }
    };

    // Capture phase runs before the event reaches the link
    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, []);

  return null;
}
