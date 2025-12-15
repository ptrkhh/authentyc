/**
 * Solution Section - Dark Design
 *
 * Explains the Authentyc approach with benefits checklist.
 * Updated with premium design system and animations.
 */

'use client';

import { motion } from 'framer-motion';
import { GradientText } from '@/components/ui/gradient-text';
import { VARIANTS } from '@/lib/animations/constants';

const INSIGHTS = [
  'Problem-solving patterns',
  'Communication clarity',
  'Emotional intelligence',
  'Learning velocity',
  'Collaboration style',
  'Authentic values & priorities',
];

export function SolutionSection() {
  return (
    <section className="relative py-36 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-4xl lg:text-mega font-bold mb-6">
              Reveal <GradientText>Authentic Patterns</GradientText>
            </h2>

            <p className="text-lg lg:text-xl text-gray-400 mb-8 leading-relaxed">
              Analyze real conversations to see how someone actually thinks and communicates. No performance, no rehearsal.
            </p>

            <h3 className="text-xl font-semibold mb-6 text-white">See the real person:</h3>

            <motion.ul
              className="space-y-4"
              variants={VARIANTS.stagger}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              {INSIGHTS.map((item) => (
                <motion.li
                  key={item}
                  className="flex items-start"
                  variants={VARIANTS.fadeIn}
                >
                  <svg
                    className="w-6 h-6 text-brand-primary mr-4 mt-0.5 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-gray-300 text-lg">{item}</span>
                </motion.li>
              ))}
            </motion.ul>

            <p className="text-gray-500 mt-8 text-base">
              All from conversations they've already had—no extra hoops, no performance pressure.
            </p>
          </motion.div>

          {/* Visual element placeholder */}
          <motion.div
            className="h-96 rounded-2xl bg-gradient-to-br from-brand-primary/10 to-transparent
              border border-white/10 flex items-center justify-center relative overflow-hidden group"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/20 via-transparent to-transparent
              opacity-50 group-hover:opacity-70 transition-opacity duration-700" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_50%)]" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
