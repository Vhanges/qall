import type { Metadata } from "next";
import { ScrollReset } from "@/components/sections/features-v2/ScrollReset";
import { HeroSectionV2 } from "@/components/sections/home-v2/HeroSectionV2";
import { HeroCRMOrb } from "@/components/sections/home-v2/HeroCRMOrb";
import { FeatureShowcase } from "@/components/sections/home-v2/FeatureShowcase";
import { TestimonialsV2 } from "@/components/sections/home-v2/TestimonialsV2";
import { ClosingCTAV2 } from "@/components/sections/home-v2/ClosingCTAV2";

export const metadata: Metadata = {
  title: "Qall — The Future of Insurance Distribution",
  description:
    "Automate financials, track revenue in real-time, and maximize advisor capacity with Qall's high-performance insurance CRM platform.",
};

export default function HomePage() {
  return (
    <>
      <ScrollReset />
      <HeroSectionV2 />
      <HeroCRMOrb />
      <FeatureShowcase />
      <TestimonialsV2 />
      <ClosingCTAV2 />
    </>
  );
}
