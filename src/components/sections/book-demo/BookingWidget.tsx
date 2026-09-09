"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Cal, { getCalApi } from "@calcom/embed-react";
import { FadeIn } from "@/components/animation/FadeIn";

interface BookingWidgetProps {
  calLink: string;
}

export function BookingWidget({ calLink }: BookingWidgetProps) {
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const cal = await getCalApi();
      cal("ui", {
        theme: "dark",
        styles: { branding: { brandColor: "#f88c00" } },
        cssVarsPerTheme: {
          light: {
            "cal-brand": "#f88c00",
          },
          dark: {
            "cal-brand": "#f88c00",
          },
        },
      });
    })();
  }, []);

  useEffect(() => {
    // Listen for Cal.com booking confirmation event
    const handleMessage = (e: MessageEvent) => {
      if (
        e.data?.type === "CAL:bookingSuccessful" ||
        e.data?.type === "CAL:rescheduleBookingSuccessful"
      ) {
        router.push("/success?type=booking");
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [router]);

  // Scroll to booking section when navigating with #booking hash
  useEffect(() => {
    if (window.location.hash === "#booking") {
      const el = document.getElementById("booking");
      if (el) {
        // Small delay to ensure layout is complete after navigation
        setTimeout(() => {
          el.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    }
  }, []);

  return (
    <section id="booking" className="relative z-[45] py-24" style={{ backgroundColor: "#0d2240" }}>
      <div className="mx-auto max-w-4xl px-6">
        <FadeIn>
          <div className="text-center mb-10">
            <h2 className="font-heading font-bold text-2xl md:text-3xl lg:text-4xl text-dark-50 leading-tight">
              See the <span className="text-orange-500">System in Action</span>
            </h2>
            <p className="mt-3 text-base md:text-lg text-white max-w-2xl mx-auto">
              Book a demo with our specialist today and unlock your full Qall potential.
            </p>
          </div>
          <div className="rounded-2xl border border-orange-500/30 hover:border-orange-500/60 bg-white/5 p-2 sm:p-4 overflow-hidden shadow-lg shadow-orange-500/10 hover:shadow-orange-500/20 transition-all duration-300">
            <Cal
              calLink={calLink}
              config={{
                theme: "dark",
                layout: "month_view",
              }}
              style={{ width: "100%", height: "100%", overflow: "auto" }}
            />
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
