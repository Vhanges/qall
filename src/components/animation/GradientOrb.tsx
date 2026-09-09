"use client";

import { useRef, useEffect } from "react";
import { gsap } from "@/lib/gsap-config";

interface GradientOrbProps {
  color?: "orange" | "blue";
  size?: number;
  className?: string;
}

export function GradientOrb({
  color = "blue",
  size = 400,
  className = "",
}: GradientOrbProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const ctx = gsap.context(() => {
      gsap.to(ref.current, {
        y: 40,
        x: 20,
        duration: 6,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });
    });

    return () => ctx.revert();
  }, []);

  const gradient =
    color === "orange"
      ? "from-orange-500/20 to-orange-300/5"
      : "from-blue-800/30 to-blue-500/5";

  return (
    <div
      ref={ref}
      className={`absolute rounded-full bg-gradient-radial ${gradient} blur-3xl pointer-events-none ${className}`}
      style={{ width: size, height: size }}
    />
  );
}
