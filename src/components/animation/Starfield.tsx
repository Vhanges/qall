"use client";

import { useEffect, useRef, useState } from "react";

function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

/* ── Generate star field data ── */

// Dense milky way band stars
const MILKY_WAY_STARS = 400;
const milkyWayStars = Array.from({ length: MILKY_WAY_STARS }, (_, i) => {
  const s = seededRandom;
  // Band runs diagonally across screen
  const t = s(i * 7 + 1);
  const bandCenter = 0.3 + t * 0.4; // diagonal band center
  const spread = (s(i * 7 + 2) - 0.5) * 0.15; // tight spread
  return {
    x: t + (s(i * 7 + 3) - 0.5) * 0.3,
    y: bandCenter + spread + (s(i * 7 + 4) - 0.5) * 0.08,
    size: s(i * 7 + 5) * 1.0 + 0.2,
    brightness: s(i * 7 + 6) * 0.5 + 0.3,
  };
});

// Background scattered stars
const BG_STARS = 300;
const bgStars = Array.from({ length: BG_STARS }, (_, i) => {
  const s = seededRandom;
  const idx = i + 5000;
  return {
    x: s(idx * 3 + 1),
    y: s(idx * 3 + 2),
    size: s(idx * 3 + 3) * 0.8 + 0.2,
    brightness: s(idx * 7) * 0.4 + 0.15,
    twinkleSpeed: s(idx * 11) * 0.003 + 0.001,
    twinkleOffset: s(idx * 5) * Math.PI * 2,
  };
});

// Star clusters (tight groups)
const CLUSTERS = [
  { cx: 0.15, cy: 0.2, count: 35, radius: 0.05 },
  { cx: 0.75, cy: 0.15, count: 28, radius: 0.04 },
  { cx: 0.5, cy: 0.7, count: 30, radius: 0.05 },
  { cx: 0.85, cy: 0.6, count: 25, radius: 0.035 },
  { cx: 0.3, cy: 0.85, count: 20, radius: 0.04 },
];

const clusterStars = CLUSTERS.flatMap((cluster, ci) =>
  Array.from({ length: cluster.count }, (_, si) => {
    const s = seededRandom;
    const idx = ci * 100 + si + 10000;
    const angle = s(idx) * Math.PI * 2;
    const dist = s(idx + 1) * cluster.radius;
    return {
      x: cluster.cx + Math.cos(angle) * dist,
      y: cluster.cy + Math.sin(angle) * dist,
      size: s(idx + 2) * 0.6 + 0.2,
      brightness: s(idx + 3) * 0.5 + 0.4,
    };
  })
);

// Constellation lines (connect nearby bright stars)
const constellationStars = [
  // Constellation 1
  { x: 0.12, y: 0.35 }, { x: 0.15, y: 0.32 }, { x: 0.19, y: 0.34 },
  { x: 0.21, y: 0.38 }, { x: 0.18, y: 0.41 },
  // Constellation 2
  { x: 0.7, y: 0.25 }, { x: 0.73, y: 0.22 }, { x: 0.77, y: 0.24 },
  { x: 0.76, y: 0.29 },
  // Constellation 3
  { x: 0.55, y: 0.8 }, { x: 0.58, y: 0.77 }, { x: 0.62, y: 0.79 },
  { x: 0.6, y: 0.83 }, { x: 0.56, y: 0.82 },
];
const constellationLines = [
  [0, 1], [1, 2], [2, 3], [3, 4], [4, 0],
  [5, 6], [6, 7], [7, 8], [8, 5],
  [9, 10], [10, 11], [11, 12], [12, 13], [13, 9],
];

