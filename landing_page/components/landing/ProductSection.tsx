/**
 * Product Section - LeetVibeCode
 *
 * Points visitors at the product they can try today. Same frosted panel as
 * HowItWorks so it reads as part of the page, not an ad.
 */

'use client';

import { motion } from 'framer-motion';
import { GradientText } from '@/components/ui/gradient-text';
import { PRODUCTS } from '@/lib/constants';

export function ProductSection() {
  return (
    <section className="relative py-36 px-4">
      <div className="max-w-3xl mx-auto">
        <motion.div
          className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl
            px-8 py-10 md:px-12 md:py-12 space-y-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="text-sm text-brand-primary">Live now from Authentyc</p>
          <h2 className="font-display text-5xl lg:text-6xl font-bold">
            <GradientText>{PRODUCTS.LEETVIBECODE.NAME}</GradientText>
          </h2>
          <p className="text-xl text-gray-300 leading-relaxed">
            One prompt. Four models. Scored on the weakest. Write a single prompt, watch four
            small AI models build from it, and see how well you direct AI to write code.
          </p>
          <a
            href={PRODUCTS.LEETVIBECODE.URL}
            className="inline-flex items-center justify-center rounded-xl px-8 py-4 text-base font-semibold text-white
              bg-gradient-to-r from-brand-primary to-brand-primary-hover border border-white/10
              shadow-[0_0_40px_var(--brand-primary-glow)] hover:shadow-[0_0_60px_var(--brand-primary-glow)]
              transition-shadow duration-300
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary
              focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0a]"
          >
            Play a challenge
          </a>
          <p className="text-sm text-gray-400">Free to play. No account needed.</p>
        </motion.div>
      </div>
    </section>
  );
}
