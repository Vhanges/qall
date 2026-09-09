"use client";

import { useRef, useEffect } from "react";
import { gsap } from "@/lib/gsap-config";

export function ExplainerVideo() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const wrapper = section.querySelector<HTMLElement>(".video-wrapper");

    const ctx = gsap.context(() => {
      gsap.set(wrapper, { autoAlpha: 0, y: 30 });

      gsap.to(wrapper, {
        autoAlpha: 1,
        y: 0,
        duration: 0.8,
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
    <section
      ref={sectionRef}
      className="snap-section relative z-[45] pt-24 pb-16 md:pt-32 md:pb-20 md:min-h-screen flex items-center overflow-hidden"
    >
      <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, #0A0E17 0%, #0d1e35 100%)" }} />

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full blur-[150px] opacity-[0.06] pointer-events-none bg-orange-500" />

      <div className="relative mx-auto max-w-5xl px-6">
        <div className="text-center mb-12">
          <h2 className="font-heading font-bold text-3xl sm:text-4xl lg:text-5xl text-dark-50 leading-tight">
            See <span className="text-orange-500">Qall</span> in Action
          </h2>
          <p className="mt-4 text-lg text-white max-w-2xl mx-auto">
            Two minutes to understand how Qall transforms insurance brokerage
            operations from end to end.
          </p>
        </div>

        <div className="video-wrapper relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-black/40">
          <video
            className="w-full aspect-video bg-black"
            controls
            preload="auto"
            playsInline
            poster="/images/posters/explainer-poster.jpg"
          >
            <source src="/videos/explainer-v4.mp4" type="video/mp4" />
          </video>
        </div>
      </div>
    </section>
  );
}
