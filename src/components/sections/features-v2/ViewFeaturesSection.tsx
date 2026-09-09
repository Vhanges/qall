"use client";

import { useRef, useEffect } from "react";
import { gsap } from "@/lib/gsap-config";
import {
  MANAGEMENT_FEATURES,
  ADVISOR_FEATURES,
  CONCLUSION_MANAGEMENT,
  CONCLUSION_ADVISOR,
} from "@/lib/constants-v2";

/* ═══════════════════════════════════════════
   Card-grid feature section (foundations style)
   ═══════════════════════════════════════════ */

function CardFeaturesSection({
  features,
  label,
  accentColor,
}: {
  features: { title: string; description: string }[];
  label: string;
  accentColor: "orange" | "blue";
}) {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      const heading = el.querySelector(".section-heading");
      if (heading) {
        gsap.from(heading, {
          autoAlpha: 0,
          y: 24,
          duration: 0.6,
          ease: "power2.out",
          scrollTrigger: { trigger: heading, start: "top 88%", once: true },
        });
      }
      el.querySelectorAll<HTMLElement>(".feature-card").forEach((card, i) => {
        gsap.from(card, {
          autoAlpha: 0,
          y: 24,
          duration: 0.6,
          delay: i * 0.1,
          ease: "power2.out",
          scrollTrigger: { trigger: card, start: "top 88%", once: true },
        });
      });
    }, el);
    return () => ctx.revert();
  }, []);

  const badgeCls =
    accentColor === "orange"
      ? "text-orange-500 bg-orange-500/10"
      : "text-orange-500 bg-orange-500/10";
  const accentCls =
    accentColor === "orange" ? "text-orange-500" : "text-orange-500";

  return (
    <section
      className="relative py-24 md:py-32"
      style={{ backgroundColor: "#0d2240" }}
    >
      <div ref={sectionRef} className="mx-auto max-w-5xl px-6">
        <div className="section-heading text-center mb-12">
          <h2 className="font-heading font-bold text-2xl md:text-3xl lg:text-4xl text-dark-50 leading-tight">
            <span className={accentCls}>{label}</span> Features
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-4xl mx-auto">
          {features.map((f, i) => (
            <div
              key={f.title}
              className="feature-card rounded-xl border border-dark-700/50 bg-dark-900/60 p-6 md:p-8"
            >
              <span
                className={`inline-block text-xs font-medium ${badgeCls} px-2.5 py-1 rounded-full mb-4`}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="font-heading font-bold text-lg text-orange-500 mb-3">
                {f.title}
              </h3>
              <p className="text-sm text-dark-50 leading-relaxed">
                {f.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   Exported sections
   ═══════════════════════════════════════════ */

export function ManagementViewSection() {
  return (
    <CardFeaturesSection
      features={MANAGEMENT_FEATURES}
      label="Management"
      accentColor="orange"
    />
  );
}

export function AdvisorViewSection() {
  return (
    <CardFeaturesSection
      features={ADVISOR_FEATURES}
      label="Advisor"
      accentColor="blue"
    />
  );
}

/* ═══════════════════════════════════════════
   Conclusion section
   ═══════════════════════════════════════════ */

const CONCLUSION_MGMT_ICONS = [
  <svg key="m0" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 7V4h16v3" /><path d="M9 20h6" /><path d="M12 4v16" /><rect x="2" y="7" width="20" height="6" rx="1" /></svg>,
  <svg key="m1" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>,
  <svg key="m2" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18" /><path d="m19 9-5 5-4-4-3 3" /></svg>,
  <svg key="m3" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" /><path d="m9 12 2 2 4-4" /></svg>,
  <svg key="m4" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /><path d="M11 8v6M8 11h6" /></svg>,
];

const CONCLUSION_ADV_ICONS = [
  <svg key="a0" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></svg>,
  <svg key="a1" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" /><path d="M16 2v4M8 2v4M3 10h18M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01" /></svg>,
  <svg key="a2" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92Z" /></svg>,
  <svg key="a3" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>,
  <svg key="a4" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8M12 17v4" /></svg>,
];

export function ConclusionSection() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      el.querySelectorAll<HTMLElement>(".fade-up").forEach((item) => {
        gsap.from(item, {
          autoAlpha: 0, y: 24, duration: 0.6, ease: "power2.out",
          scrollTrigger: { trigger: item, start: "top 88%", once: true },
        });
      });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={ref}
      className="snap-section min-h-screen flex items-center overflow-hidden"
      style={{ backgroundColor: "#0d2240" }}
    >
      <div className="mx-auto max-w-5xl px-6 py-20 w-full">
        <div className="fade-up text-center mb-12">
          <h3 className="font-heading font-bold text-2xl md:text-3xl lg:text-4xl text-dark-50">
            The <span className="text-orange-500">Qall Advantage</span> at a Glance
          </h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 max-w-4xl mx-auto">
          <div className="fade-up">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-2 h-2 rounded-full bg-orange-500" />
              <span className="font-heading font-bold text-sm uppercase tracking-wider text-orange-500">Management Benefits</span>
            </div>
            <div className="space-y-5">
              {CONCLUSION_MANAGEMENT.map((item, i) => (
                <ConclusionItem key={item.title} icon={CONCLUSION_MGMT_ICONS[i]} title={item.title} description={item.description} color="orange" />
              ))}
            </div>
          </div>

          <div className="fade-up">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-2 h-2 rounded-full bg-orange-500" />
              <span className="font-heading font-bold text-sm uppercase tracking-wider text-orange-500">Advisor Benefits</span>
            </div>
            <div className="space-y-5">
              {CONCLUSION_ADVISOR.map((item, i) => (
                <ConclusionItem key={item.title} icon={CONCLUSION_ADV_ICONS[i]} title={item.title} description={item.description} color="blue" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ConclusionItem({
  icon, title, description, color,
}: {
  icon: React.ReactNode; title: string; description: string; color: "orange" | "blue";
}) {
  return (
    <div className="flex gap-4 items-start">
      <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${
        color === "orange" ? "bg-orange-500/10 text-orange-500" : "bg-orange-500/10 text-orange-500"
      }`}>
        {icon}
      </div>
      <div>
        <h5 className="font-heading font-bold text-sm text-orange-500 mb-1">{title}</h5>
        <p className="text-xs text-dark-50 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}
