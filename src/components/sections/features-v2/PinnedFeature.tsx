"use client";

import { useRef, useEffect } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap-config";
import type { ComparisonRowV2 } from "@/types";

interface PinnedFeatureProps {
  feature: ComparisonRowV2;
  alignment: "left" | "right";
  index: number;
}

/* ─── Abstract graphics for each feature ─── */

function OperationalGraphic() {
  return (
    <div className="relative w-full h-80 lg:h-96">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-2xl bg-orange-500/20 border border-orange-500/30 flex items-center justify-center">
        <span className="text-orange-500 text-xs font-bold">Q</span>
      </div>
      {[0, 60, 120, 180, 240, 300].map((deg) => (
        <div
          key={deg}
          className="absolute top-1/2 left-1/2 w-10 h-10 rounded-lg bg-dark-700/80 border border-dark-500/40 flex items-center justify-center"
          style={{
            transform: `translate(-50%, -50%) rotate(${deg}deg) translateY(-100px) rotate(-${deg}deg)`,
          }}
        >
          <div className="w-2 h-2 rounded-full bg-orange-500/60" />
        </div>
      ))}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] rounded-full border border-dashed border-orange-500/15" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[260px] h-[260px] rounded-full border border-dark-600/20" />
    </div>
  );
}

function FinancialGraphic() {
  return (
    <div className="relative w-full h-80 lg:h-96 flex items-end justify-center gap-3 px-8 pb-12">
      {[65, 40, 85, 55, 90, 70, 95].map((h, i) => (
        <div key={i} className="flex flex-col items-center gap-1 flex-1 max-w-[40px]">
          <div className="w-full rounded-t-md" style={{ height: `${h * 2.5}px` }}>
            <div
              className={`w-full h-full rounded-t-md ${
                i % 2 === 0
                  ? "bg-orange-500/30 border border-orange-500/20"
                  : "bg-dark-600/50 border border-dark-500/20"
              }`}
            />
          </div>
          <div className="w-full h-px bg-dark-600/30" />
        </div>
      ))}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 300 250"
        fill="none"
        preserveAspectRatio="none"
      >
        <path
          d="M 30 160 Q 75 100, 110 120 T 180 80 T 270 50"
          stroke="rgb(249 115 22 / 0.3)"
          strokeWidth="2"
          strokeDasharray="6 4"
          fill="none"
        />
      </svg>
    </div>
  );
}

