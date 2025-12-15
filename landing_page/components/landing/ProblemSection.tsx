/**
 * Problem Section - Surface Cards Design
 *
 * Three-column grid with frosted glass surface cards.
 * Highlights pain points with traditional matching methods.
 */

'use client';

import { motion } from 'framer-motion';
import { SurfaceCard } from '@/components/ui/surface-card';
import { GradientText } from '@/components/ui/gradient-text';
import { VARIANTS } from '@/lib/animations/constants';

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
      <div className="max-w-6xl mx-auto">
        <motion.h2
          className="font-display text-5xl lg:text-hero font-bold text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          The Problem With <GradientText>Matching</GradientText>
        </motion.h2>

        <motion.div
          className="grid md:grid-cols-3 gap-8"
          variants={VARIANTS.stagger}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          {PROBLEMS.map((problem, index) => (
            <SurfaceCard key={index}>
              {/* Icon with glow effect */}
              <div className="w-16 h-16 mb-6 rounded-2xl bg-gradient-to-br from-brand-primary/20 to-brand-primary/10
                border border-white/10 flex items-center justify-center text-3xl
                group-hover:shadow-[0_0_40px_var(--brand-primary-glow)] transition-all">
                {problem.icon}
              </div>

              <h3 className="text-2xl font-semibold mb-4">{problem.title}</h3>
              <p className="text-gray-400 leading-relaxed">{problem.description}</p>
            </SurfaceCard>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
