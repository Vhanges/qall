"use client";

import { useRef, useEffect } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap-config";
import { LazyVideo } from "@/components/ui/LazyVideo";
import { DATA_RESULTS_V2 } from "@/lib/constants-home-v2";

/* ─── Chart constants ─── */
const CG_BEFORE  = [44, 42, 46, 41, 43, 45];          // £k/mo — before Qall (flat/low)
const CG_AFTER   = [52, 58, 64, 66, 71, 76.4];        // £k/mo — after Qall (always higher, avg ~32% uplift)
const CG_LABELS  = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
const CG_MAX     = 84;   // chart ceiling
const CG_MIN     = 40;   // chart floor (exaggerates visual difference)
const CG_B       = 148;  // bottom y of chart area
const CG_T       = 18;   // top y of chart area
const CG_L       = 44;   // left x margin
const CG_BAR_W   = 60;
const CG_STRIDE  = 96;   // x stride per bar
const CG_VW      = 604;  // SVG viewBox width
const CG_VH      = 174;  // SVG viewBox height

const cgBarX = (i: number) => CG_L + i * CG_STRIDE;
// Use min-max range so small differences look visually dramatic
const cgBarH = (v: number) => ((v - CG_MIN) / (CG_MAX - CG_MIN)) * (CG_B - CG_T);
const cgBarY = (v: number) => CG_B - cgBarH(v);

/* ─── Stat counter "before Qall" baseline values ─── */
// [Revenue Uplift %, Monthly Commission £k, Compliance %, Speed to Lead %]
const STAT_BEFORE = [-8, 57.9, 78, -24];

/* Format a stat value with sign, prefix, suffix */
function fmtStat(v: number, prefix: string, suffix: string, decimals: number): string {
  const abs = decimals ? Math.abs(v).toFixed(decimals) : String(Math.abs(Math.round(v)));
  if (v < 0) return `-${abs}${suffix}`;
  return `${prefix}${abs}${suffix}`;
}

/* ─── Before / After Comparison Chart ─── */
let gcInstanceCounter = 0;

