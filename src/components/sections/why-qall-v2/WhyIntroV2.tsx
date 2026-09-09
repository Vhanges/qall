"use client";

import { useRef, useEffect } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap-config";
import { WHY_INTRO_V2 } from "@/lib/constants-why-v2";

export function WhyIntroV2() {
  const pinRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = pinRef.current;
    if (!el) return;

    const badge = el.querySelector<HTMLElement>(".wi-badge");
    const heading = el.querySelector<HTMLElement>(".wi-heading");
    const para1 = el.querySelector<HTMLElement>(".wi-para1");
    const para2 = el.querySelector<HTMLElement>(".wi-para2");

    // Initial hidden states
    gsap.set(badge, { autoAlpha: 0, y: 20 });
    gsap.set(heading, { autoAlpha: 0, y: 30 });
    gsap.set(para1, { autoAlpha: 0, y: 30 });
    gsap.set(para2, { autoAlpha: 0, y: 30 });

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: "+=200%",
          pin: true,
          scrub: 0.5,
          anticipatePin: 1,
        },
      });

      /* ── Phase 1: Badge + heading appear ── */
      tl.to(badge, { autoAlpha: 1, y: 0, duration: 1, ease: "power2.out" }, 0);
      tl.to(heading, { autoAlpha: 1, y: 0, duration: 1.5, ease: "power2.out" }, 0.5);

      // Hold — heading visible

      /* ── Phase 2: First paragraph fades in ── */
      tl.to(para1, { autoAlpha: 1, y: 0, duration: 1.5, ease: "power2.out" }, 3);

      // Hold — para1 visible

      /* ── Phase 3: Second paragraph fades in ── */
      tl.to(para2, { autoAlpha: 1, y: 0, duration: 1.5, ease: "power2.out" }, 6);

      // Hold — all visible until unpin at ~10
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={pinRef} className="h-screen flex items-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-dark" />

      {/* Subtle glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-[120px] opacity-[0.05] bg-orange-500 pointer-events-none" />

      <div className="relative mx-auto max-w-3xl px-6 text-center">
        <span className="wi-badge inline-block px-4 py-1.5 text-xs font-medium tracking-wider uppercase text-orange-500 bg-orange-500/10 rounded-full mb-6">
          Why Choose Qall
        </span>

        <h2 className="wi-heading font-heading font-bold text-3xl sm:text-4xl lg:text-5xl text-dark-50 leading-tight mb-10">
          The Performance Engine for the Modern Insurance Brokerage.
        </h2>

        <p className="wi-para1 text-base sm:text-lg text-white leading-relaxed mb-6">
          {WHY_INTRO_V2.paragraph1}
        </p>

        <p className="wi-para2 text-base sm:text-lg text-dark-200 leading-relaxed font-medium">
          {WHY_INTRO_V2.paragraph2}
        </p>
      </div>
    </div>
  );
}
