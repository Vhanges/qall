"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import { gsap, ScrollTrigger } from "@/lib/gsap-config";
import { INFRA_INTRO_V2 } from "@/lib/constants-home-v2";
import { setOrbCardPositions, setOrbCardElements } from "@/lib/orb-card-positions";

/* ─── Mini card components ─── */

function RevenueCard() {
  return (
    <div className="w-[200px] lg:w-[200px] max-w-full rounded-xl overflow-hidden shadow-2xl shadow-black/50 border border-white/10 bg-gradient-to-br from-[#141927] to-[#0c1019]">
      <div className="p-3">
        <div className="flex items-center gap-2 mb-2.5">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-[9px] text-white uppercase tracking-wider">Live Revenue</span>
        </div>
        <div className="text-lg font-bold text-orange-500 mb-1">£76.4k</div>
        <div className="flex items-center gap-1 mb-3">
          <svg width="10" height="10" viewBox="0 0 16 16" fill="none">
            <path d="M8 12V4M8 4L4 8M8 4L12 8" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <span className="text-[9px] text-green-400">+32% vs last month</span>
        </div>
        <div className="flex items-end gap-0.5 h-8">
          {[40, 55, 45, 65, 60, 80, 75, 90, 85, 95, 88, 100].map((h, i) => (
            <div
              key={i}
              className="flex-1 rounded-t-sm bg-gradient-to-t from-orange-600 to-orange-400/70"
              style={{ height: `${h}%` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function AIInsightCard() {
  return (
    <div className="w-[190px] lg:w-[190px] max-w-full rounded-xl shadow-2xl shadow-black/50 border border-white/10 bg-gradient-to-br from-[#141927] to-[#0c1019] p-3">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-6 h-6 rounded-full bg-orange-500/20 flex items-center justify-center">
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
            <path d="M8 1L10 6H15L11 9L12.5 14L8 11L3.5 14L5 9L1 6H6L8 1Z" fill="#F88C00" />
          </svg>
        </div>
        <span className="text-[9px] text-white uppercase tracking-wider">AI Insight</span>
      </div>
      <p className="text-[10px] text-white leading-relaxed">
        3 policies <span className="text-orange-500">flagged for renewal in the next 14 days</span> — estimated £12.4k in commission.
      </p>
      <div className="mt-2 flex gap-1.5">
        <div className="px-2 py-0.5 rounded text-[8px] bg-orange-500/10 text-orange-500 border border-orange-500/20">
          View
        </div>
        <div className="px-2 py-0.5 rounded text-[8px] bg-white/5 text-white border border-white/10">
          Dismiss
        </div>
      </div>
    </div>
  );
}

function ComplianceBadge() {
  return (
    <div className="w-[190px] lg:w-[190px] max-w-full rounded-xl shadow-2xl shadow-black/50 border border-white/10 bg-gradient-to-br from-[#141927] to-[#0c1019] p-3">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-green-500/15 flex items-center justify-center border border-green-500/20 flex-shrink-0">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path d="M3 8L7 12L13 4" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div>
          <div className="text-[10px] font-semibold text-dark-200">Compliance</div>
          <div className="text-[9px] text-green-400">100% Verified</div>
        </div>
      </div>
    </div>
  );
}

function PipelineCard() {
  return (
    <div className="w-[190px] lg:w-[190px] max-w-full rounded-xl shadow-2xl shadow-black/50 border border-white/10 bg-gradient-to-br from-[#141927] to-[#0c1019] p-3">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-2 h-2 rounded-full bg-orange-500/60" />
        <span className="text-[9px] text-white uppercase tracking-wider">Active Pipeline</span>
      </div>
      <div className="text-lg font-bold text-orange-500">£284k</div>
      <div className="text-[9px] text-white mt-0.5">47 active quotes</div>
    </div>
  );
}

/* ─── Mobile orb with animated orbit ─── */
const MOB_ORB = 200; // orb diameter on mobile
const MOB_ORBIT_R = 150; // orbit radius
const MOB_CARD_SCALE = 0.4;

function MobileOrbSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const orbRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    const orb = orbRef.current;
    const cards = cardsRef.current.filter(Boolean) as HTMLElement[];
    if (!section || !orb || cards.length < 4) return;
    if (typeof window !== "undefined" && window.innerWidth >= 1024) return;

    // Initial state: orb high up (50% visible in hero area), cards hidden
    const orbUpY = -(window.innerHeight * 0.35) + (MOB_ORB / 2) + 10;
    gsap.set(orb, { y: orbUpY });
    cards.forEach((c) => gsap.set(c, { autoAlpha: 0, scale: 0.5 }));

    const ctx = gsap.context(() => {
      // Orb scrolls down into position as section enters
      gsap.to(orb, {
        y: 0,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "top 20%",
          scrub: true,
        },
      });

      // Cards appear after orb is in position
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 30%",
          once: true,
        },
      });

      // Cards fade in at their starting positions around the orb
      const startAngles = [315, 45, 225, 135]; // same as desktop
      cards.forEach((card, i) => {
        const angle = (startAngles[i] * Math.PI) / 180;
        const x = Math.cos(angle) * MOB_ORBIT_R;
        const y = Math.sin(angle) * MOB_ORBIT_R;
        gsap.set(card, { x, y });
        tl.to(card, {
          autoAlpha: 1, scale: 1, duration: 0.5, ease: "back.out(1.5)",
        }, 0.4 + i * 0.1);
      });

      // After entrance, start continuous orbit
      tl.call(() => {
        cards.forEach((card, i) => {
          const startAngle = startAngles[i];
          gsap.to({ angle: startAngle }, {
            angle: startAngle + 360,
            duration: 20,
            repeat: -1,
            ease: "none",
            onUpdate() {
              const a = (this.targets()[0].angle * Math.PI) / 180;
              gsap.set(card, {
                x: Math.cos(a) * MOB_ORBIT_R,
                y: Math.sin(a) * MOB_ORBIT_R,
              });
            },
          });
        });
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="lg:hidden relative pt-8 pb-20"
      style={{ background: "linear-gradient(180deg, #0A0E17 0%, #0d1e35 40%, #0d2240 100%)", overflowX: "hidden", marginTop: "-120px", paddingTop: "120px" }}
    >
      {/* Orb + orbiting cards — height accounts for orbit radius + card size */}
      <div className="relative flex justify-center" style={{ height: 420 }}>
        {/* Orb */}
        <div
          ref={orbRef}
          className="absolute top-1/2 left-1/2"
          style={{ width: MOB_ORB, height: MOB_ORB, marginLeft: -MOB_ORB / 2, marginTop: -MOB_ORB / 2 }}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="rounded-full bg-orange-500/[0.07] blur-[60px]" style={{ width: 140, height: 140 }} />
          </div>
          <div className="rounded-full overflow-hidden" style={{ width: MOB_ORB, height: MOB_ORB }}>
            <Image
              src="/images/energy-orb.png"
              alt="Energy orb"
              width={1504}
              height={688}
              className="animate-[orbSpin_20s_linear_infinite] object-cover"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
        </div>

        {/* Orbiting cards — positioned by GSAP */}
        {[RevenueCard, AIInsightCard, ComplianceBadge, PipelineCard].map((Card, i) => (
          <div
            key={i}
            ref={(el) => { cardsRef.current[i] = el; }}
            className="absolute top-1/2 left-1/2"
            style={{
              opacity: 0,
              transform: `scale(${MOB_CARD_SCALE})`,
              marginLeft: -95,
              marginTop: -40,
            }}
          >
            <Card />
          </div>
        ))}
      </div>

      {/* Text content */}
      <div className="px-6 text-center max-w-2xl mx-auto mt-6">
        <div className="w-12 h-px bg-white/30 mb-6 mx-auto" />
        <h2 className="font-heading font-bold text-2xl sm:text-3xl md:text-4xl text-dark-50 mb-4 leading-tight">
          <span className="text-orange-500">High-Performance Insurance CRM &amp; Brokerage Management</span>
        </h2>
        <p className="text-base sm:text-lg text-white leading-relaxed">
          Qall unifies your data, automates financials, and delivers the intelligence your advisors need — all in one platform.
        </p>
      </div>
    </section>
  );
}

/* ─── Main export ─── */

export function HeroCRMOrb() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const orbGroupRef = useRef<HTMLDivElement>(null);
  const card1Ref = useRef<HTMLDivElement>(null);
  const card2Ref = useRef<HTMLDivElement>(null);
  const card3Ref = useRef<HTMLDivElement>(null);
  const card4Ref = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  const ORB_SIZE = 1350;
  // Visual size of the orb image on screen (roughly)
  const ORB_VISUAL = 500;

  useEffect(() => {
    if (typeof window === "undefined" || window.innerWidth < 1024) return;

    const section = sectionRef.current;
    const orbGroup = orbGroupRef.current;
    const textEl = textRef.current;
    const cards = [card1Ref.current, card2Ref.current, card3Ref.current, card4Ref.current];
    if (!section || !orbGroup || !textEl || cards.some((c) => !c)) return;

    // Hide text initially
    gsap.set(textEl, { autoAlpha: 0, x: -60 });

    // Save original inline style + className for each card before any GSAP touches them
    const originalCardState = cards.map((card) => ({
      style: card!.getAttribute("style") || "",
      className: card!.className,
    }));

    // Store card elements for cross-section cloning
    setOrbCardElements(cards.filter(Boolean) as HTMLElement[]);

    // Entrance: fade cards in
    cards.forEach((card, i) => {
      gsap.fromTo(
        card!,
        { opacity: 0, y: 30, scale: 0.85 },
        { opacity: 1, y: 0, scale: 1, duration: 0.8, delay: 0.3 + i * 0.15, ease: "power2.out" }
      );
    });

    const ctx = gsap.context(() => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const targetX = vw * 0.22;
      const orbitRadius = 340;
      const orbitDuration = 16;
      const startAngles = [315, 45, 225, 135];
      const orbitCenterX = vw / 2 + targetX;
      const orbitCenterY = vh / 2;
      let orbitTween: gsap.core.Tween | null = null;

      /** Reset everything to initial state — orb centered, cards floating */
      const resetToInitial = () => {
        // Kill all running animations
        if (orbitTween) { orbitTween.kill(); orbitTween = null; }
        if (entranceTl) { entranceTl.kill(); entranceTl = null; }

        // Kill any tweens on orb and text
        gsap.killTweensOf(orbGroup);
        gsap.killTweensOf(textEl);

        // Reset orb to center immediately
        gsap.set(orbGroup, { x: 0, scale: 1, opacity: 1 });

        // Hide the text immediately
        gsap.set(textEl, { autoAlpha: 0, x: -60 });

        // Restore cards to original state
        cards.forEach((card, i) => {
          const orig = originalCardState[i];
          gsap.killTweensOf(card!);
          gsap.set(card!, { clearProps: "all" });
          // Restore original inline style (CSS calc positions)
          card!.setAttribute("style", orig.style);
          // Restore className (float animation class)
          card!.className = orig.className;
          // Force visible + trigger reflow for animation restart
          card!.style.opacity = "1";
          void card!.offsetWidth;
        });

        hasAnimated.current = false;
      };

      let entranceTl: gsap.core.Timeline | null = null;

      // Pin the section when orb is centered on screen
      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "+=100%",
        pin: true,
        anticipatePin: 1,
        onEnter: () => {
          if (hasAnimated.current) return;
          hasAnimated.current = true;

          const cardTargets = startAngles.map((deg) => {
            const rad = (deg * Math.PI) / 180;
            return {
              left: orbitCenterX + orbitRadius * Math.cos(rad) - 100,
              top: orbitCenterY + orbitRadius * Math.sin(rad) - 40,
            };
          });

          entranceTl = gsap.timeline();
          const tl = entranceTl;

          // 1. Move orb to the right + scale down
          tl.to(orbGroup, {
            x: targetX,
            scale: 0.75,
            duration: 1.2,
            ease: "power3.inOut",
          }, 0);

          // 2. Animate each card smoothly from its current position to its orbit start
          cards.forEach((card, i) => {
            card!.style.animation = "none";
            const rect = card!.getBoundingClientRect();
            card!.style.right = "auto";
            card!.style.left = `${rect.left}px`;
            card!.style.top = `${rect.top}px`;

            tl.to(card!, {
              left: cardTargets[i].left,
              top: cardTargets[i].top,
              x: 0,
              y: 0,
              duration: 1.0,
              ease: "power2.inOut",
            }, 0.3 + i * 0.08);
          });

          // 3. After cards arrive, start continuous orbit
          tl.call(() => {
            const angleOffsets = startAngles.map((d) => (d * Math.PI) / 180);

            orbitTween = gsap.to({ val: 0 }, {
              val: 1,
              duration: orbitDuration,
              repeat: -1,
              ease: "none",
              onUpdate: function () {
                const progress = this.progress();
                cards.forEach((card, i) => {
                  const angle = angleOffsets[i] + progress * Math.PI * 2;
                  const cx = orbitCenterX + orbitRadius * Math.cos(angle) - 100;
                  const cy = orbitCenterY + orbitRadius * Math.sin(angle) - 40;
                  gsap.set(card!, { left: cx, top: cy });
                });
                setOrbCardPositions(cards.map((c) => {
                  const r = c!.getBoundingClientRect();
                  return { left: r.left, top: r.top, width: r.width, height: r.height };
                }));
              },
            });
          }, [], "+=0");

          // 4. Fade in the text on the left
          tl.to(textEl, {
            autoAlpha: 1,
            x: 0,
            duration: 0.8,
            ease: "power2.out",
          }, 0.8);
        },
        onLeaveBack: () => {
          // Scrolling back up past the pin — reset to initial state
          resetToInitial();
        },
      });

      // After the pin releases, scrub-animate the cards downward as user scrolls
      ScrollTrigger.create({
        trigger: section,
        start: "bottom top",
        end: `+=${vh * 0.5}`,
        scrub: 0.4,
        onUpdate(self) {
          const p = self.progress;
          const drift = p * vh * 0.6;
          cards.forEach((card) => {
            gsap.set(card!, { y: drift });
          });
          gsap.set(orbGroup, { opacity: 1 - p });
          gsap.set(textEl, { opacity: 1 - p });
          setOrbCardPositions(cards.map((c) => {
            const r = c!.getBoundingClientRect();
            return { left: r.left, top: r.top, width: r.width, height: r.height };
          }));
        },
        onLeaveBack() {
          // Scrolling back up into the pin area — restore visibility
          cards.forEach((card) => gsap.set(card!, { y: 0 }));
          gsap.set(orbGroup, { opacity: 1 });
          gsap.set(textEl, { opacity: 1 });
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <>
    <section
      ref={sectionRef}
      className="relative hidden lg:flex items-center justify-center overflow-hidden"
      style={{ height: "100vh" }}
    >
      {/* Background — light blue gradient for smooth transition to orange */}
      <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, #0A0E17 0%, #0d1e35 40%, #0d2240 100%)" }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-blue-400/5 blur-3xl pointer-events-none" />

      {/* Text content — left side, hidden initially */}
      <div
        ref={textRef}
        className="absolute left-0 top-0 bottom-0 w-[45%] flex items-center z-10"
      >
        <div className="px-12 xl:px-20 max-w-2xl">
          <div className="w-12 h-px bg-white/30 mb-8" />
          <h2 className="font-heading font-bold text-2xl lg:text-3xl xl:text-5xl text-dark-50 mb-6 leading-tight">
            <span className="text-orange-500">High-Performance Insurance CRM &amp; Brokerage Management</span>
          </h2>
          <p className="text-base lg:text-lg xl:text-xl text-white max-w-xl leading-relaxed">
            Qall unifies your data, automates financials, and delivers the intelligence your advisors need — all in one platform.
          </p>
        </div>
      </div>

      {/* Orb group — orb + glow, will be animated to the right */}
      <div
        ref={orbGroupRef}
        className="relative pointer-events-none"
        style={{ width: ORB_SIZE, height: ORB_SIZE }}
      >
        {/* Ambient glow */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="rounded-full bg-orange-500/[0.07] blur-[100px]"
            style={{ width: ORB_SIZE * 0.6, height: ORB_SIZE * 0.6 }}
          />
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <Image
            src="/images/energy-orb.png"
            alt="Energy orb"
            width={ORB_SIZE}
            height={ORB_SIZE}
            className="animate-[orbSpin_20s_linear_infinite]"
            priority
          />
        </div>
      </div>

      {/* Floating cards — symmetrical, well outside the orb */}
      {/* Top-left */}
      <div
        ref={card1Ref}
        className="absolute opacity-0 animate-[heroFloat_6s_ease-in-out_infinite]"
        style={{ right: "calc(50% + 380px)", top: "25%" }}
      >
        <RevenueCard />
      </div>
      {/* Top-right */}
      <div
        ref={card2Ref}
        className="absolute opacity-0 animate-[heroFloat_6s_ease-in-out_1.5s_infinite]"
        style={{ left: "calc(50% + 380px)", top: "25%" }}
      >
        <AIInsightCard />
      </div>
      {/* Bottom-left */}
      <div
        ref={card3Ref}
        className="absolute opacity-0 animate-[heroFloat_6s_ease-in-out_0.8s_infinite]"
        style={{ right: "calc(50% + 380px)", bottom: "10%" }}
      >
        <ComplianceBadge />
      </div>
      {/* Bottom-right */}
      <div
        ref={card4Ref}
        className="absolute opacity-0 animate-[heroFloat_6s_ease-in-out_2.2s_infinite]"
        style={{ left: "calc(50% + 380px)", bottom: "10%" }}
      >
        <PipelineCard />
      </div>
    </section>

    {/* ── Mobile / Tablet version ── */}
    <MobileOrbSection />
    </>
  );
}
