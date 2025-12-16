interface GradientTextProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Brand-colored text component with emerald green color.
 * Solid color ensures compatibility across all browsers including mobile.
 */
export function GradientText({
  children,
  className = ''
}: GradientTextProps) {
  return (
    <span
      className={`
        text-brand-primary
        ${className}
      `}
    >
      {children}
    </span>
  );
}
