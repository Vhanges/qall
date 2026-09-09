import type { Metadata } from "next";
import { ScrollReset } from "@/components/sections/features-v2/ScrollReset";
import { SnapScrollActivator } from "@/components/sections/features-v2/SnapScrollActivator";
import { FeaturesHero } from "@/components/sections/features/FeaturesHero";
import { ExplainerVideo } from "@/components/sections/features-v2/ExplainerVideo";
import { QallToggleSection } from "@/components/sections/features-v2/QallToggleSection";
import {
  ManagementViewSection,
  AdvisorViewSection,
} from "@/components/sections/features-v2/ViewFeaturesSection";
import { CTABanner } from "@/components/shared/CTABanner";

export const metadata: Metadata = {
  title: "Features",
  description:
    "Explore Qall's powerful features: real-time dashboards, automated commissions, AI-powered lead management, and more for insurance brokerages.",
};

export default function FeaturesPage() {
  return (
    <>
      <ScrollReset />
      <SnapScrollActivator />
      <FeaturesHero />
      <ExplainerVideo />
      <QallToggleSection />
      <ManagementViewSection />
      <AdvisorViewSection />

      <div className="snap-section">
        <CTABanner
          title="See the Difference for Yourself"
          description="Schedule a personalized demo and discover how Qall transforms insurance distribution."
          buttonText="Request Demo"
          buttonHref="/contact#booking"
          variant="orange"
        />
      </div>
    </>
  );
}
