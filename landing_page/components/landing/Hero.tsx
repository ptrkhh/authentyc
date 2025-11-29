/**
 * Hero Section
 *
 * Landing page hero with headline, subheadline, and primary CTA.
 * Copy from LANDING_PAGE_PLAN.md lines 48-69
 */

'use client';

import { trackEvent } from '@/lib/analytics/posthog';

export function Hero() {
  const handleCTAClick = () => {
    trackEvent('cta_clicked', {
      location: 'hero',
      button_text: 'Get Early Access',
    });
    // TODO: Open waitlist form
  };
  return (
    <section className="text-center py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-bold mb-6">
          Stop guessing. Start knowing.
        </h1>

        <p className="text-xl md:text-2xl text-gray-600 mb-8">
          What if you could see how someone really thinks, communicates, and solves
          problems—before you commit?
        </p>

        <p className="text-lg text-gray-700 mb-10">
          We analyze AI conversation patterns to reveal authentic compatibility for hiring,
          dating, and team matching.
        </p>

        <button
          onClick={handleCTAClick}
          className="bg-brand-primary hover:bg-brand-primary-hover text-white font-semibold px-8 py-4 rounded-lg text-lg transition-all"
        >
          Get Early Access
        </button>

        <p className="text-sm text-gray-500 mt-6">
          Joining 100+ people on the waitlist • Launching Q1 2026
        </p>
      </div>
    </section>
  );
}
