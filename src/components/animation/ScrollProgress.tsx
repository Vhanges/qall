"use client";

import { useEffect, useState } from "react";

export function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = window.scrollY / scrollHeight;
      setProgress(scrolled);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fade out during the last 15% of the page
  const opacity = progress > 0.85 ? Math.max(0, 1 - (progress - 0.85) / 0.15) : 1;

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] h-0.5" style={{ opacity }}>
      <div
        className="h-full bg-gradient-to-r from-orange-500 to-orange-300 transition-transform duration-150 origin-left"
        style={{ transform: `scaleX(${progress})` }}
      />
    </div>
  );
}
