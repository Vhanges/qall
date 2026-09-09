"use client";

import { useRef, useEffect } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap-config";

/* ─── Floating UI Mockup Elements ─── */
function FloatingDashboardCard() {
  return (
    <div className="w-[200px] rounded-xl overflow-hidden shadow-2xl shadow-black/40 border border-white/10 bg-gradient-to-br from-[#141927] to-[#0c1019]">
      <div className="p-3">
        <div className="flex items-center gap-2 mb-2.5">
          <div className="w-2 h-2 rounded-full bg-green-500 text-green-500 animate-glow-pulse" />
          <span className="text-[9px] text-white uppercase tracking-wider">Live Revenue</span>
        </div>
        <div className="text-lg font-bold text-orange-500 mb-1">£76.4k</div>
        <div className="flex items-center gap-1 mb-3">
          <svg width="10" height="10" viewBox="0 0 16 16" fill="none"><path d="M8 12V4M8 4L4 8M8 4L12 8" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" /></svg>
          <span className="text-[9px] text-green-400">+32% vs last month</span>
        </div>
        <div className="flex items-end gap-0.5 h-8">
          {[40, 55, 45, 65, 60, 80, 75, 90, 85, 95, 88, 100].map((h, i) => (
            <div key={i} className="flex-1 rounded-t-sm bg-gradient-to-t from-orange-600 to-orange-400/70 animate-bar-grow" style={{ height: `${h}%`, animationDelay: `${i * 0.05}s` }} />
          ))}
        </div>
      </div>
    </div>
  );
}

function FloatingNotificationCard() {
  return (
    <div className="w-[190px] rounded-xl shadow-2xl shadow-black/40 border border-white/10 bg-gradient-to-br from-[#141927] to-[#0c1019] p-3">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-6 h-6 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-500 animate-glow-pulse">
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M8 1L10 6H15L11 9L12.5 14L8 11L3.5 14L5 9L1 6H6L8 1Z" fill="#F88C00" /></svg>
        </div>
        <span className="text-[9px] text-white uppercase tracking-wider">AI Insight</span>
      </div>
      <p className="text-[10px] text-white leading-relaxed">
        3 policies <span className="text-orange-500">flagged for renewal in the next 14 days</span> — estimated £12.4k in commission.
      </p>
      <div className="mt-2 flex gap-1.5">
        <div className="px-2 py-0.5 rounded text-[8px] bg-orange-500/10 text-orange-500 border border-orange-500/20">View</div>
        <div className="px-2 py-0.5 rounded text-[8px] bg-white/5 text-white border border-white/10">Dismiss</div>
      </div>
    </div>
  );
}

function FloatingComplianceBadge() {
  return (
    <div className="w-[160px] rounded-xl shadow-2xl shadow-black/40 border border-white/10 bg-gradient-to-br from-[#141927] to-[#0c1019] p-3">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-green-500/15 flex items-center justify-center border border-green-500/20 animate-ring-fill">
          <svg className="animate-check-draw" width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M3 8L7 12L13 4" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </div>
        <div>
          <div className="text-[10px] font-semibold text-dark-200">Compliance</div>
          <div className="text-[9px] text-green-400">100% Verified</div>
        </div>
      </div>
    </div>
  );
}

/**
 * Fixed overlay — 3 floating cards that start overlaying the CRM dashboard,
 * then break away and spread outward as user scrolls. Desktop only.
 */
