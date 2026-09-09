"use client";

import { useRef, useEffect } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap-config";

const metrics = [
  {
    metric: "Advisor Selling Time",
    before: "60%",
    after: "85%",
    improvement: "+42%",
  },
  {
    metric: "Commission Accuracy",
    before: "95%",
    after: "99.8%",
    improvement: "+5%",
  },
  {
    metric: "Lead Response Time",
    before: "48hrs",
    after: "2hrs",
    improvement: "-96%",
  },
  {
    metric: "Revenue Per Advisor",
    before: "Baseline",
    after: "+32%",
    improvement: "+32%",
  },
];

export function PerformanceTableV2() {
  const pinRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = pinRef.current;
    if (!el) return;

    const badge = el.querySelector<HTMLElement>(".ndl-badge");
    const heading = el.querySelector<HTMLElement>(".ndl-heading");
    const table = el.querySelector<HTMLElement>(".ndl-table");
    const withQallHeader = el.querySelector<HTMLElement>(".ndl-wq-header");
    const impactHeader = el.querySelector<HTMLElement>(".ndl-impact-header");
    const withQallCells = el.querySelectorAll<HTMLElement>(".ndl-wq-cell");
    const impactCells = el.querySelectorAll<HTMLElement>(".ndl-impact-cell");
    const rows = el.querySelectorAll<HTMLElement>(".ndl-row");

    // Initial states
    gsap.set([badge, heading], { autoAlpha: 0, y: 20 });
    gsap.set(table, { autoAlpha: 0, y: 20 });
    gsap.set(withQallHeader, { color: "rgba(255,255,255,0.25)" });
    gsap.set(impactHeader, { autoAlpha: 0 });
    gsap.set(withQallCells, { color: "rgba(255,255,255,0.25)" });
    gsap.set(impactCells, { autoAlpha: 0 });

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

      /* ── Phase 1: Badge + heading + table appear ── */
      tl.to(badge, { autoAlpha: 1, y: 0, duration: 1, ease: "power2.out" }, 0);
      tl.to(heading, { autoAlpha: 1, y: 0, duration: 1.5, ease: "power2.out" }, 0.3);
      tl.to(table, { autoAlpha: 1, y: 0, duration: 1.5, ease: "power2.out" }, 0.8);

      /* ── Phase 2: "With Qall" header lights up ── */
      tl.to(withQallHeader, {
        color: "rgb(249, 115, 22)",
        duration: 0.6,
        ease: "power2.out",
      }, 3);

      /* ── Phase 3: Each row lights up sequentially ── */
      withQallCells.forEach((cell, i) => {
        const startTime = 3.5 + i * 1.5;

        // "With Qall" cell goes orange
        tl.to(cell, {
          color: "rgb(249, 115, 22)",
          duration: 0.6,
          ease: "power2.out",
        }, startTime);

        // Row gets subtle glow
        if (rows[i]) {
          tl.to(rows[i], {
            backgroundColor: "rgba(249, 115, 22, 0.03)",
            duration: 0.6,
            ease: "power2.out",
          }, startTime);
        }

        // Impact badge appears AFTER the cell lights up
        if (impactCells[i]) {
          tl.to(impactCells[i], {
            autoAlpha: 1,
            duration: 0.5,
            ease: "power2.out",
          }, startTime + 0.6);
        }
      });

      /* ── Impact header appears with first impact cell ── */
      tl.to(impactHeader, {
        autoAlpha: 1,
        duration: 0.5,
        ease: "power2.out",
      }, 4.1);

      // Hold — all lit until unpin
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={pinRef} className="h-screen flex items-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-section" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-[120px] opacity-[0.04] bg-orange-500 pointer-events-none" />

      <div className="relative mx-auto max-w-5xl px-6 w-full">
        <div className="text-center mb-10">
          <span className="ndl-badge inline-block px-4 py-1.5 text-xs font-medium tracking-wider uppercase text-orange-500 bg-orange-500/10 rounded-full mb-4">
            Performance
          </span>
          <h2 className="ndl-heading font-heading font-bold text-3xl sm:text-4xl lg:text-5xl text-dark-50">
            The Numbers Don&apos;t Lie
          </h2>
        </div>

        <div className="ndl-table glass-light rounded-2xl overflow-hidden">
          {/* Header */}
          <div className="grid grid-cols-4 gap-4 p-6 border-b border-white/5 text-xs uppercase tracking-wider">
            <div className="text-white">Metric</div>
            <div className="text-center text-white">Before <span className="text-orange-500">Qall</span></div>
            <div className="ndl-wq-header text-center font-semibold">With <span className="text-orange-500">Qall</span></div>
            <div className="ndl-impact-header text-right text-white">Impact</div>
          </div>

          {/* Rows */}
          {metrics.map((row) => (
            <div
              key={row.metric}
              className="ndl-row grid grid-cols-4 gap-4 p-6 border-b border-white/5 last:border-b-0 transition-colors duration-300"
            >
              <div className="font-medium text-dark-200 text-sm">
                {row.metric}
              </div>
              <div className="text-center text-white text-sm">
                {row.before}
              </div>
              <div className="ndl-wq-cell text-center text-sm font-semibold">
                {row.after}
              </div>
              <div className="ndl-impact-cell text-right">
                <span className="inline-flex px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 text-xs">
                  {row.improvement}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
