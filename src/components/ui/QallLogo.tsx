import Image from "next/image";

interface QallLogoProps {
  height?: number;
  layout?: "horizontal" | "vertical";
  variant?: "orange" | "navy";
  className?: string;
}

const logoSrc = {
  "horizontal-orange": "/images/logo-horizontal-orange.png",
  "horizontal-navy": "/images/logo-horizontal-navy.png",
  "vertical-orange": "/images/logo-vertical-orange.png",
  "vertical-navy": "/images/logo-vertical-navy.png",
} as const;

export function QallLogo({
  height = 36,
  layout = "vertical",
  variant = "orange",
  className,
}: QallLogoProps) {
  const src = logoSrc[`${layout}-${variant}`];
  const aspectRatio = layout === "horizontal" ? 386 / 99 : 295 / 345;
  const width = Math.round(height * aspectRatio);

  return (
    <Image
      src={src}
      alt="Qall"
      width={width}
      height={height}
      className={className}
      style={{ height, width: "auto" }}
      priority
    />
  );
}
