import { FadeIn } from "@/components/animation/FadeIn";
import { FlowSection } from "./FlowSection";
import {
  WALKTHROUGH_CATEGORIES,
  WALKTHROUGH_FLOWS,
} from "@/lib/constants-walkthrough";

export function WalkthroughContent() {
  return (
    <section
      className="relative py-20 md:py-28"
      style={{ backgroundColor: "#0d2240" }}
    >
      <div className="mx-auto max-w-6xl px-6 space-y-24 md:space-y-32">
        {WALKTHROUGH_CATEGORIES.map((cat) => {
          const flows = WALKTHROUGH_FLOWS.filter((f) => f.category === cat.id);
          return (
            <div key={cat.id}>
              {/* Category header */}
              <FadeIn>
                <div className="text-center mb-12 md:mb-16 max-w-3xl mx-auto">
                  <span className="inline-block px-3 py-1 text-xs font-medium tracking-wider uppercase text-orange-500 bg-orange-500/10 rounded-full mb-4">
                    {cat.label}
                  </span>
                  <h2 className="font-heading font-bold text-3xl md:text-4xl lg:text-5xl text-dark-50 leading-tight">
                    {cat.heading}
                  </h2>
                  <p className="mt-4 text-base md:text-lg text-white leading-relaxed">
                    {cat.subheading}
                  </p>
                </div>
              </FadeIn>

              {/* Flows in this category */}
              <div className="space-y-12 md:space-y-16">
                {flows.map((flow) => (
                  <FlowSection key={flow.id} flow={flow} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
