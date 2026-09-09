import { FadeIn } from "@/components/animation/FadeIn";
import { WalkthroughMedia } from "./WalkthroughMedia";
import type { WalkthroughFlow } from "@/lib/constants-walkthrough";

interface FlowSectionProps {
  flow: WalkthroughFlow;
}

export function FlowSection({ flow }: FlowSectionProps) {
  return (
    <FadeIn>
      <article className="relative rounded-3xl border border-white/5 bg-dark-900/60 p-6 md:p-10">
        {/* Flow header */}
        <header className="mb-8 md:mb-10 max-w-2xl">
          <h3 className="font-heading font-bold text-2xl md:text-3xl lg:text-4xl text-dark-50 leading-tight">
            {flow.title}
          </h3>
          <p className="mt-3 text-sm md:text-base text-white leading-relaxed">
            {flow.summary}
          </p>
        </header>

        {/* Steps */}
        <ol className="relative space-y-10 md:space-y-14">
          {flow.steps.map((step, i) => {
            const stepNumber = String(i + 1).padStart(2, "0");
            const isLast = i === flow.steps.length - 1;
            return (
              <li
                key={step.title}
                className="relative grid gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] md:gap-10 items-start"
              >
                {/* Left: number + text */}
                <div className="relative md:pl-12">
                  {/* Number dot */}
                  <div className="hidden md:flex absolute left-0 top-0 w-9 h-9 rounded-full bg-orange-500/10 border border-orange-500/30 items-center justify-center text-orange-500 font-mono text-xs font-semibold">
                    {stepNumber}
                  </div>
                  {/* Connector line — skip on last step */}
                  {!isLast && (
                    <div
                      className="hidden md:block absolute left-[17px] top-9 w-px bg-gradient-to-b from-orange-500/30 via-white/5 to-transparent"
                      style={{ height: "calc(100% + 2.5rem)" }}
                    />
                  )}

                  {/* Mobile number pill */}
                  <span className="md:hidden inline-block px-2.5 py-1 text-[10px] font-mono font-semibold tracking-wider text-orange-500 bg-orange-500/10 rounded-full mb-2">
                    STEP {stepNumber}
                  </span>

                  <h4 className="font-heading font-semibold text-lg md:text-xl text-dark-50 leading-snug">
                    {step.title}
                  </h4>
                  <p className="mt-2 text-sm md:text-[15px] text-white leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Right: media */}
                <div className="order-first md:order-none">
                  <WalkthroughMedia
                    imageSrc={step.imageSrc}
                    videoSrc={step.videoSrc}
                    videoPoster={step.videoPoster}
                    alt={`${flow.title} — step ${stepNumber}: ${step.title}`}
                  />
                </div>
              </li>
            );
          })}
        </ol>
      </article>
    </FadeIn>
  );
}
