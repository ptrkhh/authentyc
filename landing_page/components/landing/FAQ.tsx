/**
 * FAQ Section
 *
 * Accordion-style FAQ.
 * Copy from LANDING_PAGE_PLAN.md lines 398-455
 */

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export function FAQ() {
  const faqs = [
    {
      q: 'How does it work?',
      a: 'You share AI conversation links (ChatGPT, Claude, Gemini, etc.). We analyze communication patterns, problem-solving style, and authentic personality—then match you with compatible people. Only insights are shared, never raw conversations.',
    },
    {
      q: 'Is my data private?',
      a: 'Yes. You control what conversations you share. We encrypt all data, never sell it, and never show your raw conversations to anyone. Only structured insights (e.g., "collaborative communication style") are used for matching. You can delete your data anytime.',
    },
    {
      q: 'Which AI tools do you support?',
      a: "We're starting with ChatGPT (most widely used, 200M+ weekly users). Support for Claude and Gemini coming in Phase 2 based on demand.",
    },
    {
      q: 'When will this launch?',
      a: "We're launching invite-only in Q1 2026, starting with early waitlist members. We'll focus on the category with strongest demand first, then expand to others.",
    },
    {
      q: 'How much does it cost?',
      a: "Pricing isn't finalized yet. For individual users (dating/founder matching), we're exploring freemium models with premium features. For companies (B2B hiring in Phase 2), expect $30K-75K/year. Early waitlist members will get founding member pricing.",
    },
    {
      q: "What if I don't have extensive ChatGPT history?",
      a: "The personality prompt we provide works even with limited history. ChatGPT analyzes patterns from your past conversations to generate insights. If you're brand new to ChatGPT, we can offer alternative assessment methods, though AI conversations provide the most authentic signal.",
    },
  ];

  return (
    <section className="py-20 px-4 bg-gray-50">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12">Frequently Asked Questions</h2>

        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, idx) => (
            <AccordionItem key={idx} value={`item-${idx}`}>
              <AccordionTrigger className="text-left font-semibold">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-gray-600">{faq.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
