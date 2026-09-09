"use client";

import React, { useRef, useEffect } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap-config";
import { Button } from "@/components/ui/Button";
import { ConclusionSection } from "@/components/sections/features-v2/ViewFeaturesSection";

const FOUNDATIONS: { number: string; title: string; description: React.ReactNode }[] = [
  {
    number: "01",
    title: "A Decade of Domain Authority",
    description: <>Our framework is designed by veterans who understand the structural strength required for high-volume distribution. <span className="text-orange-500">We don&rsquo;t just write code; we ensure it meets insurance compliance, premium accuracy, and long-term stability.</span></>,
  },
  {
    number: "02",
    title: "Ongoing Platform Evolution",
    description: <>A static system is a liability. Qall is always evolving, incorporating the latest AI-driven lead generation and financial insights. <span className="text-orange-500">We make sure your system stays ahead of global market changes.</span></>,
  },
  {
    number: "03",
    title: "Customization for Infinite Scale",
    description: <>Growth cannot be mass-produced. We reject &ldquo;one-size-fits-all&rdquo; software, instead tailoring the Qall infrastructure to your unique operational flow. <span className="text-orange-500">We fine-tune the system to eliminate your unique pain points and speed up your growth.</span></>,
  },
  {
    number: "04",
    title: "Dedicated Performance Support",
    description: <>Precision technology needs expert guidance. Every partnership includes a Dedicated Qall Specialist to enhance your workflows and handle your technical needs. <span className="text-orange-500">We don&rsquo;t just give you access; we help you master the system.</span></>,
  },
];

const CTA_BADGES = [
  "10+ Years of Expertise",
  "Ongoing Innovation",
  "Dedicated Human Support",
];

export function WhyContent() {
  const introRef = useRef<HTMLDivElement>(null);
  const foundationsRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Intro section animation
      if (introRef.current) {
        const heading = introRef.current.querySelector(".intro-heading");
        const body = introRef.current.querySelector(".intro-body");

        if (heading) {
          gsap.fromTo(heading,
            { autoAlpha: 0, y: 30 },
            {
              autoAlpha: 1, y: 0, duration: 0.7, ease: "power2.out",
              scrollTrigger: { trigger: heading, start: "top 85%", once: true },
            }
          );
        }
        if (body) {
          gsap.fromTo(body,
            { autoAlpha: 0, y: 20 },
            {
              autoAlpha: 1, y: 0, duration: 0.7, ease: "power2.out",
              scrollTrigger: { trigger: body, start: "top 85%", once: true },
            }
          );
        }
      }

      // Foundations section animation
      if (foundationsRef.current) {
        const heading = foundationsRef.current.querySelector(".foundations-heading");
        const cards = foundationsRef.current.querySelectorAll(".foundation-card");

        if (heading) {
          gsap.fromTo(heading,
            { autoAlpha: 0, y: 30 },
            {
              autoAlpha: 1, y: 0, duration: 0.7, ease: "power2.out",
              scrollTrigger: { trigger: heading, start: "top 85%", once: true },
            }
          );
        }

        cards.forEach((card, i) => {
          gsap.fromTo(card,
            { autoAlpha: 0, y: 30, scale: 0.95 },
            {
              autoAlpha: 1, y: 0, scale: 1, duration: 0.5, ease: "power2.out",
              scrollTrigger: { trigger: card, start: "top 90%", once: true },
              delay: i * 0.1,
            }
          );
        });
      }
    });

    return () => ctx.revert();
  }, []);

  return (
    <>
      {/* ─── Intro section ─── */}
      <section
        className="relative pt-24 md:pt-32 pb-24 md:pb-32"
        style={{ background: "linear-gradient(180deg, #0A0E17 0%, #0d1e35 50%, #0d2240 100%)" }}
      >
        <div ref={introRef} className="mx-auto max-w-3xl px-6 text-center">
          <div className="intro-heading" style={{ opacity: 0, visibility: "hidden" }}>
            <h2 className="font-heading font-bold text-2xl md:text-3xl lg:text-4xl text-dark-50 leading-tight mb-8">
              The Infrastructure of <span className="text-orange-500">Modern Insurance Distribution.</span>
            </h2>
          </div>
          <div className="intro-body" style={{ opacity: 0, visibility: "hidden" }}>
            <p className="text-base md:text-lg text-white leading-relaxed mb-6">
              <span className="font-semibold">Qall</span> is a high-performance engine built from over 10 years of deep-sector insurance expertise. We have spent a decade identifying the structural obstacles that limit agency potential, and <span className="text-orange-500 font-semibold">we created the solution.</span>
            </p>
            <p className="text-base md:text-lg text-white leading-relaxed">
              We provide the future-ready brokerage infrastructure required to transform fragmented data into a unified, scalable powerhouse. By eliminating the &ldquo;Search Tax&rdquo; and automating insurance workflows, we empower your firm to move beyond administrative maintenance and into <span className="text-orange-500 font-semibold">total market mastery.</span>
            </p>
          </div>
        </div>
      </section>

      {/* ─── Four Foundations ─── */}
      <section
        className="relative py-24 md:py-32"
        style={{ backgroundColor: "#0d2240" }}
      >
        <div ref={foundationsRef} className="mx-auto max-w-5xl px-6">
          <div className="foundations-heading text-center mb-12" style={{ opacity: 0, visibility: "hidden" }}>
            <h2 className="font-heading font-bold text-2xl md:text-3xl lg:text-4xl text-dark-50 leading-tight">
              The Four Foundations of the <span className="text-orange-500">Qall Partnership</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-4xl mx-auto">
            {FOUNDATIONS.map((f) => (
              <div
                key={f.number}
                className="foundation-card rounded-xl border border-dark-700/50 bg-dark-900/60 p-6 md:p-8"
                style={{ opacity: 0, visibility: "hidden" }}
              >
                <span className="inline-block text-xs font-medium text-orange-500 bg-orange-500/10 px-2.5 py-1 rounded-full mb-4">
                  {f.number}
                </span>
                <h3 className="font-heading font-bold text-lg text-orange-500 mb-3">
                  {f.title}
                </h3>
                <p className="text-sm text-white leading-relaxed">
                  {f.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ConclusionSection />

      {/* ─── Closing CTA — orange background ─── */}
      <section ref={ctaRef} className="relative py-24 overflow-hidden bg-gradient-to-br from-orange-500 via-orange-500 to-orange-600">
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: "radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }} />

        <div className="relative mx-auto max-w-3xl px-6 text-center">
          <h2 className="font-heading font-bold text-2xl md:text-3xl lg:text-4xl text-white leading-tight mb-6">
            The Mastery Gate: Your Next Phase of Growth
          </h2>
          <p className="text-base md:text-lg text-white leading-relaxed mb-10">
            Choosing <span className="font-bold text-blue-900">Qall</span> is a commitment to operational excellence. It is the choice to move from &ldquo;Data Management&rdquo; to &ldquo;Market Mastery&rdquo; and entering a space of complete clarity and unlimited potential.
          </p>

          <Button href="/contact#booking" size="lg" variant="secondary" className="!bg-blue-900 !text-white !border-blue-900 hover:!bg-blue-800 font-semibold shadow-lg shadow-black/20">
            Partner with Qall
          </Button>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-6">
            {CTA_BADGES.map((badge) => (
              <span
                key={badge}
                className="inline-flex items-center gap-2 text-sm font-semibold text-white"
              >
                <span className="w-2 h-2 rounded-full bg-white/40" />
                {badge}
              </span>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
