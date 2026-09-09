"use client";

import { useRef, useEffect } from "react";
import { gsap } from "@/lib/gsap-config";

// 6 task icons positioned on a circle, angles in degrees
const ORBIT_RADIUS = 145;
const CENTER_X = 200;
const CENTER_Y = 220;

function getOrbitPosition(angleDeg: number) {
  const rad = (angleDeg * Math.PI) / 180;
  return {
    x: Math.round(CENTER_X + ORBIT_RADIUS * Math.sin(rad)),
    y: Math.round(CENTER_Y - ORBIT_RADIUS * Math.cos(rad)),
  };
}

const ICON_ANGLES = [0, 60, 120, 180, 240, 300];

export function ManagementRobot() {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const ctx = gsap.context(() => {
      // Floating bob on the robot body
      gsap.to(".robot-body", {
        y: -6,
        duration: 2.5,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });

      // Rotate the entire orbit ring
      gsap.to(".orbit-ring", {
        rotation: 360,
        duration: 30,
        ease: "none",
        repeat: -1,
        svgOrigin: `${CENTER_X} ${CENTER_Y}`,
      });

      // Counter-rotate each icon so it stays upright
      const icons = svg.querySelectorAll<SVGGElement>(".orbit-icon-inner");
      icons.forEach((icon) => {
        gsap.to(icon, {
          rotation: -360,
          duration: 30,
          ease: "none",
          repeat: -1,
          transformOrigin: "center center",
        });
      });

      // Pulse the glow rings
      gsap.to(".glow-ring", {
        opacity: 0.15,
        scale: 1.08,
        duration: 2,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        transformOrigin: "center center",
      });

      // Dash animation on orbit track
      gsap.to(".orbit-track", {
        strokeDashoffset: -24,
        duration: 2,
        ease: "none",
        repeat: -1,
      });

      // Pulse the robot eyes
      gsap.to(".robot-eye", {
        opacity: 0.6,
        duration: 1.2,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });
    }, svg);

    return () => ctx.revert();
  }, []);

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 400 440"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full max-w-[420px]"
    >
      {/* Background glow */}
      <circle
        className="glow-ring"
        cx={CENTER_X}
        cy={CENTER_Y}
        r="160"
        fill="url(#robotGlow)"
        opacity="0.1"
      />

      {/* Orbit track (dashed circle) */}
      <circle
        className="orbit-track"
        cx={CENTER_X}
        cy={CENTER_Y}
        r={ORBIT_RADIUS}
        fill="none"
        stroke="rgba(248,140,0,0.1)"
        strokeWidth="1"
        strokeDasharray="6 6"
      />

      {/* ─── ORBITING TASK ICONS ─── */}
      <g className="orbit-ring">
        {/* 1. DATABASE / Unified Data */}
        {(() => {
          const pos = getOrbitPosition(ICON_ANGLES[0]);
          return (
            <g transform={`translate(${pos.x - 28}, ${pos.y - 28})`}>
              <g className="orbit-icon-inner">
                <rect width="56" height="56" rx="12" fill="rgba(248,140,0,0.05)" stroke="rgba(248,140,0,0.2)" strokeWidth="1" />
                <ellipse cx="28" cy="20" rx="14" ry="5" fill="none" stroke="#F88C00" strokeWidth="1.5" opacity="0.7" />
                <path d="M14 20v10a14 5 0 0 0 28 0V20" fill="none" stroke="#F88C00" strokeWidth="1.5" opacity="0.7" />
                <path d="M14 30v10a14 5 0 0 0 28 0V30" fill="none" stroke="#F88C00" strokeWidth="1.5" opacity="0.7" />
              </g>
            </g>
          );
        })()}

        {/* 2. BAR CHART / Financial Tracking */}
        {(() => {
          const pos = getOrbitPosition(ICON_ANGLES[1]);
          return (
            <g transform={`translate(${pos.x - 28}, ${pos.y - 28})`}>
              <g className="orbit-icon-inner">
                <rect width="56" height="56" rx="12" fill="rgba(248,140,0,0.05)" stroke="rgba(248,140,0,0.2)" strokeWidth="1" />
                <rect x="14" y="32" width="7" height="14" rx="2" fill="#F88C00" opacity="0.4" />
                <rect x="24" y="24" width="7" height="22" rx="2" fill="#F88C00" opacity="0.6" />
                <rect x="34" y="16" width="7" height="30" rx="2" fill="#F88C00" opacity="0.9" />
                <path d="M17 30 L27 22 L37 14" fill="none" stroke="#F88C00" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
              </g>
            </g>
          );
        })()}

        {/* 3. PEOPLE / Advisor Performance */}
        {(() => {
          const pos = getOrbitPosition(ICON_ANGLES[2]);
          return (
            <g transform={`translate(${pos.x - 28}, ${pos.y - 28})`}>
              <g className="orbit-icon-inner">
                <rect width="56" height="56" rx="12" fill="rgba(248,140,0,0.05)" stroke="rgba(248,140,0,0.2)" strokeWidth="1" />
                <circle cx="22" cy="20" r="5" fill="none" stroke="#F88C00" strokeWidth="1.5" opacity="0.7" />
                <path d="M14 36 Q14 28 22 28 Q30 28 30 36" fill="none" stroke="#F88C00" strokeWidth="1.5" opacity="0.7" />
                <circle cx="36" cy="22" r="4" fill="none" stroke="#F88C00" strokeWidth="1.2" opacity="0.5" />
                <path d="M30 36 Q30 30 36 30 Q42 30 42 36" fill="none" stroke="#F88C00" strokeWidth="1.2" opacity="0.5" />
              </g>
            </g>
          );
        })()}

        {/* 4. DOCUMENT / Reports */}
        {(() => {
          const pos = getOrbitPosition(ICON_ANGLES[3]);
          return (
            <g transform={`translate(${pos.x - 28}, ${pos.y - 28})`}>
              <g className="orbit-icon-inner">
                <rect width="56" height="56" rx="12" fill="rgba(248,140,0,0.05)" stroke="rgba(248,140,0,0.2)" strokeWidth="1" />
                <rect x="16" y="12" width="24" height="32" rx="3" fill="none" stroke="#F88C00" strokeWidth="1.5" opacity="0.7" />
                <line x1="20" y1="20" x2="36" y2="20" stroke="#F88C00" strokeWidth="1" opacity="0.4" />
                <line x1="20" y1="26" x2="32" y2="26" stroke="#F88C00" strokeWidth="1" opacity="0.4" />
                <line x1="20" y1="32" x2="34" y2="32" stroke="#F88C00" strokeWidth="1" opacity="0.4" />
                <path d="M30 36 L33 39 L40 30" fill="none" stroke="#F88C00" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
              </g>
            </g>
          );
        })()}

        {/* 5. GEAR / Automation */}
        {(() => {
          const pos = getOrbitPosition(ICON_ANGLES[4]);
          return (
            <g transform={`translate(${pos.x - 24}, ${pos.y - 24})`}>
              <g className="orbit-icon-inner">
                <rect width="48" height="48" rx="10" fill="rgba(248,140,0,0.05)" stroke="rgba(248,140,0,0.2)" strokeWidth="1" />
                <circle cx="24" cy="24" r="8" fill="none" stroke="#F88C00" strokeWidth="1.5" opacity="0.6" />
                <circle cx="24" cy="24" r="3" fill="#F88C00" opacity="0.4" />
                {[0, 60, 120, 180, 240, 300].map((angle) => {
                  const rad = (angle * Math.PI) / 180;
                  const x1 = Math.round(24 + 8 * Math.cos(rad));
                  const y1 = Math.round(24 + 8 * Math.sin(rad));
                  const x2 = Math.round(24 + 12 * Math.cos(rad));
                  const y2 = Math.round(24 + 12 * Math.sin(rad));
                  return (
                    <line key={angle} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#F88C00" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
                  );
                })}
              </g>
            </g>
          );
        })()}

        {/* 6. SHIELD / Compliance */}
        {(() => {
          const pos = getOrbitPosition(ICON_ANGLES[5]);
          return (
            <g transform={`translate(${pos.x - 24}, ${pos.y - 24})`}>
              <g className="orbit-icon-inner">
                <rect width="48" height="48" rx="10" fill="rgba(248,140,0,0.05)" stroke="rgba(248,140,0,0.2)" strokeWidth="1" />
                <path
                  d="M24 10 L36 16 V28 Q36 38 24 42 Q12 38 12 28 V16 Z"
                  fill="rgba(248,140,0,0.08)"
                  stroke="#F88C00"
                  strokeWidth="1.5"
                  opacity="0.6"
                />
                <path d="M19 25 L22 28 L30 20" fill="none" stroke="#F88C00" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
              </g>
            </g>
          );
        })()}
      </g>

      {/* ─── ROBOT BODY (drawn on top of orbit) ─── */}
      <g className="robot-body">
        {/* Body shell */}
        <rect x="160" y="230" width="80" height="60" rx="12" fill="rgba(248,140,0,0.06)" stroke="rgba(248,140,0,0.25)" strokeWidth="1.5" />
        {/* Chest indicator */}
        <circle cx="200" cy="255" r="6" fill="#F88C00" opacity="0.4" />
        <circle cx="200" cy="255" r="3" fill="#F88C00" opacity="0.8" />

        {/* Neck */}
        <rect x="192" y="218" width="16" height="16" rx="4" fill="rgba(248,140,0,0.08)" stroke="rgba(248,140,0,0.2)" strokeWidth="1" />

        {/* Head */}
        <rect x="162" y="178" width="76" height="44" rx="14" fill="rgba(248,140,0,0.06)" stroke="rgba(248,140,0,0.3)" strokeWidth="1.5" />
        {/* Visor/screen */}
        <rect x="172" y="188" width="56" height="22" rx="6" fill="rgba(10,14,23,0.6)" stroke="rgba(248,140,0,0.15)" strokeWidth="1" />
        {/* Eyes */}
        <circle className="robot-eye" cx="188" cy="199" r="4" fill="#F88C00" opacity="0.9" />
        <circle className="robot-eye" cx="212" cy="199" r="4" fill="#F88C00" opacity="0.9" />

        {/* Antenna */}
        <line x1="200" y1="178" x2="200" y2="166" stroke="rgba(248,140,0,0.3)" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="200" cy="163" r="3" fill="#F88C00" opacity="0.6" />

        {/* Left arm */}
        <path d="M160 242 Q130 238 115 215" stroke="rgba(248,140,0,0.25)" strokeWidth="2" strokeLinecap="round" fill="none" />
        <circle cx="113" cy="213" r="5" fill="rgba(248,140,0,0.1)" stroke="rgba(248,140,0,0.3)" strokeWidth="1" />

        {/* Right arm */}
        <path d="M240 242 Q270 238 285 215" stroke="rgba(248,140,0,0.25)" strokeWidth="2" strokeLinecap="round" fill="none" />
        <circle cx="287" cy="213" r="5" fill="rgba(248,140,0,0.1)" stroke="rgba(248,140,0,0.3)" strokeWidth="1" />

        {/* Hover disc / base */}
        <ellipse cx="200" cy="296" rx="36" ry="6" fill="rgba(248,140,0,0.08)" stroke="rgba(248,140,0,0.15)" strokeWidth="1" />
      </g>

      {/* Gradient defs */}
      <defs>
        <radialGradient id="robotGlow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#F88C00" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#F88C00" stopOpacity="0" />
        </radialGradient>
      </defs>
    </svg>
  );
}
