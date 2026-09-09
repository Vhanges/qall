"use client";

import Image from "next/image";
import { FadeIn } from "@/components/animation/FadeIn";

export function FeaturesHeroImage() {
  return (
    <section className="relative" style={{ backgroundColor: "#0d2240" }}>
      <FadeIn className="mx-auto max-w-5xl px-6 py-16">
        <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden">
          <Image
            src="/images/posters/dashboard-shapes.png"
            alt="AI-driven project management dashboard"
            fill
            priority
            className="object-cover"
          />
        </div>
      </FadeIn>
    </section>
  );
}
