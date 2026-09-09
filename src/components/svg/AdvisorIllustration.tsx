"use client";

import { useRef, useEffect } from "react";
import { gsap } from "@/lib/gsap-config";

const ORBIT_RADIUS = 140;
const CENTER_X = 200;
const CENTER_Y = 200;

function orbitPos(angleDeg: number) {
  const rad = (angleDeg * Math.PI) / 180;
  return {
    x: Math.round(CENTER_X + ORBIT_RADIUS * Math.sin(rad)),
    y: Math.round(CENTER_Y - ORBIT_RADIUS * Math.cos(rad)),
  };
}

const ICON_ANGLES = [0, 90, 180, 270];

export function AdvisorIllustration() {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const ctx = gsap.context(() => {
      // Gentle bob on the advisor
      gsap.to(".advisor-figure", {
        y: -4,
        duration: 3,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });

      // Orbit the task icons
      gsap.to(".advisor-orbit-ring", {
        rotation: 360,
        duration: 35,
        ease: "none",
        repeat: -1,
        svgOrigin: `${CENTER_X} ${CENTER_Y}`,
      });

      // Counter-rotate icons to stay upright
      const icons = svg.querySelectorAll<SVGGElement>(".adv-orbit-inner");
      icons.forEach((icon) => {
        gsap.to(icon, {
          rotation: -360,
          duration: 35,
          ease: "none",
          repeat: -1,
          transformOrigin: "center center",
        });
      });

      // Orbit track dash
      gsap.to(".adv-orbit-track", {
        strokeDashoffset: -24,
        duration: 2,
        ease: "none",
        repeat: -1,
      });

      // Typing cursor blink
      gsap.to(".typing-cursor", {
        opacity: 0,
        duration: 0.5,
        ease: "steps(1)",
        repeat: -1,
        yoyo: true,
      });

      // Screen glow pulse
      gsap.to(".screen-glow", {
        opacity: 0.5,
        duration: 2,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });

      // Audio waveform
      const bars = svg.querySelectorAll<SVGElement>(".wave-bar");
      bars.forEach((bar, i) => {
        gsap.to(bar, {
          scaleY: 0.3 + Math.random() * 1.5,
          duration: 0.3 + i * 0.05,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
          transformOrigin: "center bottom",
        });
      });
    }, svg);

    return () => ctx.revert();
  }, []);

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 400 420"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full max-w-[420px]"
    >
      {/* Background glow */}
      <circle cx={CENTER_X} cy={CENTER_Y} r="160" fill="url(#advGlow)" opacity="0.08" />

      {/* Orbit track */}
      <circle
        className="adv-orbit-track"
        cx={CENTER_X}
        cy={CENTER_Y}
        r={ORBIT_RADIUS}
        fill="none"
        stroke="rgba(74,123,212,0.1)"
        strokeWidth="1"
        strokeDasharray="6 6"
      />

      {/* ─── ORBITING ICONS ─── */}
      <g className="advisor-orbit-ring">
        {/* 1. CLIENT RECORD / Contact card (top) */}
        {(() => {
          const pos = orbitPos(ICON_ANGLES[0]);
          return (
            <g transform={`translate(${pos.x - 28}, ${pos.y - 28})`}>
              <g className="adv-orbit-inner">
                <rect width="56" height="56" rx="12" fill="rgba(74,123,212,0.05)" stroke="rgba(74,123,212,0.2)" strokeWidth="1" />
                {/* Person silhouette */}
                <circle cx="28" cy="18" r="6" fill="none" stroke="#4A7BD4" strokeWidth="1.5" opacity="0.7" />
                <path d="M18 36 Q18 27 28 27 Q38 27 38 36" fill="none" stroke="#4A7BD4" strokeWidth="1.5" opacity="0.7" />
                {/* Info lines */}
                <line x1="18" y1="42" x2="38" y2="42" stroke="#4A7BD4" strokeWidth="1" opacity="0.3" />
                <line x1="18" y1="47" x2="32" y2="47" stroke="#4A7BD4" strokeWidth="1" opacity="0.3" />
              </g>
            </g>
          );
        })()}

        {/* 2. CALENDAR / Scheduling (right) */}
        {(() => {
          const pos = orbitPos(ICON_ANGLES[1]);
          return (
            <g transform={`translate(${pos.x - 28}, ${pos.y - 28})`}>
              <g className="adv-orbit-inner">
                <rect width="56" height="56" rx="12" fill="rgba(74,123,212,0.05)" stroke="rgba(74,123,212,0.2)" strokeWidth="1" />
                {/* Calendar frame */}
                <rect x="12" y="14" width="32" height="30" rx="4" fill="none" stroke="#4A7BD4" strokeWidth="1.5" opacity="0.7" />
                <line x1="12" y1="22" x2="44" y2="22" stroke="#4A7BD4" strokeWidth="1" opacity="0.4" />
                {/* Date dots */}
                {[0, 1, 2, 3, 4, 5].map((i) => {
                  const col = i % 3;
                  const row = Math.floor(i / 3);
                  const highlight = i === 1 || i === 4;
                  return (
                    <circle
                      key={i}
                      cx={20 + col * 8}
                      cy={29 + row * 8}
                      r={highlight ? 3 : 2}
                      fill={highlight ? "#4A7BD4" : "rgba(74,123,212,0.2)"}
                      opacity={highlight ? 0.8 : 0.5}
                    />
                  );
                })}
              </g>
            </g>
          );
        })()}

        {/* 3. PHONE / Call recordings (bottom) */}
        {(() => {
          const pos = orbitPos(ICON_ANGLES[2]);
          return (
            <g transform={`translate(${pos.x - 28}, ${pos.y - 28})`}>
              <g className="adv-orbit-inner">
                <rect width="56" height="56" rx="12" fill="rgba(74,123,212,0.05)" stroke="rgba(74,123,212,0.2)" strokeWidth="1" />
                {/* Phone handset */}
                <path
                  d="M18 22 Q18 18 22 16 L26 15 Q28 15 28 17 L28 21 Q28 23 26 23 L24 23 Q20 26 20 30 Q20 34 24 37 L24 37 Q26 37 26 39 L26 43 Q26 45 24 45 L20 44 Q16 42 16 38 L16 30"
                  fill="none"
                  stroke="#4A7BD4"
                  strokeWidth="1.5"
                  opacity="0.7"
                />
                {/* Sound waves */}
                <path d="M32 24 Q36 28 32 32" fill="none" stroke="#4A7BD4" strokeWidth="1" opacity="0.4" />
                <path d="M36 21 Q42 28 36 35" fill="none" stroke="#4A7BD4" strokeWidth="1" opacity="0.3" />
              </g>
            </g>
          );
        })()}

        {/* 4. FILTER / Lead management (left) */}
        {(() => {
          const pos = orbitPos(ICON_ANGLES[3]);
          return (
            <g transform={`translate(${pos.x - 28}, ${pos.y - 28})`}>
              <g className="adv-orbit-inner">
                <rect width="56" height="56" rx="12" fill="rgba(74,123,212,0.05)" stroke="rgba(74,123,212,0.2)" strokeWidth="1" />
                {/* Funnel / filter */}
                <path d="M14 16 L42 16 L30 30 L30 40 L26 42 L26 30 Z" fill="rgba(74,123,212,0.1)" stroke="#4A7BD4" strokeWidth="1.5" opacity="0.7" />
                {/* Dots entering funnel */}
                <circle cx="20" cy="12" r="2" fill="#4A7BD4" opacity="0.5" />
                <circle cx="28" cy="10" r="2" fill="#4A7BD4" opacity="0.5" />
                <circle cx="36" cy="12" r="2" fill="#4A7BD4" opacity="0.5" />
              </g>
            </g>
          );
        })()}
      </g>

      {/* ─── ADVISOR FIGURE ─── */}
      <g className="advisor-figure">
        {/* Desk / laptop base */}
        <rect x="148" y="258" width="104" height="6" rx="3" fill="rgba(74,123,212,0.08)" stroke="rgba(74,123,212,0.15)" strokeWidth="1" />

        {/* Laptop screen */}
        <rect x="155" y="218" width="90" height="42" rx="4" fill="rgba(10,14,23,0.7)" stroke="rgba(74,123,212,0.25)" strokeWidth="1.5" />
        {/* Screen content - mini dashboard */}
        <rect className="screen-glow" x="160" y="223" width="80" height="32" rx="2" fill="rgba(74,123,212,0.04)" opacity="0.3" />
        {/* Mini chart bars on screen */}
        <rect x="165" y="243" width="5" height="8" rx="1" fill="#4A7BD4" opacity="0.5" />
        <rect x="173" y="239" width="5" height="12" rx="1" fill="#4A7BD4" opacity="0.6" />
        <rect x="181" y="241" width="5" height="10" rx="1" fill="#4A7BD4" opacity="0.5" />
        <rect x="189" y="235" width="5" height="16" rx="1" fill="#4A7BD4" opacity="0.8" />
        <rect x="197" y="238" width="5" height="13" rx="1" fill="#4A7BD4" opacity="0.6" />
        {/* Text lines on screen */}
        <rect x="210" y="228" width="25" height="3" rx="1" fill="rgba(74,123,212,0.3)" />
        <rect x="210" y="234" width="20" height="3" rx="1" fill="rgba(74,123,212,0.2)" />
        <rect x="210" y="240" width="22" height="3" rx="1" fill="rgba(74,123,212,0.2)" />
        {/* Typing cursor */}
        <rect className="typing-cursor" x="232" y="240" width="2" height="3" rx="0.5" fill="#4A7BD4" opacity="0.8" />

        {/* Laptop keyboard */}
        <path d="M155 258 L148 264 L252 264 L245 258" fill="rgba(74,123,212,0.04)" stroke="rgba(74,123,212,0.12)" strokeWidth="1" />

        {/* ─── PERSON ─── */}
        {/* Torso */}
        <path
          d="M178 210 Q178 195 200 192 Q222 195 222 210 L222 218 L178 218 Z"
          fill="rgba(74,123,212,0.06)"
          stroke="rgba(74,123,212,0.2)"
          strokeWidth="1.5"
        />

        {/* Neck */}
        <rect x="194" y="178" width="12" height="16" rx="4" fill="rgba(74,123,212,0.06)" stroke="rgba(74,123,212,0.15)" strokeWidth="1" />

        {/* Head */}
        <ellipse cx="200" cy="162" rx="22" ry="24" fill="rgba(74,123,212,0.06)" stroke="rgba(74,123,212,0.25)" strokeWidth="1.5" />

        {/* Eyes */}
        <circle cx="192" cy="158" r="2" fill="#4A7BD4" opacity="0.6" />
        <circle cx="208" cy="158" r="2" fill="#4A7BD4" opacity="0.6" />

        {/* Subtle smile */}
        <path d="M194 168 Q200 172 206 168" fill="none" stroke="#4A7BD4" strokeWidth="1" strokeLinecap="round" opacity="0.3" />

        {/* ─── HEADSET ─── */}
        {/* Headband */}
        <path
          d="M174 155 Q174 130 200 128 Q226 130 226 155"
          fill="none"
          stroke="#4A7BD4"
          strokeWidth="2.5"
          strokeLinecap="round"
          opacity="0.6"
        />
        {/* Left earpiece */}
        <rect x="168" y="150" width="10" height="16" rx="5" fill="rgba(74,123,212,0.15)" stroke="#4A7BD4" strokeWidth="1.5" opacity="0.7" />
        {/* Right earpiece */}
        <rect x="222" y="150" width="10" height="16" rx="5" fill="rgba(74,123,212,0.15)" stroke="#4A7BD4" strokeWidth="1.5" opacity="0.7" />
        {/* Mic boom */}
        <path
          d="M170 162 Q165 168 165 176 Q165 182 170 184"
          fill="none"
          stroke="#4A7BD4"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.5"
        />
        {/* Mic tip */}
        <circle cx="171" cy="185" r="3" fill="rgba(74,123,212,0.2)" stroke="#4A7BD4" strokeWidth="1" opacity="0.6" />

        {/* Audio waveform from mic */}
        <g transform="translate(148, 178)">
          {[0, 1, 2, 3, 4].map((i) => (
            <rect
              key={i}
              className="wave-bar"
              x={i * 4}
              y={0}
              width="2"
              height="8"
              rx="1"
              fill="#4A7BD4"
              opacity="0.4"
            />
          ))}
        </g>

        {/* Arms reaching to keyboard */}
        <path
          d="M178 210 Q168 230 165 250"
          fill="none"
          stroke="rgba(74,123,212,0.2)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M222 210 Q232 230 235 250"
          fill="none"
          stroke="rgba(74,123,212,0.2)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />

        {/* Hands on keyboard area */}
        <circle cx="168" cy="252" r="4" fill="rgba(74,123,212,0.06)" stroke="rgba(74,123,212,0.15)" strokeWidth="1" />
        <circle cx="232" cy="252" r="4" fill="rgba(74,123,212,0.06)" stroke="rgba(74,123,212,0.15)" strokeWidth="1" />
      </g>

      {/* Small ambient particles */}
      {[
        { cx: 130, cy: 130 },
        { cx: 270, cy: 130 },
        { cx: 120, cy: 280 },
        { cx: 280, cy: 280 },
        { cx: 100, cy: 200 },
        { cx: 300, cy: 200 },
      ].map((p, i) => (
        <circle
          key={i}
          cx={p.cx}
          cy={p.cy}
          r="1.5"
          fill="#4A7BD4"
          opacity={0.15 + (i % 3) * 0.08}
        />
      ))}

      <defs>
        <radialGradient id="advGlow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#4A7BD4" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#4A7BD4" stopOpacity="0" />
        </radialGradient>
      </defs>
    </svg>
  );
}
