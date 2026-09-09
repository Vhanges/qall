"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { gsap } from "gsap";

interface AnimatedCounterProps {
  value: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  decimals?: number;
  className?: string;
  immediate?: boolean; // Start animation immediately on mount
}

export function AnimatedCounter({
  value,
  prefix = "",
  suffix = "",
  duration = 2,
  decimals = 0,
  className = "",
  immediate = false,
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  const animate = useCallback(() => {
    if (!ref.current || hasAnimated) return;
    setHasAnimated(true);

    const counter = { val: 0 };
    gsap.to(counter, {
      val: value,
      duration,
      ease: "power2.out",
      snap: { val: decimals > 0 ? 1 / Math.pow(10, decimals) : 1 },
      onUpdate: () => {
        if (ref.current) {
          ref.current.textContent = `${prefix}${counter.val.toFixed(decimals)}${suffix}`;
        }
      },
    });
  }, [value, prefix, suffix, duration, decimals, hasAnimated]);

  useEffect(() => {
    if (!ref.current || hasAnimated) return;

    // If immediate mode, animate right away with a small delay for mount
    if (immediate) {
      const timer = setTimeout(() => animate(), 100);
      return () => clearTimeout(timer);
    }

    // Otherwise use intersection observer
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          animate();
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [animate, hasAnimated, immediate]);

  return (
    <span ref={ref} className={`font-bold ${className}`}>
      {prefix}0{suffix}
    </span>
  );
}
