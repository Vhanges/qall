"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { gsap, ScrollTrigger, MorphSVGPlugin } from "@/lib/gsap-config";
import { FEATURES_V2, DATA_RESULTS_V2 } from "@/lib/constants-home-v2";
import { highlightQall } from "@/lib/highlight-qall";
import { getOrbCardPositions, getOrbCardElements } from "@/lib/orb-card-positions";
import { GrowthChart } from "./DataResultsV2";

/* ─── Animated Compliance Widget ─── */
const CHECKS = [
  "Data entry validated",
  "Interaction logs complete",
  "Policy documents attached",
  "KYC verification current",
  "Branch consistency check",
];

function ComplianceWidget() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [counter, setCounter] = useState(0);
  const [revealedChecks, setRevealedChecks] = useState(0);
  const animFrameRef = useRef<number>(0);
  const hasRunRef = useRef(false);
  const wasActiveRef = useRef(false);

  // Watch for .animate-active on any ancestor
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    let timers: NodeJS.Timeout[] = [];

    const check = () => {
      const active = !!el.closest(".animate-active");

      // Only act on transitions, not every mutation
      if (active && !wasActiveRef.current) {
        // Became active — start animation (only if hasn't completed yet for this pillar visit)
        wasActiveRef.current = true;
        if (hasRunRef.current) return; // Already showing final state
        hasRunRef.current = true;

        setCounter(0);
        setRevealedChecks(0);

        const startTime = performance.now();
        const duration = 1500;
        const tick = (now: number) => {
          const elapsed = now - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          setCounter(Math.round(eased * 100));
          if (progress < 1) {
            animFrameRef.current = requestAnimationFrame(tick);
          }
        };
        animFrameRef.current = requestAnimationFrame(tick);

        timers.forEach(clearTimeout);
        timers = [];
        CHECKS.forEach((_, i) => {
          timers.push(setTimeout(() => setRevealedChecks(i + 1), 1500 + i * 300));
        });
      } else if (!active && wasActiveRef.current) {
        // Became inactive — reset for next visit
        wasActiveRef.current = false;
        hasRunRef.current = false;
        cancelAnimationFrame(animFrameRef.current);
        timers.forEach(clearTimeout);
        timers = [];
        setCounter(0);
        setRevealedChecks(0);
      }
    };

    check();
    const observers: MutationObserver[] = [];
    let node: HTMLElement | null = el.parentElement;
    while (node && observers.length < 6) {
      const obs = new MutationObserver(check);
      obs.observe(node, { attributes: true, attributeFilter: ["class"] });
      observers.push(obs);
      node = node.parentElement;
    }

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      timers.forEach(clearTimeout);
      observers.forEach((o) => o.disconnect());
    };
  }, []);

  // Ring: SVG circle with stroke-dasharray animation
  const ringRadius = 22;
  const ringCircumference = 2 * Math.PI * ringRadius;
  const ringOffset = ringCircumference - (counter / 100) * ringCircumference;

  return (
    <div ref={wrapRef}>
      <div className="p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="relative w-14 h-14 flex items-center justify-center">
            <svg className="absolute inset-0 -rotate-90" width="56" height="56" viewBox="0 0 56 56">
              {/* Background ring */}
              <circle cx="28" cy="28" r={ringRadius} fill="none" stroke="rgba(34,197,94,0.15)" strokeWidth="4" />
              {/* Animated fill ring */}
              <circle
                cx="28" cy="28" r={ringRadius} fill="none"
                stroke="#22c55e" strokeWidth="4" strokeLinecap="round"
                strokeDasharray={ringCircumference}
                strokeDashoffset={ringOffset}
                style={{ transition: "stroke-dashoffset 0.05s linear" }}
              />
            </svg>
            <span className="text-lg font-bold text-green-400 relative z-10">{counter}%</span>
          </div>
          <div>
            <div className="text-sm font-semibold text-dark-100">
              {counter >= 100 ? "All Checks Passed" : "Checking..."}
            </div>
            <div className="text-[10px] text-white">Last scan: 2 min ago</div>
          </div>
        </div>
        <div className="space-y-2">
          {CHECKS.map((check, i) => {
            const revealed = i < revealedChecks;
            return (
              <div
                key={i}
                className="flex items-center gap-2 transition-all duration-300"
                style={{ opacity: revealed ? 1 : 0.3 }}
              >
                <svg
                  width="14" height="14" viewBox="0 0 16 16" fill="none"
                  className="transition-all duration-300"
                  style={{ transform: revealed ? "scale(1)" : "scale(0.5)" }}
                >
                  <path
                    d="M3 8L7 12L13 4"
                    stroke={revealed ? "#22c55e" : "#374151"}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeDasharray="20"
                    strokeDashoffset={revealed ? 0 : 20}
                    style={{ transition: "stroke-dashoffset 0.4s ease-out, stroke 0.3s" }}
                  />
                </svg>
                <span className={`text-[11px] transition-colors duration-300 ${revealed ? "text-white" : "text-white"}`}>
                  {check}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ─── AI Insights Widget — cards light up one by one ─── */
const INSIGHTS = [
  { priority: "High", text: "3 renewals in 14 days — £12.4k commission at risk", color: "border-orange-500/30 bg-orange-500/5", activeColor: "border-orange-500/50 bg-orange-500/10" },
  { priority: "Medium", text: "Coverage gap: J. Hargreaves missing critical illness", color: "border-yellow-500/30 bg-yellow-500/5", activeColor: "border-yellow-500/50 bg-yellow-500/10" },
  { priority: "Opportunity", text: "5 clients eligible for multi-policy discount — est. £8.1k", color: "border-green-500/30 bg-green-500/5", activeColor: "border-green-500/50 bg-green-500/10" },
];

function AIInsightsWidget() {
  const ref = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(0);
  const wasActiveRef = useRef(false);
  const hasRunRef = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let timers: NodeJS.Timeout[] = [];

    const check = () => {
      const active = !!el.closest(".animate-active");

      if (active && !wasActiveRef.current) {
        wasActiveRef.current = true;
        if (hasRunRef.current) return; // Already at final state
        hasRunRef.current = true;
        setRevealed(0);
        INSIGHTS.forEach((_, i) => {
          timers.push(setTimeout(() => setRevealed(i + 1), 400 + i * 600));
        });
      } else if (!active && wasActiveRef.current) {
        wasActiveRef.current = false;
        hasRunRef.current = false;
        timers.forEach(clearTimeout);
        timers = [];
        setRevealed(0);
      }
    };

    check();
    const observers: MutationObserver[] = [];
    let node: HTMLElement | null = el.parentElement;
    while (node && observers.length < 6) {
      const obs = new MutationObserver(check);
      obs.observe(node, { attributes: true, attributeFilter: ["class"] });
      observers.push(obs);
      node = node.parentElement;
    }

    return () => {
      timers.forEach(clearTimeout);
      observers.forEach((o) => o.disconnect());
    };
  }, []);

  return (
    <div ref={ref}>
      <div className="p-5 space-y-3">
        {INSIGHTS.map((insight, i) => {
          const lit = i < revealed;
          return (
            <div
              key={i}
              className={`rounded-lg border px-4 py-3 transition-all duration-500 ${lit ? insight.activeColor : "border-white/[0.04] bg-white/[0.01]"}`}
              style={{ opacity: lit ? 1 : 0.25, transform: lit ? "translateX(0)" : "translateX(4px)" }}
            >
              <span className={`text-[8px] font-bold uppercase tracking-wider transition-colors duration-500 ${lit ? "text-dark-200" : "text-white"}`}>
                {insight.priority}
              </span>
              <p className={`text-[11px] leading-relaxed mt-1 transition-colors duration-500 ${lit ? "text-white" : "text-white"}`}>
                {insight.text}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Sequential reveal list — items light up one by one ─── */
function SequentialReveal({ items, delay = 400, startDelay = 300 }: {
  items: { dot: string; text: string }[];
  delay?: number;
  startDelay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(0);
  const wasActiveRef = useRef(false);
  const hasRunRef = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let timers: NodeJS.Timeout[] = [];

    const check = () => {
      const active = !!el.closest(".animate-active");

      if (active && !wasActiveRef.current) {
        wasActiveRef.current = true;
        if (hasRunRef.current) return; // Already at final state
        hasRunRef.current = true;
        setRevealed(0);
        items.forEach((_, i) => {
          timers.push(setTimeout(() => setRevealed(i + 1), startDelay + i * delay));
        });
      } else if (!active && wasActiveRef.current) {
        wasActiveRef.current = false;
        hasRunRef.current = false;
        timers.forEach(clearTimeout);
        timers = [];
        setRevealed(0);
      }
    };

    check();
    const observers: MutationObserver[] = [];
    let node: HTMLElement | null = el.parentElement;
    while (node && observers.length < 6) {
      const obs = new MutationObserver(check);
      obs.observe(node, { attributes: true, attributeFilter: ["class"] });
      observers.push(obs);
      node = node.parentElement;
    }

    return () => {
      timers.forEach(clearTimeout);
      observers.forEach((o) => o.disconnect());
    };
  }, [items, delay, startDelay]);

  return (
    <div ref={ref} className="space-y-1.5">
      {items.map((item, i) => {
        const lit = i < revealed;
        return (
          <div
            key={i}
            className="flex items-center gap-2 text-[10px] transition-all duration-400"
            style={{ opacity: lit ? 1 : 0.25 }}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full transition-all duration-400 ${item.dot}`}
              style={{
                transform: lit ? "scale(1)" : "scale(0.5)",
                boxShadow: lit ? `0 0 6px currentColor` : "none",
              }}
            />
            <span className={`transition-colors duration-400 ${lit ? "text-white" : "text-dark-700"}`}>
              {item.text}
            </span>
          </div>
        );
      })}
    </div>
  );
}

/* ─── Silo Shatter Animation — Pillar 01 ─── */
const SS_VW = 280;
const SS_VH = 238;
const SS_QCX = 140;
const SS_QCY = 128;
const SS_RAY_INNER = 38;
const SS_RAY_OUTER = 120;
const SS_RAY_LEN = SS_RAY_OUTER - SS_RAY_INNER;
const SS_RAY_COUNT = 10;
const ssRayData = Array.from({ length: SS_RAY_COUNT }, (_, i) => {
  const angle = (i * (360 / SS_RAY_COUNT)) * (Math.PI / 180);
  const r = (n: number) => Math.round(n * 1000) / 1000;
  return {
    x1: r(SS_QCX + Math.cos(angle) * SS_RAY_INNER),
    y1: r(SS_QCY + Math.sin(angle) * SS_RAY_INNER),
    x2: r(SS_QCX + Math.cos(angle) * SS_RAY_OUTER),
    y2: r(SS_QCY + Math.sin(angle) * SS_RAY_OUTER),
  };
});

// Pyramid: one silo on top, two on bottom row
const SS_SILO_RECTS = [
  { x: 97,  y: 8,   w: 86, h: 72 }, // top-centre
  { x: 8,   y: 118, w: 86, h: 72 }, // bottom-left
  { x: 186, y: 118, w: 86, h: 72 }, // bottom-right
];
const SS_SILO_LABELS = ["Spreadsheets", "Email Threads", "Legacy CRM"];
const SS_SILO_ROWS = [
  ["Client_v3_FINAL", "Policy #2847??", "Commission ???"],
  ["RE: RE: RE: Claim", "FWD: FWD: docs", "Follow up #4..."],
  ["Record: NULL", "Status: ERROR", "Last sync: —"],
];
// Scatter vectors per silo [TL, TR, BL, BR]
const SS_SILO_SCATTER: [number, number][][] = [
  [[-38, -40], [ 38, -40], [-34,  32], [ 34,  32]], // top silo — bursts up & sideways
  [[-32, -28], [ 18, -36], [-42,  36], [ 24,  30]], // bottom-left — down-left emphasis
  [[-18, -36], [ 32, -28], [-24,  30], [ 42,  36]], // bottom-right — down-right emphasis
];
const SS_SILO_COLORS = [
  "rgba(248,140,0,0.55)",
  "rgba(26,58,110,0.55)",
  "rgba(248,140,0,0.55)",
];
// Rotation per quadrant: TL, TR, BL, BR
const SS_FRAG_ROTS = [28, -32, -24, 30];

const SS_FRAGS = SS_SILO_RECTS.flatMap((silo, si) => {
  const hw = silo.w / 2;
  const hh = silo.h / 2;
  return [
    { sx: silo.x,      sy: silo.y,      fw: hw, fh: hh, scX: SS_SILO_SCATTER[si][0][0], scY: SS_SILO_SCATTER[si][0][1], rot: SS_FRAG_ROTS[0] },
    { sx: silo.x + hw, sy: silo.y,      fw: hw, fh: hh, scX: SS_SILO_SCATTER[si][1][0], scY: SS_SILO_SCATTER[si][1][1], rot: SS_FRAG_ROTS[1] },
    { sx: silo.x,      sy: silo.y + hh, fw: hw, fh: hh, scX: SS_SILO_SCATTER[si][2][0], scY: SS_SILO_SCATTER[si][2][1], rot: SS_FRAG_ROTS[2] },
    { sx: silo.x + hw, sy: silo.y + hh, fw: hw, fh: hh, scX: SS_SILO_SCATTER[si][3][0], scY: SS_SILO_SCATTER[si][3][1], rot: SS_FRAG_ROTS[3] },
  ].map(f => ({
    ...f,
    siloIdx: si,
    // GSAP translate to place fragment centre at Q centre
    convX: SS_QCX - (f.sx + f.fw / 2),
    convY: SS_QCY - (f.sy + f.fh / 2),
  }));
});

function SiloShatterWidget() {
  const containerRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const wasActiveRef = useRef(false);
  const hasPlayedIntro = useRef(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const siloEls = Array.from(el.querySelectorAll<SVGGElement>(".ss-silo"));
    const fragEls = Array.from(el.querySelectorAll<SVGRectElement>(".ss-frag"));
    const qWrap   = el.querySelector<SVGGElement>(".ss-q-wrap");
    const qGlow   = el.querySelector<SVGCircleElement>(".ss-q-glow");
    const rayEls  = Array.from(el.querySelectorAll<SVGLineElement>(".ss-ray"));
    const svgEl   = el.querySelector<SVGSVGElement>("svg");

    const resetVisuals = () => {
      gsap.set(siloEls, { autoAlpha: 1, x: 0, y: 0 });
      gsap.set(fragEls, { autoAlpha: 0, x: 0, y: 0, rotation: 0, scale: 1 });
      gsap.set(qWrap,   { autoAlpha: 0, scale: 0 });
      gsap.set(qGlow,   { autoAlpha: 0, attr: { r: 38 } });
      rayEls.forEach(r => {
        gsap.set(r, { autoAlpha: 0, attr: { strokeDasharray: SS_RAY_LEN, strokeDashoffset: SS_RAY_LEN } });
      });
    };

    const stop = () => {
      if (tlRef.current) { tlRef.current.kill(); tlRef.current = null; }
      resetVisuals();
    };

    // The left ray (180°, index 5) is the one we keep glowing
    const LEFT_RAY_IDX = 5;

    /** Run the shatter sequence once. Left ray glows at the end and persists. */
    const shatter = (onDone?: () => void) => {
      const tl = gsap.timeline({
        onComplete() { onDone?.(); },
      });
      tlRef.current = tl;

      // 1 — silos shake
      tl.to(siloEls, {
        x: "random(-6,6)", y: "random(-4,4)",
        duration: 0.065, ease: "none", repeat: 10, yoyo: true, stagger: 0.01,
      }, 0.3);

      // 2 — silos vanish; fragments appear
      tl.to(siloEls, { autoAlpha: 0, duration: 0.1 }, 1.0);
      fragEls.forEach(frag => {
        tl.set(frag, { autoAlpha: 0.9, x: 0, y: 0, scale: 1, rotation: 0 }, 1.0);
      });

      // 3 — fragments blast outward
      fragEls.forEach((frag, i) => {
        const d = SS_FRAGS[i];
        tl.to(frag, {
          x: d.scX, y: d.scY, rotation: d.rot, scale: 0.82,
          duration: 0.3, ease: "power2.out",
        }, 1.04 + (i % 4) * 0.016);
      });

      // 4 — fragments implode toward Q centre
      fragEls.forEach((frag, i) => {
        const d = SS_FRAGS[i];
        tl.to(frag, {
          x: d.convX, y: d.convY, rotation: 0, scale: 0, autoAlpha: 0,
          duration: 0.44, ease: "power3.in",
        }, 1.4 + i * 0.018);
      });

      // 5 — Q bursts in
      tl.to(qWrap, { autoAlpha: 1, scale: 1, duration: 0.42, ease: "back.out(2.8)" }, 1.82);

      // 6 — glow pulse (stays visible)
      tl.to(qGlow, { autoAlpha: 0.9, attr: { r: 52 }, duration: 0.36, ease: "power2.out" }, 1.82);
      tl.to(qGlow, { autoAlpha: 0.35, attr: { r: 42 }, duration: 0.5, ease: "power2.inOut" }, 2.18);

      // 7 — data rays radiate
      rayEls.forEach((r, i) => {
        const t = 1.98 + i * 0.055;
        tl.to(r, { autoAlpha: 1, duration: 0.05 }, t);
        tl.to(r, { attr: { strokeDashoffset: 0 }, duration: 0.38, ease: "power2.out" }, t);
      });

      // 8 — all rays stay visible; left ray becomes more prominent
      const leftRay = rayEls[LEFT_RAY_IDX];
      if (leftRay) {
        tl.to(leftRay, {
          attr: { strokeWidth: 4, stroke: "#F88C00" },
          duration: 0.4,
          ease: "power2.out",
        }, 2.8);
      }

      // Hold at end state
      tl.to({}, { duration: 1.0 });
    };

    /** First-time intro: fly orb cards into silo positions, then shatter. */
    const playIntro = () => {
      stop();
      // Hide silos initially
      gsap.set(siloEls, { autoAlpha: 0 });

      const cardPositions = getOrbCardPositions();
      const cardElements = getOrbCardElements();
      if (!svgEl || cardPositions.length < 3) {
        resetVisuals();
        shatter();
        return;
      }

      // Get the SVG element's screen rect to calculate target positions
      const svgRect = svgEl.getBoundingClientRect();
      const svgScaleX = svgRect.width / SS_VW;
      const svgScaleY = svgRect.height / SS_VH;

      const siloTargets = SS_SILO_RECTS.map((s) => ({
        left: svgRect.left + (s.x + s.w / 2) * svgScaleX,
        top: svgRect.top + (s.y + s.h / 2) * svgScaleY,
        width: s.w * svgScaleX,
        height: s.h * svgScaleY,
      }));

      // Clone the actual CRM cards from the orb section
      const clones: HTMLElement[] = [];
      for (let i = 0; i < 4; i++) {
        const pos = cardPositions[i] || cardPositions[0];
        const srcEl = cardElements[i];

        const clone = document.createElement("div");
        clone.style.cssText = `
          position: fixed; z-index: 9999; pointer-events: none;
          left: ${pos.left}px; top: ${pos.top}px;
          width: ${pos.width}px; height: ${pos.height}px;
          overflow: hidden; border-radius: 12px;
          transition: none;
        `;

        // Clone the actual card content if available
        if (srcEl) {
          const inner = srcEl.cloneNode(true) as HTMLElement;
          inner.style.opacity = "1";
          inner.style.transform = "none";
          inner.style.animation = "none";
          inner.style.position = "static";
          clone.appendChild(inner);
        } else {
          clone.style.background = "linear-gradient(135deg, #141927, #0c1019)";
          clone.style.border = "1px solid rgba(255,255,255,0.1)";
        }

        document.body.appendChild(clone);
        clones.push(clone);
      }

      const tl = gsap.timeline();
      tlRef.current = tl;

      // Animate 3 card clones into silo positions (shrink + move)
      for (let i = 0; i < 3; i++) {
        const target = siloTargets[i];
        tl.to(clones[i], {
          left: target.left - target.width / 2,
          top: target.top - target.height / 2,
          width: target.width,
          height: target.height,
          borderRadius: 5,
          duration: 0.8,
          ease: "power3.inOut",
        }, 0.1 + i * 0.1);
      }

      // 4th clone fades out
      tl.to(clones[3], {
        opacity: 0,
        scale: 0.5,
        duration: 0.6,
        ease: "power2.in",
      }, 0.2);

      // After clones arrive, show actual silos and remove clones
      tl.call(() => {
        gsap.set(siloEls, { autoAlpha: 1, x: 0, y: 0 });
        clones.forEach((c) => c.remove());
      }, [], 1.1);

      // Then run the shatter
      tl.call(() => {
        shatter();
      }, [], 1.2);
    };

    const check = () => {
      const active = !!el.closest(".animate-active");
      if (active && !wasActiveRef.current) {
        wasActiveRef.current = true;
        // Always replay from the start
        stop();
        resetVisuals();
        shatter();
      }
      else if (!active && wasActiveRef.current) {
        wasActiveRef.current = false;
        stop();
        resetVisuals();
      }
    };

    check();
    const observers: MutationObserver[] = [];
    let node: HTMLElement | null = el.parentElement;
    while (node && observers.length < 6) {
      const obs = new MutationObserver(check);
      obs.observe(node, { attributes: true, attributeFilter: ["class"] });
      observers.push(obs);
      node = node.parentElement;
    }
    return () => {
      stop();
      observers.forEach(o => o.disconnect());
    };
  }, []);

  return (
    <div ref={containerRef}>
      {/* Full SVG stage — no container clipping */}
      <div className="relative" style={{ minHeight: 380 }}>
        <svg viewBox={`0 0 ${SS_VW} ${SS_VH}`} className="w-full h-full" overflow="visible">
          <defs>
            {/* Soft blur for Q glow halo */}
            <filter id="ss-blur" x="-120%" y="-120%" width="340%" height="340%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="8" />
            </filter>
          </defs>

          {/* Pyramid connector lines (subtle structure hint) */}
          <line x1={140} y1={80} x2={51}  y2={118}
            stroke="rgba(255,255,255,0.05)" strokeWidth="1" strokeDasharray="4 3" />
          <line x1={140} y1={80} x2={229} y2={118}
            stroke="rgba(255,255,255,0.05)" strokeWidth="1" strokeDasharray="4 3" />

          {/* ── Silo boxes (pyramid) — blue themed ── */}
          {SS_SILO_RECTS.map((silo, i) => (
            <g key={i} className="ss-silo">
              {/* Outer box */}
              <rect x={silo.x} y={silo.y} width={silo.w} height={silo.h} rx="5"
                fill="rgba(248,140,0,0.15)" stroke="rgba(248,140,0,0.4)" strokeWidth="1" />
              {/* Header fill */}
              <rect x={silo.x + 1} y={silo.y + 1} width={silo.w - 2} height="17" rx="4"
                fill="rgba(248,140,0,0.2)" />
              <rect x={silo.x + 1} y={silo.y + 11} width={silo.w - 2} height="7"
                fill="rgba(248,140,0,0.15)" />
              {/* Header bottom rule */}
              <line x1={silo.x} y1={silo.y + 18} x2={silo.x + silo.w} y2={silo.y + 18}
                stroke="rgba(248,140,0,0.3)" strokeWidth="0.5" />
              {/* Label */}
              <text x={silo.x + silo.w / 2} y={silo.y + 12.5} textAnchor="middle"
                fill="rgba(255,255,255,0.45)" fontSize="6.5" fontFamily="monospace">
                {SS_SILO_LABELS[i].toUpperCase()}
              </text>
              {/* Data rows */}
              {SS_SILO_ROWS[i].map((row, j) => (
                <text key={j} x={silo.x + 6} y={silo.y + 29 + j * 14}
                  fill="rgba(255,255,255,0.25)" fontSize="6" fontFamily="monospace">
                  {row}
                </text>
              ))}
            </g>
          ))}

          {/* ── Fragment pieces — appear when silos shatter ── */}
          {SS_FRAGS.map((f, i) => (
            <rect key={i} className="ss-frag"
              x={f.sx} y={f.sy} width={f.fw} height={f.fh} rx="3"
              fill={SS_SILO_COLORS[f.siloIdx]}
              stroke="rgba(248,160,48,0.3)" strokeWidth="0.5"
              style={{ opacity: 0 }}
            />
          ))}

          {/* ── Data rays — light blue to stand out on orange bg ── */}
          {ssRayData.map((r, i) => (
            <line key={i} className="ss-ray"
              x1={r.x1} y1={r.y1} x2={r.x2} y2={r.y2}
              stroke={i === 5 ? "#F88C00" : "#F8A030"}
              strokeWidth={i === 5 ? 2.5 : 1.5}
              strokeLinecap="round"
              style={{ opacity: 0 }}
            />
          ))}

          {/* ── Q glow halo (blurred, behind circle) ── */}
          <circle className="ss-q-glow"
            cx={SS_QCX} cy={SS_QCY} r={38}
            fill="rgba(248,140,0,0.3)"
            filter="url(#ss-blur)"
            style={{ opacity: 0 }}
          />

          {/* ── Qall Q logo ── */}
          <g className="ss-q-wrap" style={{ opacity: 0 }}>
            <circle cx={SS_QCX} cy={SS_QCY} r={36}
              fill="rgba(10,14,23,0.95)" />
            <image
              href="/images/qall-q-logo.png"
              x={SS_QCX - 30} y={SS_QCY - 34}
              width="60" height="68"
              preserveAspectRatio="xMidYMid meet"
            />
          </g>
        </svg>
      </div>
    </div>
  );
}

/* ─── Live Pulse Animation — Pillar 02 ─── */
const LP_W = 280;
const LP_H = 110;
// Jagged red legacy points
const LEGACY_PTS = "0,82 22,62 38,78 58,52 74,72 94,54 114,74 134,58 154,78 174,56 194,70 214,60 234,74 258,64 280,68";
// Smooth green Qall curve (path d)
const QALL_PATH_D = "M 0,90 C 50,84 100,65 150,44 S 230,20 280,12";
const QALL_AREA_D = `${QALL_PATH_D} L 280,${LP_H} L 0,${LP_H} Z`;
const LEGACY_AREA_PTS = `${LEGACY_PTS} 280,${LP_H} 0,${LP_H}`;

let lpInstanceCounter = 0;

function LivePulseWidget() {
  const containerRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const wasActiveRef = useRef(false);
  const hasPlayed = useRef(false);
  const idRef = useRef(`lp-${++lpInstanceCounter}`);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const uid = idRef.current;
    const redClipRect   = el.querySelector<SVGRectElement>(`#${uid}-red-clip rect`);
    const greenClipRect = el.querySelector<SVGRectElement>(`#${uid}-green-clip rect`);
    const bar           = el.querySelector<SVGRectElement>(".lp-bar");
    const barLabel      = el.querySelector<SVGTextElement>(".lp-bar-label");
    const bridgeLine    = el.querySelector<SVGLineElement>(".lp-bridge-line");
    const legacyLabel   = el.querySelector<SVGTextElement>(".lp-legacy-label");
    const qallLabel     = el.querySelector<SVGTextElement>(".lp-qall-label");
    const kpiEls: HTMLElement[]  = [];

    const resetVisuals = () => {
      if (redClipRect)   { redClipRect.setAttribute("x", "0"); redClipRect.setAttribute("width", String(LP_W)); }
      if (greenClipRect) { greenClipRect.setAttribute("x", "0"); greenClipRect.setAttribute("width", "0"); }
      if (bar)           { bar.setAttribute("x", "0"); gsap.set(bar, { autoAlpha: 0 }); }
      if (barLabel)      { barLabel.setAttribute("x", "4"); gsap.set(barLabel, { autoAlpha: 0 }); }
      if (bridgeLine)    gsap.set(bridgeLine, { autoAlpha: 0 });
      if (legacyLabel)   gsap.set(legacyLabel, { autoAlpha: 0 });
      if (qallLabel)     gsap.set(qallLabel, { autoAlpha: 0 });
      gsap.set(kpiEls, { autoAlpha: 0, y: 6 });
    };

    const stop = () => {
      if (tlRef.current) { tlRef.current.kill(); tlRef.current = null; }
      resetVisuals();
    };

    /** Play once: bridge line → bar sweeps → holds at end with bar at right edge. */
    const play = () => {
      stop();
      resetVisuals();

      // Check __skipBridge flag on self AND ancestors (flag set on widgetContent parent)
      let skipBridge = false;
      let node: HTMLElement | null = el;
      while (node && !skipBridge) {
        if ((node as any).__skipBridge) { skipBridge = true; (node as any).__skipBridge = false; }
        node = node.parentElement;
      }

      const tl = gsap.timeline();
      tlRef.current = tl;

      // Time offset for the sweep — depends on whether we skip the bridge intro
      let sweepStart: number;

      if (skipBridge) {
        // Skip bridge — ghost line from silo handles the intro.
        // Bar starts at x=0 immediately.
        if (bridgeLine) gsap.set(bridgeLine, { autoAlpha: 0 });
        tl.to([bar, barLabel], { autoAlpha: 1, duration: 0.1 }, 0.3);
        tl.to(kpiEls, { autoAlpha: 1, y: 0, duration: 0.35, stagger: 0.1, ease: "power2.out" }, 0.1);
        tl.to(legacyLabel, { autoAlpha: 1, duration: 0.35 }, 0.2);
        sweepStart = 0.6;
      } else {
        // Bridge line: horizontal ray morphs into vertical bar at x=0
        if (bridgeLine) {
          gsap.set(bridgeLine, {
            autoAlpha: 1,
            attr: {
              x1: LP_W / 2 - 54, y1: LP_H / 2,
              x2: LP_W / 2, y2: LP_H / 2,
              strokeWidth: 3,
            },
          });

          tl.to(bridgeLine, {
            attr: { x1: 0, y1: 0, x2: 0, y2: LP_H, strokeWidth: 2.5 },
            duration: 0.7,
            ease: "power2.inOut",
          }, 0);

          tl.to(bridgeLine, {
            autoAlpha: 0,
            duration: 0.15,
          }, 0.65);
        }

        // Bar appears at x=0
        tl.to([bar, barLabel], { autoAlpha: 1, duration: 0.1 }, 0.65);

        // KPIs and legacy label fade in
        tl.to(kpiEls, { autoAlpha: 1, y: 0, duration: 0.35, stagger: 0.1, ease: "power2.out" }, 0.3);
        tl.to(legacyLabel, { autoAlpha: 1, duration: 0.35 }, 0.4);

        sweepStart = 1.3;
      }

      // Bar slides all the way across — covers entire chart (no red left)
      const proxy = { x: 0 };
      tl.to(proxy, {
        x: LP_W,
        duration: 2.2,
        ease: "power1.inOut",
        onUpdate() {
          const x = Math.round(proxy.x);
          if (redClipRect)   { redClipRect.setAttribute("x", String(x)); redClipRect.setAttribute("width", String(Math.max(0, LP_W - x))); }
          if (greenClipRect) { greenClipRect.setAttribute("width", String(x)); }
          if (bar)           bar.setAttribute("x", String(Math.min(x, LP_W - 2)));
          if (barLabel)      barLabel.setAttribute("x", String(Math.min(x + 4, LP_W - 55)));
        },
      }, sweepStart);

      // Qall label, legacy fades
      tl.to(qallLabel,   { autoAlpha: 1, duration: 0.4 }, sweepStart + 1.9);
      tl.to(legacyLabel, { autoAlpha: 0, duration: 0.3 }, sweepStart + 1.9);

      // Hold at end — bar stays at right edge
      tl.to({}, { duration: 1.5 });
    };

    /** Show the final state (bar at right, green chart, no red). */
    const showEndState = () => {
      if (tlRef.current) { tlRef.current.kill(); tlRef.current = null; }
      if (redClipRect)   { redClipRect.setAttribute("x", String(LP_W)); redClipRect.setAttribute("width", "0"); }
      if (greenClipRect) { greenClipRect.setAttribute("width", String(LP_W)); }
      if (bar)           { bar.setAttribute("x", String(LP_W - 2)); gsap.set(bar, { autoAlpha: 1 }); }
      if (barLabel)      { barLabel.setAttribute("x", String(LP_W - 59)); gsap.set(barLabel, { autoAlpha: 1 }); }
      if (bridgeLine)    gsap.set(bridgeLine, { autoAlpha: 0 });
      if (legacyLabel)   gsap.set(legacyLabel, { autoAlpha: 0 });
      if (qallLabel)     gsap.set(qallLabel, { autoAlpha: 1 });
      gsap.set(kpiEls, { autoAlpha: 1, y: 0 });
    };

    const check = () => {
      const active = !!el.closest(".animate-active");
      if (active && !wasActiveRef.current) {
        wasActiveRef.current = true;
        // Always replay from start
        play();
      }
      else if (!active && wasActiveRef.current) {
        wasActiveRef.current = false;
        // Show end state so the red chart doesn't flash when scrolling past
        showEndState();
      }
    };

    check();
    const observers: MutationObserver[] = [];
    let node: HTMLElement | null = el.parentElement;
    while (node && observers.length < 6) {
      const obs = new MutationObserver(check);
      obs.observe(node, { attributes: true, attributeFilter: ["class"] });
      observers.push(obs);
      node = node.parentElement;
    }
    return () => { stop(); observers.forEach((o) => o.disconnect()); };
  }, []);

  return (
    <div ref={containerRef}>
      <div className="p-5">
        {/* Chart */}
        <div className="rounded-lg bg-white/[0.02] border border-white/[0.05]">
          <svg viewBox={`0 0 ${LP_W} ${LP_H}`} className="w-full" style={{ height: 180 }} overflow="visible">
            <defs>
              <clipPath id={`${idRef.current}-red-clip`}>
                <rect x="0" y="0" width={LP_W} height={LP_H} />
              </clipPath>
              <clipPath id={`${idRef.current}-green-clip`}>
                <rect x="0" y="0" width="0" height={LP_H} />
              </clipPath>
              <filter id={`${idRef.current}-glow`} x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="3" />
              </filter>
            </defs>

            {/* Subtle grid */}
            {[28, 55, 82].map((y) => (
              <line key={y} x1="0" y1={y} x2={LP_W} y2={y} stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
            ))}

            {/* Legacy red jagged area + line */}
            <polygon points={LEGACY_AREA_PTS} fill="rgba(239,68,68,0.07)" clipPath={`url(#${idRef.current}-red-clip)`} />
            <polyline points={LEGACY_PTS} fill="none" stroke="#ef4444" strokeWidth="2" strokeLinejoin="round" clipPath={`url(#${idRef.current}-red-clip)`} />

            {/* Qall green smooth area + line */}
            <path d={QALL_AREA_D} fill="rgba(34,197,94,0.08)" clipPath={`url(#${idRef.current}-green-clip)`} />
            <path d={QALL_PATH_D} fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" clipPath={`url(#${idRef.current}-green-clip)`} />

            {/* Bridge line — light blue ray that morphs into the vertical bar */}
            <line className="lp-bridge-line"
              x1={LP_W / 2 - 54} y1={LP_H / 2} x2={LP_W / 2} y2={LP_H / 2}
              stroke="#F88C00" strokeWidth="3.5" strokeLinecap="round"
              style={{ opacity: 0 }}
            />

            {/* Sliding filter bar */}
            <rect className="lp-bar" x="0" y="0" width="2" height={LP_H}
              fill="#F88C00"
              style={{ filter: "drop-shadow(0 0 5px rgba(248,140,0,0.7))" }}
            />
            <text className="lp-bar-label" x="4" y="10" fill="#F88C00" fontSize="5.5" fontFamily="monospace" fontWeight="bold">
              FINANCIAL CLARITY
            </text>

            {/* Line labels */}
            <text className="lp-legacy-label" x="6" y="60" fill="#ef4444" fontSize="6" fontFamily="monospace" opacity="0">
              Legacy Reporting
            </text>
            <text className="lp-qall-label" x="6" y="22" fill="#22c55e" fontSize="6" fontFamily="monospace" opacity="0">
              Qall Real-Time Tracking
            </text>

            {/* X-axis */}
            {[["0", "Jan"], ["126", "Jun"], ["256", "Dec"]].map(([x, lbl]) => (
              <text key={lbl} x={x} y={LP_H - 2} fill="rgba(255,255,255,0.18)" fontSize="5.5" fontFamily="monospace">{lbl}</text>
            ))}
          </svg>
        </div>
      </div>
    </div>
  );
}

/* ─── Opportunity Radar Animation — Pillar 03 ─── */
const OR_CX = 140;
const OR_CY = 140;
const OR_R  = 75;
const OR_LABEL_R = 100; // radius for name labels around the radar
const OR_ROT_DUR = 3.5; // seconds per revolution

// Icons match orbit icons — consistent across radar → funnel → orbit
const OR_CLIENTS = [
  { name: "J. Hargreaves", angle: 40,  dist: 0.72, type: "Call History",    amount: "£12.4k", icon: "phone" as const, color: "#3b82f6" },
  { name: "P. Nair",       angle: 110, dist: 0.55, type: "SMS",            amount: "£8.1k",  icon: "sms"   as const, color: "#a855f7" },
  { name: "D. Chen",       angle: 170, dist: 0.80, type: "Policy Details", amount: "£6.8k",  icon: "doc"   as const, color: "#F88C00" },
  { name: "S. Mitchell",   angle: 230, dist: 0.62, type: "Renewals",       amount: "£9.3k",  icon: "cal"   as const, color: "#22c55e" },
  { name: "T. Richardson", angle: 300, dist: 0.75, type: "Email",          amount: "£11.2k", icon: "mail"  as const, color: "#06b6d4" },
].map((c) => ({
  ...c,
  cx: Math.round(OR_CX + Math.cos((c.angle * Math.PI) / 180) * c.dist * OR_R),
  cy: Math.round(OR_CY + Math.sin((c.angle * Math.PI) / 180) * c.dist * OR_R),
  // Label position for the icon overlay
  lx: Math.round(OR_CX + Math.cos((c.angle * Math.PI) / 180) * OR_LABEL_R),
  ly: Math.round(OR_CY + Math.sin((c.angle * Math.PI) / 180) * OR_LABEL_R),
}));

// 60° wedge trail behind the arm (counterclockwise from east)
const OR_WEDGE = [
  `M ${OR_CX} ${OR_CY}`,
  `L ${OR_CX + OR_R} ${OR_CY}`,
  `A ${OR_R} ${OR_R} 0 0 0`,
  `${(OR_CX + OR_R * Math.cos(-Math.PI / 3)).toFixed(1)}`,
  `${(OR_CY + OR_R * Math.sin(-Math.PI / 3)).toFixed(1)} Z`,
].join(" ");

function OpportunityRadarWidget() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sweepRef     = useRef<SVGGElement>(null);
  const tweenRef     = useRef<gsap.core.Tween | null>(null);
  const wasActiveRef = useRef(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const dotEls   = Array.from(el.querySelectorAll<SVGCircleElement>(".or-dot"));
    const rowEls   = Array.from(el.querySelectorAll<SVGGElement>(".or-row"));
    const iconEls  = Array.from(el.querySelectorAll<SVGGElement>(".or-icon"));

    const resetVisuals = () => {
      dotEls.forEach((d) => { d.setAttribute("r", "4"); d.setAttribute("fill", "rgba(255,255,255,0.18)"); d.removeAttribute("filter"); });
      gsap.set(iconEls, { autoAlpha: 0 });
      gsap.set(rowEls, { opacity: 0.25 });
    };

    const stop = () => {
      tweenRef.current?.kill();
      tweenRef.current = null;
      resetVisuals();
    };

    const play = () => {
      stop();
      resetVisuals();

      // Check __skipBridge flag on self and ancestors
      let skipBridge = false;
      let flagNode: HTMLElement | null = el;
      while (flagNode && !skipBridge) {
        if ((flagNode as any).__skipBridge) { skipBridge = true; (flagNode as any).__skipBridge = false; }
        flagNode = flagNode.parentElement;
      }

      const bridge = el.querySelector<SVGLineElement>(".or-bridge");
      const sweepGroup = sweepRef.current;

      if (skipBridge) {
        // Skip bridge intro — ghost line from chart handles it.
        // Reset sweep to angle 0 (pointing right, matching ghost's final position)
        // then go straight to sweep rotation.
        if (bridge) gsap.set(bridge, { autoAlpha: 0 });
        if (sweepGroup) {
          sweepGroup.setAttribute("transform", `rotate(0, ${OR_CX}, ${OR_CY})`);
          gsap.set(sweepGroup, { autoAlpha: 1 });
        }
        setTimeout(() => startSweep(), 0);
      } else {
        // Hide sweep arm until bridge line finishes
        if (sweepGroup) gsap.set(sweepGroup, { autoAlpha: 0 });

        const introTl = gsap.timeline({
          onComplete() {
            if (sweepGroup) gsap.set(sweepGroup, { autoAlpha: 1 });
            startSweep();
          },
        });

        if (bridge) {
          // Start as a vertical line on the right side (where the LivePulse bar ended)
          gsap.set(bridge, {
            autoAlpha: 1,
            attr: {
              x1: OR_CX + OR_R, y1: OR_CY - OR_R,
              x2: OR_CX + OR_R, y2: OR_CY + OR_R,
              strokeWidth: 2.5,
            },
          });

          // Morph vertical line → horizontal sweep arm from center outward
          introTl.to(bridge, {
            attr: {
              x1: OR_CX, y1: OR_CY,
              x2: OR_CX + OR_R, y2: OR_CY,
              strokeWidth: 1.5,
            },
            duration: 0.8,
            ease: "power2.inOut",
          }, 0);

          // Fade out as the actual sweep arm takes over
          introTl.to(bridge, { autoAlpha: 0, duration: 0.2 }, 0.7);
        } else {
          // No bridge — just show sweep immediately
          if (sweepGroup) gsap.set(sweepGroup, { autoAlpha: 1 });
        }
      }

      const startSweep = () => {
        const proxy    = { a: 0 };
        let   prevA    = -1;
        const litFlags = new Array(OR_CLIENTS.length).fill(false);

        const lightUp = (i: number) => {
          const dot = dotEls[i];
          if (dot) {
            dot.setAttribute("fill", "#F88C00");
            dot.setAttribute("r", "7");
            gsap.to(dot, { attr: { r: 5 }, duration: 0.6, ease: "power2.out" });
            dot.setAttribute("filter", "url(#or-glow)");
          }
          // Icon row lights up
          gsap.to(rowEls[i], { opacity: 1, duration: 0.4, ease: "power2.out" });
          // Status icon pops in
          if (iconEls[i]) {
            gsap.to(iconEls[i], { autoAlpha: 1, scale: 1, duration: 0.3, ease: "back.out(2)" });
          }
        };

        tweenRef.current = gsap.to(proxy, {
          a: 360,
          duration: OR_ROT_DUR,
          ease: "none",
          repeat: -1,

          onUpdate() {
            const a = proxy.a % 360;
            sweepRef.current?.setAttribute("transform", `rotate(${a}, ${OR_CX}, ${OR_CY})`);

            if (prevA >= 0) {
              OR_CLIENTS.forEach((client, i) => {
                if (litFlags[i]) return;
                if (prevA < client.angle && a >= client.angle) {
                  litFlags[i] = true;
                  lightUp(i);
                }
              });
            }

            prevA = a;
          },

          onRepeat() {
            prevA = -1;
            litFlags.fill(false);
            dotEls.forEach((d) => { d.setAttribute("fill", "rgba(248,140,0,0.35)"); d.removeAttribute("filter"); });
            gsap.to(iconEls,  { autoAlpha: 0, duration: 0.3 });
            gsap.to(rowEls,   { opacity: 0.25, duration: 0.3 });
          },
        });
      };
    };

    const check = () => {
      const active = !!el.closest(".animate-active");
      if (active && !wasActiveRef.current)       { wasActiveRef.current = true;  play(); }
      else if (!active && wasActiveRef.current)  { wasActiveRef.current = false; stop(); }
    };

    check();
    const observers: MutationObserver[] = [];
    let node: HTMLElement | null = el.parentElement;
    while (node && observers.length < 6) {
      const obs = new MutationObserver(check);
      obs.observe(node, { attributes: true, attributeFilter: ["class"] });
      observers.push(obs);
      node = node.parentElement;
    }
    return () => { stop(); observers.forEach((o) => o.disconnect()); };
  }, []);

  return (
    <div ref={containerRef}>
      <div className="relative" style={{ minHeight: 340 }}>
        <svg viewBox="0 0 280 280" className="w-full" style={{ height: 340 }} overflow="visible">
          <defs>
            <filter id="or-glow" x="-100%" y="-100%" width="300%" height="300%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="3" />
            </filter>
          </defs>
          {/* Background fill */}
          <circle className="or-bg" cx={OR_CX} cy={OR_CY} r={OR_R + 6} fill="rgba(8,14,28,0.85)" />

          {/* Concentric rings — blue */}
          {[0.33, 0.66, 1.0].map((ratio, i) => (
            <circle key={i} className={i === 2 ? "or-outer-ring" : "or-inner-ring"} cx={OR_CX} cy={OR_CY} r={OR_R * ratio}
              fill="none" stroke="rgba(248,140,0,0.14)" strokeWidth="1"
              strokeDasharray={i < 2 ? "3 5" : undefined}
            />
          ))}

          {/* Crosshairs */}
          <line className="or-crosshair" x1={OR_CX - OR_R} y1={OR_CY} x2={OR_CX + OR_R} y2={OR_CY} stroke="rgba(248,140,0,0.08)" strokeWidth="0.5" />
          <line className="or-crosshair" x1={OR_CX} y1={OR_CY - OR_R} x2={OR_CX} y2={OR_CY + OR_R} stroke="rgba(248,140,0,0.08)" strokeWidth="0.5" />

          {/* Bridge line — vertical bar morphs into radar sweep arm */}
          <line className="or-bridge"
            x1={OR_CX} y1={0} x2={OR_CX} y2={280}
            stroke="#F88C00" strokeWidth="2.5" strokeLinecap="round"
            style={{ opacity: 0 }}
          />

          {/* Rotating sweep group — blue */}
          <g ref={sweepRef} className="or-sweep">
            <path d={OR_WEDGE} fill="rgba(248,140,0,0.10)" />
            <line x1={OR_CX} y1={OR_CY} x2={OR_CX + OR_R} y2={OR_CY}
              stroke="#F88C00" strokeWidth="1.5"
              style={{ filter: "drop-shadow(0 0 4px rgba(248,140,0,0.9))" }}
            />
          </g>

          {/* Center pivot */}
          <circle className="or-pivot" cx={OR_CX} cy={OR_CY} r="4.5" fill="#F88C00"
            style={{ filter: "drop-shadow(0 0 5px rgba(248,140,0,0.8))" }}
          />

          {/* Client dots */}
          {OR_CLIENTS.map((c, i) => (
            <circle key={i} className="or-dot"
              cx={c.cx} cy={c.cy} r="4"
              fill="rgba(255,255,255,0.18)"
            />
          ))}

          {/* Icons centered on each client dot position */}
          {OR_CLIENTS.map((c, i) => (
            <g key={i} className="or-row" style={{ opacity: 0.25 }}>
              <g className="or-icon" transform={`translate(${c.cx}, ${c.cy})`} style={{ opacity: 0 }}>
                <circle r="12" fill="rgba(8,14,28,0.85)" stroke={c.color} strokeWidth="1.2"
                  style={{ filter: `drop-shadow(0 0 3px ${c.color}55)` }} />
                {c.icon === "phone" && <ObPhone c={c.color} />}
                {c.icon === "sms"   && <ObSMS   c={c.color} />}
                {c.icon === "doc"   && <ObDoc   c={c.color} />}
                {c.icon === "cal"   && <ObCal   c={c.color} />}
                {c.icon === "mail"  && <ObMail  c={c.color} />}
              </g>
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}

/* ─── Error Filter Animation — Pillar 04 ─── */
const EF_VW   = 280;
const EF_VH   = 224;
const EF_FTY  = 82;   // funnel top y
const EF_FNY  = 158;  // funnel neck y
const EF_FLTX = 46;   // funnel left  top x
const EF_FRTX = 234;  // funnel right top x
const EF_FLNX = 122;  // funnel left  neck x
const EF_FRNX = 158;  // funnel right neck x
const EF_FCX  = 140;  // funnel centre x
const EF_CKY  = 197;  // checkmark row y

// 5 messy icons — matching orbit icons: phone, sms, doc, cal, mail
const EF_MESSY = [
  { sx: 66,  sy: 20, rot:  18, type: "phone" as const, color: "#3b82f6" },
  { sx: 140, sy: 12, rot: -22, type: "sms"   as const, color: "#a855f7" },
  { sx: 214, sy: 26, rot:  38, type: "doc"   as const, color: "#F88C00" },
  { sx: 90,  sy: 52, rot:  -8, type: "cal"   as const, color: "#22c55e" },
  { sx: 190, sy: 48, rot:  28, type: "mail"  as const, color: "#06b6d4" },
];
const EF_CK_XS = [82, 112, 140, 168, 198];

// Inline SVG icon shapes (all drawn at origin 0,0)
function EfWarning() {
  return <>
    <polygon points="0,-11 10,7 -10,7" fill="rgba(239,68,68,0.85)" />
    <text x="0" y="6" textAnchor="middle" fontSize="8" fill="white" fontWeight="bold" fontFamily="monospace">!</text>
  </>;
}
function EfClock() {
  return <>
    <circle r="10" fill="rgba(8,14,28,0.5)" stroke="rgba(248,140,0,0.85)" strokeWidth="1.5" />
    <line x1="0" y1="0" x2="0"  y2="-6" stroke="rgba(248,140,0,0.9)" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="0" y1="0" x2="5"  y2="-3" stroke="rgba(248,140,0,0.9)" strokeWidth="1.5" strokeLinecap="round" />
    <circle r="1.5" fill="rgba(248,140,0,0.9)" />
  </>;
}
function EfPlane() {
  return <polygon points="0,-11 11,8 0,3 -11,8" fill="rgba(156,163,175,0.75)" />;
}
function EfX() {
  return <>
    <line x1="-7" y1="-7" x2="7"  y2="7"  stroke="rgba(239,68,68,0.85)" strokeWidth="2.5" strokeLinecap="round" />
    <line x1="7"  y1="-7" x2="-7" y2="7"  stroke="rgba(239,68,68,0.85)" strokeWidth="2.5" strokeLinecap="round" />
  </>;
}

function ErrorFilterWidget() {
  const containerRef = useRef<HTMLDivElement>(null);
  const tlRef        = useRef<gsap.core.Timeline | null>(null);
  const wasActiveRef = useRef(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const messyEls   = Array.from(el.querySelectorAll<SVGGElement>(".ef-messy"));
    const checkEls   = Array.from(el.querySelectorAll<SVGGElement>(".ef-check"));
    const neckGlow   = el.querySelector<SVGCircleElement>(".ef-neck-glow");
    const funnelLbl  = el.querySelector<SVGTextElement>(".ef-funnel-label");
    const exitArrow  = el.querySelector<SVGGElement>(".ef-exit");
    const caption    = el.querySelector<SVGTextElement>(".ef-caption");

    // Hard-reset all elements to their invisible starting state
    const resetVisuals = () => {
      messyEls.forEach((g, i) => {
        gsap.set(g, { x: EF_MESSY[i].sx, y: EF_MESSY[i].sy, rotation: EF_MESSY[i].rot, scale: 1, autoAlpha: 0 });
      });
      gsap.set(checkEls, { x: EF_FCX, y: EF_FNY + 10, autoAlpha: 0, scale: 0, rotation: 0 });
      if (neckGlow) { gsap.set(neckGlow, { autoAlpha: 0 }); neckGlow.setAttribute("r", "6"); }
      gsap.set(funnelLbl, { autoAlpha: 0 });
      if (exitArrow) gsap.set(exitArrow, { autoAlpha: 0 });
      if (caption) gsap.set(caption, { autoAlpha: 0 });
    };

    const stop = () => {
      if (tlRef.current) { tlRef.current.kill(); tlRef.current = null; }
      resetVisuals();
    };

    // play is declared with let so onComplete can reference it
    let play: () => void;
    play = () => {
      // Kill any running timeline and hard-reset before building a new one
      if (tlRef.current) { tlRef.current.kill(); tlRef.current = null; }
      resetVisuals();

      // Each call creates a fresh timeline — no repeat: -1, no onRepeat conflicts
      const tl = gsap.timeline({
        onComplete() {
          // Schedule next cycle only if still active
          if (wasActiveRef.current) play();
        },
      });
      tlRef.current = tl;

      // Check if icons already came from radar transition
      const skipDropIn = (el as any).__skipDropIn === true;
      if (skipDropIn) {
        (el as any).__skipDropIn = false;
        // Icons are already visible at their positions — just ensure they're set
        messyEls.forEach((g, i) => {
          gsap.set(g, { x: EF_MESSY[i].sx, y: EF_MESSY[i].sy, rotation: EF_MESSY[i].rot, scale: 1, autoAlpha: 1 });
        });
        // Small delay then go straight to wobble
        tl.to({}, { duration: 0.3 }, 0);
      } else {
        // 1 — icons drop in staggered
        tl.fromTo(messyEls,
          { autoAlpha: 0, y: (i) => EF_MESSY[i].sy - 14 },
          { autoAlpha: 1, y: (i) => EF_MESSY[i].sy, duration: 0.22, stagger: 0.08, ease: "power2.out" },
          0.1
        );
      }

      // Time offset: skip drop-in saves ~0.7s
      const t0 = skipDropIn ? 0.3 : 0.9;

      // 2 — funnel label fades in
      tl.to(funnelLbl, { autoAlpha: 1, duration: 0.35 }, t0);

      // 3 — chaotic wobble x2
      tl.to(messyEls, {
        x: (i) => EF_MESSY[i].sx + gsap.utils.random(-10, 10),
        y: (i) => EF_MESSY[i].sy + gsap.utils.random(-7, 7),
        rotation: (i) => EF_MESSY[i].rot + gsap.utils.random(-25, 25),
        duration: 0.38, stagger: 0.04, ease: "power1.inOut",
      }, t0 + 0.1);
      tl.to(messyEls, {
        x: (i) => EF_MESSY[i].sx + gsap.utils.random(-10, 10),
        y: (i) => EF_MESSY[i].sy + gsap.utils.random(-7, 7),
        rotation: (i) => EF_MESSY[i].rot + gsap.utils.random(-25, 25),
        duration: 0.38, stagger: 0.04, ease: "power1.inOut",
      }, t0 + 0.52);

      // 4 — converge into funnel
      const t1 = t0 + 1.1;
      tl.to(messyEls, {
        x: EF_FCX, y: EF_FTY + 4,
        scale: 0.2, rotation: 0, autoAlpha: 0,
        duration: 0.52, stagger: 0.04, ease: "power3.in",
      }, t1);

      // 5 — neck glow pulse as icons "process"
      tl.to(neckGlow, { autoAlpha: 1, attr: { r: 14 }, duration: 0.25, ease: "power2.out" }, t1 + 0.55);
      tl.to(neckGlow, { autoAlpha: 0, attr: { r: 6  }, duration: 0.4,  ease: "power2.in"  }, t1 + 0.80);

      // 6 — exit arrow appears
      if (exitArrow) {
        tl.to(exitArrow, { autoAlpha: 1, duration: 0.3, ease: "power2.out" }, t1 + 0.7);
      }

      // 7 — checkmarks emerge and spread out from funnel neck
      EF_CK_XS.forEach((cx, i) => {
        tl.fromTo(checkEls[i],
          { x: EF_FCX, y: EF_FNY + 10, autoAlpha: 0, scale: 0.1, rotation: -15 },
          { x: cx, y: EF_CKY, autoAlpha: 1, scale: 1, rotation: 0, duration: 0.42, ease: "back.out(1.8)" },
          t1 + 0.9 + i * 0.09
        );
      });

      // 8 — caption appears after checkmarks
      if (caption) {
        tl.to(caption, { autoAlpha: 1, duration: 0.3, ease: "power2.out" }, t1 + 1.4);
      }

      // Hold
      tl.to({}, { duration: 1.4 });
    };

    const check = () => {
      const active = !!el.closest(".animate-active");
      if (active && !wasActiveRef.current)      { wasActiveRef.current = true;  play(); }
      else if (!active && wasActiveRef.current) { wasActiveRef.current = false; stop(); }
    };

    check();
    const observers: MutationObserver[] = [];
    let node: HTMLElement | null = el.parentElement;
    while (node && observers.length < 6) {
      const obs = new MutationObserver(check);
      obs.observe(node, { attributes: true, attributeFilter: ["class"] });
      observers.push(obs);
      node = node.parentElement;
    }
    return () => { stop(); observers.forEach((o) => o.disconnect()); };
  }, []);

  // Pre-compute funnel fill path
  const funnelFill = `M ${EF_FLTX} ${EF_FTY} L ${EF_FLNX} ${EF_FNY} L ${EF_FRNX} ${EF_FNY} L ${EF_FRTX} ${EF_FTY} Z`;

  return (
    <div ref={containerRef}>
      <div className="relative">
        <svg viewBox={`0 0 ${EF_VW} ${EF_VH}`} className="w-full" style={{ height: 360 }} overflow="visible">

          {/* ── Messy icons — same as orbit icons (rendered at 0,0 — GSAP positions them) ── */}
          {EF_MESSY.map((icon, i) => (
            <g key={i} className="ef-messy" style={{ opacity: 0 }}>
              <circle r="14" fill="rgba(8,14,28,0.85)" stroke={icon.color} strokeWidth="1.4"
                style={{ filter: `drop-shadow(0 0 4px ${icon.color}55)` }} />
              {icon.type === "phone" && <ObPhone c={icon.color} />}
              {icon.type === "sms"   && <ObSMS   c={icon.color} />}
              {icon.type === "doc"   && <ObDoc   c={icon.color} />}
              {icon.type === "cal"   && <ObCal   c={icon.color} />}
              {icon.type === "mail"  && <ObMail  c={icon.color} />}
            </g>
          ))}

          {/* ── Funnel — blue themed ── */}
          <path d={funnelFill} fill="rgba(10,14,23,0.85)" />
          {/* Left wall */}
          <line x1={EF_FLTX} y1={EF_FTY} x2={EF_FLNX} y2={EF_FNY}
            stroke="rgba(248,140,0,0.6)" strokeWidth="1.5" />
          {/* Right wall */}
          <line x1={EF_FRTX} y1={EF_FTY} x2={EF_FRNX} y2={EF_FNY}
            stroke="rgba(248,140,0,0.6)" strokeWidth="1.5" />
          {/* Top rim */}
          <line x1={EF_FLTX} y1={EF_FTY} x2={EF_FRTX} y2={EF_FTY}
            stroke="rgba(248,140,0,0.3)" strokeWidth="1" />
          {/* Neck */}
          <line x1={EF_FLNX} y1={EF_FNY} x2={EF_FRNX} y2={EF_FNY}
            stroke="rgba(248,140,0,0.8)" strokeWidth="2" />

          {/* Filter grid lines inside funnel */}
          {[0.28, 0.55, 0.80].map((t, i) => {
            const y  = EF_FTY + (EF_FNY - EF_FTY) * t;
            const lx = EF_FLTX + (EF_FLNX - EF_FLTX) * t;
            const rx = EF_FRTX + (EF_FRNX - EF_FRTX) * t;
            return <line key={i} x1={lx} y1={y} x2={rx} y2={y}
              stroke="rgba(248,140,0,0.3)" strokeWidth="0.75" strokeDasharray="3 5" />;
          })}

          {/* Funnel label */}
          <text className="ef-funnel-label"
            x={EF_FCX} y={EF_FTY + 40}
            textAnchor="middle" fill="#FFFFFF"
            fontSize="9" fontFamily="monospace" fontWeight="bold"
            opacity="0" style={{ letterSpacing: "0.15em" }}
          >QALL FILTER</text>

          {/* Neck glow — pulses when icons "process" */}
          <circle className="ef-neck-glow"
            cx={EF_FCX} cy={EF_FNY} r="6"
            fill="rgba(248,140,0,0.6)"
            style={{ filter: "blur(4px)", opacity: 0 }}
          />

          {/* Exit stem + arrow — hidden initially, shown after funnel anim */}
          <g className="ef-exit" style={{ opacity: 0 }}>
            <line x1={EF_FCX} y1={EF_FNY} x2={EF_FCX} y2={EF_FNY + 20}
              stroke="rgba(34,197,94,0.45)" strokeWidth="1.5" />
            <polygon
              points={`${EF_FCX},${EF_FNY + 24} ${EF_FCX - 4},${EF_FNY + 17} ${EF_FCX + 4},${EF_FNY + 17}`}
              fill="rgba(34,197,94,0.55)"
            />
          </g>

          {/* ── Clean checkmarks (GSAP positions them) ── */}
          {EF_CK_XS.map((_, i) => (
            <g key={i} className="ef-check" style={{ opacity: 0 }}>
              <circle r="11" fill="#22c55e" />
              <path d="M -5 0 L -1.5 4.5 L 6 -5"
                fill="none" stroke="#bbf7d0" strokeWidth="2.5"
                strokeLinecap="round" strokeLinejoin="round" />
            </g>
          ))}

          {/* Bottom caption — hidden initially */}
          <text className="ef-caption" x={EF_FCX} y={EF_VH - 4}
            textAnchor="middle" fill="#FFFFFF"
            fontSize="8" fontFamily="monospace" fontWeight="bold"
            style={{ opacity: 0 }}
          >AUTOMATED · COMPLIANT · CONSISTENT</text>
        </svg>
      </div>
    </div>
  );
}

/* ─── 360° Orbit Animation — Pillar 05 ─── */
const OB_CX = 140;
const OB_CY = 120;
const OB_R  = 72;

const OB_ICONS = [
  { label: "Call History",   angle:   0, color: "#3b82f6", type: "phone" as const },
  { label: "SMS",            angle:  60, color: "#a855f7", type: "sms"   as const },
  { label: "Policy Details", angle: 120, color: "#F88C00", type: "doc"   as const },
  { label: "Renewals",       angle: 180, color: "#22c55e", type: "cal"   as const },
  { label: "Email",          angle: 240, color: "#06b6d4", type: "mail"  as const },
  { label: "Notes",          angle: 300, color: "#f59e0b", type: "note"  as const },
].map((o) => ({
  ...o,
  ix: Math.round(OB_CX + Math.cos((o.angle * Math.PI) / 180) * OB_R),
  iy: Math.round(OB_CY + Math.sin((o.angle * Math.PI) / 180) * OB_R),
}));

// Minimal icon paths drawn at origin for a ~10px display area
function ObPhone({ c }: { c: string }) {
  return <>
    <rect x="-4.5" y="-7" width="9" height="14" rx="2" fill="none" stroke={c} strokeWidth="1.3" />
    <circle cx="0" cy="4.5" r="1.2" fill={c} />
  </>;
}
function ObSMS({ c }: { c: string }) {
  return <>
    <rect x="-6" y="-5.5" width="12" height="9" rx="2" fill="none" stroke={c} strokeWidth="1.3" />
    <path d="M -2,3.5 L 0,7 L 2,3.5" fill={c} />
  </>;
}
function ObDoc({ c }: { c: string }) {
  return <>
    <rect x="-5" y="-7" width="10" height="14" rx="1" fill="none" stroke={c} strokeWidth="1.3" />
    <line x1="-3" y1="-2.5" x2="3" y2="-2.5" stroke={c} strokeWidth="1.1" />
    <line x1="-3" y1="0.5"  x2="3" y2="0.5"  stroke={c} strokeWidth="1.1" />
    <line x1="-3" y1="3.5"  x2="1" y2="3.5"  stroke={c} strokeWidth="1.1" />
  </>;
}
function ObCal({ c }: { c: string }) {
  return <>
    <rect x="-6" y="-5" width="12" height="12" rx="1" fill="none" stroke={c} strokeWidth="1.3" />
    <line x1="-6" y1="-1" x2="6" y2="-1" stroke={c} strokeWidth="1" />
    <line x1="-3" y1="-7" x2="-3" y2="-3" stroke={c} strokeWidth="1.3" />
    <line x1="3"  y1="-7" x2="3"  y2="-3" stroke={c} strokeWidth="1.3" />
    <rect x="-4" y="1" width="3" height="3" rx="0.5" fill={c} opacity="0.7" />
    <rect x="1"  y="1" width="3" height="3" rx="0.5" fill={c} opacity="0.7" />
  </>;
}
function ObMail({ c }: { c: string }) {
  return <>
    <rect x="-6" y="-5" width="12" height="10" rx="1" fill="none" stroke={c} strokeWidth="1.3" />
    <path d="M -6,-5 L 0,2 L 6,-5" fill="none" stroke={c} strokeWidth="1.2" />
  </>;
}
function ObNote({ c }: { c: string }) {
  return <>
    <polygon points="0,-8 2.4,-2.5 8.5,-2.5 3.8,1 5.5,7 0,3.5 -5.5,7 -3.8,1 -8.5,-2.5 -2.4,-2.5"
      fill={c} opacity="0.85" style={{ transform: "scale(0.78)" }} />
  </>;
}

function OrbitWidget() {
  const containerRef  = useRef<HTMLDivElement>(null);
  const tlRef         = useRef<gsap.core.Timeline | null>(null);
  const orbitTweenRef = useRef<gsap.core.Tween | null>(null);
  const timersRef     = useRef<ReturnType<typeof setTimeout>[]>([]);
  const wasActiveRef  = useRef(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const clientEl  = el.querySelector<SVGGElement>(".ob-client");
    const ringEl    = el.querySelector<SVGCircleElement>(".ob-ring");
    const headEl    = el.querySelector<SVGCircleElement>(".ob-head");
    const bodyEl    = el.querySelector<SVGPathElement>(".ob-body");
    const orbitEls  = Array.from(el.querySelectorAll<SVGGElement>(".ob-orbit"));
    const labelEls  = Array.from(el.querySelectorAll<SVGTextElement>(".ob-label"));

    const clearTimers = () => { timersRef.current.forEach(clearTimeout); timersRef.current = []; };

    /** Reset avatar to greyed-out hidden state */
    const resetVisuals = () => {
      gsap.set(clientEl, { autoAlpha: 0, scale: 0.4, transformOrigin: `${OB_CX}px ${OB_CY}px`, filter: "none" });
      // Reset to grey
      if (ringEl) { ringEl.setAttribute("fill", "rgba(100,100,100,0.15)"); ringEl.setAttribute("stroke", "rgba(100,100,100,0.4)"); ringEl.setAttribute("stroke-width", "1.5"); }
      if (headEl) headEl.setAttribute("fill", "rgba(100,100,100,0.4)");
      if (bodyEl) bodyEl.setAttribute("fill", "rgba(100,100,100,0.4)");
      orbitEls.forEach((g, i) => gsap.set(g, { x: OB_ICONS[i].ix, y: OB_ICONS[i].iy, autoAlpha: 0, scale: 0 }));
      gsap.set(labelEls, { autoAlpha: 0 });
    };

    const stop = () => {
      clearTimers();
      tlRef.current?.kill();        tlRef.current = null;
      orbitTweenRef.current?.kill(); orbitTweenRef.current = null;
      resetVisuals();
    };

    const startOrbit = () => {
      // Show labels
      gsap.to(labelEls, { autoAlpha: 1, duration: 0.4, stagger: 0.06 });

      // Continuous orbit via proxy
      const proxy = { a: 0 };
      orbitTweenRef.current = gsap.to(proxy, {
        a: 360,
        duration: 9,
        ease: "none",
        repeat: -1,
        onUpdate() {
          orbitEls.forEach((g, i) => {
            const rad = ((OB_ICONS[i].angle + proxy.a) * Math.PI) / 180;
            gsap.set(g, {
              x: OB_CX + Math.cos(rad) * OB_R,
              y: OB_CY + Math.sin(rad) * OB_R,
            });
          });
        },
      });

      // Restart the full sequence after 1 orbit + hold
      timersRef.current.push(setTimeout(() => {
        if (wasActiveRef.current) { stop(); play(); } // eslint-disable-line @typescript-eslint/no-use-before-define
      }, 10500));
    };

    const play = () => {
      stop();
      resetVisuals();

      const fromTicks = (el as any).__fromTicks === true;
      if (fromTicks) (el as any).__fromTicks = false;

      const tl = gsap.timeline({ onComplete: startOrbit });
      tlRef.current = tl;

      /** Light up avatar from grey to bright glowing orange */
      const lightUpAvatar = (startTime: number) => {
        // Bright orange with high opacity
        tl.to(ringEl, {
          attr: { fill: "rgba(248,140,0,0.35)", stroke: "#F88C00", strokeWidth: 2.5 },
          duration: 0.5, ease: "power2.out",
        }, startTime);
        tl.to(headEl, {
          attr: { fill: "#F88C00" },
          duration: 0.5, ease: "power2.out",
        }, startTime);
        tl.to(bodyEl, {
          attr: { fill: "#F88C00" },
          duration: 0.5, ease: "power2.out",
        }, startTime);
        // Add glow via CSS filter on the whole client group
        tl.to(clientEl, {
          filter: "drop-shadow(0 0 12px rgba(248,140,0,0.8))",
          duration: 0.5, ease: "power2.out",
        }, startTime);
        // Settle glow down slightly after the burst
        tl.to(clientEl, {
          filter: "drop-shadow(0 0 6px rgba(248,140,0,0.5))",
          duration: 0.6, ease: "power2.inOut",
        }, startTime + 0.5);
      };

      if (fromTicks) {
        // Icons were placed by the transition — show client greyed, light up when orbit starts
        tl.to(clientEl, { autoAlpha: 1, scale: 1, duration: 0.35, ease: "power2.out" }, 0);
        lightUpAvatar(0.6);

        // Wait for icons to be in position before starting orbit
        tl.to({}, { duration: 0.8 });
      } else {
        // 1 — client avatar appears greyed out
        tl.to(clientEl, { autoAlpha: 1, scale: 1, duration: 0.45, ease: "back.out(2.5)" }, 0.3);

        // 2 — orbit icons appear one by one at ring positions
        const lastIconT = 1.0 + (OB_ICONS.length - 1) * 0.28 + 0.3;
        orbitEls.forEach((g, i) => {
          tl.to(g, { autoAlpha: 1, scale: 1, duration: 0.3, ease: "back.out(2.8)" }, 1.0 + i * 0.28);
        });

        // 3 — avatar lights up bright orange once all icons are in place
        lightUpAvatar(lastIconT);

        // Brief pause before orbit begins (onComplete fires)
        tl.to({}, { duration: 0.35 });
      }
    };

    const check = () => {
      const active = !!el.closest(".animate-active");
      if (active && !wasActiveRef.current)      { wasActiveRef.current = true;  play(); }
      else if (!active && wasActiveRef.current) { wasActiveRef.current = false; stop(); }
    };

    check();
    const observers: MutationObserver[] = [];
    let node: HTMLElement | null = el.parentElement;
    while (node && observers.length < 6) {
      const obs = new MutationObserver(check);
      obs.observe(node, { attributes: true, attributeFilter: ["class"] });
      observers.push(obs);
      node = node.parentElement;
    }
    return () => { stop(); observers.forEach((o) => o.disconnect()); };
  }, []);

  return (
    <div ref={containerRef}>
      <div className="relative">
        <svg viewBox="0 0 280 240" className="w-full" style={{ height: 360 }} overflow="visible">

          {/* Orbit track */}
          <circle cx={OB_CX} cy={OB_CY} r={OB_R}
            fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" strokeDasharray="4 5" />

          {/* Client avatar (centre) — starts greyed out, lights up orange */}
          <g className="ob-client" style={{ opacity: 0 }}>
            <circle className="ob-ring" cx={OB_CX} cy={OB_CY} r="27"
              fill="rgba(100,100,100,0.15)" stroke="rgba(100,100,100,0.4)" strokeWidth="1.5" />
            {/* Head */}
            <circle className="ob-head" cx={OB_CX} cy={OB_CY - 8} r="8" fill="rgba(100,100,100,0.4)" />
            {/* Shoulders */}
            <path className="ob-body" d={`M ${OB_CX - 17} ${OB_CY + 20} Q ${OB_CX - 17} ${OB_CY + 8} ${OB_CX} ${OB_CY + 8} Q ${OB_CX + 17} ${OB_CY + 8} ${OB_CX + 17} ${OB_CY + 20}`}
              fill="rgba(100,100,100,0.4)" />
          </g>

          {/* Orbit icon nodes (GSAP positions via x,y) */}
          {OB_ICONS.map((icon, i) => (
            <g key={i} className="ob-orbit" style={{ opacity: 0 }}>
              {/* Background circle */}
              <circle r="14" fill="rgba(8,14,28,0.85)"
                stroke={icon.color} strokeWidth="1.4"
                style={{ filter: `drop-shadow(0 0 4px ${icon.color}55)` }}
              />
              {/* Icon shape */}
              {icon.type === "phone" && <ObPhone c={icon.color} />}
              {icon.type === "sms"   && <ObSMS   c={icon.color} />}
              {icon.type === "doc"   && <ObDoc   c={icon.color} />}
              {icon.type === "cal"   && <ObCal   c={icon.color} />}
              {icon.type === "mail"  && <ObMail  c={icon.color} />}
              {icon.type === "note"  && <ObNote  c={icon.color} />}
            </g>
          ))}

        </svg>
      </div>
    </div>
  );
}

/* ─── CRM Widget content per Feature ─── */
function FeatureCRMWidget({ id }: { id: string }) {
  const widgets: Record<string, React.ReactNode> = {
    "unified-source": <SiloShatterWidget />,
    "performance-tracking": <LivePulseWidget />,
    "ai-advisor": <OpportunityRadarWidget />,
    efficiency: <ErrorFilterWidget />,
    "client-engagement": <OrbitWidget />,
  };

  return widgets[id] || widgets["unified-source"];
}

/* ─── Mobile: Pinned scroll feature showcase + Numbers Speak ─── */
function MobileFeatureShowcase() {
  const pinRef = useRef<HTMLDivElement>(null);
  const widgetRefs = useRef<(HTMLDivElement | null)[]>([]);
  const textRefs = useRef<(HTMLDivElement | null)[]>([]);
  const dotRefs = useRef<(HTMLDivElement | null)[]>([]);
  const dataRef = useRef<HTMLDivElement>(null);
  const currentRef = useRef(-1);
  const count = FEATURES_V2.length;
  // total steps: features + 1 for Numbers Speak
  const totalSteps = count + 1;

  useEffect(() => {
    const el = pinRef.current;
    if (!el) return;
    if (typeof window !== "undefined" && window.innerWidth >= 768) return;

    const widgets = widgetRefs.current.filter(Boolean) as HTMLElement[];
    const texts = textRefs.current.filter(Boolean) as HTMLElement[];
    const dots = dotRefs.current.filter(Boolean) as HTMLElement[];
    const dataEl = dataRef.current;

    // First widget visible but animation not yet active — triggered on pin
    widgets.forEach((w, i) => { if (i > 0) gsap.set(w, { autoAlpha: 0 }); });
    texts.forEach((t, i) => gsap.set(t, { autoAlpha: i === 0 ? 1 : 0, y: 0 }));
    dots.forEach((d, i) => { d.style.opacity = i === 0 ? "1" : "0.3"; d.style.transform = i === 0 ? "scale(1.5)" : "scale(1)"; });
    if (dataEl) gsap.set(dataEl, { autoAlpha: 0, y: 40 });
    currentRef.current = 0;
    let firstActivated = false;

    const activateTimeouts: ReturnType<typeof setTimeout>[] = [];
    const transitionTo = (newIdx: number) => {
      if (newIdx === currentRef.current) return;
      const prevIdx = currentRef.current;
      currentRef.current = newIdx;

      // Cancel any pending activation timers from an earlier fast-scroll jump
      while (activateTimeouts.length) {
        clearTimeout(activateTimeouts.pop()!);
      }

      // Defensive: force-hide every widget/text except the incoming one so
      // fast scrolling can't leave multiple panels visible on top of each other.
      widgets.forEach((w, i) => {
        if (i === newIdx) return;
        w.classList.remove("animate-active");
        gsap.to(w, { autoAlpha: 0, duration: 0.25, overwrite: "auto" });
      });
      texts.forEach((t, i) => {
        if (i === newIdx) return;
        gsap.to(t, { autoAlpha: 0, y: i < newIdx ? -20 : 20, duration: 0.25, overwrite: "auto" });
      });

      if (newIdx < count) {
        if (dataEl) {
          dataEl.classList.remove("animate-active");
          gsap.to(dataEl, { autoAlpha: 0, y: 40, duration: 0.25, overwrite: "auto" });
        }

        gsap.to(widgets[newIdx], { autoAlpha: 1, duration: 0.3, delay: 0.1, overwrite: "auto" });
        gsap.to(texts[newIdx], { autoAlpha: 1, y: 0, duration: 0.35, delay: 0.15, overwrite: "auto" });
        activateTimeouts.push(setTimeout(() => widgets[newIdx]?.classList.add("animate-active"), 180));

        dots.forEach((d, i) => {
          d.style.opacity = i === newIdx ? "1" : "0.3";
          d.style.transform = i === newIdx ? "scale(1.5)" : "scale(1)";
        });
        void prevIdx;
      } else if (newIdx === count && dataEl) {
        dots.forEach((d) => { d.style.opacity = "0.3"; d.style.transform = "scale(1)"; });
        gsap.to(dataEl, { autoAlpha: 1, y: 0, duration: 0.4, delay: 0.1, overwrite: "auto" });
        activateTimeouts.push(setTimeout(() => dataEl.classList.add("animate-active"), 250));
      }
    };

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: el,
        start: "top top",
        end: `+=${totalSteps * 70}%`,
        pin: true,
        snap: {
          snapTo: (value) => Math.round(value * totalSteps) / totalSteps,
          duration: { min: 0.15, max: 0.4 },
          ease: "power2.out",
        },
        onEnter() {
          // Activate first widget animation when section pins into view
          if (!firstActivated) {
            firstActivated = true;
            widgets[0]?.classList.add("animate-active");
          }
        },
        onUpdate(self) {
          const progress = self.progress * totalSteps;
          const idx = Math.min(Math.floor(progress), totalSteps - 1);
          transitionTo(idx);
        },
      });
    }, el);

    return () => {
      activateTimeouts.forEach(clearTimeout);
      ctx.revert();
    };
  }, [count, totalSteps]);

  return (
    <div
      ref={pinRef}
      className="md:hidden relative h-screen flex flex-col overflow-hidden pt-16 pb-24"
      style={{ backgroundColor: "#0d2240" }}
    >
      {/* Widget area — grows to fill top portion */}
      <div className="relative px-4 flex-1 min-h-0">
        {FEATURES_V2.map((feature, i) => (
          <div
            key={feature.id}
            ref={(el) => { widgetRefs.current[i] = el; }}
            className="absolute inset-x-4 top-0 overflow-hidden"
            style={i === 0 ? {} : { opacity: 0, visibility: "hidden" }}
          >
            <FeatureCRMWidget id={feature.id} />
          </div>
        ))}

        {/* Numbers Speak — overlaid in same area */}
        <div
          ref={dataRef}
          className="absolute inset-x-4 top-12"
          style={{ opacity: 0, visibility: "hidden" }}
        >
          <div className="text-center mb-4">
            <span className="inline-block px-3 py-1 text-xs font-medium tracking-wider uppercase text-orange-500 bg-orange-500/10 rounded-full mb-2">
              Real Results
            </span>
            <h2 className="font-heading font-bold text-xl text-orange-500">
              The Numbers Speak
            </h2>
            <p className="mt-1 text-sm text-white">
              Real results from a live brokerage on Qall.
            </p>
          </div>
          <GrowthChart />
        </div>
      </div>

      {/* Text area — pinned to bottom */}
      <div className="relative flex-shrink-0 px-6 -mt-8" style={{ height: "160px" }}>
        {FEATURES_V2.map((feature, i) => (
          <div
            key={feature.id}
            ref={(el) => { textRefs.current[i] = el; }}
            className="absolute inset-x-6 top-0"
            style={i === 0 ? {} : { opacity: 0, visibility: "hidden" }}
          >
            <h3 className="font-heading font-bold text-2xl text-orange-500 mb-2">{feature.title}</h3>
            <p className="text-sm font-semibold text-white mb-2">{feature.subtitle}</p>
            <p className="text-white leading-relaxed text-sm">{feature.description}</p>
          </div>
        ))}
      </div>

      {/* Progress dots — hidden, kept as refs for GSAP animations */}
      <div className="hidden">
        {FEATURES_V2.map((_, i) => (
          <div
            key={i}
            ref={(el) => { dotRefs.current[i] = el; }}
          />
        ))}
      </div>
    </div>
  );
}

/* ─── Single pinned section with internal cross-fade & side-swap ─── */
export function FeatureShowcase() {
  const pinRef = useRef<HTMLDivElement>(null);
  const textLayersRef = useRef<(HTMLDivElement | null)[]>([]);
  const widgetRef = useRef<HTMLDivElement>(null);
  const widgetContentRefs = useRef<(HTMLDivElement | null)[]>([]);
  const progressDotsRef = useRef<(HTMLDivElement | null)[]>([]);
  const cardInnerRef = useRef<HTMLDivElement>(null);
  const resultsHeadingRef = useRef<HTMLDivElement>(null);
  const dataContentRef = useRef<HTMLDivElement>(null);
  const diamondRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

  const count = FEATURES_V2.length;

  useEffect(() => {
    const el = pinRef.current;
    const widget = widgetRef.current;
    if (!el || !widget) return;
    if (window.innerWidth < 768) return;

    const textLayers = textLayersRef.current.filter(Boolean) as HTMLElement[];
    const widgetContents = widgetContentRefs.current.filter(Boolean) as HTMLElement[];
    const dots = progressDotsRef.current.filter(Boolean) as HTMLElement[];

    // Hide everything initially
    textLayers.forEach((layer) => {
      gsap.set(layer, { autoAlpha: 0, y: 30 });
    });
    widgetContents.forEach((wc) => {
      gsap.set(wc, { autoAlpha: 0 });
    });
    // Widget starts hidden; always on the left side
    gsap.set(widget, { autoAlpha: 0, scale: 0.9, rotateY: 0 });
    // Results heading hidden until diamond stage
    if (resultsHeadingRef.current) {
      gsap.set(resultsHeadingRef.current, { autoAlpha: 0, y: 30 });
    }
    if (diamondRef.current) {
      gsap.set(diamondRef.current, { autoAlpha: 0, scale: 0, rotation: 45 });
    }
    // Data content starts below viewport
    if (dataContentRef.current) {
      gsap.set(dataContentRef.current, { y: "100vh" });
    }

    // Shared state — accessible by both gsap.context and event handlers
    let currentFeature = -1;
    let isAnimating = false;
    let isPinned = false;
    let activeTl: gsap.core.Timeline | null = null;
    let pinTrigger: ScrollTrigger | null = null;
    // Earliest time at which the user is allowed to scroll past Numbers Speak.
    // Set when the diamond starts expanding so the chart has time to play
    // through the "after Qall" bars before we release the pin.
    let chartReadyAt = 0;
    const CHART_HOLD_MS = 5000;
    const totalSteps = count + 1;

    // transitionTo will be assigned inside the context
    let transitionTo: (newIdx: number) => void = () => {};

    const ctx = gsap.context(() => {
      const totalSegments = count + 1.5;

      const activateWidget = (idx: number) => {
        widgetContents.forEach((wc, j) => {
          if (j === idx) {
            wc.querySelectorAll<HTMLElement>("[class*='animate-']").forEach((el) => {
              el.style.animation = "none";
              void el.offsetWidth;
              el.style.animation = "";
            });
            wc.classList.add("animate-active");
          } else {
            wc.classList.remove("animate-active");
          }
        });
      };

      // Single consistent dark blue background
      const BG_COLOR = "#0d2240";

      transitionTo = (newIdx: number) => {
        if (newIdx === currentFeature) return;
        if (newIdx < 0 || newIdx > count) return;

        // Kill any in-progress animation — jump to its end state
        // so nothing is left half-visible
        if (activeTl) {
          activeTl.progress(1).kill();
          activeTl = null;
        }

        isAnimating = true;
        const prevIdx = currentFeature;
        currentFeature = newIdx;

        // No background animation — consistent dark blue throughout

        const tl = gsap.timeline({
          onComplete() { isAnimating = false; activeTl = null; },
        });
        activeTl = tl;

        // --- SPECIAL: Radar → Funnel (3D flip) ---
        const isRadarToFunnel = prevIdx === 2 && newIdx === 3;
        const isFunnelToRadar = prevIdx === 3 && newIdx === 2;

        if (isRadarToFunnel) {
          // 3D FUNNEL: Build a wireframe funnel from stacked circular rings
          // whose proportions match the actual 2D funnel widget exactly.
          // Viewed from above → circle (radar). Rotate to side → funnel profile.
          tl.to(textLayers[prevIdx], {
            autoAlpha: 0, y: -20, duration: 0.3, ease: "power2.in",
          }, 0);
          if (dots[prevIdx]) tl.to(dots[prevIdx], { scale: 1, opacity: 0.3, duration: 0.2 }, 0);
          widgetContents[prevIdx]?.classList.remove("animate-active");

          const radarContent = widgetContents[prevIdx];
          const funnelContent = widgetContents[newIdx];

          // Briefly show funnel content (invisible) to measure its SVG position
          gsap.set(funnelContent, { autoAlpha: 0, visibility: "visible" });
          const funnelSvg = funnelContent?.querySelector("svg");
          let funnelScreenRect = { left: 0, top: 0, width: 0, height: 0 };
          if (funnelSvg) {
            const svgRect = funnelSvg.getBoundingClientRect();
            // Calculate where the funnel shape sits within the SVG
            const scaleX = svgRect.width / EF_VW;
            const scaleY = svgRect.height / EF_VH;
            const funnelCenterX = svgRect.left + EF_FCX * scaleX;
            const funnelTopY = svgRect.top + EF_FTY * scaleY;
            const funnelNeckY = svgRect.top + EF_FNY * scaleY;
            const funnelTopHalfW = ((EF_FRTX - EF_FLTX) / 2) * scaleX;
            const funnelNeckHalfW = ((EF_FRNX - EF_FLNX) / 2) * scaleX;
            funnelScreenRect = {
              left: funnelCenterX,
              top: funnelTopY,
              width: funnelTopHalfW, // half-width at top (= top radius)
              height: funnelNeckY - funnelTopY,
            };
          }
          gsap.set(funnelContent, { visibility: "hidden" });

          // Hide radar widget
          tl.to(radarContent, { autoAlpha: 0, duration: 0.3 }, 0.1);

          // Build the 3D funnel overlay — positioned to match the real funnel
          const overlayId = "funnel-3d-overlay";
          let oldOverlay = document.getElementById(overlayId);
          if (oldOverlay) oldOverlay.remove();

          const overlay = document.createElement("div");
          overlay.id = overlayId;

          // Use the measured funnel proportions
          const topR = funnelScreenRect.width || 120;
          const neckR = topR * ((EF_FRNX - EF_FLNX) / (EF_FRTX - EF_FLTX));
          const funnelDepth = funnelScreenRect.height || 120;

          // Position the overlay centered on where the funnel appears
          const sceneCX = funnelScreenRect.left;
          const sceneCY = funnelScreenRect.top + funnelDepth / 2;
          const sceneSize = Math.max(topR * 2.5, funnelDepth * 1.5);

          overlay.style.cssText = `
            position:fixed; z-index:9998; pointer-events:none;
            left:${sceneCX - sceneSize / 2}px; top:${sceneCY - sceneSize / 2}px;
            width:${sceneSize}px; height:${sceneSize}px;
            perspective:1200px;
          `;

          // 3D scene — starts viewed from above
          const scene = document.createElement("div");
          scene.style.cssText = `
            width:100%; height:100%;
            transform-style:preserve-3d;
            transform:rotateX(-85deg);
            position:relative;
          `;

          // Build funnel from stacked rings matching exact proportions
          const RING_COUNT = 16;
          for (let i = 0; i < RING_COUNT; i++) {
            const t = i / (RING_COUNT - 1);
            const r = topR * (1 - t) + neckR * t;
            const y = t * funnelDepth;
            const opacity = i === 0 ? 0.7 : i === RING_COUNT - 1 ? 0.6 : 0.25 + 0.1 * Math.sin(t * Math.PI);

            const ring = document.createElement("div");
            ring.style.cssText = `
              position:absolute;
              left:50%; top:50%;
              width:${r * 2}px; height:${r * 2}px;
              margin-left:${-r}px; margin-top:${-r}px;
              border-radius:50%;
              border:${i === 0 ? 2 : 1.5}px solid rgba(248,140,0,${opacity});
              transform:rotateX(90deg) translateZ(${-y}px);
              ${i === 0 ? "box-shadow:0 0 10px rgba(248,140,0,0.3);" : ""}
            `;
            scene.appendChild(ring);
          }

          // Vertical edge lines
          for (let a = 0; a < 8; a++) {
            const angle = (a / 8) * Math.PI * 2;
            const x1 = Math.cos(angle) * topR;

            const vLine = document.createElement("div");
            vLine.style.cssText = `
              position:absolute;
              left:calc(50% + ${x1}px); top:50%;
              width:1.5px; height:0px;
              background:rgba(248,140,0,0.12);
              transform-origin:top center;
              transform:rotateX(90deg);
            `;
            scene.appendChild(vLine);

            gsap.to(vLine, {
              height: funnelDepth,
              delay: 0.4 + a * 0.03,
              duration: 0.6,
              ease: "power2.out",
            });
          }

          overlay.appendChild(scene);
          document.body.appendChild(overlay);

          // Animate rotation: top-down → side view
          gsap.to(scene, {
            rotateX: -10,
            duration: 1.8,
            ease: "power2.inOut",
            delay: 0.2,
          });

          // Fade out 3D funnel and show real funnel widget simultaneously
          gsap.to(overlay, {
            opacity: 0,
            duration: 0.4,
            delay: 1.7,
            onComplete: () => overlay.remove(),
          });

          tl.to(funnelContent, { autoAlpha: 1, duration: 0.4 }, 1.5);

          // Text + dot for new feature
          tl.to(textLayers[newIdx], {
            autoAlpha: 1, y: 0, duration: 0.4, ease: "power2.out",
          }, 1.4);
          if (dots[newIdx]) tl.to(dots[newIdx], { scale: 1.5, opacity: 1, duration: 0.2 }, 1.4);
          tl.call(() => { activateWidget(newIdx); }, [], 1.9);

          return;
        }

        if (isFunnelToRadar) {
          // Reverse: simple crossfade back (3D funnel in reverse would be disorienting)
          tl.to(textLayers[prevIdx], { autoAlpha: 0, y: -20, duration: 0.3, ease: "power2.in" }, 0);
          if (dots[prevIdx]) tl.to(dots[prevIdx], { scale: 1, opacity: 0.3, duration: 0.2 }, 0);
          widgetContents[prevIdx]?.classList.remove("animate-active");
          tl.to(widgetContents[prevIdx], { autoAlpha: 0, duration: 0.35, ease: "power2.in" }, 0);
          tl.to(widgetContents[newIdx], { autoAlpha: 1, duration: 0.4, ease: "power2.out" }, 0.3);
          tl.to(textLayers[newIdx], { autoAlpha: 1, y: 0, duration: 0.4, ease: "power2.out" }, 0.25);
          if (dots[newIdx]) tl.to(dots[newIdx], { scale: 1.5, opacity: 1, duration: 0.2 }, 0.25);
          tl.call(() => { activateWidget(newIdx); }, [], 0.35);
          return;
        }

        // --- SPECIAL: Funnel → Orbit (checks merge to center, spawn orbit icons) ---
        const isFunnelToOrbit = prevIdx === 3 && newIdx === 4;
        const isOrbitToFunnel = prevIdx === 4 && newIdx === 3;

        if (isFunnelToOrbit) {
          // Text transitions
          tl.to(textLayers[prevIdx], {
            autoAlpha: 0, y: -20, duration: 0.3, ease: "power2.in",
          }, 0);
          if (dots[prevIdx]) tl.to(dots[prevIdx], { scale: 1, opacity: 0.3, duration: 0.2 }, 0);
          widgetContents[prevIdx]?.classList.remove("animate-active");

          const funnelContent = widgetContents[3];
          const orbitContent = widgetContents[4];
          const funnelSvg = funnelContent?.querySelector("svg");

          // Clone the funnel messy icons as ghosts
          const funnelMessyEls = funnelContent ? Array.from(funnelContent.querySelectorAll<SVGGElement>(".ef-messy")) : [];
          const ghosts: HTMLDivElement[] = [];
          funnelMessyEls.forEach((messyEl, i) => {
            if (i >= 5) return;
            const rect = messyEl.getBoundingClientRect();
            if (rect.width === 0) return;
            const ghost = document.createElement("div");
            ghost.style.cssText = `position:fixed;z-index:9999;pointer-events:none;left:${rect.left}px;top:${rect.top}px;width:${Math.max(rect.width, 28)}px;height:${Math.max(rect.height, 28)}px;`;
            const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            svg.setAttribute("viewBox", "-18 -18 36 36");
            svg.setAttribute("width", String(Math.max(rect.width, 28)));
            svg.setAttribute("height", String(Math.max(rect.height, 28)));
            svg.style.overflow = "visible";
            const cloned = messyEl.cloneNode(true) as SVGGElement;
            cloned.removeAttribute("transform");
            cloned.style.opacity = "1";
            cloned.setAttribute("transform", "translate(0,0)");
            svg.appendChild(cloned);
            ghost.appendChild(svg);
            document.body.appendChild(ghost);
            ghosts.push(ghost);
          });

          // 1. Fade out funnel internals (checks, caption, exit arrow, label, messy icons)
          const funnelExtras = funnelContent ? Array.from(funnelContent.querySelectorAll<SVGElement>(
            ".ef-check, .ef-caption, .ef-exit, .ef-funnel-label, .ef-neck-glow, .ef-messy"
          )) : [];
          tl.to(funnelExtras, { autoAlpha: 0, duration: 0.25 }, 0.05);

          // 2. Funnel walls collapse inward — converge to a circle shape
          //    Animate the funnel SVG with CSS scale to shrink toward center
          if (funnelSvg) {
            tl.to(funnelSvg, {
              scale: 0.4,
              transformOrigin: `${EF_FCX / EF_VW * 100}% ${((EF_FTY + EF_FNY) / 2) / EF_VH * 100}%`,
              duration: 0.6,
              ease: "power2.in",
            }, 0.2);
          }

          // 3. Fade out funnel, fade in orbit
          tl.to(funnelContent, { autoAlpha: 0, duration: 0.2 }, 0.6);
          tl.call(() => {
            // Reset funnel scale
            if (funnelSvg) gsap.set(funnelSvg, { scale: 1, transformOrigin: "center center" });
          }, [], 0.85);

          tl.to(orbitContent, { autoAlpha: 1, duration: 0.25 }, 0.55);
          if (orbitContent) (orbitContent as any).__fromTicks = true;

          // 4. Fly ghost icons from funnel to orbit positions
          tl.call(() => {
            const orbitIconEls = orbitContent ? Array.from(orbitContent.querySelectorAll<SVGGElement>(".ob-orbit")) : [];
            const orbitSvg = orbitContent?.querySelector("svg");

            if (orbitSvg && orbitIconEls.length > 0) {
              const svgRect = orbitSvg.getBoundingClientRect();
              const scaleX = svgRect.width / 280;
              const scaleY = svgRect.height / 240;

              ghosts.forEach((ghost, i) => {
                const iconData = OB_ICONS[i % OB_ICONS.length];
                const targetLeft = svgRect.left + iconData.ix * scaleX - 14;
                const targetTop = svgRect.top + iconData.iy * scaleY - 14;

                gsap.to(ghost, {
                  left: targetLeft, top: targetTop,
                  duration: 0.5, ease: "power2.inOut",
                  delay: i * 0.06,
                });
                gsap.to(ghost, {
                  opacity: 0, duration: 0.2,
                  delay: 0.55 + i * 0.06,
                  onComplete: () => ghost.remove(),
                });
              });

              orbitIconEls.forEach((g, i) => {
                gsap.set(g, { x: OB_ICONS[i].ix, y: OB_ICONS[i].iy, autoAlpha: 0, scale: 0.5 });
                gsap.to(g, {
                  autoAlpha: 1, scale: 1,
                  duration: 0.3, ease: "back.out(2)",
                  delay: 0.5 + i * 0.06,
                });
              });
            }
          }, [], 0.5);

          // Text + dot for new feature
          tl.to(textLayers[newIdx], { autoAlpha: 1, y: 0, duration: 0.4, ease: "power2.out" }, 0.6);
          if (dots[newIdx]) tl.to(dots[newIdx], { scale: 1.5, opacity: 1, duration: 0.2 }, 0.6);
          tl.call(() => { activateWidget(newIdx); }, [], 0.7);

          return;
        }

        if (isOrbitToFunnel) {
          // Simple crossfade for going back
          tl.to(textLayers[prevIdx], { autoAlpha: 0, y: -20, duration: 0.3, ease: "power2.in" }, 0);
          if (dots[prevIdx]) tl.to(dots[prevIdx], { scale: 1, opacity: 0.3, duration: 0.2 }, 0);
          widgetContents[prevIdx]?.classList.remove("animate-active");
          tl.to(widgetContents[prevIdx], { autoAlpha: 0, duration: 0.35, ease: "power2.in" }, 0);
          tl.to(widgetContents[newIdx], { autoAlpha: 1, duration: 0.4, ease: "power2.out" }, 0.3);
          tl.to(textLayers[newIdx], { autoAlpha: 1, y: 0, duration: 0.4, ease: "power2.out" }, 0.25);
          if (dots[newIdx]) tl.to(dots[newIdx], { scale: 1.5, opacity: 1, duration: 0.2 }, 0.25);
          tl.call(() => { activateWidget(newIdx); }, [], 0.35);
          return;
        }

        // --- SPECIAL: Silo → Chart (left ray becomes bridge line) ---
        const isSiloToChart = prevIdx === 0 && newIdx === 1;
        if (isSiloToChart) {
          tl.to(textLayers[prevIdx], { autoAlpha: 0, y: -20, duration: 0.3, ease: "power2.in" }, 0);
          if (dots[prevIdx]) tl.to(dots[prevIdx], { scale: 1, opacity: 0.3, duration: 0.2 }, 0);

          const siloContent = widgetContents[0];
          const chartContent = widgetContents[1];
          const siloSvg = siloContent?.querySelector("svg");
          const chartSvg = chartContent?.querySelector("svg");

          // 1. Grab the left ray's screen position BEFORE deactivating the widget
          const leftRay = siloContent?.querySelector<SVGLineElement>(`.ss-ray:nth-child(${10 + 5 + 1})`);
          // More reliable: query all rays and pick index 5
          const allRays = siloContent ? Array.from(siloContent.querySelectorAll<SVGLineElement>(".ss-ray")) : [];
          const targetRay = allRays[5] || leftRay;

          let ghost: HTMLDivElement | null = null;
          if (targetRay && siloSvg) {
            const svgRect = siloSvg.getBoundingClientRect();
            const scaleX = svgRect.width / SS_VW;
            const scaleY = svgRect.height / SS_VH;

            // Left ray goes from (102,128) to (20,128) in SVG coords
            const rayData = ssRayData[5];
            const screenX1 = svgRect.left + Math.min(rayData.x1, rayData.x2) * scaleX;
            const screenY = svgRect.top + rayData.y1 * scaleY;
            const screenWidth = Math.abs(rayData.x2 - rayData.x1) * scaleX;

            ghost = document.createElement("div");
            ghost.style.cssText = `
              position:fixed; z-index:9999; pointer-events:none;
              left:${screenX1}px; top:${screenY - 2}px;
              width:${screenWidth}px; height:4px;
              background:#F88C00; border-radius:2px;
              box-shadow:0 0 8px rgba(248,140,0,0.6);
            `;
            document.body.appendChild(ghost);
          }

          // 2. Fade out silo content (everything including Q logo)
          //    DON'T remove animate-active yet — do it after fade completes to avoid flash
          tl.to(siloContent, { autoAlpha: 0, duration: 0.3 }, 0);
          tl.call(() => {
            siloContent?.classList.remove("animate-active");
          }, [], 0.35);

          // 3. Show chart content
          tl.to(chartContent, { autoAlpha: 1, duration: 0.3 }, 0.5);

          // 4. Animate ghost line from silo ray position to chart bridge line position
          if (ghost && chartSvg) {
            tl.call(() => {
              // Get the chart SVG screen position to calculate bridge line target
              const cSvgRect = chartSvg!.getBoundingClientRect();
              // The chart SVG is inside a container with padding, find the actual chart area
              const chartContainer = chartSvg!.closest(".rounded-lg");
              const chartRect = chartContainer ? chartContainer.getBoundingClientRect() : cSvgRect;

              const cScaleX = cSvgRect.width / LP_W;
              const cScaleY = cSvgRect.height / LP_H;

              // Bridge line target: vertical bar at x=0, full height of chart
              const targetLeft = cSvgRect.left;
              const targetTop = cSvgRect.top;
              const targetHeight = cSvgRect.height;

              // First morph: horizontal ray → rotate to vertical at chart left edge
              gsap.to(ghost!, {
                left: targetLeft - 1,
                top: targetTop,
                width: 3,
                height: targetHeight,
                duration: 0.6,
                ease: "power2.inOut",
              });

              // After arriving, fade out ghost as chart's real bar takes over
              gsap.to(ghost!, {
                opacity: 0,
                duration: 0.15,
                delay: 0.65,
                onComplete: () => ghost?.remove(),
              });
            }, [], 0.15);
          }

          // 5. Activate chart widget — set flag to skip bridge intro (ghost IS the bridge)
          if (chartContent) (chartContent as any).__skipBridge = true;
          tl.call(() => { activateWidget(newIdx); }, [], 0.55);

          // Text + dot
          tl.to(textLayers[newIdx], { autoAlpha: 1, y: 0, duration: 0.4, ease: "power2.out" }, 0.45);
          if (dots[newIdx]) tl.to(dots[newIdx], { scale: 1.5, opacity: 1, duration: 0.2 }, 0.45);

          return;
        }

        // --- SPECIAL: Chart → Radar (bar becomes radar bridge/sweep arm) ---
        const isChartToRadar = prevIdx === 1 && newIdx === 2;
        if (isChartToRadar) {
          tl.to(textLayers[prevIdx], { autoAlpha: 0, y: -20, duration: 0.3, ease: "power2.in" }, 0);
          if (dots[prevIdx]) tl.to(dots[prevIdx], { scale: 1, opacity: 0.3, duration: 0.2 }, 0);

          const chartContent = widgetContents[1];
          const radarContent = widgetContents[2];
          const chartSvg = chartContent?.querySelector("svg");
          const radarSvg = radarContent?.querySelector("svg");

          // 1. Clone the bar at right edge as a ghost
          const lpBar = chartContent?.querySelector<SVGRectElement>(".lp-bar");
          let ghost: HTMLDivElement | null = null;

          if (lpBar && chartSvg) {
            const svgRect = chartSvg.getBoundingClientRect();
            const scaleX = svgRect.width / LP_W;
            const scaleY = svgRect.height / LP_H;
            const barX = parseFloat(lpBar.getAttribute("x") || String(LP_W - 2));
            const screenLeft = svgRect.left + barX * scaleX;
            const screenTop = svgRect.top;
            const screenHeight = svgRect.height;

            ghost = document.createElement("div");
            ghost.style.cssText = `
              position:fixed; z-index:9999; pointer-events:none;
              left:${screenLeft}px; top:${screenTop}px;
              width:3px; height:${screenHeight}px;
              background:#F88C00; border-radius:2px;
              box-shadow:0 0 8px rgba(248,140,0,0.6);
            `;
            document.body.appendChild(ghost);
          }

          // 2. Fade out chart (delay removal of animate-active to prevent flash)
          tl.to(chartContent, { autoAlpha: 0, duration: 0.3 }, 0);
          tl.call(() => {
            chartContent?.classList.remove("animate-active");
          }, [], 0.35);

          // 3. Show radar content BUT hide the sweep arm/bridge — ghost handles the line
          const radarSweep = radarContent?.querySelector<SVGGElement>(".or-sweep");
          const radarPivot = radarContent?.querySelector<SVGCircleElement>(".or-pivot");
          const radarBridge = radarContent?.querySelector<SVGLineElement>(".or-bridge");
          if (radarSweep) gsap.set(radarSweep, { autoAlpha: 0 });
          if (radarPivot) gsap.set(radarPivot, { autoAlpha: 0 });
          if (radarBridge) gsap.set(radarBridge, { autoAlpha: 0 });
          tl.to(radarContent, { autoAlpha: 1, duration: 0.3 }, 0.4);

          // 4. Animate ghost from chart bar position to radar right edge (vertical line)
          if (ghost && radarSvg) {
            tl.call(() => {
              const rSvgRect = radarSvg!.getBoundingClientRect();
              const rScaleX = rSvgRect.width / 280;
              const rScaleY = rSvgRect.height / 280;

              // Target: vertical line on right side of radar circle
              const targetLeft = rSvgRect.left + (OR_CX + OR_R) * rScaleX;
              const targetTop = rSvgRect.top + (OR_CY - OR_R) * rScaleY;
              const targetHeight = OR_R * 2 * rScaleY;

              gsap.to(ghost!, {
                left: targetLeft,
                top: targetTop,
                height: targetHeight,
                duration: 0.5,
                ease: "power2.inOut",
              });

              // Then morph from vertical to horizontal (sweep arm direction)
              gsap.to(ghost!, {
                left: rSvgRect.left + OR_CX * rScaleX,
                top: rSvgRect.top + OR_CY * rScaleY - 1,
                width: OR_R * rScaleX,
                height: 2,
                duration: 0.5,
                delay: 0.5,
                ease: "power2.inOut",
              });

              // Fade out ghost — activate radar exactly when ghost disappears
              gsap.to(ghost!, {
                opacity: 0,
                duration: 0.15,
                delay: 1.0,
                onComplete: () => {
                  ghost?.remove();
                  // Activate radar now — sweep arm takes over at the same position
                  activateWidget(newIdx);
                },
              });
            }, [], 0.1);
          } else {
            // No ghost — just activate directly
            tl.call(() => { activateWidget(newIdx); }, [], 1.2);
          }

          // Set skip flag (must be before activateWidget runs)
          if (radarContent) (radarContent as any).__skipBridge = true;

          // Text + dot
          tl.to(textLayers[newIdx], { autoAlpha: 1, y: 0, duration: 0.4, ease: "power2.out" }, 0.5);
          if (dots[newIdx]) tl.to(dots[newIdx], { scale: 1.5, opacity: 1, duration: 0.2 }, 0.5);

          return;
        }

        // --- Feature OUT (previous) ---
        if (prevIdx >= 0 && prevIdx < count) {
          tl.to(textLayers[prevIdx], {
            autoAlpha: 0, y: -20, duration: 0.3, ease: "power2.in",
          }, 0);

          if (dots[prevIdx]) {
            tl.to(dots[prevIdx], { scale: 1, opacity: 0.3, duration: 0.2 }, 0);
          }

          widgetContents[prevIdx]?.classList.remove("animate-active");

          tl.to(widgetContents[prevIdx], {
            autoAlpha: 0, duration: 0.35, ease: "power2.in",
          }, 0);
        }

        // --- Feature IN (new) ---
        if (newIdx < count) {
          // If coming back from expansion, reverse the widget transform first
          if (prevIdx >= count) {
            const cardInner = cardInnerRef.current;

            // Hide expansion content immediately
            if (resultsHeadingRef.current) {
              gsap.set(resultsHeadingRef.current, { autoAlpha: 0, y: 30 });
            }
            if (dataContentRef.current) {
              gsap.set(dataContentRef.current, { y: "100vh" });
            }
            if (diamondRef.current) {
              gsap.set(diamondRef.current, { autoAlpha: 0, scale: 0 });
            }

            // Reset widget to normal position — clear all expansion transforms
            gsap.set(widget, {
              left: 0, xPercent: 0, top: 0, yPercent: 0,
              x: 0, y: 0, rotation: 0, rotateX: 0, rotateY: 0,
              scale: 1, autoAlpha: 1,
            });

            if (cardInner) {
              gsap.set(cardInner, { borderRadius: 16, borderWidth: 0 });
            }

            // Show dots again
            dots.forEach((dot) => gsap.set(dot, { autoAlpha: 1, opacity: 0.3, scale: 1 }));

            // Re-enable pinned state
            isPinned = true;
          }

          const enterDelay = prevIdx >= count ? 0.4 : 0.25;

          tl.to(textLayers[newIdx], {
            autoAlpha: 1, y: 0, duration: 0.4, ease: "power2.out",
          }, enterDelay);

          if (dots[newIdx]) {
            tl.to(dots[newIdx], { scale: 1.5, opacity: 1, duration: 0.2 }, enterDelay);
          }

          if (prevIdx < 0) {
            tl.to(widget, {
              autoAlpha: 1, scale: 1, duration: 0.4, ease: "power3.out",
            }, 0);
          }

          tl.to(widgetContents[newIdx], {
            autoAlpha: 1, duration: 0.4, ease: "power2.out",
          }, enterDelay + 0.05);

          tl.call(() => { activateWidget(newIdx); }, [], enterDelay + 0.1);
        }

        // --- EXPANSION: Blue diamond spawns from client icon and fills screen ---
        if (newIdx >= count) {
          const lastText = textLayers[count - 1];
          const lastContent = widgetContents[count - 1];
          const diamond = diamondRef.current;

          // Fade out last feature content
          tl.to(lastText, { autoAlpha: 0, y: -20, duration: 0.25, ease: "power2.in" }, 0);
          dots.forEach((dot) => tl.to(dot, { autoAlpha: 0, duration: 0.15 }, 0));
          tl.to(lastContent, { autoAlpha: 0, duration: 0.2, ease: "power2.in" }, 0.1);
          tl.to(widget, { autoAlpha: 0, duration: 0.2 }, 0.1);

          // Diamond appears small at center (where client icon was), rotated 45°
          if (diamond) {
            tl.to(diamond, {
              autoAlpha: 1, scale: 0.15, duration: 0.01,
            }, 0.25);

            // Scale up as a diamond shape
            tl.to(diamond, {
              scale: 1.5, duration: 0.35, ease: "power2.out",
            }, 0.26);

            // Continue scaling to fill viewport
            tl.to(diamond, {
              scale: 8, duration: 0.45, ease: "power2.in",
            }, 0.55);
          }

          // "Real Results" heading appears
          if (resultsHeadingRef.current) {
            tl.to(resultsHeadingRef.current, {
              autoAlpha: 1, y: 0, duration: 0.3, ease: "power2.out",
            }, 0.6);
          }

          // Data content rises up
          if (dataContentRef.current) {
            tl.to(dataContentRef.current, { y: 0, duration: 0.6, ease: "power2.out" }, 0.9);
          }

          // Stay pinned on the Numbers Speak screen — next scroll will unpin
          tl.call(() => {
            // Mark that we're on the results screen, awaiting one more scroll to release
            isPinned = true;
          }, [], 1.5);

          // Gate scroll-off until the chart animation reaches its "after Qall"
          // growth phase (post-flash orange bars).
          chartReadyAt = Date.now() + CHART_HOLD_MS;
        } else {
          // Any other transition clears the gate so returning to Numbers Speak
          // starts a fresh hold.
          chartReadyAt = 0;
        }
      };

      // Pin the section. Wheel handler drives transitions, but preventDefault
      // can leak small scroll deltas on some trackpads, so we keep a generous
      // pin distance to absorb drift across all 6 steps (5 features + Numbers).
      // The wheel handler jumps scrollY past pinTrigger.end when the user
      // leaves the results screen, so this length never creates dead scroll.
      pinTrigger = ScrollTrigger.create({
        trigger: el,
        start: "top top",
        end: `+=${(totalSteps + 2) * 100}%`,
        pin: true,
        anticipatePin: 1,
        onEnter() {
          isPinned = true;
          if (currentFeature < 0) {
            transitionTo(0);
          }
        },
        onLeaveBack() {
          isPinned = false;
          // Reset to pre-entry state
          currentFeature = -1;
          isAnimating = false;
          chartReadyAt = 0;
          widgetContents.forEach((wc) => wc.classList.remove("animate-active"));
          textLayers.forEach((layer) => gsap.set(layer, { autoAlpha: 0, y: 30 }));
          widgetContents.forEach((wc) => gsap.set(wc, { autoAlpha: 0 }));
          gsap.set(widget, { autoAlpha: 0, scale: 0.9, left: 0, xPercent: 0, top: 0, yPercent: 0, rotation: 0, rotateX: 0 });
          dots.forEach((d) => gsap.set(d, { opacity: 0.3, scale: 1, autoAlpha: 1 }));
          if (bgRef.current) gsap.set(bgRef.current, { backgroundColor: "#0d2240" });
        },
        onEnterBack() {
          isPinned = true;
          // Coming back from below — restore the Numbers Speak screen
          // so the user sees it before scrolling up to the last feature
          currentFeature = count;
          isAnimating = false;
          // Chart has already played — allow immediate scroll-off
          chartReadyAt = 0;
          // Snap to the Numbers Speak final state (no animation)
          textLayers.forEach((layer) => gsap.set(layer, { autoAlpha: 0 }));
          widgetContents.forEach((wc) => {
            gsap.set(wc, { autoAlpha: 0 });
            wc.classList.remove("animate-active");
          });
          gsap.set(widget, { autoAlpha: 0 });
          dots.forEach((d) => gsap.set(d, { autoAlpha: 0 }));
          if (diamondRef.current) gsap.set(diamondRef.current, { autoAlpha: 1, scale: 8, rotation: 45 });
          if (resultsHeadingRef.current) gsap.set(resultsHeadingRef.current, { autoAlpha: 1, y: 0 });
          if (dataContentRef.current) gsap.set(dataContentRef.current, { y: 0 });
        },
      });

    }, el);

    // Wheel listener — one step per scroll gesture (outside gsap.context so cleanup works)
    let wheelCooldown = false;

    const onWheel = (e: WheelEvent) => {
      // Prevent native scroll for ANY wheel event while pinned — small deltas
      // slipping through is what lets ScrollTrigger advance past the pin end
      // before the user has seen all features.
      if (isPinned) e.preventDefault();

      if (Math.abs(e.deltaY) < 10) return;

      const direction = e.deltaY > 0 ? 1 : -1;
      const next = currentFeature + direction;

      // On results screen, scrolling down: hold until the chart has played
      // through the "after Qall" growth phase, then jump past the pin so
      // testimonials appear on the next scroll instead of the user having
      // to chew through the remaining pin distance.
      if (currentFeature >= count && direction > 0) {
        if (Date.now() < chartReadyAt) return;
        isPinned = false;
        if (pinTrigger) {
          window.scrollTo({ top: pinTrigger.end + 1 });
        }
        return;
      }

      if (isAnimating || wheelCooldown) return;

      if (next > count) return;
      if (next < 0) return;

      if (!isPinned && currentFeature < count) return;

      if (currentFeature >= count && direction < 0) {
        isPinned = true;
      }

      wheelCooldown = true;
      setTimeout(() => { wheelCooldown = false; }, 400);

      transitionTo(next);
    };

    let touchStartY = 0;
    const onTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };
    const onTouchEnd = (e: TouchEvent) => {
      if (!isPinned || isAnimating) return;
      const deltaY = touchStartY - e.changedTouches[0].clientY;
      if (Math.abs(deltaY) < 30) return;

      const direction = deltaY > 0 ? 1 : -1;

      // On results screen, scrolling down — hold until the chart is ready,
      // then jump past the pin so the user isn't left scrolling through
      // dead pinned space.
      if (currentFeature >= count && direction > 0) {
        if (Date.now() < chartReadyAt) return;
        isPinned = false;
        if (pinTrigger) {
          window.scrollTo({ top: pinTrigger.end + 1 });
        }
        return;
      }

      const next = currentFeature + direction;
      if (next >= 0 && next <= count) {
        transitionTo(next);
      }
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchend", onTouchEnd, { passive: true });

    return () => {
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchend", onTouchEnd);
      ctx.revert();
    };
  }, [count]);

  return (
    <section className="relative" style={{ backgroundColor: "#0d2240" }}>
      {/* Extra wrapper prevents React 19 removeChild error when ScrollTrigger pins */}
      <div>
      <div ref={pinRef} data-feature-showcase className="relative h-screen hidden md:flex items-center overflow-hidden">
        <div ref={bgRef} className="absolute inset-0" style={{ backgroundColor: "#0d2240" }} />
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-[120px] opacity-[0.08] pointer-events-none bg-white" />


        {/* Blue diamond overlay — spawns from client icon, fills screen */}
        <div
          ref={diamondRef}
          className="absolute z-20 pointer-events-none"
          style={{
            left: "50%",
            top: "50%",
            width: "150vw",
            height: "150vh",
            marginLeft: "-75vw",
            marginTop: "-75vh",
            background: "linear-gradient(135deg, #042D70 0%, #091c32 50%, #021A42 100%)",
            transform: "rotate(45deg) scale(0)",
            transformOrigin: "center center",
          }}
        />

        {/* "Real Results" heading — appears during diamond transition */}
        <div
          ref={resultsHeadingRef}
          className="absolute inset-x-0 top-[15%] z-30 flex flex-col items-center pointer-events-none"
        >
          <span className="inline-block px-3 py-1 text-xs font-medium tracking-wider uppercase text-orange-500 bg-orange-500/10 rounded-full mb-3">
            Real Results
          </span>
          <h2 className="font-heading font-bold text-2xl md:text-3xl lg:text-5xl text-orange-500">
            The Numbers Speak
          </h2>
          <p className="mt-2 text-base text-white">
            Real results from a live brokerage on Qall.
          </p>
        </div>

        {/* Data content — rises up after card fills viewport */}
        <div
          ref={dataContentRef}
          className="absolute inset-x-0 top-[34%] bottom-0 z-30 pointer-events-none"
        >
          <div className="mx-auto max-w-5xl px-6 w-full pointer-events-auto">
            <GrowthChart />
          </div>
        </div>

        <div className="relative z-10 mx-auto w-full max-w-7xl px-6">
          {/* Full-width content area — text & widget positioned absolutely */}
          <div className="relative w-full" style={{ minHeight: "560px" }}>

            {/* Text layers — always on the right */}
            {FEATURES_V2.map((feature, i) => (
              <div
                key={feature.id}
                ref={(el) => { textLayersRef.current[i] = el; }}
                className="absolute top-0 bottom-0 w-[46%] right-0 flex flex-col justify-center"
                style={{ opacity: 0, visibility: "hidden" }}
              >
                <h3 className="font-heading font-bold text-2xl md:text-3xl lg:text-4xl xl:text-5xl text-orange-500 mb-3 leading-tight">
                  {feature.title}
                </h3>
                <p className="text-base md:text-lg lg:text-xl font-semibold text-white mb-4">
                  {feature.subtitle}
                </p>
                <p className="text-white leading-relaxed text-sm lg:text-base max-w-lg">
                  {feature.description}
                </p>
              </div>
            ))}

            {/* Widget — always on the left side, vertically centered like text */}
            <div
              ref={widgetRef}
              className="absolute top-0 bottom-0 left-0 w-[44%] lg:w-[48%] max-w-[480px] flex items-center will-change-transform"
              style={{ perspective: "1200px", transformStyle: "preserve-3d", opacity: 0, visibility: "hidden" }}
            >
                <div
                  ref={cardInnerRef}
                  className="w-full relative"
                >
                {/* First child is relative (gives height), rest are absolute */}
                {FEATURES_V2.map((feature, i) => (
                  <div
                    key={feature.id}
                    ref={(el) => { widgetContentRefs.current[i] = el; }}
                    className={i === 0 ? "" : "absolute inset-0"}
                    style={{ opacity: 0, visibility: "hidden" }}
                  >
                    <FeatureCRMWidget id={feature.id} />
                  </div>
                ))}
                </div>
              </div>
          </div>

          {/* Progress dots */}
          <div className="flex justify-center gap-3 mt-10">
            {FEATURES_V2.map((_, i) => (
              <div
                key={i}
                ref={(el) => { progressDotsRef.current[i] = el; }}
                className="w-2 h-2 rounded-full bg-white transition-all"
                style={{ opacity: i === 0 ? 1 : 0.3 }}
              />
            ))}
          </div>
        </div>
      </div>
      </div>

      {/* Mobile — pinned scroll, animation above text */}
      <MobileFeatureShowcase />
    </section>
  );
}
