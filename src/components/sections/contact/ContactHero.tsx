"use client";

import Image from "next/image";
import { RevealText } from "@/components/animation/RevealText";
import { FadeIn } from "@/components/animation/FadeIn";
import { GridPattern } from "@/components/animation/GridPattern";
import { GradientOrb } from "@/components/animation/GradientOrb";
import { ScrollIndicator } from "@/components/animation/ScrollIndicator";

export function ContactHero() {
  return (
    <section className="relative z-[45] min-h-screen flex items-center justify-center overflow-hidden pt-32 pb-16">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/images/posters/network-visualisation.png"
          alt="Network visualization background"
          fill
          className="object-cover opacity-30"
          priority
          sizes="100vw"
        />
        {/* Dark overlay for text readability - fades out at bottom */}
        <div className="absolute inset-0 bg-gradient-to-b from-dark-900/70 via-dark-900/50 to-transparent" />
      </div>

      <GridPattern />
      <GradientOrb color="blue" size={400} className="-top-20 -left-40 opacity-30" />
      <GradientOrb color="orange" size={300} className="bottom-20 right-0 opacity-20" />

      <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8">
          <span className="text-sm text-white font-medium">Contact Us</span>
        </div>

        <RevealText
          as="h1"
          className="font-heading font-bold text-4xl sm:text-5xl md:text-6xl text-dark-50 leading-[1.1] tracking-tight"
          highlightRange={[0, 3]}
          highlightClassName="text-orange-500"
        >
          Scale Your Agency&apos;s Output Without Scaling Your Overhead
        </RevealText>

        <FadeIn delay={0.5}>
          <p className="mt-6 text-lg text-white max-w-2xl mx-auto leading-relaxed">
            Transition to a high-performance infrastructure that automates
            client organization and maximizes every advisor&apos;s revenue potential.
          </p>
          <p className="mt-4 text-base text-white max-w-2xl mx-auto">
            Let us show you how:
          </p>
        </FadeIn>
      </div>

      <ScrollIndicator />
    </section>
  );
}
