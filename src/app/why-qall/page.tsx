import type { Metadata } from "next";
import { WhyHero } from "@/components/sections/why-qall/WhyHero";
import { WhyContent } from "@/components/sections/why-qall-v2/WhyContent";

export const metadata: Metadata = {
  title: "Why Qall — The Performance Engine",
  description:
    "Discover why leading insurance brokerages choose Qall: eliminate admin drag, achieve financial precision, and maximize revenue with data-driven insights.",
};

export default function WhyQallPage() {
  return (
    <>
      <WhyHero />
      <WhyContent />
    </>
  );
}
