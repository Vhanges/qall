"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap-config";
import Image from "next/image";
import { GradientOrb } from "@/components/animation/GradientOrb";
import { GridPattern } from "@/components/animation/GridPattern";
import { MagneticButton } from "@/components/animation/MagneticButton";
import { Button } from "@/components/ui/Button";

function SuccessInner() {
  const searchParams = useSearchParams();
  const type = searchParams.get("type"); // "booking" or "contact"
  const isBooking = type === "booking";
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const icon = ref.current.querySelector<HTMLElement>(".sc-icon");
    const heading = ref.current.querySelector<HTMLElement>(".sc-heading");
    const lines = ref.current.querySelectorAll<HTMLElement>(".sc-line");
    const cta = ref.current.querySelector<HTMLElement>(".sc-cta");

    gsap.set([icon, heading, cta], { autoAlpha: 0, y: 20 });
    gsap.set(lines, { autoAlpha: 0, y: 15 });

    const tl = gsap.timeline({ delay: 0.2 });

    tl.to(icon, { autoAlpha: 1, y: 0, duration: 0.6, ease: "back.out(1.7)" }, 0);
    tl.to(heading, { autoAlpha: 1, y: 0, duration: 0.6, ease: "power2.out" }, 0.3);
    tl.to(lines, { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.2, ease: "power2.out" }, 0.6);
    tl.to(cta, { autoAlpha: 1, y: 0, duration: 0.5, ease: "power2.out" }, 1.4);

    return () => { tl.kill(); };
  }, []);

  return (
    <section className="relative z-[45] min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <Image
          src="/images/posters/performance-engine.png"
          alt="Background"
          fill
          className="object-cover opacity-20"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-dark-900/80 via-dark-900/70 to-dark-900/90" />
      </div>

      <GridPattern />
      <GradientOrb color="orange" size={400} className="-top-20 right-0 opacity-15" />
      <GradientOrb color="blue" size={300} className="bottom-20 -left-20 opacity-20" />

      <div ref={ref} className="relative z-10 mx-auto max-w-3xl px-6 text-center py-32">
        {/* Checkmark icon */}
        <div className="sc-icon mx-auto w-20 h-20 rounded-full bg-orange-500/10 border border-orange-500/30 flex items-center justify-center mb-8">
          <svg
            width="36"
            height="36"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-orange-500"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>

        <h1 className="sc-heading font-heading font-bold text-3xl sm:text-4xl lg:text-5xl text-dark-50 leading-tight mb-8">
          Transitioning to High-Performance Distribution.
        </h1>

        <p className="sc-line text-base sm:text-lg text-white leading-relaxed mb-4">
          You have initiated the shift toward a high-capacity infrastructure.
        </p>

        <p className="sc-line text-base sm:text-lg text-white leading-relaxed mb-6">
          We are analyzing your current operational hurdles to demonstrate how
          our unified database, real-time reporting, and intelligence enhanced
          data analysis can accelerate your agency&apos;s performance.
        </p>

        <p className="sc-line text-base sm:text-lg text-dark-200 leading-relaxed font-medium mb-10">
          {isBooking
            ? "Our Qall advisor is looking forward to meeting with you!"
            : "Our Qall team will be in contact with you shortly."}
        </p>

        <div className="sc-cta">
          <MagneticButton>
            <Button href="/" size="lg">
              Back to Home
            </Button>
          </MagneticButton>
        </div>
      </div>
    </section>
  );
}

export function SuccessContent() {
  return (
    <Suspense>
      <SuccessInner />
    </Suspense>
  );
}