// Nebula clouds
const nebulae = [
  { cx: 0.2, cy: 0.3, rx: 0.18, ry: 0.12, color: [90, 40, 180], opacity: 0.025 },    // purple
  { cx: 0.7, cy: 0.2, rx: 0.15, ry: 0.1, color: [30, 100, 180], opacity: 0.02 },      // blue
  { cx: 0.5, cy: 0.55, rx: 0.25, ry: 0.15, color: [60, 20, 120], opacity: 0.018 },     // deep purple
  { cx: 0.8, cy: 0.65, rx: 0.12, ry: 0.1, color: [20, 140, 160], opacity: 0.02 },      // teal
  { cx: 0.35, cy: 0.8, rx: 0.2, ry: 0.1, color: [150, 30, 100], opacity: 0.015 },      // magenta
  { cx: 0.15, cy: 0.6, rx: 0.1, ry: 0.15, color: [40, 80, 200], opacity: 0.02 },       // bright blue
  { cx: 0.6, cy: 0.35, rx: 0.12, ry: 0.08, color: [120, 50, 160], opacity: 0.018 },    // violet
  { cx: 0.9, cy: 0.4, rx: 0.08, ry: 0.12, color: [30, 160, 140], opacity: 0.015 },     // cyan
];

export function Starfield() {
  const shootingStarContainerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !isMounted) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0, h = 0;

    function resize() {
      w = canvas!.width = window.innerWidth;
      h = canvas!.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    let animId: number;

    function draw(time: number) {
      ctx!.clearRect(0, 0, w, h);

      // 1. Nebula clouds
      for (const neb of nebulae) {
        const glow = ctx!.createRadialGradient(
          neb.cx * w, neb.cy * h, 0,
          neb.cx * w, neb.cy * h, Math.max(neb.rx * w, neb.ry * h)
        );
        const [r, g, b] = neb.color;
        const pulse = Math.sin(time * 0.0003 + neb.cx * 10) * 0.003;
        glow.addColorStop(0, `rgba(${r},${g},${b},${neb.opacity + pulse})`);
        glow.addColorStop(0.4, `rgba(${r},${g},${b},${(neb.opacity + pulse) * 0.5})`);
        glow.addColorStop(1, `rgba(${r},${g},${b},0)`);
        ctx!.fillStyle = glow;
        ctx!.beginPath();
        ctx!.ellipse(neb.cx * w, neb.cy * h, neb.rx * w, neb.ry * h, 0, 0, Math.PI * 2);
        ctx!.fill();
      }

      // 2. Milky way band stars
      for (const star of milkyWayStars) {
        const sx = star.x * w;
        const sy = star.y * h;
        if (sx < 0 || sx > w || sy < 0 || sy > h) continue;
        ctx!.beginPath();
        ctx!.arc(sx, sy, star.size, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(220,225,240,${star.brightness})`;
        ctx!.fill();
      }

      // 3. Cluster stars
      for (const star of clusterStars) {
        ctx!.beginPath();
        ctx!.arc(star.x * w, star.y * h, star.size, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(230,235,255,${star.brightness})`;
        ctx!.fill();
      }

      // 4. Background stars with subtle twinkle
      for (const star of bgStars) {
        const twinkle = Math.sin(time * star.twinkleSpeed + star.twinkleOffset);
        const opacity = star.brightness + twinkle * 0.06;
        if (opacity <= 0) continue;
        ctx!.beginPath();
        ctx!.arc(star.x * w, star.y * h, star.size, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(210,218,240,${opacity})`;
        ctx!.fill();
      }

      // 5. Constellation lines
      ctx!.strokeStyle = "rgba(150,170,220,0.08)";
      ctx!.lineWidth = 0.5;
      for (const [a, b] of constellationLines) {
        const sa = constellationStars[a];
        const sb = constellationStars[b];
        ctx!.beginPath();
        ctx!.moveTo(sa.x * w, sa.y * h);
        ctx!.lineTo(sb.x * w, sb.y * h);
        ctx!.stroke();
      }
      // Constellation anchor stars (slightly brighter)
      for (const star of constellationStars) {
        ctx!.beginPath();
        ctx!.arc(star.x * w, star.y * h, 1.2, 0, Math.PI * 2);
        ctx!.fillStyle = "rgba(200,210,240,0.7)";
        ctx!.fill();
        // Tiny glow
        ctx!.beginPath();
        ctx!.arc(star.x * w, star.y * h, 3, 0, Math.PI * 2);
        ctx!.fillStyle = "rgba(180,200,240,0.06)";
        ctx!.fill();
      }

      // 6. Occasional bright stars with cross-flare
      const brightStars = [
        { x: 0.25, y: 0.18, size: 1.5, flare: 8 },
        { x: 0.65, y: 0.12, size: 1.3, flare: 6 },
        { x: 0.82, y: 0.45, size: 1.4, flare: 7 },
        { x: 0.4, y: 0.75, size: 1.2, flare: 5 },
        { x: 0.1, y: 0.55, size: 1.1, flare: 5 },
      ];
      for (const star of brightStars) {
        const pulse = Math.sin(time * 0.001 + star.x * 20) * 0.15 + 0.85;
        // Core
        ctx!.beginPath();
        ctx!.arc(star.x * w, star.y * h, star.size, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(240,245,255,${0.9 * pulse})`;
        ctx!.fill();
        // Glow
        ctx!.beginPath();
        ctx!.arc(star.x * w, star.y * h, star.size * 4, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(200,220,255,${0.05 * pulse})`;
        ctx!.fill();
        // Cross flare
        ctx!.strokeStyle = `rgba(220,230,255,${0.12 * pulse})`;
        ctx!.lineWidth = 0.5;
        const fl = star.flare * pulse;
        ctx!.beginPath();
        ctx!.moveTo(star.x * w - fl, star.y * h);
        ctx!.lineTo(star.x * w + fl, star.y * h);
        ctx!.stroke();
        ctx!.beginPath();
        ctx!.moveTo(star.x * w, star.y * h - fl);
        ctx!.lineTo(star.x * w, star.y * h + fl);
        ctx!.stroke();
      }

      animId = requestAnimationFrame(draw);
    }

    animId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, [isMounted]);

  // Shooting stars
  useEffect(() => {
    const container = shootingStarContainerRef.current;
    if (!container || !isMounted) return;

    function createShootingStar() {
      const star = document.createElement("div");

      // Randomize starting position across entire viewport
      const startX = Math.random() * 100;
      const startY = Math.random() * 100;

      // Completely random angle (0-360 degrees)
      const angle = Math.random() * 360;

      const duration = Math.random() * 1.2 + 0.6;
      const length = Math.random() * 150 + 80;

      star.style.cssText = `
        position: absolute;
        top: ${startY}%;
        left: ${startX}%;
        width: ${length}px;
        height: 1.5px;
        background: linear-gradient(90deg, transparent, rgba(180,200,255,0.1), rgba(220,235,255,0.6), rgba(255,255,255,0.95));
        transform: rotate(${angle}deg);
        opacity: 0;
        pointer-events: none;
        border-radius: 1px;
        box-shadow: 0 0 4px rgba(180,200,255,0.3), 0 0 8px rgba(150,180,240,0.15);
        animation: shootingStar ${duration}s ease-out forwards;
      `;

      container!.appendChild(star);
      setTimeout(() => star.remove(), duration * 1000 + 200);
    }

    const initialTimer = setTimeout(createShootingStar, 8000);

    function scheduleNext() {
      const delay = Math.random() * 10000 + 10000; // 10-20 seconds between stars
      return setTimeout(() => {
        createShootingStar();
        timerId = scheduleNext();
      }, delay);
    }

    let timerId = scheduleNext();
    return () => {
      clearTimeout(initialTimer);
      clearTimeout(timerId);
    };
  }, [isMounted]);

  return (
    <div
      className="fixed inset-0 z-40 pointer-events-none overflow-hidden"
      aria-hidden="true"
      style={{
        maskImage: 'linear-gradient(to bottom, transparent 0%, transparent 65vh, rgba(0,0,0,1) 75vh)',
        WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, transparent 65vh, rgba(0,0,0,1) 75vh)',
      }}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ opacity: isMounted ? 1 : 0 }}
      />
      <div ref={shootingStarContainerRef} className="absolute inset-0" />
    </div>
  );
}
