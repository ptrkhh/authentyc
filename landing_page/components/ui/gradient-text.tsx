interface GradientTextProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Animated gradient text component with emerald green to blue gradient.
 * Subtle shimmer animation creates premium feel without distraction.
 */
export function GradientText({
  children,
  className = ''
}: GradientTextProps) {
  return (
    <span
      className={`
        bg-gradient-to-r from-brand-primary via-[#4facfe] to-brand-primary
        bg-clip-text text-transparent
        bg-size-200 animate-shimmer
        ${className}
      `}
    >
      {children}
    </span>
  );
}
