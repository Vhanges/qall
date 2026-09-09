"use client";

import Image from "next/image";

const providerLogos = [
  { src: "/images/providerLogos/no-bg/Aviva.png", alt: "Aviva", scale: "" },
  { src: "/images/providerLogos/no-bg/bupa.png", alt: "Bupa", scale: "scale-125" },
  { src: "/images/providerLogos/no-bg/exeter.png", alt: "Exeter", scale: "" },
  { src: "/images/providerLogos/no-bg/guardian.png", alt: "Guardian", scale: "" },
  { src: "/images/providerLogos/no-bg/holloway.png", alt: "Holloway", scale: "" },
  { src: "/images/providerLogos/no-bg/L&G.png", alt: "Legal & General", scale: "scale-125" },
  { src: "/images/providerLogos/no-bg/lv.png", alt: "LV", scale: "" },
  { src: "/images/providerLogos/no-bg/metlife.png", alt: "MetLife", scale: "" },
  { src: "/images/providerLogos/no-bg/rl.png", alt: "Royal London", scale: "" },
  { src: "/images/providerLogos/no-bg/sw.png", alt: "Scottish Widows", scale: "scale-[1.75]" },
  { src: "/images/providerLogos/no-bg/vitality.png", alt: "Vitality", scale: "scale-125" },
  { src: "/images/providerLogos/no-bg/zurich.png", alt: "Zurich", scale: "" },
];

function LogoSet() {
  return (
    <>
      {providerLogos.map((logo, index) => (
        <div
          key={index}
          className={`relative h-8 w-14 shrink-0 md:h-10 md:w-20`}
        >
          <Image
            src={logo.src}
            alt={logo.alt}
            fill
            className={`object-contain brightness-0 invert opacity-50 ${logo.scale}`}
            sizes="80px"
          />
        </div>
      ))}
    </>
  );
}

export function LogoScroll() {
  return (
    <div className="w-full py-8 overflow-hidden">
      <div
        className="flex items-center gap-8 md:gap-12 w-max animate-[logo-scroll_30s_linear_infinite]"
      >
        <LogoSet />
        <LogoSet />
      </div>

      <style jsx>{`
        @keyframes logo-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
