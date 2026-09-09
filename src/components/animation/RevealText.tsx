"use client";

import { useRef, useEffect } from "react";
import { gsap } from "@/lib/gsap-config";

interface RevealTextProps {
  children: string;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  className?: string;
  delay?: number;
  highlightWords?: string[];
  highlightRange?: [number, number];
  highlightClassName?: string;
}

export function RevealText({
  children,
  as: Tag = "h1",
  className = "",
  delay = 0,
  highlightWords = [],
  highlightRange,
  highlightClassName = "",
}: RevealTextProps) {
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const words = containerRef.current.querySelectorAll(".reveal-word");

    const ctx = gsap.context(() => {
      gsap.fromTo(
        words,
        { y: "100%", opacity: 0 },
        {
          y: "0%",
          opacity: 1,
          duration: 0.8,
          stagger: 0.05,
          delay,
          ease: "power3.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 80%",
            once: true,
          },
        }
      );
    });

    return () => ctx.revert();
  }, [delay]);

  const words = children.trim().split(/\s+/);

  return (
    <Tag
      ref={containerRef as React.RefObject<HTMLHeadingElement>}
      className={className}
    >
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden mr-[0.25em]">
          <span className={`reveal-word inline-block ${(highlightRange ? i >= highlightRange[0] && i <= highlightRange[1] : highlightWords.includes(word)) ? highlightClassName : ""}`}>{word}</span>
        </span>
      ))}
    </Tag>
  );
}
