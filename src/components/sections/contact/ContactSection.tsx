"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { RevealText } from "@/components/animation/RevealText";
import { FadeIn } from "@/components/animation/FadeIn";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { contactFormSchema } from "@/lib/validations";
import { BARRIERS } from "@/lib/constants";
import type { ContactFormData } from "@/types";

export function ContactSection() {
  const [formData, setFormData] = useState<ContactFormData>({
    fullName: "",
    email: "",
    barrier: "",
    message: "",
  });
  const router = useRouter();
  const [errors, setErrors] = useState<Partial<Record<keyof ContactFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof ContactFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError("");

    const result = contactFormSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof ContactFormData, string>> = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof ContactFormData;
        if (!fieldErrors[field]) {
          fieldErrors[field] = issue.message;
        }
      }
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      router.push("/success?type=contact");
    } catch (err) {
      setServerError(
        err instanceof Error ? err.message : "Failed to send message. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="relative z-[45] min-h-screen flex items-center overflow-hidden pt-32 pb-16">
      <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, #0A0E17 0%, #0d1e35 50%, #0d2240 100%)" }} />

      <div className="relative z-10 mx-auto max-w-6xl px-6 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left — Hero text */}
          <div>
            <RevealText
              as="h1"
              className="font-heading font-bold text-3xl sm:text-4xl md:text-5xl text-dark-50 leading-[1.1] tracking-tight"
              highlightRange={[0, 3]}
              highlightClassName="text-orange-500"
            >
              Scale Your Agency&apos;s Output Without Scaling Your Overhead
            </RevealText>

            <FadeIn delay={0.5}>
              <p className="mt-6 text-lg text-white max-w-lg leading-relaxed">
                Transition to a high-performance infrastructure that automates
                client organization and <span className="text-orange-500">maximizes</span> <span className="text-orange-500">every advisor&apos;s revenue potential.</span>
              </p>
              <p className="mt-4 text-base text-white">
                Let us show you how:
              </p>
            </FadeIn>
          </div>

          {/* Right — Contact form */}
          <FadeIn delay={0.3}>
            <form
              onSubmit={handleSubmit}
              className="glass-light rounded-2xl p-8 sm:p-10 space-y-6"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Input
                  label="Full Name"
                  name="fullName"
                  placeholder="John Smith"
                  value={formData.fullName}
                  onChange={handleChange}
                  error={errors.fullName}
                />
                <Input
                  label="Email Address"
                  name="email"
                  type="email"
                  placeholder="john@company.com"
                  value={formData.email}
                  onChange={handleChange}
                  error={errors.email}
                />
              </div>

              <Select
                label="Primary Barrier"
                name="barrier"
                options={BARRIERS}
                value={formData.barrier}
                onChange={handleChange}
                error={errors.barrier}
              />

              <Textarea
                label="Message"
                name="message"
                placeholder="Tell us about your brokerage and what challenges you're facing..."
                value={formData.message}
                onChange={handleChange}
                error={errors.message}
              />

              {serverError && (
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                  <p className="text-sm text-red-400">{serverError}</p>
                </div>
              )}

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full"
                size="lg"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <svg
                      className="animate-spin h-4 w-4"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                    Sending...
                  </span>
                ) : (
                  "Claim Your Qall Advantage"
                )}
              </Button>

              <p className="text-xs text-white text-center">
                See how you can join the top-tier agencies through Qall&apos;s CRM customization.
              </p>
            </form>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
