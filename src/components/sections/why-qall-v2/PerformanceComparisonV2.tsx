"use client";

import { useRef, useEffect } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap-config";
import { COMPARISON_V2 } from "@/lib/constants-why-v2";

export function PerformanceComparisonV2() {
  const pinRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = pinRef.current;
    if (!el) return;

    const heading = el.querySelector<HTMLElement>(".pc-heading");
    const table = el.querySelector<HTMLElement>(".pc-table");
    const qallHeader = el.querySelector<HTMLElement>(".pc-qall-header");
    const qallCells = el.querySelectorAll<HTMLElement>(".pc-qall-cell");
    const rowHighlights = el.querySelectorAll<HTMLElement>(".pc-row");

    gsap.set(heading, { autoAlpha: 0, y: 30 });
    gsap.set(table, { autoAlpha: 0, y: 20 });
    // Qall header starts grey
    gsap.set(qallHeader, { color: "rgba(255,255,255,0.25)" });
    // Qall cells start grey
    gsap.set(qallCells, { color: "rgba(255,255,255,0.25)" });

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: "+=150%",
          pin: true,
          scrub: 0.5,
          anticipatePin: 1,
        },
      });

      /* ── Phase 1: Heading + table appear ── */
      tl.to(heading, { autoAlpha: 1, y: 0, duration: 1.5, ease: "power2.out" }, 0);
      tl.to(table, { autoAlpha: 1, y: 0, duration: 1.5, ease: "power2.out" }, 0.5);

      /* ── Phase 2: Qall column lights up row by row ── */
      // Header lights up first
      tl.to(qallHeader, {
        color: "rgb(249, 115, 22)",
        duration: 0.8,
        ease: "power2.out",
      }, 3);

      // Each row lights up sequentially with a stagger
      qallCells.forEach((cell, i) => {
        const rowEl = rowHighlights[i];
        const startTime = 3.5 + i * 1.2;

        // Cell text goes orange
        tl.to(cell, {
          color: "rgb(249, 115, 22)",
          duration: 0.8,
          ease: "power2.out",
        }, startTime);

        // Row gets a subtle glow
        if (rowEl) {
          tl.to(rowEl, {
            backgroundColor: "rgba(249, 115, 22, 0.03)",
            duration: 0.8,
            ease: "power2.out",
          }, startTime);
        }
      });

      // Hold — all lit up until unpin
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={pinRef} className="h-screen flex items-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-section" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-[120px] opacity-[0.04] bg-orange-500 pointer-events-none" />

      <div className="relative mx-auto max-w-5xl px-6 w-full">
        <h2 className="pc-heading font-heading font-bold text-2xl sm:text-3xl lg:text-4xl text-dark-50 text-center mb-10">
          {COMPARISON_V2.heading}
        </h2>

        <div className="pc-table glass-light rounded-2xl overflow-hidden">
          {/* Header */}
          <div className="grid grid-cols-3 gap-4 p-5 sm:p-6 border-b border-white/10">
            <div className="text-xs uppercase tracking-wider text-white font-bold">
              {COMPARISON_V2.columns[0]}
            </div>
            <div className="text-xs uppercase tracking-wider text-center text-white">
              {COMPARISON_V2.columns[1]}
            </div>
            <div className="pc-qall-header text-xs uppercase tracking-wider text-center font-semibold">
              {COMPARISON_V2.columns[2]}
            </div>
          </div>

          {/* Rows */}
          {COMPARISON_V2.rows.map((row) => (
            <div
              key={row.feature}
              className="pc-row grid grid-cols-3 gap-4 p-5 sm:p-6 border-b border-white/5 last:border-b-0 transition-colors duration-300"
            >
              <div className="font-medium text-dark-200 text-sm">
                {row.feature}
              </div>
              <div className="text-center text-white text-sm">
                {row.legacy}
              </div>
              <div className="pc-qall-cell text-center text-sm font-medium">
                {row.qall}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
