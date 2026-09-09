interface GridPatternProps {
  className?: string;
}

export function GridPattern({ className = "" }: GridPatternProps) {
  return (
    <div
      className={`absolute inset-0 grid-pattern opacity-50 pointer-events-none ${className}`}
    />
  );
}
