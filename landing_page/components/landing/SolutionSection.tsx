/**
 * Solution Section - Hybrid Design
 *
 * Centered layout with three highlighted traits in frosted pills and a
 * frosted glass tag cloud showing the breadth of personality signals
 * Authentyc detects. Dark theme consistent with the rest of the site.
 */

'use client';

import { motion } from 'framer-motion';
import { GradientText } from '@/components/ui/gradient-text';
import { VARIANTS } from '@/lib/animations/constants';

const HIGHLIGHTED_TRAITS = [
  'Communication style',
  'Emotional intelligence',
  'Values & priorities',
];

const TAG_CLOUD_SIGNALS = [
  'humor & wit',
  'conflict resolution',
  'empathy',
  'risk tolerance',
  'values alignment',
  'adaptability',
  'decision-making',
  'collaboration style',
  'clarity under pressure',
  'vulnerability',
];

const TAG_STYLE = 'text-sm text-gray-300';

const TAG_STAGGER_DELAY_SECONDS = 0.05;
const TAG_CLOUD_BASE_DELAY_SECONDS = 0.3;

function CheckIcon() {
  return (
    <svg
      className="w-5 h-5 text-brand-primary mr-2 flex-shrink-0"
      fill="currentColor"
      viewBox="0 0 20 20"
    >
      <path
        fillRule="evenodd"
        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function AnimatedChevronDown() {
  return (
    <motion.svg
      className="w-5 h-5 mx-auto mt-2 text-brand-primary/60"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      animate={{ y: [0, 6, 0] }}
      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </motion.svg>
  );
}

export function SolutionSection() {
  return (
    <section className="relative py-36 px-4">
      <div className="max-w-5xl mx-auto text-center">
        {/* Headline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="font-display text-5xl lg:text-hero font-bold mb-6">
            Reveal <GradientText>Authentic Patterns</GradientText>
          </h2>

          <p className="text-lg lg:text-xl text-gray-300 mb-12 leading-relaxed max-w-2xl mx-auto">
            Analyze real conversations to see how someone actually thinks and
            communicates. No performance, no rehearsal.
          </p>
        </motion.div>

        {/* Unified frosted glass card with radial glow */}
        <div className="relative">
          {/* Radial glow behind the card */}
          <div
            className="absolute -inset-8 rounded-3xl opacity-30 blur-2xl pointer-events-none"
            style={{
              background:
                'radial-gradient(ellipse at center, var(--brand-primary-glow) 0%, transparent 70%)',
            }}
          />

          <motion.div
            className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl
              px-8 py-8 md:px-12 md:py-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            {/* Section label */}
            <p className="text-sm text-gray-400 uppercase tracking-widest mb-6">
              Core signals we analyze
            </p>

            {/* Three highlighted traits as frosted pills */}
            <motion.div
              className="flex flex-wrap justify-center gap-4 mb-8"
              variants={VARIANTS.stagger}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              {HIGHLIGHTED_TRAITS.map((trait) => (
                <motion.div
                  key={trait}
                  className="flex items-center text-white text-lg font-medium
                    bg-white/5 border border-white/10 rounded-full px-5 py-2.5"
                  variants={VARIANTS.fadeIn}
                >
                  <CheckIcon />
                  {trait}
                </motion.div>
              ))}
            </motion.div>

            {/* Tag cloud */}
            <div className="flex flex-wrap justify-center items-baseline gap-x-6 gap-y-3">
              {TAG_CLOUD_SIGNALS.map((signal, index) => (
                <motion.span
                  key={signal}
                  className={TAG_STYLE}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{
                    delay:
                      TAG_CLOUD_BASE_DELAY_SECONDS +
                      index * TAG_STAGGER_DELAY_SECONDS,
                  }}
                >
                  {signal}
                </motion.span>
              ))}
            </div>

            {/* "Dozens more" at the bottom */}
            <motion.p
              className="text-gray-500 text-sm mt-6 tracking-wide"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{
                delay:
                  TAG_CLOUD_BASE_DELAY_SECONDS +
                  TAG_CLOUD_SIGNALS.length * TAG_STAGGER_DELAY_SECONDS,
              }}
            >
              &hellip; and dozens more
            </motion.p>
          </motion.div>
        </div>

        {/* Transitional CTA bridging to HowItWorks */}
        <motion.div
          className="mt-10 text-gray-400 text-base"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          <p>Here&apos;s how it works</p>
          <AnimatedChevronDown />
        </motion.div>
      </div>
    </section>
  );
}
