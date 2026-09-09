import type { Metadata } from "next";
import { ContactSection } from "@/components/sections/contact/ContactSection";
import { BookingWidget } from "@/components/sections/book-demo/BookingWidget";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Qall. Schedule a demo and discover how our insurance CRM platform can transform your brokerage operations.",
};

export default function ContactPage() {
  return (
    <>
      <ContactSection />
      <BookingWidget calLink={process.env.NEXT_PUBLIC_CAL_LINK ?? "your-username/qall-demo"} />
    </>
  );
}
