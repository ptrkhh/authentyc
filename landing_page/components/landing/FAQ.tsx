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
import { LAUNCH_COPY } from '@/lib/constants';

const FAQS = [
  {
    q: 'How does it work?',
    a: 'You share ChatGPT conversation link. We analyze communication patterns, problem-solving style, and authentic personality, then match you with compatible people. Only insights are shared, never raw conversations.',
  },
  {
    q: 'Is my data private?',
    a: 'Yes, 100% private. Here\'s how it works: (1) You have a conversation with ChatGPT where it analyzes your personality from your chat history. (2) You share that conversation link with us. (3) We extract only ChatGPT\'s personality insights about you, not your underlying chat history. (4) You review and approve everything before it\'s shared with potential matches. Your original chats with ChatGPT remain private and are never shared.',
  },
  {
    q: 'Which AI tools do you support?',
    a: "We're starting with ChatGPT (most widely used, 200M+ weekly users). Support for other tools coming in Phase 2 based on demand.",
  },
  {
    q: 'When will this launch?',
    a: `We're launching invite-only in ${LAUNCH_COPY.SHORT}, starting with early waitlist members. We'll launch the category with strongest demand first, validate product-market fit, then expand to other categories.`,
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
                <AccordionContent className="text-gray-300 leading-relaxed">
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
