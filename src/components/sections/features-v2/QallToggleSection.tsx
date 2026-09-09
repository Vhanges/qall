"use client";

import { useState, useRef, useEffect } from "react";
import { gsap } from "@/lib/gsap-config";
import { COMPARISON_ROWS_V2 } from "@/lib/constants-v2";

export function QallToggleSection() {
  const [isOn, setIsOn] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);
  const prevOn = useRef(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      gsap.from(section.querySelector(".toggle-heading"), {
        autoAlpha: 0,
        y: 20,
        duration: 0.6,
        ease: "power2.out",
        scrollTrigger: { trigger: section, start: "top 80%", once: true },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (isOn && !prevOn.current) {
      // Toggle ON — stagger rows one by one
      rowRefs.current.forEach((row, i) => {
        if (!row) return;
        const qallTexts = row.querySelectorAll<HTMLElement>(".qall-text");
        const standardTexts = row.querySelectorAll<HTMLElement>(".standard-text");
        const featureLabels = row.querySelectorAll<HTMLElement>(".feature-label");
        const delay = i * 0.3;

        gsap.to(row, {
          borderColor: "rgba(248,140,0,0.6)",
          backgroundColor: "rgba(248,140,0,1)",
          duration: 0.4,
          delay,
          ease: "power2.out",
        });

        featureLabels.forEach((el) => {
          gsap.to(el, { color: "#ffffff", duration: 0.4, delay, ease: "power2.out" });
        });

        qallTexts.forEach((el) => {
          gsap.fromTo(el,
            { autoAlpha: 0, x: 10, color: "#ffffff" },
            { autoAlpha: 1, x: 0, color: "#ffffff", duration: 0.4, delay: delay + 0.1, ease: "power2.out" }
          );
        });

        standardTexts.forEach((el) => {
          gsap.to(el, { color: "rgba(255,255,255,0.6)", textDecoration: "line-through", duration: 0.3, delay, ease: "power2.out" });
        });
      });
    } else if (!isOn && prevOn.current) {
      // Toggle OFF — all rows reset simultaneously
      rowRefs.current.forEach((row) => {
        if (!row) return;
        const qallTexts = row.querySelectorAll<HTMLElement>(".qall-text");
        const standardTexts = row.querySelectorAll<HTMLElement>(".standard-text");
        const featureLabels = row.querySelectorAll<HTMLElement>(".feature-label");

        gsap.to(row, {
          borderColor: "rgba(55,65,81,0.5)",
          backgroundColor: "rgba(17,24,39,0.4)",
          duration: 0.4,
          ease: "power2.out",
        });

        featureLabels.forEach((el) => {
          gsap.to(el, { clearProps: "color", duration: 0.4, ease: "power2.out" });
        });

        qallTexts.forEach((el) => {
          gsap.to(el, { autoAlpha: 0, duration: 0.3, ease: "power2.out" });
        });

        standardTexts.forEach((el) => {
          gsap.to(el, { clearProps: "color,textDecoration", duration: 0.3, ease: "power2.out" });
        });
      });
    }
    prevOn.current = isOn;
  }, [isOn]);

  return (
    <section
      ref={sectionRef}
      className="snap-section relative h-screen flex items-center overflow-hidden"
      style={{ background: "linear-gradient(180deg, #0A0E17 0%, #0d1e35 50%, #0d2240 100%)" }}
    >
      <div className="relative mx-auto max-w-5xl px-6 w-full">
        {/* Heading */}
        <div className="toggle-heading text-center mb-8">
          <h2 className="font-heading font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-dark-50 leading-tight mb-3">
            Standard CRM vs. <span className="text-orange-500">Qall</span>
          </h2>
          <p className="text-sm md:text-base text-white max-w-2xl mx-auto">
            Advantages to both Management view and Advisor view
          </p>
        </div>

        {/* Toggle */}
        <div className="flex justify-center mb-8">
          <button
            onClick={() => setIsOn((v) => !v)}
            className="group relative flex items-center gap-4 select-none"
          >
            <div
              className={`relative w-20 h-10 rounded-full transition-colors duration-300 ${
                isOn
                  ? "bg-orange-500 shadow-[0_0_24px_rgba(248,140,0,0.4)]"
                  : "bg-dark-700"
              }`}
            >
              <div
                className={`absolute top-1 w-8 h-8 rounded-full bg-white shadow-md transition-all duration-300 ${
                  isOn ? "left-11" : "left-1"
                }`}
              />
            </div>
            <span
              className={`font-heading font-bold text-sm tracking-widest uppercase transition-colors duration-300 ${
                isOn ? "text-orange-500" : "text-white"
              }`}
            >
              {isOn ? "Qall On" : "Qall off"}
            </span>
          </button>
        </div>

        {/* Column headers — desktop only */}
        <div className="hidden sm:grid grid-cols-12 gap-4 mb-4 px-2">
          <div className="col-span-3">
            <span className="text-xs font-medium uppercase tracking-wider text-white">
              Feature
            </span>
          </div>
          <div className="col-span-4">
            <span className="text-xs font-medium uppercase tracking-wider text-white">
              Standard CRM
            </span>
          </div>
          <div className="col-span-5">
            <span
              className={`text-xs font-medium uppercase tracking-wider transition-colors duration-300 ${
                isOn ? "text-orange-500" : "text-white"
              }`}
            >
              The Qall Advantage
            </span>
          </div>
        </div>

        {/* Rows */}
        <div className="space-y-2">
          {COMPARISON_ROWS_V2.map((row, i) => (
            <div
              key={row.label}
              ref={(el) => { rowRefs.current[i] = el; }}
              className="rounded-lg sm:rounded-xl border border-dark-700/50 bg-dark-900/40 px-3 sm:px-5 py-2 sm:py-3"
            >
              {/* Desktop: 3 columns — text wraps to fit, uniform row height */}
              <div className="hidden sm:grid grid-cols-12 gap-4 items-start min-h-[40px]">
                <div className="col-span-3">
                  <span className="feature-label font-heading font-bold text-xs md:text-sm text-dark-50">
                    {row.label}
                  </span>
                </div>
                <div className="col-span-4">
                  <p className="standard-text text-xs md:text-sm text-white">
                    {row.standard}
                  </p>
                </div>
                <div className="col-span-5 min-h-[20px]">
                  <p className="qall-text text-xs md:text-sm font-semibold opacity-0">
                    {row.qall}
                  </p>
                </div>
              </div>

              {/* Mobile: inline labels on the left for each field */}
              <div className="sm:hidden space-y-1">
                <div className="flex gap-2">
                  <span className="text-[9px] uppercase tracking-wider text-white/50 w-20 shrink-0 pt-px">Feature</span>
                  <span className="feature-label font-heading font-bold text-[11px] text-dark-50 leading-tight">{row.label}</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-[9px] uppercase tracking-wider text-white/50 w-20 shrink-0 pt-px">Standard</span>
                  <p className="standard-text text-[10px] text-white leading-tight">{row.standard}</p>
                </div>
                <div className="flex gap-2">
                  <span className="text-[9px] uppercase tracking-wider text-white/50 w-20 shrink-0 pt-px">Qall</span>
                  <p className="qall-text text-[10px] font-semibold leading-tight opacity-0">{row.qall}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
