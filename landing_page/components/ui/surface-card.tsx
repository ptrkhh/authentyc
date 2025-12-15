'use client';

import { motion } from 'framer-motion';
import { SPRING_CONFIGS, VARIANTS } from '@/lib/animations/constants';

interface SurfaceCardProps {
  children: React.ReactNode;
  className?: string;
  featured?: boolean;
}

/**
 * Frosted glass surface card component with subtle animations.
 * Creates premium feel through restrained execution, not technical complexity.
 * Featured cards have enhanced hover effects for emphasis.
 */
export function SurfaceCard({
  children,
  className = '',
  featured = false
}: SurfaceCardProps) {
  return (
    <motion.div
      className={`
        relative p-8 rounded-2xl
        bg-[var(--surface-base)]
        border border-[var(--surface-border)]
        shadow-[0_8px_32px_rgba(0,0,0,0.3)]
        transition-all duration-500 ease-smooth
        hover:border-[var(--surface-highlight)]
        overflow-hidden
        group
        ${featured ? 'will-change-transform' : ''}
        ${className}
      `}
      variants={VARIANTS.fadeIn}
      whileHover={{ y: -8, scale: featured ? 1.02 : 1.01 }}
      transition={SPRING_CONFIGS.gentle}
    >
      {/* Top highlight line */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r
        from-transparent via-white/20 to-transparent" />

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>

      {/* Subtle gradient overlay on hover - only on featured cards for performance */}
      {featured && (
        <div className="absolute inset-0 opacity-0 group-hover:opacity-30
          transition-opacity duration-700 pointer-events-none
          bg-gradient-to-br from-brand-primary/10 to-transparent" />
      )}
    </motion.div>
  );
}
