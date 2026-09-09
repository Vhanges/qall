"use client";

import { useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import { gsap } from "@/lib/gsap-config";

/**
 * A decorative SVG path that draws itself as the user scrolls,
 * creating a visual "infrastructure" connection between homepage sections.
 * Inspired by Marqeta's flowing road / network motif.
 *
 * Desktop only (hidden on < 1024 px).
 */
export function ScrollConnector() {
  const pathname = usePathname();
  const svgRef = useRef<SVGSVGElement>(null);
  const mainPathRef = useRef<SVGPathElement>(null);
  const glowDotRef = useRef<SVGCircleElement>(null);

  useEffect(() => {
    if (pathname !== "/") return;
    if (typeof window === "undefined" || window.innerWidth < 1024) return;

    const svg = svgRef.current;
    const mainPath = mainPathRef.current;
    const glowDot = glowDotRef.current;
    if (!svg || !mainPath || !glowDot) return;

    const length = mainPath.getTotalLength();

    gsap.set(mainPath, { strokeDasharray: length, strokeDashoffset: length });
    gsap.set(glowDot, { opacity: 0 });
    gsap.set(svg, { opacity: 1 });

    // Proxy to drive both path draw and glow dot position
    const proxy = { progress: 0 };

    const play = () => {
      proxy.progress = 0;
      gsap.set(mainPath, { strokeDashoffset: length });
      gsap.set(glowDot, { opacity: 0 });

      gsap.to(proxy, {
        progress: 1,
        duration: 6,
        ease: "none",
        onUpdate() {
          const p = proxy.progress;
          gsap.set(mainPath, { strokeDashoffset: length * (1 - p) });
          const point = mainPath.getPointAtLength(length * p);
          gsap.set(glowDot, {
            attr: { cx: point.x, cy: point.y },
            opacity: p > 0.02 && p < 0.98 ? 0.9 : 0,
          });
        },
        onComplete: play,
      });
    };

    play();

    return () => { gsap.killTweensOf(proxy); };
  }, []);

  return (
    <svg
      ref={svgRef}
      className={`fixed inset-0 w-full h-full pointer-events-none z-[39] hidden lg:block ${pathname !== "/" ? "invisible" : ""}`}
      viewBox="0 0 1440 900"
      preserveAspectRatio="none"
      fill="none"
    >
      <defs>
        <linearGradient id="connGrad" x1="0" y1="0" x2="0.5" y2="1">
          <stop offset="0%" stopColor="#F88C00" stopOpacity="0.25" />
          <stop offset="40%" stopColor="#F88C00" stopOpacity="0.12" />
          <stop offset="70%" stopColor="#F88C00" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#F88C00" stopOpacity="0.2" />
        </linearGradient>
        <radialGradient id="dotGlow">
          <stop offset="0%" stopColor="#F88C00" stopOpacity="1" />
          <stop offset="50%" stopColor="#F88C00" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#F88C00" stopOpacity="0" />
        </radialGradient>
        <filter id="pathBlur">
          <feGaussianBlur stdDeviation="3" />
        </filter>
      </defs>

      {/* Blurred wide background path */}
      <path
        d="M -40,820
           C 180,820 280,620 480,580
           S 680,780 820,520
           S 1020,720 1120,420
           S 1320,570 1480,320"
        stroke="#F88C00"
        strokeWidth="8"
        strokeLinecap="round"
        fill="none"
        opacity="0.04"
        filter="url(#pathBlur)"
      />

      {/* Main visible path */}
      <path
        ref={mainPathRef}
        d="M -40,820
           C 180,820 280,620 480,580
           S 680,780 820,520
           S 1020,720 1120,420
           S 1320,570 1480,320"
        stroke="url(#connGrad)"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />

      {/* Glow dot that tracks the path head */}
      <circle
        ref={glowDotRef}
        r="8"
        fill="url(#dotGlow)"
        opacity="0"
      />
    </svg>
  );
}
