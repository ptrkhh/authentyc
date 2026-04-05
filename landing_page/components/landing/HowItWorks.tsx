/**
 * How It Works Section - Dark Design
 *
 * Three-step process explanation with surface cards.
 */

'use client';

import { motion } from 'framer-motion';
import { SurfaceCard } from '@/components/ui/surface-card';
import { GradientText } from '@/components/ui/gradient-text';
import { VARIANTS } from '@/lib/animations/constants';

const STEPS = [
  {
    number: 1,
    title: 'Build Your Profile',
    description:
      'Grab a prompt, drop it into ChatGPT, and share the link. Three quick steps and your personality profile writes itself.',
    icon: '🎯',
  },
  {
    number: 2,
    title: 'Match on Substance',
    description:
      'Your profile captures how you actually think and communicate, drawn from a real conversation. That depth is what drives every match.',
    icon: '📤',
  },
  {
    number: 3,
    title: 'Connect with Confidence',
    description:
      'See exactly why you clicked: shared values, communication style, sense of humor. Walk into every first conversation already knowing what you have in common.',
    icon: '🤝',
  },
];

export function HowItWorks() {
  return (
    <section className="relative py-36 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          className="font-display text-5xl lg:text-hero font-bold text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          From Conversation to <GradientText>Connection</GradientText>
        </motion.h2>

        <motion.div
          className="grid md:grid-cols-3 gap-8"
          variants={VARIANTS.stagger}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          {STEPS.map((step) => (
            <SurfaceCard key={step.number}>
              {/* Step number badge */}
              <div className="w-12 h-12 mb-6 rounded-xl bg-gradient-to-br from-brand-primary to-brand-primary-hover
                flex items-center justify-center text-xl font-bold text-white
                shadow-[0_0_30px_var(--brand-primary-glow)]">
                {step.number}
              </div>

              {/* Icon */}
              <div className="text-5xl mb-6">{step.icon}</div>

              {/* Content */}
              <h3 className="text-2xl font-semibold mb-4 text-white">
                {step.title}
              </h3>
              <p className="text-gray-300 leading-relaxed">{step.description}</p>
            </SurfaceCard>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
