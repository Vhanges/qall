"use client";

import { FeatureCard } from "./FeatureCard";
import type { ComparisonRowV2 } from "@/types";

interface WireFeaturesSectionProps {
  features: ComparisonRowV2[];
}

const ALIGNMENTS: ("left" | "right")[] = ["left", "right", "left", "right"];

export function WireFeaturesSection({ features }: WireFeaturesSectionProps) {
  return (
    <section>
      {features.map((feature, i) => (
        <FeatureCard
          key={feature.label}
          feature={feature}
          alignment={ALIGNMENTS[i]}
        />
      ))}
    </section>
  );
}
