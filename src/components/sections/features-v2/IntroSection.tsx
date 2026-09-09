"use client";

import { useRef, useEffect } from "react";
import { gsap } from "@/lib/gsap-config";

export function IntroSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const heading = section.querySelector<HTMLElement>(".intro-heading");
    const subtitle = section.querySelector<HTMLElement>(".intro-subtitle");

    const ctx = gsap.context(() => {
      gsap.set([heading, subtitle], { autoAlpha: 0 });

      // Heading fades in place
      gsap.to(heading, {
        autoAlpha: 1,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: section,
          start: "top 75%",
          once: true,
        },
      });

      // Subtitle follows
      gsap.to(subtitle, {
        autoAlpha: 1,
        duration: 0.8,
        delay: 0.3,
        ease: "power2.out",
        scrollTrigger: {
          trigger: section,
          start: "top 75%",
          once: true,
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative z-[45] py-24 lg:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-dark" />

      <div className="relative mx-auto max-w-4xl px-6 text-center">
        <h2 className="intro-heading font-heading font-bold text-3xl sm:text-4xl lg:text-5xl text-dark-50 leading-tight">
          Standard CRM vs. Qall Infrastructure
        </h2>

        <p className="intro-subtitle mt-6 text-lg lg:text-xl text-white leading-relaxed max-w-3xl mx-auto">
          Compare the speed of a unified central nervous system against the
          &ldquo;Search Tax&rdquo; of fragmented legacy tools.
        </p>
      </div>
    </section>
  );
}
