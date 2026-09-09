"use client";

import Image from "next/image";

export function WhyHero() {
  return (
    <section className="relative z-[45] overflow-hidden bg-dark-900">
      {/* Background image */}
      <Image
        src="/images/posters/performance-engine.png"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />
      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-dark-900/60" />
      {/* Bottom fade into page background */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 md:h-56 bg-gradient-to-b from-transparent to-dark-900" />

      <div className="relative z-10 mx-auto max-w-4xl px-6 text-center pt-32 pb-32 min-h-[60vh] flex flex-col items-center justify-center">
        <h1 className="font-heading font-bold text-4xl sm:text-5xl md:text-6xl text-dark-50 leading-[1.1] tracking-tight">
          Decade-Deep Insights. <span className="text-orange-500">Future-Ready Performance.</span>
        </h1>
      </div>
    </section>
  );
}
