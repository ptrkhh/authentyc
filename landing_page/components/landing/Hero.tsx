/**
 * Hero Section - Bold & Asymmetric Design
 *
 * Dark gradient background with floating visual elements.
 * Asymmetric layout with 160px headline (mobile-responsive).
 * Features animated background orbs and premium button component.
 */

'use client';

import { motion } from 'framer-motion';
import { PremiumButton } from '@/components/ui/premium-button';
import { GradientText } from '@/components/ui/gradient-text';
import { SPRING_CONFIGS, VARIANTS } from '@/lib/animations/constants';
import { trackEvent } from '@/lib/analytics/posthog';

interface HeroProps {
  onCTAClick: () => void;
}

export function Hero({ onCTAClick }: HeroProps) {
  const handleCTAClick = () => {
    trackEvent('cta_clicked', {
      location: 'hero',
      button_text: 'Get Early Access',
    });
    onCTAClick();
  };

  return (
    <section className="relative min-h-screen flex items-center px-4 overflow-hidden">
      {/* Animated background orbs for atmospheric depth */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-primary/20 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand-primary/15 rounded-full blur-3xl"
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.5, 0.3, 0.5] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
      </div>

      {/* Content - Asymmetric grid layout */}
      <div className="relative max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
        <motion.div
          className="space-y-8"
          variants={VARIANTS.stagger}
          initial="initial"
          animate="animate"
        >
          <motion.h1
            className="font-display text-7xl lg:text-display font-bold tracking-tight"
            variants={VARIANTS.fadeIn}
            transition={SPRING_CONFIGS.bouncy}
          >
            Stop guessing.{' '}
            <GradientText>Start knowing.</GradientText>
          </motion.h1>

          <motion.p
            className="text-xl lg:text-2xl text-gray-400 leading-relaxed"
            variants={VARIANTS.fadeIn}
          >
            See how someone really thinks, communicates, and solves problems before you commit.
          </motion.p>

          <motion.p
            className="text-base lg:text-lg text-gray-500 max-w-xl"
            variants={VARIANTS.fadeIn}
          >
            AI-powered conversation analysis reveals authentic compatibility for hiring, dating, and co-founder matching.
          </motion.p>

          <motion.div variants={VARIANTS.fadeIn}>
            <PremiumButton size="lg" onClick={handleCTAClick}>
              Get Early Access
            </PremiumButton>
          </motion.div>

          {/* Privacy badge */}
          <motion.div
            className="flex items-center gap-3 px-4 py-2 rounded-lg bg-white/5 border border-white/10 inline-flex"
            variants={VARIANTS.fadeIn}
          >
            <svg className="w-5 h-5 text-brand-primary" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 1.944A11.954 11.954 0 012.166 5C2.056 5.649 2 6.319 2 7c0 5.225 3.34 9.67 8 11.317C14.66 16.67 18 12.225 18 7c0-.682-.057-1.35-.166-2.001A11.954 11.954 0 0110 1.944zM11 14a1 1 0 11-2 0 1 1 0 012 0zm0-7a1 1 0 10-2 0v3a1 1 0 102 0V7z" clipRule="evenodd" />
            </svg>
            <span className="text-sm text-gray-400">
              <strong className="text-white">100% Private</strong>: Your data is encrypted, never sold, and you control what's shared
            </span>
          </motion.div>
        </motion.div>

        {/* Visual Element - Enhanced gradient surface */}
        <motion.div
          className="hidden lg:block h-[600px] relative"
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={SPRING_CONFIGS.gentle}
        >
          <div className="w-full h-full rounded-2xl bg-gradient-to-br from-brand-primary/10 to-transparent
            border border-white/10 flex items-center justify-center relative overflow-hidden group">
            {/* Animated gradient layers */}
            <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/20 via-transparent to-brand-primary/20
              opacity-50 group-hover:opacity-70 transition-opacity duration-700" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_50%)]" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
