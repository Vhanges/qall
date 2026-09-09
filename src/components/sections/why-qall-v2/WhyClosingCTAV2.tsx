"use client";

import { CTABanner } from "@/components/shared/CTABanner";
import { WHY_CLOSING_V2 } from "@/lib/constants-why-v2";

export function WhyClosingCTAV2() {
  return (
    <CTABanner
      title={WHY_CLOSING_V2.title}
      description={WHY_CLOSING_V2.description}
      buttonText={WHY_CLOSING_V2.buttonText}
      buttonHref={WHY_CLOSING_V2.buttonHref}
    />
  );
}
