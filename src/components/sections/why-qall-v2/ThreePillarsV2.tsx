"use client";

import { useRef, useEffect } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap-config";
import { PILLARS_V2 } from "@/lib/constants-why-v2";
import { highlightQall } from "@/lib/highlight-qall";

/* ─── Title Screen ─── */
function PillarTitle() {
  const pinRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = pinRef.current;
    if (!el) return;

    const heading = el.querySelector<HTMLElement>(".pt-heading");

    gsap.set(heading, { autoAlpha: 0, y: 30 });

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: "+=100%",
          pin: true,
          scrub: 0.5,
          anticipatePin: 1,
        },
      });

      tl.to(heading, { autoAlpha: 1, y: 0, duration: 2, ease: "power2.out" }, 0);
      // Hold until unpin
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={pinRef} className="h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-dark" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-[120px] opacity-[0.05] bg-orange-500 pointer-events-none" />

      <div className="relative mx-auto max-w-4xl px-6 text-center">
        <h2 className="pt-heading font-heading font-bold text-3xl sm:text-4xl lg:text-5xl text-dark-50 leading-tight">
          {highlightQall(PILLARS_V2.heading)}
        </h2>
      </div>
    </div>
  );
}

/* ─── Icon Map ─── */
const iconMap: Record<string, React.ReactNode> = {
  rocket: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
      <path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
      <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
      <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
    </svg>
  ),
  target: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" />
    </svg>
  ),
  trending: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  ),
};

/* ─── Single Pillar Screen ─── */
interface PillarScreenProps {
  pillar: (typeof PILLARS_V2.items)[number];
}

function splitSentences(text: string): string[] {
  // Split on ". " and re-add the period to each fragment except the last
  const parts = text.split(". ");
  return parts.map((s, i) => (i < parts.length - 1 ? s + "." : s));
}

function PillarScreen({ pillar }: PillarScreenProps) {
  const pinRef = useRef<HTMLDivElement>(null);

  const sentences = splitSentences(pillar.description);

  useEffect(() => {
    const el = pinRef.current;
    if (!el) return;

    const icon = el.querySelector<HTMLElement>(".ps-icon");
    const number = el.querySelector<HTMLElement>(".ps-number");
    const title = el.querySelector<HTMLElement>(".ps-title");
    const sentenceEls = el.querySelectorAll<HTMLElement>(".ps-sentence");
    const stat = el.querySelector<HTMLElement>(".ps-stat");

    gsap.set([icon, number, title], { autoAlpha: 0, y: 20 });
    gsap.set(sentenceEls, { autoAlpha: 0, y: 20 });
    gsap.set(stat, { autoAlpha: 0, scale: 0.8 });

    const ctx = gsap.context(() => {
      // More scroll distance for 3 sentences + title + stat + hold
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: "+=250%",
          pin: true,
          scrub: 0.5,
          anticipatePin: 1,
        },
      });

      /* ── Phase 1: Icon + number + title ── */
      tl.to(icon, { autoAlpha: 1, y: 0, duration: 1, ease: "power2.out" }, 0);
      tl.to(number, { autoAlpha: 1, y: 0, duration: 1, ease: "power2.out" }, 0.3);
      tl.to(title, { autoAlpha: 1, y: 0, duration: 1.5, ease: "power2.out" }, 0.5);

      /* ── Phase 2+: Each sentence appears ── */
      sentenceEls.forEach((sentenceEl, i) => {
        const startTime = 2.5 + i * 2.5;
        tl.to(sentenceEl, {
          autoAlpha: 1,
          y: 0,
          duration: 1.5,
          ease: "power2.out",
        }, startTime);
      });

      /* ── Final: Stat badge pops in ── */
      const statTime = 2.5 + sentences.length * 2.5;
      tl.to(stat, {
        autoAlpha: 1,
        scale: 1,
        duration: 1,
        ease: "back.out(2)",
      }, statTime);

      // Hold until unpin
    }, el);

    return () => ctx.revert();
  }, [pillar, sentences.length]);

  return (
    <div ref={pinRef} className="h-screen flex items-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-dark" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[150px] opacity-[0.04] bg-orange-500 pointer-events-none" />

      <div className="relative mx-auto max-w-3xl px-6">
        {/* Icon */}
        <div className="ps-icon w-14 h-14 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-500 mb-6">
          {iconMap[pillar.icon]}
        </div>

        {/* Number */}
        <span className="ps-number inline-block text-sm font-bold text-orange-500/50 mb-2">
          {pillar.number}
        </span>

        {/* Title */}
        <h3 className="ps-title font-heading font-bold text-2xl sm:text-3xl lg:text-4xl text-dark-50 leading-tight mb-8">
          {pillar.title}
        </h3>

        {/* Sentences — each revealed individually */}
        <div className="space-y-4">
          {sentences.map((sentence, i) => (
            <p
              key={i}
              className="ps-sentence text-base sm:text-lg text-white leading-relaxed"
            >
              {highlightQall(sentence)}
            </p>
          ))}
        </div>

        {/* Stat badge */}
        <div className="ps-stat mt-8">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-500 text-sm font-semibold">
            {pillar.stat}
          </span>
        </div>
      </div>
    </div>
  );
}

/* ─── Main Export ─── */
export function ThreePillarsV2() {
  return (
    <section>
      <PillarTitle />
      {PILLARS_V2.items.map((pillar) => (
        <PillarScreen key={pillar.title} pillar={pillar} />
      ))}
    </section>
  );
}
