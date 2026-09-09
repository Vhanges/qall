import Link from "next/link";

type ButtonVariant = "primary" | "secondary" | "ghost" | "book-demo";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
  className?: string;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-gradient-to-r from-orange-500 to-orange-400 text-dark-900 font-semibold hover:from-orange-400 hover:to-orange-300 shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30",
  secondary:
    "bg-white/5 text-dark-50 border border-white/10 hover:bg-white/10 hover:border-white/20",
  ghost:
    "bg-transparent text-white hover:text-dark-50 hover:bg-white/5",
  "book-demo":
    "bg-white text-orange-500 font-semibold border border-white/20 hover:bg-orange-50 shadow-lg shadow-white/10",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-5 py-2 text-sm rounded-lg",
  md: "px-7 py-3 text-sm rounded-xl",
  lg: "px-9 py-4 text-base rounded-xl",
};

export function Button({
  children,
  variant = "primary",
  size = "md",
  href,
  onClick,
  type = "button",
  disabled = false,
  className = "",
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center font-medium transition-all duration-300 cursor-pointer";
  const styles = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${
    disabled ? "opacity-50 pointer-events-none" : ""
  } ${className}`;

  if (href) {
    return (
      <Link href={href} className={styles}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={styles}
    >
      {children}
    </button>
  );
}