export function GrowthChart() {
  const containerRef  = useRef<HTMLDivElement>(null);
  const tlRef         = useRef<gsap.core.Timeline | null>(null);
  const isActiveRef   = useRef(false);
  const gcId          = useRef(`cg-${++gcInstanceCounter}`);
  // Direct refs to stat counter spans — set via callback refs in JSX below
  const statSpanRefs  = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const beforeBars  = Array.from(el.querySelectorAll<SVGRectElement>(".cgb-bar"));
    const afterBars   = Array.from(el.querySelectorAll<SVGRectElement>(".cga-bar"));
    const beforeVals  = Array.from(el.querySelectorAll<SVGTextElement>(".cgb-val"));
    const afterVals   = Array.from(el.querySelectorAll<SVGTextElement>(".cga-val"));
    const arrows      = Array.from(el.querySelectorAll<SVGGElement>(".cga-arrow"));
    const flash        = el.querySelector<SVGRectElement>(".cg-flash");
    const beforeBadge  = el.querySelector<SVGGElement>(".cg-before-badge");
    const activated    = el.querySelector<SVGGElement>(".cg-activated");
    const upliftBadge  = el.querySelector<HTMLElement>(".cg-uplift");
    const beforeStat   = el.querySelector<HTMLElement>(".cg-before-stat");
    const afterStat    = el.querySelector<HTMLElement>(".cg-after-stat");

    // Stat spans are rendered inside this same component — refs are guaranteed populated
    const statSpans = statSpanRefs.current.filter((s): s is HTMLSpanElement => s !== null);

    const resetVisuals = () => {
      // Before bars: invisible, at their full heights (will animate up)
      beforeBars.forEach((bar) => {
        bar.setAttribute("y",      String(CG_B));
        bar.setAttribute("height", "0");
        gsap.set(bar, { autoAlpha: 0 });
      });
      // After bars: invisible, start at before heights (will grow to after)
      afterBars.forEach((bar, i) => {
        bar.setAttribute("y",      String(cgBarY(CG_BEFORE[i])));
        bar.setAttribute("height", String(cgBarH(CG_BEFORE[i])));
        gsap.set(bar, { autoAlpha: 0 });
      });
      gsap.set(beforeVals,  { autoAlpha: 0 });
      gsap.set(afterVals,   { autoAlpha: 0 });
      gsap.set(arrows,      { autoAlpha: 0, y: 10 });
      gsap.set(flash,       { autoAlpha: 0 });
      gsap.set(beforeBadge, { autoAlpha: 0, scale: 0.75 });
      gsap.set(activated,   { autoAlpha: 0, scale: 0.75 });
      gsap.set(upliftBadge, { autoAlpha: 0, scale: 0.85 });
      gsap.set(beforeStat,  { autoAlpha: 0 });
      gsap.set(afterStat,   { autoAlpha: 0 });

      // Reset stat counters to 0
      statSpans.forEach((span) => {
        const suffix = span.dataset.suffix ?? "";
        span.textContent = `0${suffix}`;
      });
    };

    let play: () => void;
    play = () => {
      if (tlRef.current) { tlRef.current.kill(); tlRef.current = null; }
      resetVisuals();

      const tl = gsap.timeline();
      tlRef.current = tl;

      /* ── Phase 1: "BEFORE QALL" badge + bars rise up (red-tinted) ── */
      tl.to(beforeStat, { autoAlpha: 1, duration: 0.4 }, 0.2);
      tl.to(beforeBadge, { autoAlpha: 1, scale: 1, duration: 0.3, ease: "back.out(2)" }, 0.3);

      beforeBars.forEach((bar, i) => {
        const h = cgBarH(CG_BEFORE[i]);
        const y = cgBarY(CG_BEFORE[i]);
        tl.to(bar, { autoAlpha: 1, duration: 0.05 }, 0.35 + i * 0.13);
        tl.to(bar, { attr: { y, height: h }, duration: 0.44, ease: "power3.out" }, 0.35 + i * 0.13 + 0.05);
      });
      tl.to(beforeVals, { autoAlpha: 1, duration: 0.2, stagger: 0.13 }, 0.65);

      /* ── Stat counters Phase 1: 0 → before values ── */
      statSpans.forEach((span, i) => {
        const beforeVal = STAT_BEFORE[i] ?? 0;
        const prefix    = span.dataset.prefix ?? "";
        const suffix    = span.dataset.suffix ?? "";
        const decimals  = parseInt(span.dataset.decimals ?? "0");
        const proxy = { v: 0 };
        tl.to(proxy, {
          v: beforeVal,
          duration: 1.2,
          ease: "power2.out",
          onUpdate() {
            span.textContent = fmtStat(proxy.v, prefix, suffix, decimals);
          },
        }, 0.35);
      });

      /* Hold on before state */
      tl.to({}, { duration: 0.7 }, 1.9);

      /* ── Phase 2: "Before Qall" badge fades, Qall Activated flash ── */
      tl.to(beforeBadge, { autoAlpha: 0, duration: 0.2 }, 2.5);
      tl.to(flash, { autoAlpha: 0.4, duration: 0.12 }, 2.6);
      tl.to(flash, { autoAlpha: 0,   duration: 0.3  }, 2.72);
      // Fade before value labels + legend (but keep before bars visible!)
      tl.to(beforeVals, { autoAlpha: 0, duration: 0.2 }, 2.6);
      tl.to(beforeStat, { autoAlpha: 0, duration: 0.2 }, 2.6);
      tl.to(activated, { autoAlpha: 1, scale: 1, duration: 0.28, ease: "back.out(2.2)" }, 2.65);
      tl.to(activated, { autoAlpha: 0, duration: 0.3 }, 3.7);

      /* ── Phase 3: AFTER bars grow ON TOP of before bars (orange over red) ── */
      afterBars.forEach((bar, i) => {
        const afterH = cgBarH(CG_AFTER[i]);
        const afterY = cgBarY(CG_AFTER[i]);
        tl.to(bar, { autoAlpha: 1, duration: 0.05 }, 2.9 + i * 0.12);
        tl.to(bar, {
          attr: { y: afterY, height: afterH },
          duration: 0.52,
          ease: "power3.out",
        }, 2.9 + i * 0.12 + 0.05);
      });
      tl.to(afterVals,  { autoAlpha: 1, duration: 0.22, stagger: 0.12 }, 3.15);
      tl.to(afterStat,  { autoAlpha: 1, duration: 0.4 }, 3.3);

      /* ── Stat counters Phase 3: before values → after values (while orange bars grow) ── */
      statSpans.forEach((span, i) => {
        const beforeVal = STAT_BEFORE[i] ?? 0;
        const afterVal  = parseFloat(span.dataset.after ?? "0");
        const prefix    = span.dataset.prefix ?? "";
        const suffix    = span.dataset.suffix ?? "";
        const decimals  = parseInt(span.dataset.decimals ?? "0");
        const proxy = { v: beforeVal };
        tl.to(proxy, {
          v: afterVal,
          duration: 0.9,
          ease: "power2.out",
          onUpdate() {
            span.textContent = fmtStat(proxy.v, prefix, suffix, decimals);
          },
        }, 2.9);
      });

      /* ── Phase 4: Growth arrows + uplift badge ── */
      tl.to(arrows, { autoAlpha: 1, y: 0, duration: 0.32, stagger: 0.09, ease: "power2.out" }, 3.85);
      tl.to(upliftBadge, { autoAlpha: 1, scale: 1, duration: 0.4, ease: "back.out(2)" }, 4.0);

      /* Hold */
      tl.to({}, { duration: 2.2 });
    };

    /* Play once when first truly visible (not hidden by parent opacity/visibility) */
    const isActuallyVisible = () => {
      let node: HTMLElement | null = el;
      while (node) {
        const style = getComputedStyle(node);
        if (style.visibility === "hidden" || style.opacity === "0") return false;
        node = node.parentElement;
      }
      return true;
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isActiveRef.current && isActuallyVisible()) {
          isActiveRef.current = true;
          play();
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);

    /* Also watch for animate-active class (mobile pinned section) */
    const checkActive = () => {
      if (el.closest(".animate-active") && !isActiveRef.current) {
        isActiveRef.current = true;
        play();
      }
    };
    const mutObservers: MutationObserver[] = [];
    let node: HTMLElement | null = el.parentElement;
    while (node && mutObservers.length < 6) {
      const mo = new MutationObserver(checkActive);
      mo.observe(node, { attributes: true, attributeFilter: ["class"] });
      mutObservers.push(mo);
      node = node.parentElement;
    }

    return () => {
      isActiveRef.current = false;
      tlRef.current?.kill();
      observer.disconnect();
      mutObservers.forEach((mo) => mo.disconnect());
    };
  }, []);

  const midX = CG_VW / 2;
  const midY = CG_T + (CG_B - CG_T) / 2;

  return (
    <div ref={containerRef}>

      {/* Stat counter cards — rendered here so callback refs are set before useEffect runs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-4 md:mb-6">
        {DATA_RESULTS_V2.stats.map((stat, i) => (
          <div key={stat.label} className="glass-light rounded-xl p-3 md:p-4 text-center">
            <div className="font-bold text-lg sm:text-2xl text-orange-500 mb-1">
              <span
                ref={(el) => { statSpanRefs.current[i] = el; }}
                data-before={STAT_BEFORE[i]}
                data-after={stat.value}
                data-prefix={stat.prefix ?? ""}
                data-suffix={stat.suffix ?? ""}
                data-decimals={stat.decimals ?? 0}
              >0{stat.suffix}</span>
            </div>
            <p className="text-[10px] sm:text-xs text-white">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="glass-light rounded-2xl p-3 sm:p-5">

      {/* Header row */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4">
        <div>
          <h3 className="text-[10px] sm:text-xs uppercase tracking-wider text-white">
            Monthly Commission Revenue
          </h3>
          <p className="text-[9px] sm:text-[10px] text-white mt-0.5">
            6-month snapshot — before &amp; after Qall
          </p>
        </div>
        <div className="cg-uplift flex items-center gap-1.5 px-2 sm:px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20"
          style={{ opacity: 0, transform: "scale(0.85)" }}>
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
            <path d="M8 12V4M8 4L4 8M8 4L12 8" stroke="#F88C00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="text-[10px] sm:text-xs font-semibold text-orange-500">
            +{DATA_RESULTS_V2.upliftPercent}% Revenue Uplift
          </span>
        </div>
      </div>

      {/* Before / After legend */}
      <div className="flex items-center gap-5 mb-3">
        <div className="cg-before-stat flex items-center gap-2" style={{ opacity: 0 }}>
          <div className="w-3 h-3 rounded-sm bg-red-500/50 shrink-0" />
          <div>
            <p className="text-[8px] text-white uppercase tracking-wide">Before Qall</p>
            <p className="text-[11px] font-bold text-white">
              £{(DATA_RESULTS_V2.preQall / 1000).toFixed(1)}k/mo avg
            </p>
          </div>
        </div>
        <svg width="24" height="10" viewBox="0 0 24 10" className="text-white">
          <path d="M0 5 L20 5 M16 1 L20 5 L16 9" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
        </svg>
        <div className="cg-after-stat flex items-center gap-2" style={{ opacity: 0 }}>
          <div className="w-3 h-3 rounded-sm bg-orange-500/80 shrink-0" />
          <div>
            <p className="text-[8px] text-white uppercase tracking-wide">After Qall</p>
            <p className="text-[11px] font-bold text-orange-400">
              £{(DATA_RESULTS_V2.postQall / 1000).toFixed(1)}k/mo
            </p>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="rounded-lg bg-white/[0.02] border border-white/[0.04] overflow-hidden">
        <svg viewBox={`0 0 ${CG_VW} ${CG_VH}`} className="w-full">
          <defs>
            <linearGradient id={`${gcId.current}-before-grad`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor="rgba(239,68,68,0.5)" />
              <stop offset="100%" stopColor="rgba(71,85,105,0.3)"   />
            </linearGradient>
            <linearGradient id={`${gcId.current}-after-grad`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor="rgba(251,146,60,0.9)"  />
              <stop offset="100%" stopColor="rgba(234,88,12,0.95)"  />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[25, 50, 75, 100].map((pct) => {
            const y = CG_B - (pct / 100) * (CG_B - CG_T);
            return (
              <line key={pct} x1={CG_L} y1={y} x2={CG_VW - 16} y2={y}
                stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
            );
          })}

          {/* Y-axis value hints */}
          {[45, 55, 65, 75].map((v) => (
            <text key={v} x={CG_L - 4} y={cgBarY(v) + 3}
              textAnchor="end" fill="rgba(255,255,255,0.18)" fontSize="8" fontFamily="monospace">
              £{v}k
            </text>
          ))}

          {/* Flash overlay (Qall activation burst) */}
          <rect className="cg-flash"
            x={CG_L} y={CG_T} width={CG_VW - CG_L - 16} height={CG_B - CG_T}
            fill="rgba(248,140,0,0.55)" rx="3" style={{ opacity: 0 }}
          />

          {/* ── Before bars (gray) ── */}
          {CG_BEFORE.map((_, i) => (
            <rect key={i} className="cgb-bar"
              x={cgBarX(i)} y={CG_B} width={CG_BAR_W} height="0"
              fill={`url(#${gcId.current}-before-grad)`} rx="3"
              style={{ opacity: 0 }}
            />
          ))}

          {/* ── After bars (orange) ── */}
          {CG_AFTER.map((v, i) => (
            <rect key={i} className="cga-bar"
              x={cgBarX(i)} y={cgBarY(CG_BEFORE[i])} width={CG_BAR_W}
              height={cgBarH(CG_BEFORE[i])}
              fill={`url(#${gcId.current}-after-grad)`} rx="3"
              style={{ opacity: 0 }}
            />
          ))}

          {/* Before value labels */}
          {CG_BEFORE.map((v, i) => (
            <text key={i} className="cgb-val"
              x={cgBarX(i) + CG_BAR_W / 2} y={cgBarY(v) - 5}
              textAnchor="middle" fill="rgba(148,163,184,0.7)" fontSize="8.5" fontFamily="monospace"
              style={{ opacity: 0 }}
            >£{v}k</text>
          ))}

          {/* After value labels */}
          {CG_AFTER.map((v, i) => (
            <text key={i} className="cga-val"
              x={cgBarX(i) + CG_BAR_W / 2} y={cgBarY(v) - 5}
              textAnchor="middle" fill="rgba(251,146,60,0.95)" fontSize="8.5" fontFamily="monospace"
              style={{ opacity: 0 }}
            >£{v.toFixed(1)}k</text>
          ))}

          {/* Growth delta arrows above after bars */}
          {CG_AFTER.map((v, i) => {
            const delta = v - CG_BEFORE[i];
            if (delta <= 0) return null;
            const ax = cgBarX(i) + CG_BAR_W / 2;
            const ay = cgBarY(v) - 20;
            return (
              <g key={i} className="cga-arrow" style={{ opacity: 0 }}>
                <polygon points={`${ax},${ay} ${ax - 4},${ay + 8} ${ax + 4},${ay + 8}`}
                  fill="rgba(34,197,94,0.85)" />
                <text x={ax} y={ay + 20}
                  textAnchor="middle" fill="rgba(34,197,94,0.8)"
                  fontSize="7" fontFamily="monospace">
                  +{Math.round(delta)}k
                </text>
              </g>
            );
          })}

          {/* "BEFORE QALL" badge (appears with before bars) */}
          <g className="cg-before-badge" style={{ opacity: 0 }}>
            <rect x={midX - 68} y={midY - 14} width="136" height="28"
              rx="6" fill="rgba(239,68,68,0.85)"
              style={{ filter: "drop-shadow(0 0 10px rgba(239,68,68,0.5))" }}
            />
            <text x={midX} y={midY + 5}
              textAnchor="middle" fill="white"
              fontSize="11" fontFamily="monospace" fontWeight="bold"
            >BEFORE QALL</text>
          </g>

          {/* "QALL ACTIVATED" badge (appears during flash) */}
          <g className="cg-activated" style={{ opacity: 0 }}>
            <rect x={midX - 76} y={midY - 14} width="152" height="28"
              rx="6" fill="rgba(248,140,0,0.95)"
              style={{ filter: "drop-shadow(0 0 12px rgba(248,140,0,0.6))" }}
            />
            <text x={midX} y={midY + 5}
              textAnchor="middle" fill="white"
              fontSize="11" fontFamily="monospace" fontWeight="bold"
            >▶ QALL ACTIVATED</text>
          </g>

          {/* X axis */}
          <line x1={CG_L} y1={CG_B} x2={CG_VW - 16} y2={CG_B}
            stroke="rgba(255,255,255,0.1)" strokeWidth="1" />

          {/* X labels */}
          {CG_LABELS.map((label, i) => (
            <text key={i}
              x={cgBarX(i) + CG_BAR_W / 2} y={CG_B + 14}
              textAnchor="middle" fill="rgba(255,255,255,0.22)"
              fontSize="9" fontFamily="monospace"
            >{label}</text>
          ))}
        </svg>
      </div>
      </div>{/* end glass-light chart card */}
    </div>
  );
}

/* ─── Main DataResultsV2 Section ─── */
export function DataResultsV2() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    const content = contentRef.current;
    if (!el || !content) return;

    // Fade in immediately when section enters view — no scrub
    gsap.set(content, { opacity: 0, y: 24 });
    const ctx = gsap.context(() => {
      gsap.to(content, {
        opacity: 1, y: 0, duration: 0.6, ease: "power2.out",
        scrollTrigger: { trigger: el, start: "top 80%", once: true },
      });
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <div className="relative" style={{ background: "#091c32" }}>
      <div ref={sectionRef} className="relative py-20" style={{ background: "#091c32" }}>
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-10">
          <LazyVideo
            src="/videos/optimized/anlytics-abstract.mp4"
            poster="/images/posters/anlytics-abstract.png"
            alt="Analytics data visualization"
            autoplay={true}
            loopDelay={20}
            className="w-full h-full object-cover"
          />
        </div>

        <div ref={contentRef} className="relative z-10 mx-auto max-w-5xl px-6 w-full">
          <GrowthChart />
        </div>
      </div>
    </div>
  );
}
