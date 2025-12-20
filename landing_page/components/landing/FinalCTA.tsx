/**
 * Final CTA Section - Dark Design
 *
 * Bottom call-to-action with gradient background and premium button.
 */

'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { PremiumButton } from '@/components/ui/premium-button';
import { GradientText } from '@/components/ui/gradient-text';
import { trackEvent } from '@/lib/analytics/posthog';

interface FinalCTAProps {
  onCTAClick: () => void;
}

export function FinalCTA({ onCTAClick }: FinalCTAProps) {
  const [waitlistCount, setWaitlistCount] = useState<number | null>(null);

  useEffect(() => {
    // Fetch waitlist count on mount
    fetch('/api/waitlist/count')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.count > 0) {
          setWaitlistCount(data.count);
        }
      })
      .catch(err => {
        console.error('Failed to fetch waitlist count:', err);
      });
  }, []);

  const handleCTAClick = () => {
    trackEvent('cta_clicked', {
      location: 'final_cta',
      button_text: 'Get Early Access',
    });
    onCTAClick();
  };

  return (
    <section className="relative py-36 px-4 overflow-hidden">
      {/* Gradient background accent */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-brand-primary/20 via-transparent to-brand-primary/20"
          animate={{ opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="relative max-w-3xl mx-auto text-center">
        <motion.h2
          className="font-display text-4xl lg:text-mega font-bold mb-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Ready to <GradientText>stop guessing?</GradientText>
        </motion.h2>

        <motion.p
          className="text-xl lg:text-2xl text-gray-400 mb-12 leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          {waitlistCount !== null
            ? `Join ${waitlistCount}+ people getting early access to authentic matching for hiring, dating, and co-founder matching.`
            : 'Join ambitious people getting early access to authentic matching for hiring, dating, and co-founder matching.'}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <PremiumButton size="xl" onClick={handleCTAClick}>
            Get Early Access
          </PremiumButton>
        </motion.div>

        {/* Trust indicator */}
        <motion.p
          className="text-sm text-gray-500 mt-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          Launching Q1 2026 • 100% Private • No credit card required
        </motion.p>
      </div>
    </section>
  );
}
