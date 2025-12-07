/**
 * Category Cards Section
 *
 * 3 large cards for choosing category (Hiring/Dating/Teams).
 * Each card opens waitlist form with pre-selected category.
 * Copy from LANDING_PAGE_PLAN.md lines 215-296
 */

'use client';

import { trackEvent } from '@/lib/analytics/posthog';

interface CategoryCardsProps {
  onCardClick: (category: string) => void;
}

export function CategoryCards({ onCardClick }: CategoryCardsProps) {
  const categories = [
    {
      emoji: '💼',
      title: 'For Hiring',
      tagline: 'Find talent who can actually do the job, not just interview well.',
      benefits: [
        'See real problem-solving ability',
        'Assess communication clarity',
        'Evaluate learning velocity',
        'Reduce bad hires by 30%+',
      ],
      audience: 'For recruiters, hiring managers, & job seekers',
      category: 'hiring',
    },
    {
      emoji: '❤️',
      title: 'For Dating',
      tagline: 'Find someone you actually vibe with, not someone who looks good on paper.',
      benefits: [
        'Match on authentic personality',
        'Assess emotional compatibility',
        'Understand communication styles',
        'Skip the small talk theater',
      ],
      audience: 'For singles tired of surface-level dating apps',
      category: 'dating',
    },
    {
      emoji: '🚀',
      title: 'For Founders & Teams',
      tagline: 'Find your co-founder or mastermind group that actually fits.',
      benefits: [
        'Assess collaboration styles',
        'Match on values & ambition',
        'Evaluate follow-through patterns',
        'Build teams that actually work',
      ],
      audience: 'For founders, operators, & builders',
      category: 'teams',
    },
  ];

  const handleCardClick = (category: string) => {
    // Track category click
    trackEvent('category_card_clicked', {
      category,
      location: 'category_cards_section',
    });

    onCardClick(category);
  };

  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12">What Are You Looking For?</h2>

        <div className="grid md:grid-cols-3 gap-8">
          {categories.map((cat) => (
            <div
              key={cat.category}
              className="bg-white border-2 border-gray-200 rounded-lg p-8 hover:border-brand-primary hover:shadow-lg transition-all cursor-pointer"
              onClick={() => handleCardClick(cat.category)}
            >
              <div className="text-5xl mb-4">{cat.emoji}</div>
              <h3 className="text-2xl font-bold mb-3">{cat.title}</h3>
              <p className="text-gray-700 mb-6">{cat.tagline}</p>

              <ul className="space-y-2 mb-6">
                {cat.benefits.map((benefit) => (
                  <li key={benefit} className="flex items-start text-sm text-gray-600">
                    <span className="text-brand-primary mr-2">•</span>
                    {benefit}
                  </li>
                ))}
              </ul>

              <p className="text-sm text-gray-500 mb-6">{cat.audience}</p>

              <button className="w-full bg-brand-primary hover:bg-brand-primary-hover text-white font-semibold px-4 py-2 rounded-lg transition-all">
                Join Waitlist →
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
