/**
 * Animation constants and configuration for consistent motion throughout the application.
 * Using Framer Motion spring physics for organic, natural-feeling animations.
 */

/**
 * Spring configuration presets
 * - gentle: Smooth, subtle animations for content appearance
 * - bouncy: Energetic animations with overshoot for interactive elements
 * - snappy: Fast, responsive animations for immediate feedback
 * - wobbly: Playful animations with more bounce
 */
export const SPRING_CONFIGS = {
  gentle: { type: "spring" as const, stiffness: 120, damping: 14 },
  bouncy: { type: "spring" as const, stiffness: 260, damping: 20 },
  snappy: { type: "spring" as const, stiffness: 400, damping: 30 },
  wobbly: { type: "spring" as const, stiffness: 180, damping: 12 },
};

/**
 * Common animation variants for consistent motion patterns
 */
export const VARIANTS = {
  fadeIn: {
    initial: { opacity: 0, y: 20, scale: 0.95 },
    animate: { opacity: 1, y: 0, scale: 1 },
  },
  slideIn: {
    initial: { opacity: 0, x: -60 },
    animate: { opacity: 1, x: 0 },
  },
  stagger: {
    animate: {
      transition: { staggerChildren: 0.1 },
    },
  },
};
