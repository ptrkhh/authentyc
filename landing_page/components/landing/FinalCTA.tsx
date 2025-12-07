/**
 * Final CTA Section
 *
 * Bottom call-to-action before footer.
 * Copy from LANDING_PAGE_PLAN.md lines 481-497
 */

'use client';

import { trackEvent } from '@/lib/analytics/posthog';

interface FinalCTAProps {
  onCTAClick: () => void;
}

export function FinalCTA({ onCTAClick }: FinalCTAProps) {
  const handleCTAClick = () => {
    trackEvent('cta_clicked', {
      location: 'final_cta',
      button_text: 'Get Early Access',
    });
    onCTAClick();
  };
  return (
    <section className="py-20 px-4 bg-brand-primary text-white">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-4xl font-bold mb-6">Ready to stop guessing?</h2>

        <p className="text-xl mb-10">
          Join 100+ people getting early access to authentic matching for hiring, dating, and
          teams.
        </p>

        <button
          onClick={handleCTAClick}
          className="bg-white text-brand-primary hover:bg-gray-100 font-semibold px-8 py-4 rounded-lg text-lg transition-all"
        >
          Get Early Access
        </button>
      </div>
    </section>
  );
}
