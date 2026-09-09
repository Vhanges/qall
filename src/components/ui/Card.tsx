interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export function Card({ children, className = "", hover = true }: CardProps) {
  return (
    <div
      className={`glass-light rounded-2xl p-6 ${
        hover
          ? "transition-all duration-500 hover:bg-white/[0.06] hover:border-white/10 hover:-translate-y-1"
          : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}
