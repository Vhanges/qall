"use client";

import { useRef, useEffect } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap-config";
import { GRAPHICS } from "./FeatureGraphics";
import type { ComparisonRowV2 } from "@/types";

interface FeatureCardProps {
  feature: ComparisonRowV2;
  alignment: "left" | "right";
}

export function FeatureCard({ feature, alignment }: FeatureCardProps) {
  const pinRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = pinRef.current;
    if (!el) return;

    const badge = el.querySelector<HTMLElement>(".fc-badge");
    const heading = el.querySelector<HTMLElement>(".fc-heading");
    const standardBlock = el.querySelector<HTMLElement>(".fc-standard");
    const qallBlock = el.querySelector<HTMLElement>(".fc-qall");
    const detailBlock = el.querySelector<HTMLElement>(".fc-detail");
    const graphicSide = el.querySelector<HTMLElement>(".fc-graphic");

    const isLeft = alignment === "left";
    const textX = isLeft ? -80 : 80;
    const graphicX = isLeft ? 80 : -80;

    // Initial hidden states
    gsap.set([badge, heading], { autoAlpha: 0, x: textX });
    gsap.set(standardBlock, { autoAlpha: 0, y: 20 });
    gsap.set(qallBlock, { autoAlpha: 0, y: 20 });
    if (detailBlock) gsap.set(detailBlock, { autoAlpha: 0, y: 20 });
    gsap.set(graphicSide, { autoAlpha: 0, x: graphicX });

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

      /* ── Phase 1: Slide in badge, heading, graphic ── */
      tl.to(badge, { autoAlpha: 1, x: 0, duration: 1.5, ease: "power2.out" }, 0);
      tl.to(heading, { autoAlpha: 1, x: 0, duration: 1.5, ease: "power2.out" }, 0.3);
      tl.to(graphicSide, { autoAlpha: 0.35, x: 0, duration: 2, ease: "power2.out" }, 0.4);

      /* ── Phase 2: Standard CRM problem appears ── */
      tl.to(standardBlock, { autoAlpha: 1, y: 0, duration: 1.5, ease: "power2.out" }, 1.5);

      // Hold — standard CRM visible (gap between 3 → 5)

      /* ── Phase 3: Standard fades, Qall slides in, graphic brightens ── */
      tl.to(standardBlock, { autoAlpha: 0, duration: 1.2 }, 5);
      tl.to(graphicSide, { autoAlpha: 1, duration: 1.5, ease: "power2.out" }, 5.5);
      tl.to(qallBlock, { autoAlpha: 1, y: 0, duration: 1.5, ease: "power2.out" }, 5.5);

      if (detailBlock) {
        tl.to(detailBlock, { autoAlpha: 1, y: 0, duration: 1.5, ease: "power2.out" }, 6.5);
      }

      // Hold — Qall visible until unpin (gap until end ~10)
    }, el);

    return () => ctx.revert();
  }, [alignment, feature]);

  const isLeft = alignment === "left";
  const Graphic = GRAPHICS[feature.svgKey];

  return (
    <div ref={pinRef} className="h-screen flex items-center overflow-hidden">
      <div className="relative mx-auto w-full max-w-7xl px-6">
        {/* Subtle gradient glow */}
        <div
          className={`absolute top-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-[120px] opacity-[0.07] pointer-events-none ${
            isLeft ? "left-0 bg-orange-500" : "right-0 bg-orange-500"
          }`}
        />

        <div
          className={`flex flex-col md:flex-row items-center gap-8 lg:gap-16 ${
            isLeft ? "" : "md:flex-row-reverse"
          }`}
        >
          {/* Text side */}
          <div className="w-full md:w-1/2">
            <span className="fc-badge inline-block px-3 py-1 text-xs font-medium tracking-wider uppercase text-orange-500 bg-orange-500/10 rounded-full mb-5">
              {feature.label}
            </span>

            <h2 className="fc-heading font-heading font-bold text-3xl sm:text-4xl lg:text-5xl text-dark-50 leading-tight mb-8">
              {feature.qall.split(":")[0]}
            </h2>

            {/* Standard CRM — shown first */}
            <div className="fc-standard">
              <p className="text-white line-through decoration-dark-600 text-lg leading-relaxed">
                <span className="text-white text-sm uppercase tracking-wide mr-2 no-underline inline-block">
                  Standard CRM:
                </span>
                {feature.standard}
              </p>
            </div>

            {/* Qall solution — revealed on continued scroll */}
            <div className="fc-qall mt-6">
              <p className="text-orange-400 font-semibold text-lg lg:text-xl leading-relaxed">
                <span className="text-orange-500 text-sm uppercase tracking-wide mr-2 inline-block">
                  Qall:
                </span>
                {feature.qall}
              </p>
            </div>

            {feature.detail && (
              <div className="fc-detail mt-6">
                <p className="text-white text-base leading-relaxed">
                  {feature.detail}
                </p>
              </div>
            )}
          </div>

          {/* Graphic side */}
          <div className="fc-graphic w-full md:w-1/2">
            <Graphic />
          </div>
        </div>
      </div>
    </div>
  );
}
