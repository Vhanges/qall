interface SectionHeadingProps {
  label?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
  highlightWords?: string[];
  highlightClassName?: string;
}

export function SectionHeading({
  label,
  title,
  description,
  align = "center",
  className = "",
  highlightWords = [],
  highlightClassName = "text-orange-500",
}: SectionHeadingProps) {
  let titleContent: React.ReactNode = title;
  if (highlightWords.length > 0) {
    const regex = new RegExp(`(${highlightWords.join("|")})`, "gi");
    const parts = title.split(regex);
    titleContent = parts.map((part, i) =>
      highlightWords.some((w) => w.toLowerCase() === part.toLowerCase()) ? (
        <span key={i} className={highlightClassName}>{part}</span>
      ) : (
        part
      )
    );
  }

  return (
    <div
      className={`${align === "center" ? "text-center" : "text-left"} ${className}`}
    >
      {label && (
        <span className="inline-block px-4 py-1.5 text-xs font-medium tracking-wider uppercase text-orange-500 bg-orange-500/10 rounded-full mb-4">
          {label}
        </span>
      )}
      <h2 className="font-heading font-bold text-3xl sm:text-4xl lg:text-5xl text-dark-50 leading-tight">
        {titleContent}
      </h2>
      {description && (
        <p
          className={`mt-4 text-lg text-white leading-relaxed ${
            align === "center" ? "max-w-2xl mx-auto" : "max-w-xl"
          }`}
        >
          {description}
        </p>
      )}
    </div>
  );
}
