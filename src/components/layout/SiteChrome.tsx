"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SmoothScrollProvider } from "@/components/layout/SmoothScrollProvider";
import { Starfield } from "@/components/animation/Starfield";
import ChatWidget from "@/components/shared/ChatWidget";
import { ScrollToTop } from "@/components/ui/ScrollToTop";
import { ScrollTriggerCleanup } from "@/components/sections/home-v2/ScrollTriggerCleanup";
import { ScrollReset } from "@/components/sections/features-v2/ScrollReset";

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const bare = pathname?.startsWith("/crm-mockup") ?? false;

  if (bare) {
    return <>{children}</>;
  }

  return (
    <SmoothScrollProvider>
      <Starfield />
      <Header />
      <ScrollReset />
      <ScrollTriggerCleanup />
      <main className="relative">{children}</main>
      <Footer />
      <ScrollToTop />
      <ChatWidget />
    </SmoothScrollProvider>
  );
}
