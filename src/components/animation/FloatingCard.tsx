"use client";

import { useRef, useEffect } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap-config";

/**
 * A floating CRM dashboard widget that animates through the page
 * as the user scrolls — rotating, scaling, and shifting in 3-D space.
 * Shows a mini pipeline / live metrics view relevant to broker CRM.
 *
 * Desktop only (hidden on < 1024 px).
 */
export function FloatingCard() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined" || window.innerWidth < 1024) return;

    const card = cardRef.current;
    if (!card) return;

    gsap.set(card, { opacity: 0 });

    const ctx = gsap.context(() => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;

      ScrollTrigger.create({
        trigger: document.documentElement,
        start: "top top",
        end: "bottom bottom",
        scrub: 1.2,
        onUpdate(self) {
          const p = self.progress;

          let opacity = 0;
          if (p < 0.03) {
            opacity = p / 0.03;
          } else if (p < 0.42) {
            opacity = 1;
          } else if (p < 0.52) {
            opacity = 1 - (p - 0.42) / 0.1;
          }

          if (opacity <= 0.01) {
            gsap.set(card, { opacity: 0 });
            return;
          }

          let x: number, y: number, rotY: number, rotX: number, rotZ: number, scale: number;

          if (p < 0.08) {
            const t = p / 0.08;
            x = gsap.utils.interpolate(vw * 0.85, vw * 0.62, t);
            y = gsap.utils.interpolate(-vh * 0.1, vh * 0.12, t);
            rotY = gsap.utils.interpolate(-30, -12, t);
            rotX = gsap.utils.interpolate(18, 6, t);
            rotZ = gsap.utils.interpolate(-10, -4, t);
            scale = gsap.utils.interpolate(0.6, 0.85, t);
          } else if (p < 0.22) {
            const t = (p - 0.08) / 0.14;
            x = gsap.utils.interpolate(vw * 0.62, vw * 0.06, t);
            y = gsap.utils.interpolate(vh * 0.12, vh * 0.22, t);
            rotY = gsap.utils.interpolate(-12, 18, t);
            rotX = gsap.utils.interpolate(6, -6, t);
            rotZ = gsap.utils.interpolate(-4, 5, t);
            scale = gsap.utils.interpolate(0.85, 1.05, t);
          } else if (p < 0.35) {
            const t = (p - 0.22) / 0.13;
            x = gsap.utils.interpolate(vw * 0.06, vw * 0.1, t);
            y = gsap.utils.interpolate(vh * 0.22, vh * 0.3, t);
            rotY = gsap.utils.interpolate(18, 5, t);
            rotX = gsap.utils.interpolate(-6, -2, t);
            rotZ = gsap.utils.interpolate(5, 1, t);
            scale = gsap.utils.interpolate(1.05, 1.15, t);
          } else {
            const t = Math.min((p - 0.35) / 0.17, 1);
            x = gsap.utils.interpolate(vw * 0.1, vw * 0.4, t);
            y = gsap.utils.interpolate(vh * 0.3, vh * 0.4, t);
            rotY = gsap.utils.interpolate(5, 0, t);
            rotX = gsap.utils.interpolate(-2, 0, t);
            rotZ = gsap.utils.interpolate(1, 0, t);
            scale = gsap.utils.interpolate(1.15, 0.7, t);
          }

          gsap.set(card, { x, y, rotateY: rotY, rotateX: rotX, rotateZ: rotZ, scale, opacity });
        },
      });
    });

    return () => ctx.revert();
  }, []);

  const stages = [
    { label: "Prospect", count: 24, color: "bg-blue-400/70", width: "w-full" },
    { label: "Quoted", count: 18, color: "bg-orange-400/70", width: "w-[75%]" },
    { label: "Submitted", count: 12, color: "bg-orange-500/80", width: "w-[50%]" },
    { label: "Bound", count: 9, color: "bg-green-500/70", width: "w-[38%]" },
  ];

  return (
    <div
      ref={wrapRef}
      className="fixed inset-0 pointer-events-none z-[40] hidden lg:block"
      style={{ perspective: "1200px" }}
    >
      <div
        ref={cardRef}
        className="absolute top-0 left-0 w-[300px] will-change-transform"
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* CRM Dashboard Widget */}
        <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-orange-500/10 border border-white/[0.08] bg-gradient-to-br from-[#151a2e] via-[#111827] to-[#0c1019]">
          {/* Top bar */}
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/[0.06]">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[10px] font-semibold text-orange-500/80 tracking-wider">QALL CRM</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
              <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
              <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
            </div>
          </div>

          {/* Live KPIs row */}
          <div className="grid grid-cols-3 gap-px bg-white/[0.03] border-b border-white/[0.06]">
            {[
              { val: "£76.4k", label: "Revenue", up: true },
              { val: "142", label: "Active Policies", up: true },
              { val: "98.2%", label: "Retention", up: false },
            ].map((kpi) => (
              <div key={kpi.label} className="px-3 py-2.5 text-center">
                <div className="text-[11px] font-bold text-dark-100">{kpi.val}</div>
                <div className="text-[7px] text-white uppercase tracking-wider mt-0.5">{kpi.label}</div>
              </div>
            ))}
          </div>

          {/* Pipeline funnel */}
          <div className="px-4 py-3">
            <div className="text-[8px] text-white uppercase tracking-wider mb-2">Pipeline</div>
            <div className="space-y-1.5">
              {stages.map((s) => (
                <div key={s.label} className="flex items-center gap-2">
                  <span className="text-[8px] text-white w-14 shrink-0">{s.label}</span>
                  <div className="flex-1 h-3 rounded-full bg-white/[0.04] overflow-hidden">
                    <div className={`h-full rounded-full ${s.color} ${s.width}`} />
                  </div>
                  <span className="text-[9px] text-white w-5 text-right">{s.count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent activity */}
          <div className="px-4 pb-3">
            <div className="text-[8px] text-white uppercase tracking-wider mb-1.5">Activity</div>
            {[
              { icon: "●", color: "text-green-400", text: "Policy bound — £4.2k commission" },
              { icon: "◆", color: "text-orange-400", text: "3 renewals due this week" },
              { icon: "▲", color: "text-blue-400", text: "New lead assigned to T. Richardson" },
            ].map((a, i) => (
              <div key={i} className="flex items-center gap-1.5 py-0.5">
                <span className={`text-[6px] ${a.color}`}>{a.icon}</span>
                <span className="text-[8px] text-white truncate">{a.text}</span>
              </div>
            ))}
          </div>

          {/* Subtle grid overlay */}
          <svg className="absolute inset-0 w-full h-full opacity-[0.015] pointer-events-none" viewBox="0 0 300 260" preserveAspectRatio="none">
            {Array.from({ length: 14 }).map((_, i) => (
              <line key={`h${i}`} x1={0} y1={i * 20} x2={300} y2={i * 20} stroke="white" strokeWidth="0.5" />
            ))}
          </svg>
        </div>
      </div>
    </div>
  );
}
