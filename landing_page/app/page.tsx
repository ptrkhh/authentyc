/**
 * Main Landing Page
 *
 * Integrates all landing page sections in order:
 * 1. Hero
 * 2. Problem Section
 * 3. Solution Section
 * 4. How It Works
 * 5. ChatGPT Analyzer (Interactive Feature)
 * 6. Category Cards
 * 7. FAQ
 * 8. Final CTA
 * 9. Footer
 */

import { Hero } from '@/components/landing/Hero';
import { ProblemSection } from '@/components/landing/ProblemSection';
import { SolutionSection } from '@/components/landing/SolutionSection';
import { HowItWorks } from '@/components/landing/HowItWorks';
import { ChatAnalyzer } from '@/components/landing/ChatAnalyzer';
import { CategoryCards } from '@/components/landing/CategoryCards';
import { FAQ } from '@/components/landing/FAQ';
import { FinalCTA } from '@/components/landing/FinalCTA';
import { Footer } from '@/components/landing/Footer';
import { PageAnalytics } from '@/components/analytics/PageAnalytics';

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Analytics tracking */}
      <PageAnalytics />

      {/* Hero Section */}
      <Hero />

      {/* Problem Section */}
      <ProblemSection />

      {/* Solution Section */}
      <SolutionSection />

      {/* How It Works */}
      <HowItWorks />

      {/* Interactive ChatGPT Analyzer - Key Differentiator */}
      <ChatAnalyzer />

      {/* Category Selection Cards */}
      <CategoryCards />

      {/* FAQ Section */}
      <FAQ />

      {/* Final CTA */}
      <FinalCTA />

      {/* Footer */}
      <Footer />
    </main>
  );
}
