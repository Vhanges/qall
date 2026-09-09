"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap-config";
import Image from "next/image";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { LogoScroll } from "@/components/animation/LogoScroll";
import { TESTIMONIALS_V2 } from "@/lib/constants-home-v2";
import type { Testimonial } from "@/types";

const loopedItems = [...TESTIMONIALS_V2, ...TESTIMONIALS_V2];

/* ─── Testimonial Card with Image Support ─── */
function TestimonialCardV2({ testimonial }: { testimonial: Testimonial }) {
  return (
    <div className="glass-light rounded-2xl p-8 h-full">
      <div className="mb-6">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" className="text-orange-500/30">
          <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10H14.017zM0 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151C7.546 6.068 5.983 8.789 5.983 11H10v10H0z" />
        </svg>
      </div>
      <p className="text-dark-200 leading-relaxed text-base mb-8">
        &ldquo;{testimonial.quote}&rdquo;
      </p>
      <div className="flex items-center gap-3">
        {testimonial.image ? (
          <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
            <Image src={testimonial.image} alt={testimonial.name} width={40} height={40} className="w-full h-full object-cover" />
          </div>
        ) : (
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-orange-300 flex items-center justify-center text-dark-900 font-bold text-sm flex-shrink-0">
            {testimonial.name.split(" ").map((n) => n[0]).join("")}
          </div>
        )}
        <div>
          <p className="text-sm font-semibold text-orange-500">{testimonial.name}</p>
          <p className="text-xs text-white">{testimonial.role}, {testimonial.company}</p>
        </div>
      </div>
    </div>
  );
}

/* ─── Main TestimonialsV2 Section (Pinned) ─── */
export function TestimonialsV2() {
  const pinRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isTransitioning = useRef(false);
  const total = TESTIMONIALS_V2.length;

  const getShift = useCallback((index: number) => `${-index * (100 / 3)}%`, []);

  const animateTo = useCallback(
    (index: number, instant = false) => {
      if (!trackRef.current) return;
      gsap.to(trackRef.current, { x: getShift(index), duration: instant ? 0 : 0.7, ease: instant ? "none" : "power2.inOut" });
    },
    [getShift]
  );

  const next = useCallback(() => {
    if (isTransitioning.current) return;
    isTransitioning.current = true;
    setActiveIndex((prev) => {
      const nextIdx = prev + 1;
      animateTo(nextIdx);
      if (nextIdx >= total) {
        setTimeout(() => {
          const resetIdx = nextIdx - total;
          animateTo(resetIdx, true);
          setActiveIndex(resetIdx);
          isTransitioning.current = false;
        }, 750);
        return nextIdx;
      }
      isTransitioning.current = false;
      return nextIdx;
    });
  }, [total, animateTo]);

  useEffect(() => {
    intervalRef.current = setInterval(next, 3000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [next]);

  const pause = () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  const resume = () => { if (intervalRef.current) clearInterval(intervalRef.current); intervalRef.current = setInterval(next, 3000); };

  // Pinned scroll reveal (desktop only — on mobile, use simple fade-in)
  useEffect(() => {
    const el = pinRef.current;
    if (!el) return;

    const logos = el.querySelector<HTMLElement>(".tm-logos");
    const heading = el.querySelector<HTMLElement>(".tm-heading");
    const carousel = el.querySelector<HTMLElement>(".tm-carousel");
    const dots = el.querySelector<HTMLElement>(".tm-dots");

    const isMobile = window.innerWidth < 768;

    if (isMobile) {
      // Mobile: simple fade-in on scroll, no pinning — all at once
      gsap.set([logos, heading, carousel], { autoAlpha: 0, y: 20 });

      const ctx = gsap.context(() => {
        gsap.timeline({
          scrollTrigger: { trigger: el, start: "top 80%", once: true },
        }).to([heading, logos, carousel], { autoAlpha: 1, y: 0, duration: 0.6, ease: "power2.out" }, 0);
      }, el);

      return () => ctx.revert();
    }

    // Desktop: fade in immediately on scroll enter, then pin for carousel dwell
    gsap.set([logos, heading, carousel, dots], { autoAlpha: 0, y: 20 });

    const ctx = gsap.context(() => {
      // Fade everything in at once as soon as the section enters view
      gsap.to([heading, logos, carousel, dots], {
        autoAlpha: 1, y: 0, duration: 0.7, ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 75%", once: true },
      });

      // Pin the section so the carousel has time to auto-advance
      ScrollTrigger.create({
        trigger: el,
        start: "top top",
        end: "+=110%",
        pin: true,
        anticipatePin: 1,
        refreshPriority: -2,
      });
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={pinRef} className="relative min-h-screen md:h-screen flex items-center overflow-hidden py-16 md:py-0 mt-16 md:mt-24">
      <div className="absolute inset-0 bg-gradient-dark" />

      <div className="relative mx-auto max-w-7xl px-6 w-full">
        <div className="tm-heading">
          <SectionHeading
            label="Testimonials"
            title="Trusted by Industry Leaders"
            highlightWords={["Industry Leaders"]}
            description="Hear from the brokerages that made the switch."
            className="mb-8"
          />
        </div>

        <div className="tm-logos mb-8">
          <LogoScroll />
        </div>

        <div
          className="tm-carousel overflow-hidden mt-8"
          onMouseEnter={pause}
          onMouseLeave={resume}
        >
          {/* Desktop: 3 visible */}
          <div className="hidden md:block">
            <div ref={trackRef} className="flex">
              {loopedItems.map((testimonial, i) => (
                <div key={`${testimonial.name}-${i}`} className="w-1/3 flex-shrink-0 px-3">
                  <TestimonialCardV2 testimonial={testimonial} />
                </div>
              ))}
            </div>
          </div>

          {/* Mobile: show all testimonials */}
          <div className="md:hidden flex flex-col gap-4">
            {TESTIMONIALS_V2.map((testimonial) => (
              <TestimonialCardV2 key={testimonial.name} testimonial={testimonial} />
            ))}
          </div>
        </div>

        {/* Dots */}
        <div className="tm-dots hidden md:flex justify-center gap-2 mt-8">
          {TESTIMONIALS_V2.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                if (isTransitioning.current) return;
                pause();
                setActiveIndex(i);
                animateTo(i);
                resume();
              }}
              className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                i === activeIndex % total ? "bg-orange-500 w-6" : "bg-white/20 w-2 hover:bg-white/40"
              }`}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
