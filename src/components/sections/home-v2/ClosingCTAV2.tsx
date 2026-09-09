"use client";

import { useRef, useEffect } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap-config";
import { CTABanner } from "@/components/shared/CTABanner";
import { CLOSING_V2 } from "@/lib/constants-home-v2";
import { highlightQall } from "@/lib/highlight-qall";

export function ClosingCTAV2() {
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      // Scale-up entrance for the entire CTA section
      gsap.fromTo(
        el,
        { scale: 0.92, opacity: 0.5 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.6,
          ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            once: true,
          },
        }
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <div ref={wrapRef} className="will-change-transform">
      <CTABanner
        title={CLOSING_V2.title}
        description={CLOSING_V2.description}
        buttonText={CLOSING_V2.buttonText}
        buttonHref={CLOSING_V2.buttonHref}
        highlightWords={["Outperform the Competition."]}
      />
    </div>
  );
}
