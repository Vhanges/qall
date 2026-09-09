"use client";

import { FadeIn } from "@/components/animation/FadeIn";
import { MagneticButton } from "@/components/animation/MagneticButton";
import { Button } from "@/components/ui/Button";
interface CTABannerProps {
  title: string;
  description?: string;
  buttonText?: string;
  buttonHref?: string;
  variant?: "video" | "orange";
  highlightWords?: string[];
}

export function CTABanner({
  title,
  description,
  buttonText = "Book a Demo",
  buttonHref = "/contact#booking",
  variant = "video",
  highlightWords = [],
}: CTABannerProps) {
  let titleContent: React.ReactNode = title;
  if (highlightWords.length > 0) {
    const regex = new RegExp(`(${highlightWords.join("|")})`, "gi");
    const parts = title.split(regex);
    titleContent = parts.map((part, i) =>
      highlightWords.some((w) => w.toLowerCase() === part.toLowerCase()) ? (
        <span key={i} className="text-orange-500">{part}</span>
      ) : (
        part
      )
    );
  }
  if (variant === "orange") {
    return (
      <section className="relative z-[45] py-24 overflow-hidden bg-gradient-to-br from-orange-500 via-orange-500 to-orange-600">
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: "radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }} />

        <div className="relative mx-auto max-w-4xl px-6 text-center">
          <FadeIn>
            <h2 className="font-heading font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-white leading-tight">
              {title}
            </h2>
            {description && (
              <p className="mt-6 text-lg text-white max-w-2xl mx-auto leading-relaxed">
                {description}
              </p>
            )}
            <div className="mt-10">
              <MagneticButton>
                <Button href={buttonHref} size="lg" variant="secondary" className="!bg-blue-900 !text-white !border-blue-900 hover:!bg-blue-800 font-semibold shadow-lg shadow-black/20">
                  {buttonText}
                </Button>
              </MagneticButton>
            </div>
          </FadeIn>
        </div>
      </section>
    );
  }

  return (
    <section className="relative z-[45] py-24 overflow-hidden">
      {/* Background Video — 200% height so overflow-hidden clips the watermarked bottom half */}
      <div className="absolute inset-0 overflow-hidden">
        <video
          src="/videos/optimized/cta-bg.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="absolute top-0 left-0 w-full"
          style={{ height: "200%", objectFit: "cover", objectPosition: "top center" }}
        />
      </div>

      <div className="relative mx-auto max-w-4xl px-6 text-center">
        <FadeIn>
          <h2 className="font-heading font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-white leading-tight">
            {titleContent}
          </h2>
          {description && (
            <p className="mt-6 text-lg text-white max-w-2xl mx-auto leading-relaxed">
              {description}
            </p>
          )}
          <div className="mt-10">
            <MagneticButton>
              <Button href={buttonHref} size="lg" variant="primary" className="!bg-gradient-to-r !from-orange-500 !to-orange-400 !text-dark-900 font-semibold shadow-lg shadow-orange-500/20">
                {buttonText}
              </Button>
            </MagneticButton>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
