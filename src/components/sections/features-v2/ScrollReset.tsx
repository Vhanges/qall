"use client";

import { useEffect } from "react";
import { ScrollTrigger } from "@/lib/gsap-config";

export function ScrollReset() {
  useEffect(() => {
    // Disable browser scroll restoration so we always start at top
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }

    window.scrollTo(0, 0);

    // Give Lenis + layout a frame to settle, then refresh all ScrollTriggers
    requestAnimationFrame(() => {
      ScrollTrigger.refresh();
    });

    // Handle bfcache (back/forward navigation restoring cached page)
    function onPageShow(e: PageTransitionEvent) {
      if (e.persisted) {
        window.scrollTo(0, 0);
        ScrollTrigger.refresh();
      }
    }
    window.addEventListener("pageshow", onPageShow);

    return () => {
      window.removeEventListener("pageshow", onPageShow);
    };
  }, []);

  return null;
}
