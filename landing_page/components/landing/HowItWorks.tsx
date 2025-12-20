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
    title: 'Select & Create',
    description:
      'Choose your category (hiring, dating, or co-founder matching) and create your basic profile.',
    icon: '🎯',
  },
  {
    number: 2,
    title: 'Share Your Profile',
    description:
      'Copy our specialized prompt, paste it into ChatGPT, and it analyzes your chat history to create an authentic personality profile. Review your profile, then share the ChatGPT conversation link with us.',
    icon: '📤',
  },
  {
    number: 3,
    title: 'Get Matched & Connect',
    description:
      "We analyze compatibility between you and others in your category. When there's strong compatibility + mutual interest, we connect you.",
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
          How It <GradientText>Works</GradientText>
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
              <p className="text-gray-400 leading-relaxed">{step.description}</p>
            </SurfaceCard>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
