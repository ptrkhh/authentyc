/**
 * Problem Section - Unified Panel Design
 *
 * Single frosted glass panel (matching SolutionSection) holding three pain
 * points as divided columns. Reads as one content block, not clickable tiles.
 */

'use client';

import { motion } from 'framer-motion';
import { GradientText } from '@/components/ui/gradient-text';

const PROBLEMS = [
  {
    icon: '📄',
    title: 'Resumes Lie',
    description: 'Polished profiles hide authentic communication patterns and problem-solving approaches.',
  },
  {
    icon: '🎭',
    title: 'Interviews Mislead',
    description: 'Rehearsed answers don\'t reveal how someone thinks under real pressure.',
  },
  {
    icon: '🎲',
    title: 'Gut Feel Fails',
    description: 'Intuition without data leads to costly mismatches and regrettable hires.',
  },
];

export function ProblemSection() {
  return (
    <section className="relative py-36 px-4">
      <div className="max-w-5xl mx-auto text-center">
        <motion.h2
          className="font-display text-5xl lg:text-hero font-bold mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          The Problem With <GradientText>Matching</GradientText>
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
              px-6 py-10 md:px-12 md:py-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/10">
              {PROBLEMS.map((problem, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center px-6 py-8 first:pt-0 last:pb-0 md:py-0"
                >
                  <div className="w-16 h-16 mb-6 rounded-2xl bg-gradient-to-br from-brand-primary/20 to-brand-primary/10
                    border border-white/10 flex items-center justify-center text-3xl">
                    {problem.icon}
                  </div>

                  <h3 className="text-2xl font-semibold mb-4">{problem.title}</h3>
                  <p className="text-gray-300 leading-relaxed">{problem.description}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
