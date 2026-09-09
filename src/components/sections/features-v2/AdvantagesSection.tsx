"use client";

import { useRef, useEffect } from "react";
import { gsap } from "@/lib/gsap-config";
import type { ManagementFeature, AdvisorFeature } from "@/types";
import { ManagementRobot } from "@/components/svg/ManagementRobot";
import { AdvisorIllustration } from "@/components/svg/AdvisorIllustration";

interface AdvantagesSectionProps {
  heading: string;
  items: (ManagementFeature | AdvisorFeature)[];
  alignment: "left" | "right";
  accentColor: "orange" | "blue";
}

function isManagementFeature(
  item: ManagementFeature | AdvisorFeature
): item is ManagementFeature {
  return "bullets" in item || "closingNote" in item;
}

export function AdvantagesSection({
  heading,
  items,
  alignment,
  accentColor,
}: AdvantagesSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);

  const isLeft = alignment === "left";

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const headingEl = section.querySelector<HTMLElement>(".adv-heading");
    const itemEls = section.querySelectorAll<HTMLElement>(".adv-item");

    const ctx = gsap.context(() => {
      // Hide everything initially
      gsap.set(headingEl, { autoAlpha: 0 });
      gsap.set(itemEls, { autoAlpha: 0 });

      // When section enters viewport, animate heading then stagger all items
      gsap.to(headingEl, {
        autoAlpha: 1,
        duration: 0.6,
        ease: "power2.out",
        scrollTrigger: {
          trigger: section,
          start: "top 70%",
          once: true,
        },
      });

      gsap.to(itemEls, {
        autoAlpha: 1,
        duration: 0.5,
        stagger: 0.12,
        ease: "power2.out",
        scrollTrigger: {
          trigger: section,
          start: "top 60%",
          once: true,
        },
      });
    }, section);

    return () => ctx.revert();
  }, [items]);

  return (
    <section ref={sectionRef} className="relative z-[45] min-h-screen flex flex-col justify-center py-10 lg:py-14 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-dark" />

      {/* Subtle glow */}
      <div
        className={`absolute top-1/3 -translate-y-1/2 w-[400px] h-[400px] rounded-full blur-[120px] opacity-[0.05] pointer-events-none ${
          isLeft ? "left-0" : "right-0"
        } ${accentColor === "orange" ? "bg-orange-500" : "bg-blue-400"}`}
      />

      <div className="relative mx-auto max-w-7xl px-6 w-full">
        {/* Illustration — positioned on the opposite side */}
        {accentColor === "orange" && (
          <div className="hidden lg:block absolute top-16 right-6 w-[34%] pointer-events-none opacity-80">
            <ManagementRobot />
          </div>
        )}
        {accentColor === "blue" && (
          <div className="hidden lg:block absolute top-16 left-6 w-[34%] pointer-events-none opacity-80">
            <AdvisorIllustration />
          </div>
        )}

        <div className={`w-full md:w-3/5 ${isLeft ? "" : "md:ml-auto"}`}>
          {/* Section heading */}
          <h2
            className={`adv-heading font-heading font-bold text-2xl sm:text-3xl lg:text-4xl leading-tight mb-6 ${
              accentColor === "orange" ? "text-orange-500" : "text-blue-400"
            }`}
          >
            {heading}
          </h2>

          {/* Feature items */}
          <div className="space-y-5">
            {items.map((item, i) => (
              <div key={item.title} className="adv-item">
                {/* Item number + title */}
                <div className="flex items-baseline gap-3 mb-1.5">
                  <span
                    className={`text-xs font-bold shrink-0 ${
                      accentColor === "orange"
                        ? "text-orange-500/50"
                        : "text-blue-400/50"
                    }`}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="font-heading font-semibold text-base lg:text-lg text-dark-100">
                    {item.title}
                  </h3>
                </div>

                {/* Description */}
                <div className="pl-8">
                  <p className="text-white text-sm leading-relaxed">
                    {item.description}
                  </p>

                  {isManagementFeature(item) && item.bullets && (
                    <ul className="mt-1.5 space-y-1">
                      {item.bullets.map((bullet) => (
                        <li
                          key={bullet}
                          className="flex items-start gap-2 text-white text-xs leading-relaxed"
                        >
                          <span
                            className={`mt-1.5 w-1 h-1 rounded-full shrink-0 ${
                              accentColor === "orange"
                                ? "bg-orange-500/60"
                                : "bg-blue-400/60"
                            }`}
                          />
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  )}

                  {isManagementFeature(item) && item.closingNote && (
                    <p className="mt-1.5 text-white text-xs italic leading-relaxed">
                      {item.closingNote}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
