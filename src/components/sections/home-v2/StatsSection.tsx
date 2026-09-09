"use client";

import { useRef, useEffect, useState } from "react";
import { HERO_V2 } from "@/lib/constants-home-v2";

interface CounterProps {
  value: number;
  suffix: string;
  prefix?: string;
  decimals?: number;
  label: string;
  isVisible: boolean;
  delay: number;
}

function StatCounter({ value, suffix, prefix, decimals, label, isVisible, delay }: CounterProps) {
  const [displayed, setDisplayed] = useState(0);
  const hasRun = useRef(false);

  useEffect(() => {
    if (!isVisible || hasRun.current) return;
    hasRun.current = true;

    const timer = setTimeout(() => {
      const duration = 1200;
      const start = performance.now();
      const tick = (now: number) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setDisplayed(eased * value);
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, delay);

    return () => clearTimeout(timer);
  }, [isVisible, value, delay]);

  const formatted = decimals
    ? displayed.toFixed(decimals)
    : Math.round(displayed).toString();

  return (
    <div
      className="flex flex-col items-center text-center transition-all duration-700"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(24px)",
        transitionDelay: `${delay}ms`,
      }}
    >
      <div className="font-heading font-bold text-4xl sm:text-5xl lg:text-6xl text-dark-50 tabular-nums">
        {prefix && <span className="text-orange-500">{prefix}</span>}
        {formatted}
        <span className="text-orange-500">{suffix}</span>
      </div>
      <p className="mt-2 text-sm text-white font-medium">{label}</p>
    </div>
  );
}

export function StatsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={sectionRef}
      className="relative z-[40] bg-[#05111f] border-t border-b border-white/5"
    >
      {/* Subtle orange glow behind the numbers */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[200px] bg-orange-500/5 blur-3xl rounded-full" />
      </div>

      <div className="relative mx-auto max-w-5xl px-6 py-16 grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-4">
        {HERO_V2.stats.map((stat, i) => (
          <StatCounter
            key={stat.label}
            value={stat.value}
            suffix={stat.suffix}
            decimals={stat.decimals}
            label={stat.label}
            isVisible={isVisible}
            delay={i * 120}
          />
        ))}
      </div>
    </div>
  );
}
