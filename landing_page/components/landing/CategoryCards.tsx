/**
 * Category Cards Section - Bento Box Layout
 *
 * Asymmetric grid with varying card sizes for visual interest.
 * First card is featured and larger. Each card opens waitlist form.
 */

'use client';

import { motion } from 'framer-motion';
import { SurfaceCard } from '@/components/ui/surface-card';
import { PremiumButton } from '@/components/ui/premium-button';
import { GradientText } from '@/components/ui/gradient-text';
import { trackEvent } from '@/lib/analytics/posthog';

interface CategoryCardsProps {
  onCardClick: (category: string) => void;
}

const CATEGORIES = [
  {
    id: 'hiring',
    icon: '💼',
    title: 'Hiring',
    tagline: 'Find teammates who think like you',
    benefits: ['See real problem-solving', 'Assess culture fit', 'Skip the resume theater'],
  },
  {
    id: 'dating',
    icon: '💝',
    title: 'Dating',
    tagline: 'Match on your true personality, not performative bios',
    benefits: ['Authentic compatibility', 'Communication chemistry', 'Values alignment'],
  },
  {
    id: 'teams',
    icon: '🤝',
    title: 'Team Building',
    tagline: 'Build cohesive squads',
    benefits: ['Personality balance', 'Conflict prevention', 'Optimal pairings'],
  },
];

export function CategoryCards({ onCardClick }: CategoryCardsProps) {
  const handleCardClick = (categoryId: string) => {
    trackEvent('category_card_clicked', {
      category: categoryId,
      location: 'category_cards_section',
    });
    onCardClick(categoryId);
  };

  return (
    <section className="relative py-36 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.h2
          className="font-display text-5xl lg:text-hero font-bold text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Built for <GradientText>Every Match</GradientText>
        </motion.h2>

        {/* Bento Grid - Responsive with different layouts */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CATEGORIES.map((category, index) => {
            const isFeatured = index === 0;

            return (
              <motion.div
                key={category.id}
                className={isFeatured ? 'md:col-span-2 lg:col-span-1' : ''}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <CategoryCard
                  category={category}
                  featured={isFeatured}
                  onClick={() => handleCardClick(category.id)}
                />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

interface CategoryCardProps {
  category: typeof CATEGORIES[0];
  featured: boolean;
  onClick: () => void;
}

function CategoryCard({ category, featured, onClick }: CategoryCardProps) {
  return (
    <SurfaceCard className="h-full flex flex-col cursor-pointer" featured={featured}>
      {/* Icon with glow */}
      <div
        className={`mb-6 rounded-2xl bg-gradient-to-br from-brand-primary/20 to-brand-primary/10
          border border-white/10 flex items-center justify-center
          group-hover:shadow-[0_0_60px_var(--brand-primary-glow)] transition-all
          ${featured ? 'w-24 h-24 text-5xl' : 'w-16 h-16 text-3xl'}`}
      >
        {category.icon}
      </div>

      {/* Content */}
      <h3 className={`font-bold mb-4 ${featured ? 'text-4xl' : 'text-2xl'}`}>
        {category.title}
      </h3>
      <p className={`text-gray-400 mb-8 ${featured ? 'text-xl' : 'text-base'}`}>
        {category.tagline}
      </p>

      {/* Benefits */}
      <ul className="space-y-3 mb-auto">
        {category.benefits.map((benefit, index) => (
          <li key={index} className="flex items-start text-gray-400">
            <svg
              className="w-5 h-5 text-brand-primary mr-3 mt-0.5 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            {benefit}
          </li>
        ))}
      </ul>

      {/* CTA */}
      <div className="mt-8">
        <PremiumButton size={featured ? 'lg' : 'md'} onClick={onClick} className="w-full">
          Join Waitlist →
        </PremiumButton>
      </div>
    </SurfaceCard>
  );
}
