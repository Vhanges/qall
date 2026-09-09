import type { Metadata } from "next";
import { SuccessContent } from "@/components/sections/success/SuccessContent";

export const metadata: Metadata = {
  title: "Success — Qall",
  description: "Your request has been received. We'll be in touch shortly.",
  robots: { index: false, follow: false },
};

export default function SuccessPage() {
  return <SuccessContent />;
}
