/**
 * How It Works Section - Unified Panel Design
 *
 * Single frosted glass panel (matching SolutionSection) with three steps as
 * numbered rows connected by a vertical line, preserving the 1->2->3 sequence.
 */

'use client';

import { motion } from 'framer-motion';
import { GradientText } from '@/components/ui/gradient-text';

const STEPS = [
  {
    number: 1,
    title: 'Build Your Profile',
    description:
      'Grab a prompt, drop it into ChatGPT, and share the link. Three quick steps and your personality profile writes itself.',
  },
  {
    number: 2,
    title: 'Match on Substance',
    description:
      'Your profile captures how you actually think and communicate, drawn from a real conversation. That depth is what drives every match.',
  },
  {
    number: 3,
    title: 'Connect with Confidence',
    description:
      'See exactly why you clicked: shared values, communication style, sense of humor. Walk into every first conversation already knowing what you have in common.',
  },
];

export function HowItWorks() {
  return (
    <section className="relative py-36 px-4">
      <div className="max-w-3xl mx-auto">
        <motion.h2
          className="font-display text-5xl lg:text-hero font-bold text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          From Conversation to <GradientText>Connection</GradientText>
        </motion.h2>

        <div className="relative">
          {/* Radial glow behind the panel */}
          <div
            className="absolute -inset-8 rounded-3xl opacity-30 blur-2xl pointer-events-none"
            style={{
              background:
                'radial-gradient(ellipse at center, var(--brand-primary-glow) 0%, transparent 70%)',
            }}
          />

          <motion.div
            className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl
              px-8 py-10 md:px-12 md:py-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <ol className="space-y-10">
              {STEPS.map((step, index) => (
                <li key={step.number} className="relative flex gap-6">
                  {/* Connector line linking step badges (skip after last) */}
                  {index < STEPS.length - 1 && (
                    <div
                      className="absolute left-6 top-14 -bottom-10 w-px bg-white/10"
                      aria-hidden="true"
                    />
                  )}

                  {/* Step number badge */}
                  <div className="relative z-10 flex-shrink-0 w-12 h-12 rounded-xl
                    bg-gradient-to-br from-brand-primary to-brand-primary-hover
                    flex items-center justify-center text-xl font-bold text-white
                    shadow-[0_0_30px_var(--brand-primary-glow)]">
                    {step.number}
                  </div>

                  <div className="pt-1">
                    <h3 className="text-2xl font-semibold mb-2 text-white">
                      {step.title}
                    </h3>
                    <p className="text-gray-300 leading-relaxed">{step.description}</p>
                  </div>
                </li>
              ))}
            </ol>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
