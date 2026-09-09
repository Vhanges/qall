"use client";

import { useRef, useEffect } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap-config";
import { INFRA_INTRO_V2 } from "@/lib/constants-home-v2";

/* ─── Decorative floating nodes ─── */
function FloatingNodes() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden hidden lg:block">
      <div className="ii-node-left absolute top-[20%] left-[8%] w-16 h-16">
        <div className="w-full h-full rounded-full border border-orange-500/20 flex items-center justify-center">
          <div className="w-3 h-3 rounded-full bg-orange-500/40 animate-pulse" />
        </div>
        <div className="absolute top-full left-1/2 w-px h-20 bg-gradient-to-b from-orange-500/20 to-transparent" />
      </div>
      <div className="ii-node-right absolute top-[15%] right-[10%] w-12 h-12">
        <div className="w-full h-full rounded-full border border-orange-500/15 flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-orange-500/30" />
        </div>
      </div>
      <div className="ii-node-bl absolute bottom-[18%] left-[14%] w-10 h-10">
        <div className="w-full h-full rounded-full border border-blue-500/15 flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-blue-400/30" />
        </div>
        <div className="absolute -top-16 left-1/2 w-px h-16 bg-gradient-to-t from-blue-500/15 to-transparent" />
      </div>
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1440 900" preserveAspectRatio="none" fill="none">
        <path d="M115,230 Q400,350 720,450 T1300,200" stroke="rgba(248,140,0,0.06)" strokeWidth="1" strokeDasharray="6 8">
          <animate attributeName="stroke-dashoffset" values="0;-28" dur="4s" repeatCount="indefinite" />
        </path>
        <path d="M200,700 Q600,500 1000,600" stroke="rgba(59,130,246,0.05)" strokeWidth="1" strokeDasharray="4 6">
          <animate attributeName="stroke-dashoffset" values="0;-20" dur="3.5s" repeatCount="indefinite" />
        </path>
      </svg>
    </div>
  );
}

export function InfraIntro() {
  const pinRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const el = pinRef.current;
    if (!el) return;
    if (window.innerWidth < 768) return;

    const divider = el.querySelector<HTMLElement>(".ii-divider");
    const heading = el.querySelector<HTMLElement>(".ii-heading");
    const body = el.querySelector<HTMLElement>(".ii-body");
    const nodeLeft = el.querySelector<HTMLElement>(".ii-node-left");
    const nodeRight = el.querySelector<HTMLElement>(".ii-node-right");
    const nodeBl = el.querySelector<HTMLElement>(".ii-node-bl");

    // Keep everything invisible until the section is fully pinned
    gsap.set([divider, heading, body], { autoAlpha: 0, y: 18 });
    if (nodeLeft) gsap.set(nodeLeft, { autoAlpha: 0, x: -30, scale: 0.6 });
    if (nodeRight) gsap.set(nodeRight, { autoAlpha: 0, x: 30, scale: 0.6 });
    if (nodeBl) gsap.set(nodeBl, { autoAlpha: 0, y: 20, scale: 0.6 });

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: el,
        start: "top top",
        end: "+=120%",
        pin: true,
        anticipatePin: 1,
        // Only animate in once the section is fully at the top — no scrub on content
        onEnter: () => {
          if (hasAnimated.current) return;
          hasAnimated.current = true;

          const tl = gsap.timeline();

          // Decorative nodes
          if (nodeLeft) tl.to(nodeLeft, { autoAlpha: 1, x: 0, scale: 1, duration: 0.6, ease: "power2.out" }, 0.2);
          if (nodeRight) tl.to(nodeRight, { autoAlpha: 1, x: 0, scale: 1, duration: 0.6, ease: "power2.out" }, 0.3);
          if (nodeBl) tl.to(nodeBl, { autoAlpha: 1, y: 0, scale: 1, duration: 0.6, ease: "power2.out" }, 0.35);

          // Divider then heading then body
          tl.to(divider, { autoAlpha: 1, y: 0, duration: 0.4, ease: "power2.out" }, 0.4);
          tl.to(heading, { autoAlpha: 1, y: 0, duration: 0.65, ease: "power2.out" }, 0.5);
          tl.to(body, { autoAlpha: 1, y: 0, duration: 0.65, ease: "power2.out" }, 0.7);
        },
      });
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={pinRef} className="relative min-h-screen md:h-screen flex flex-col overflow-hidden py-16 md:py-0">
      <div className="absolute inset-0 bg-gradient-section" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-orange-500/5 blur-3xl pointer-events-none" />

      <FloatingNodes />

      {/* Heading + body — vertically centered in remaining space */}
      <div className="relative z-10 flex-1 flex items-center justify-center">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <div className="ii-divider w-12 h-px bg-orange-500/40 mx-auto mb-8" />
          <h2 className="ii-heading font-heading font-bold text-3xl sm:text-4xl lg:text-5xl text-dark-50 mb-6 leading-tight">
            <span className="text-orange-500">High-Performance Insurance CRM &amp; Brokerage Management</span>
          </h2>
          <p className="ii-body text-lg sm:text-xl text-white max-w-3xl mx-auto leading-relaxed">
            <span className="text-orange-500">Qall</span> unifies your data, automates financials, and delivers the intelligence your advisors need — all in one platform.
          </p>
        </div>
      </div>
    </div>
  );
}
