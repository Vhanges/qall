"use client";

import { useRef, useEffect } from "react";
import { gsap } from "@/lib/gsap-config";
import { MagneticButton } from "@/components/animation/MagneticButton";
import { GradientOrb } from "@/components/animation/GradientOrb";
import { GridPattern } from "@/components/animation/GridPattern";
import { ParallaxLayer } from "@/components/animation/ParallaxLayer";
import { Button } from "@/components/ui/Button";
import { HERO_V2 } from "@/lib/constants-home-v2";

export function HeroSectionV2() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!headingRef.current || !subtitleRef.current || !ctaRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        headingRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.7, delay: 0.2, ease: "power3.out" }
      );
      gsap.fromTo(
        subtitleRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.7, delay: 0.45, ease: "power3.out" }
      );
      gsap.fromTo(
        ctaRef.current,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.7, delay: 0.65, ease: "power3.out" }
      );

    });

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      data-hero-section
      className="relative z-[41] flex flex-col pb-0 overflow-visible"
    >
      {/* Dark background */}
      <div className="absolute inset-0 bg-dark-900" />

      <GridPattern />

      {/* Decorative orbs */}
      <ParallaxLayer speed={-0.3}>
        <GradientOrb color="blue" size={600} className="-top-40 -right-40 opacity-30" />
      </ParallaxLayer>
      <ParallaxLayer speed={0.2}>
        <GradientOrb color="orange" size={400} className="bottom-20 -left-40 opacity-20" />
      </ParallaxLayer>

      {/* Radial center glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-blue-800/10 blur-3xl pointer-events-none" />

      {/* Text content */}
      <div ref={contentRef} className="relative z-10 mx-auto max-w-4xl px-6 text-center pt-20 sm:pt-24 lg:pt-28 pb-2">
        {/* Headline with orange "Better Qall" */}
        <h1
          ref={headingRef}
          className="font-heading font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-dark-50 leading-[1.1] tracking-tight opacity-0"
        >
          The Future of Insurance Distribution is a{" "}
          <span className="text-orange-500">Better Qall.</span>
        </h1>

        {/* Subtitle */}
        <p
          ref={subtitleRef}
          className="mt-5 text-lg sm:text-xl text-white max-w-2xl mx-auto leading-relaxed opacity-0"
        >
          The premier insurance-specific CRM engineered to automate complex financials, track revenue in real-time, and maximize advisor capacity for high-growth brokerages.
        </p>

        {/* CTAs */}
        <div ref={ctaRef} className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 opacity-0">
          <MagneticButton>
            <Button href={HERO_V2.primaryCTA.href} size="lg">
              {HERO_V2.primaryCTA.text}
            </Button>
          </MagneticButton>
          <Button href={HERO_V2.secondaryCTA.href} variant="secondary" size="lg" className="!text-orange-500 !border-orange-500/30 hover:!bg-orange-500/10">
            {HERO_V2.secondaryCTA.text}
          </Button>
        </div>

        {/* CTA sub-text */}
        <p className="mt-4 text-sm text-white opacity-0 animate-[fadeIn_0.6s_ease-out_1.1s_forwards]">
          {HERO_V2.ctaSubtext}
        </p>
      </div>
    </section>
  );
}