function AdvisorGraphic() {
  return (
    <div className="relative w-full h-80 lg:h-96 flex items-center justify-center">
      <div className="w-64 rounded-xl bg-dark-800/60 border border-dark-600/30 overflow-hidden">
        <div className="px-4 py-3 bg-dark-700/50 border-b border-dark-600/20 flex items-center justify-between">
          <span className="text-white text-xs">Schedule</span>
          <div className="flex gap-1">
            <div className="w-2 h-2 rounded-full bg-orange-500/50" />
            <div className="w-2 h-2 rounded-full bg-green-500/50" />
          </div>
        </div>
        <div className="p-3 space-y-2">
          {[
            "09:00 — Client Review",
            "10:30 — Portfolio Call",
            "13:00 — New Lead",
            "14:30 — Follow-up",
            "16:00 — Compliance",
          ].map((item, i) => (
            <div
              key={i}
              className={`px-3 py-2 rounded-lg text-xs ${
                i === 1
                  ? "bg-orange-500/15 text-orange-400 border border-orange-500/20"
                  : "bg-dark-700/40 text-white border border-dark-600/10"
              }`}
            >
              {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function EngagementGraphic() {
  return (
    <div className="relative w-full h-80 lg:h-96 flex items-center justify-center">
      <div className="w-64 space-y-3">
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-dark-800/60 border border-dark-600/30">
          <div className="w-8 h-8 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-green-500" />
          </div>
          <div>
            <div className="text-dark-200 text-xs font-medium">Call Recorded</div>
            <div className="text-white text-[10px]">12:34 — 8m 22s</div>
          </div>
        </div>
        <div className="w-4/5">
          <div className="px-4 py-2.5 rounded-2xl rounded-bl-md bg-dark-700/60 border border-dark-600/20">
            <p className="text-white text-xs">
              Thanks for the call, just confirming our meeting Thursday?
            </p>
          </div>
        </div>
        <div className="w-4/5 ml-auto">
          <div className="px-4 py-2.5 rounded-2xl rounded-br-md bg-orange-500/15 border border-orange-500/20">
            <p className="text-orange-300 text-xs">
              Confirmed! I&apos;ll send the documents beforehand.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-dark-800/40 border border-dark-600/20">
          <div className="w-1.5 h-1.5 rounded-full bg-orange-500/50" />
          <span className="text-white text-[10px]">Auto-archived to client record</span>
        </div>
      </div>
    </div>
  );
}

const GRAPHICS: Record<ComparisonRowV2["svgKey"], React.FC> = {
  operational: OperationalGraphic,
  financial: FinancialGraphic,
  advisor: AdvisorGraphic,
  engagement: EngagementGraphic,
};

/* ─── Main component ─── */

export function PinnedFeature({
  feature,
  alignment,
}: PinnedFeatureProps) {
  const outerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const outer = outerRef.current;
    if (!outer) return;

    const badge = outer.querySelector<HTMLElement>(".pf-badge");
    const heading = outer.querySelector<HTMLElement>(".pf-heading");
    const problem = outer.querySelector<HTMLElement>(".pf-problem");
    const solution = outer.querySelector<HTMLElement>(".pf-solution");
    const detail = outer.querySelector<HTMLElement>(".pf-detail");
    const graphic = outer.querySelector<HTMLElement>(".pf-graphic");

    const targets = [badge, heading, problem, solution, detail, graphic].filter(
      Boolean
    );

    const ctx = gsap.context(() => {
      // Hide everything initially
      gsap.set(targets, { autoAlpha: 0 });

      // Use scrub tied to the tall outer wrapper — NO pin (CSS sticky handles that)
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: outer,
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
        },
      });

      // Stagger reveals — each element fades in place, no movement
      tl.to(badge, { autoAlpha: 1, duration: 0.8 }, 0)
        .to(heading, { autoAlpha: 1, duration: 1.2 }, 0.3)
        .to(graphic, { autoAlpha: 1, duration: 1.5 }, 0.8)
        .to(problem, { autoAlpha: 1, duration: 1.2 }, 2)
        .to(solution, { autoAlpha: 1, duration: 1.2 }, 3.5)
        .to(detail, { autoAlpha: 1, duration: 1.2 }, 5);
    }, outer);

    return () => ctx.revert();
  }, [feature]);

  const isLeft = alignment === "left";
  const Graphic = GRAPHICS[feature.svgKey];

  return (
    // Tall wrapper — creates the scroll distance while sticky content stays put
    <div ref={outerRef} className="relative" style={{ height: "250vh" }}>
      {/* Sticky inner — locks to viewport while user scrolls through the 250vh */}
      <div className="sticky top-0 h-screen flex items-center overflow-hidden">
        {/* Subtle gradient glow */}
        <div
          className={`absolute top-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-[120px] opacity-[0.07] pointer-events-none ${
            isLeft ? "left-0 bg-orange-500" : "right-0 bg-orange-500"
          }`}
        />

        <div className="relative mx-auto w-full max-w-7xl px-6">
          <div
            className={`flex flex-col md:flex-row items-center gap-8 lg:gap-16 ${
              isLeft ? "" : "md:flex-row-reverse"
            }`}
          >
            {/* Text side */}
            <div className="w-full md:w-1/2">
              <span className="pf-badge inline-block px-3 py-1 text-xs font-medium tracking-wider uppercase text-orange-500 bg-orange-500/10 rounded-full mb-5">
                {feature.label}
              </span>

              <h2 className="pf-heading font-heading font-bold text-3xl sm:text-4xl lg:text-5xl text-dark-50 leading-tight">
                {feature.qall.split(":")[0]}
              </h2>

              <div className="pf-problem mt-8">
                <p className="text-white line-through decoration-dark-600 text-lg leading-relaxed">
                  <span className="text-white text-sm uppercase tracking-wide mr-2 no-underline inline-block">
                    Standard CRM:
                  </span>
                  {feature.standard}
                </p>
              </div>

              <div className="pf-solution mt-6">
                <p className="text-orange-400 font-semibold text-lg lg:text-xl leading-relaxed">
                  <span className="text-orange-500 text-sm uppercase tracking-wide mr-2 inline-block">
                    Qall:
                  </span>
                  {feature.qall}
                </p>
              </div>

              {feature.detail && (
                <div className="pf-detail mt-6">
                  <p className="text-white text-base leading-relaxed">
                    {feature.detail}
                  </p>
                </div>
              )}
            </div>

            {/* Graphic side */}
            <div className="pf-graphic w-full md:w-1/2">
              <Graphic />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
