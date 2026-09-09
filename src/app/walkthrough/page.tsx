import type { Metadata } from "next";
import { WalkthroughHero } from "@/components/sections/walkthrough/WalkthroughHero";
import { WalkthroughContent } from "@/components/sections/walkthrough/WalkthroughContent";
import { CTABanner } from "@/components/shared/CTABanner";

export const metadata: Metadata = {
  title: "Walkthrough — See Qall in Action",
  description:
    "Step-by-step visual walkthroughs of the essential Qall flows — adding clients, compliance, lead distribution, data imports and more.",
};

export default function WalkthroughPage() {
  return (
    <>
      <WalkthroughHero />
      <WalkthroughContent />
      <CTABanner
        title="Ready to see it live?"
        description="Book a demo and walk through any of these flows with a Qall specialist on the real platform."
        buttonText="Book a Demo"
        buttonHref="/contact#booking"
        variant="orange"
      />
    </>
  );
}
