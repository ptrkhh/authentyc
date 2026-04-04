/**
 * Main Landing Page
 *
 * Integrates all landing page sections in order:
 * 1. Hero
 * 2. Problem Section
 * 3. Solution Section
 * 4. How It Works
 * 5. Category Cards (with embedded ChatGPT Analyzer)
 * 6. FAQ
 * 7. Final CTA
 * 8. Footer
 */

'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { Hero } from '@/components/landing/Hero';
import { ProblemSection } from '@/components/landing/ProblemSection';
import { SolutionSection } from '@/components/landing/SolutionSection';
import { HowItWorks } from '@/components/landing/HowItWorks';
import { PageAnalytics } from '@/components/analytics/PageAnalytics';
import { WaitlistForm } from '@/components/forms/WaitlistForm';
import { LAUNCH_COPY } from '@/lib/constants';

const CategoryCards = dynamic(() => import('@/components/landing/CategoryCards').then(mod => ({ default: mod.CategoryCards })), {
  loading: () => <div className="h-96 animate-pulse bg-dark-850" />
});

const FAQ = dynamic(() => import('@/components/landing/FAQ').then(mod => ({ default: mod.FAQ })), {
  loading: () => <div className="h-96 animate-pulse bg-dark-850" />
});

const FinalCTA = dynamic(() => import('@/components/landing/FinalCTA').then(mod => ({ default: mod.FinalCTA })), {
  loading: () => <div className="h-32 animate-pulse bg-dark-850" />
});

const Footer = dynamic(() => import('@/components/landing/Footer').then(mod => ({ default: mod.Footer })), {
  loading: () => <div className="h-32 animate-pulse bg-dark-850" />
});

export default function Home() {
  const [formOpen, setFormOpen] = useState(false);
  const [preselectedCategory, setPreselectedCategory] = useState<string | undefined>(undefined);

  const openForm = (category?: string) => {
    setPreselectedCategory(category);
    setFormOpen(true);
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How does it work?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "You share ChatGPT conversation link. We analyze communication patterns, problem-solving style, and authentic personality, then match you with compatible people. Only insights are shared, never raw conversations."
        }
      },
      {
        "@type": "Question",
        "name": "Is my data private?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, 100% private. Here's how it works: (1) You have a conversation with ChatGPT where it analyzes your personality from your chat history. (2) You share that conversation link with us. (3) We extract only ChatGPT's personality insights about you, not your underlying chat history. (4) You review and approve everything before it's shared with potential matches. Your original chats with ChatGPT remain private and are never shared."
        }
      },
      {
        "@type": "Question",
        "name": "Which AI tools do you support?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We're starting with ChatGPT (most widely used, 200M+ weekly users). Support for other tools coming in Phase 2 based on demand."
        }
      },
      {
        "@type": "Question",
        "name": "When will this launch?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `We're launching invite-only in ${LAUNCH_COPY.SHORT}, starting with early waitlist members. We'll launch the category with strongest demand first, validate product-market fit, then expand to other categories.`
        }
      },
      {
        "@type": "Question",
        "name": "How much does it cost?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We're testing three categories in Phase 1 (hiring, dating, co-founder matching) to find the strongest product-market fit. Pricing will depend on which category launches first and its business model. Early waitlist members will receive special founding member rates and priority access."
        }
      },
      {
        "@type": "Question",
        "name": "What if I don't have extensive ChatGPT history?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "The personality prompt we provide works even with limited history. ChatGPT analyzes patterns from your past conversations to generate insights. If you're brand new to ChatGPT, we can offer alternative assessment methods, though AI conversations provide the most authentic signal."
        }
      }
    ]
  };

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Authentyc",
    "legalName": "Authentyc AI, Inc.",
    "url": "https://authentyc.ai",
    "logo": "https://epdjtermjtfijzmhxzoo.supabase.co/storage/v1/object/public/Public/authentyc-symbol-emerald.svg",
    "foundingDate": "2025",
    "description": "AI-powered conversation analysis reveals authentic compatibility for hiring, dating, and co-founder matching."
  };

  return (
    <main id="main-content" className="min-h-screen">
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />

      {/* Analytics tracking */}
      <PageAnalytics />

      {/* Hero Section */}
      <Hero onCTAClick={() => openForm()} />

      {/* Problem Section */}
      <ProblemSection />

      {/* Solution Section */}
      <SolutionSection />

      {/* How It Works */}
      <HowItWorks />

      {/* Category Selection Cards (with embedded ChatGPT Analyzer) */}
      <CategoryCards />

      {/* FAQ Section */}
      <FAQ />

      {/* Final CTA */}
      <FinalCTA onCTAClick={() => openForm()} />

      {/* Footer */}
      <Footer />

      {/* Waitlist Form Modal */}
      <WaitlistForm
        open={formOpen}
        onOpenChange={setFormOpen}
        preselectedCategory={preselectedCategory}
      />
    </main>
  );
}
