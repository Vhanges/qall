"use client";

import Image from "next/image";
import { FadeIn } from "@/components/animation/FadeIn";
import { RevealText } from "@/components/animation/RevealText";
import { GridPattern } from "@/components/animation/GridPattern";
import { GradientOrb } from "@/components/animation/GradientOrb";

interface LegalPageProps {
  title: string;
  lastUpdated: string;
  children: React.ReactNode;
}

export function LegalPage({ title, lastUpdated, children }: LegalPageProps) {
  return (
    <>
      {/* Hero */}
      <section className="relative z-[45] flex items-center justify-center overflow-hidden pt-40 pb-20">
        <div className="absolute inset-0">
          <Image
            src="/images/posters/network-visualisation.png"
            alt="Background"
            fill
            className="object-cover opacity-20"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-dark-900/80 via-dark-900/60 to-dark-900" />
        </div>

        <GridPattern />
        <GradientOrb color="blue" size={300} className="-top-20 -left-40 opacity-20" />
        <GradientOrb color="orange" size={200} className="bottom-10 right-0 opacity-15" />

        <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
          <RevealText
            as="h1"
            className="font-heading font-bold text-4xl sm:text-5xl text-dark-50 leading-tight tracking-tight"
          >
            {title}
          </RevealText>
          <FadeIn delay={0.4}>
            <p className="mt-4 text-sm text-white">
              Last updated: {lastUpdated}
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Content */}
      <section className="relative py-16">
        <div className="absolute inset-0 bg-gradient-dark" />
        <div className="relative mx-auto max-w-3xl px-6">
          <FadeIn>
            <div className="prose-legal space-y-8 text-white text-[15px] leading-relaxed">
              {children}
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
