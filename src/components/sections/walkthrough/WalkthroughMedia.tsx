import Image from "next/image";

interface WalkthroughMediaProps {
  imageSrc?: string;
  videoSrc?: string;
  videoPoster?: string;
  alt: string;
}

export function WalkthroughMedia({
  imageSrc,
  videoSrc,
  videoPoster,
  alt,
}: WalkthroughMediaProps) {
  if (videoSrc) {
    return (
      <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-white/10 bg-dark-900 shadow-2xl shadow-black/40">
        <video
          className="w-full h-full object-cover"
          src={videoSrc}
          poster={videoPoster}
          autoPlay
          loop
          muted
          playsInline
        />
      </div>
    );
  }

  if (imageSrc) {
    return (
      <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-white/10 bg-dark-900 shadow-2xl shadow-black/40">
        <Image
          src={imageSrc}
          alt={alt}
          fill
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover"
        />
      </div>
    );
  }

  // Styled placeholder — swap in imageSrc or videoSrc to replace
  return (
    <div className="relative aspect-video w-full rounded-2xl border border-dashed border-white/15 bg-gradient-to-br from-dark-900 to-dark-950 flex items-center justify-center overflow-hidden">
      {/* subtle grid pattern for visual interest */}
      <div
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      <div className="relative z-10 text-center px-6">
        <div className="mx-auto mb-3 w-12 h-12 rounded-full bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path
              d="M4 7h3l2-3h6l2 3h3v13H4V7z"
              stroke="#F88C00"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            <circle cx="12" cy="13" r="4" stroke="#F88C00" strokeWidth="1.5" />
          </svg>
        </div>
        <p className="text-sm font-semibold text-white">{alt}</p>
        <p className="mt-1 text-xs text-white/50">CRM screenshot coming soon</p>
      </div>
    </div>
  );
}
