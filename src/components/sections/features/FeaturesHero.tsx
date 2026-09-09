"use client";

import Image from "next/image";
import { RevealText } from "@/components/animation/RevealText";
import { FadeIn } from "@/components/animation/FadeIn";

export function FeaturesHero() {
  return (
    <section className="snap-section relative z-[45] min-h-[60vh] md:min-h-[80vh] flex items-center justify-center overflow-hidden">
      {/* Background image */}
      <Image
        src="/images/posters/hero-3d-abstract.png"
        alt=""
        fill
        priority
        className="object-cover"
      />
      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-dark-900/40" />
      {/* Bottom fade into page background */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 md:h-56 bg-gradient-to-b from-transparent to-dark-900" />

      <div className="relative z-10 mx-auto max-w-4xl px-6 text-center pt-32 pb-20">
        <RevealText
          as="h1"
          className="font-heading font-bold text-4xl sm:text-5xl md:text-6xl text-dark-50 leading-[1.1] tracking-tight"
          highlightWords={["Created", "Equal"]}
          highlightClassName="text-orange-500"
        >
          Not All Networks Are Created Equal
        </RevealText>

        <FadeIn delay={0.5}>
          <p className="mt-6 text-lg sm:text-xl text-white max-w-2xl mx-auto leading-relaxed">
            Qall isn&apos;t another CRM bolted onto your workflow. It&apos;s the operating
            system built specifically for insurance distribution.
          </p>
        </FadeIn>
      </div>
    </section>
  );
}
