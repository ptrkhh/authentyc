/**
 * FAQ Section - Dark Design
 *
 * Accordion-style FAQ with emerald accents.
 */

'use client';

import { motion } from 'framer-motion';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { GradientText } from '@/components/ui/gradient-text';

const FAQS = [
  {
    q: 'How does it work?',
    a: 'You share ChatGPT conversation link. We analyze communication patterns, problem-solving style, and authentic personality, then match you with compatible people. Only insights are shared, never raw conversations.',
  },
  {
    q: 'Is my data private?',
    a: 'Yes. You share a ChatGPT conversation link that contains insights generated about your personality, not your private conversations. We only access what ChatGPT\'s analysis reveals, and you review it first. Your original chats stay private.',
  },
  {
    q: 'Which AI tools do you support?',
    a: "We're starting with ChatGPT (most widely used, 200M+ weekly users). Support for other tools coming in Phase 2 based on demand.",
  },
  {
    q: 'When will this launch?',
    a: "We're launching invite-only in Q1 2026, starting with early waitlist members. We'll launch the category with strongest demand first, validate product-market fit, then expand to other categories.",
  },
  {
    q: 'How much does it cost?',
    a: "We're testing three categories in Phase 1 (hiring, dating, co-founder matching) to find the strongest product-market fit. Pricing will depend on which category launches first and its business model. Early waitlist members will receive special founding member rates and priority access.",
  },
  {
    q: "What if I don't have extensive ChatGPT history?",
    a: "The personality prompt we provide works even with limited history. ChatGPT analyzes patterns from your past conversations to generate insights. If you're brand new to ChatGPT, we can offer alternative assessment methods, though AI conversations provide the most authentic signal.",
  },
];

export function FAQ() {
  return (
    <section className="relative py-36 px-4">
      <div className="max-w-3xl mx-auto">
        <motion.h2
          className="font-display text-5xl lg:text-hero font-bold text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <GradientText>Questions?</GradientText>
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Accordion type="single" collapsible className="w-full">
            {FAQS.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left font-semibold text-white hover:text-brand-primary transition-colors">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-gray-400 leading-relaxed">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}
