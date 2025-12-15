'use client';

import { motion } from 'framer-motion';
import { SPRING_CONFIGS } from '@/lib/animations/constants';

interface PremiumButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  size?: 'md' | 'lg' | 'xl';
  variant?: 'primary' | 'secondary';
  className?: string;
}

const SIZE_CLASSES = {
  md: 'px-8 py-4 text-base',
  lg: 'px-10 py-5 text-lg',
  xl: 'px-16 py-8 text-2xl',
};

/**
 * Premium button component with emerald gradient, glow effects, and smooth animations.
 * Features shimmer effect on hover and spring-based micro-interactions.
 */
export function PremiumButton({
  children,
  onClick,
  size = 'md',
  variant = 'primary',
  className = '',
}: PremiumButtonProps) {
  return (
    <motion.button
      className={`
        relative rounded-xl font-semibold text-white
        bg-gradient-to-r from-brand-primary to-brand-primary-hover
        border border-white/10
        shadow-[0_0_40px_var(--brand-primary-glow)]
        transition-all duration-300 ease-smooth
        hover:shadow-[0_0_60px_var(--brand-primary-glow)]
        active:scale-[0.98]
        overflow-hidden
        group
        ${SIZE_CLASSES[size]}
        ${className}
      `}
      onClick={onClick}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      transition={SPRING_CONFIGS.bouncy}
    >
      <span className="relative z-10">{children}</span>

      {/* Shimmer effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent
        -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

      {/* Glow pulse effect */}
      <div className="absolute inset-0 -z-10 rounded-xl bg-brand-primary
        opacity-0 blur-2xl group-hover:opacity-50 group-hover:animate-glow-pulse" />
    </motion.button>
  );
}