export function HeroFloatingCards() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const dashRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const compRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined" || window.innerWidth < 1024) return;

    const wrap = wrapRef.current;
    const dash = dashRef.current;
    const notif = notifRef.current;
    const comp = compRef.current;
    if (!wrap || !dash || !notif || !comp) return;

    const vw = window.innerWidth;
    const vh = window.innerHeight;

    // Final spread positions
    const dashEnd = { x: vw * 0.04, y: vh * 0.28 };
    const notifEnd = { x: vw - 190 - vw * 0.04, y: vh * 0.22 };
    const compEnd = { x: vw - 160 - vw * 0.10, y: vh * 0.72 };

    // Mutable start positions — captured in onEnter when dashboard is in viewport
    let dashStart = { x: 0, y: 0, scale: 0.9 };
    let notifStart = { x: 0, y: 0, scale: 0.85 };
    let compStart = { x: 0, y: 0, scale: 0.8 };
    let started = false;

    gsap.set(wrap, { autoAlpha: 0 });

    const ctx = gsap.context(() => {
      const heroEl = document.querySelector<HTMLElement>("[data-hero-section]");
      if (!heroEl) return;

      // --- BREAK AWAY ---
      ScrollTrigger.create({
        trigger: heroEl,
        start: "30% top",   // begins when dashboard is on screen
        end: "bottom -20%",
        scrub: 0.5,

        onEnter() {
          if (started) return;
          started = true;

          // Capture positions NOW — dashboard elements are in the viewport
          const revenueEl = document.querySelector<HTMLElement>("[data-dashboard-revenue]");
          const activityEl = document.querySelector<HTMLElement>("[data-dashboard-activity]");
          const retentionEl = document.querySelector<HTMLElement>("[data-dashboard-retention]");

          const rr = revenueEl?.getBoundingClientRect();
          const ar = activityEl?.getBoundingClientRect();
          const cr = retentionEl?.getBoundingClientRect();

          dashStart = {
            x: rr ? rr.left : vw * 0.25,
            y: rr ? rr.top : vh * 0.6,
            scale: rr ? Math.min(rr.width / 200, rr.height / 120) : 0.9,
          };
          notifStart = {
            x: ar ? ar.left : vw * 0.7,
            y: ar ? ar.top : vh * 0.6,
            scale: ar ? Math.min(ar.width / 190, ar.height / 130) : 0.85,
          };
          compStart = {
            x: cr ? cr.left : vw * 0.5,
            y: cr ? cr.top : vh * 0.4,
            scale: cr ? Math.min(cr.width / 160, cr.height / 50) : 0.8,
          };

          // Snap cards onto dashboard elements, then reveal instantly
          gsap.set(dash, { x: dashStart.x, y: dashStart.y, scale: dashStart.scale, rotateY: 0, rotateX: 0 });
          gsap.set(notif, { x: notifStart.x, y: notifStart.y, scale: notifStart.scale, rotateY: 0, rotateX: 0 });
          gsap.set(comp, { x: compStart.x, y: compStart.y, scale: compStart.scale, rotateY: 0, rotateX: 0 });
          gsap.set(wrap, { autoAlpha: 1 });
          wrap.classList.add("animate-active");
        },

        onUpdate(self) {
          if (!started) return;
          const p = self.progress;
          const ep = 1 - Math.pow(1 - p, 2);

          gsap.set(dash, {
            x: gsap.utils.interpolate(dashStart.x, dashEnd.x, ep),
            y: gsap.utils.interpolate(dashStart.y, dashEnd.y, ep),
            scale: gsap.utils.interpolate(dashStart.scale, 1, ep),
            rotateY: gsap.utils.interpolate(0, 8, ep),
            rotateX: gsap.utils.interpolate(0, -3, ep),
          });
          gsap.set(notif, {
            x: gsap.utils.interpolate(notifStart.x, notifEnd.x, ep),
            y: gsap.utils.interpolate(notifStart.y, notifEnd.y, ep),
            scale: gsap.utils.interpolate(notifStart.scale, 1, ep),
            rotateY: gsap.utils.interpolate(0, -8, ep),
            rotateX: gsap.utils.interpolate(0, -3, ep),
          });
          gsap.set(comp, {
            x: gsap.utils.interpolate(compStart.x, compEnd.x, ep),
            y: gsap.utils.interpolate(compStart.y, compEnd.y, ep),
            scale: gsap.utils.interpolate(compStart.scale, 1, ep),
            rotateY: gsap.utils.interpolate(0, -5, ep),
            rotateX: gsap.utils.interpolate(0, 4, ep),
          });
        },

        onLeaveBack() {
          // Fade out when user scrolls back above the trigger
          gsap.to(wrap, { autoAlpha: 0, duration: 0.4, ease: "power2.in" });
          wrap.classList.remove("animate-active");
          started = false; // reset so onEnter re-captures positions on next scroll-down
        },
      });

      // --- MERGE into FeatureShowcase ---
      const featureEl = document.querySelector<HTMLElement>("[data-feature-showcase]");
      if (featureEl) {
        const maxW = Math.min(vw - 48, 1280);
        const containerLeft = (vw - maxW) / 2;
        const targetX = containerLeft + maxW * 0.52;
        const targetY = vh * 0.5;

        ScrollTrigger.create({
          trigger: featureEl,
          start: "top bottom",
          end: "top top",
          scrub: 0.5,
          onUpdate(self) {
            const p = self.progress;
            const ep = p * p;

            gsap.set(dash, {
              x: gsap.utils.interpolate(dashEnd.x, targetX, ep),
              y: gsap.utils.interpolate(dashEnd.y, targetY, ep),
              scale: gsap.utils.interpolate(1, 0.6, ep),
              opacity: p < 0.85 ? 1 : Math.max(0, (1 - p) / 0.15),
              rotateY: gsap.utils.interpolate(8, 0, ep),
              rotateX: gsap.utils.interpolate(-3, 0, ep),
            });
            gsap.set(notif, {
              x: gsap.utils.interpolate(notifEnd.x, targetX + 40, ep),
              y: gsap.utils.interpolate(notifEnd.y, targetY, ep),
              scale: gsap.utils.interpolate(1, 0.5, ep),
              opacity: p < 0.7 ? 1 : Math.max(0, (0.9 - p) / 0.2),
              rotateY: gsap.utils.interpolate(-8, 0, ep),
              rotateX: gsap.utils.interpolate(-3, 0, ep),
            });
            gsap.set(comp, {
              x: gsap.utils.interpolate(compEnd.x, targetX + 20, ep),
              y: gsap.utils.interpolate(compEnd.y, targetY, ep),
              scale: gsap.utils.interpolate(1, 0.5, ep),
              opacity: p < 0.7 ? 1 : Math.max(0, (0.9 - p) / 0.2),
              rotateY: gsap.utils.interpolate(-5, 0, ep),
              rotateX: gsap.utils.interpolate(4, 0, ep),
            });
          },
          onLeave() { gsap.set(wrap, { autoAlpha: 0 }); },
          onEnterBack() { gsap.set(wrap, { autoAlpha: 1 }); },
        });
      }
    });

    return () => ctx.revert();
  }, []);

  return (
    <div ref={wrapRef} className="fixed inset-0 pointer-events-none z-[43] hidden lg:block">
      <div
        ref={dashRef}
        className="absolute top-0 left-0 will-change-transform"
        style={{ perspective: "800px", transformStyle: "preserve-3d" }}
      >
        <FloatingDashboardCard />
      </div>
      <div
        ref={notifRef}
        className="absolute top-0 left-0 will-change-transform"
        style={{ perspective: "800px", transformStyle: "preserve-3d" }}
      >
        <FloatingNotificationCard />
      </div>
      <div
        ref={compRef}
        className="absolute top-0 left-0 will-change-transform"
        style={{ perspective: "800px", transformStyle: "preserve-3d" }}
      >
        <FloatingComplianceBadge />
      </div>
    </div>
  );
}
