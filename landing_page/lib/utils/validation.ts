/**
 * Validation Schemas
 *
 * Zod schemas for request validation.
 */

import { z } from 'zod';

/**
 * Sanitize user input to prevent prompt injection.
 * Strips {{...}} template syntax and common injection patterns.
 */
export function sanitizeUserInput(input: string): string {
  return input
    .replace(/\{\{.*?\}\}/g, '')        // Remove template placeholders
    .replace(/---\s*(SYSTEM|INSTRUCTION|PROMPT)/gi, '') // Remove role injection markers
    .trim();
}

/** Max request body size in bytes (50KB) */
export const MAX_BODY_SIZE = 50 * 1024;

/**
 * Waitlist submission schema
 */
export const waitlistSchema = z
  .object({
    email: z.string().email('Invalid email address').max(254),
    interests: z
      .array(
        z.enum([
          'hiring_recruiter',
          'hiring_jobseeker',
          'dating',
          'cofounder',
          'mastermind',
          'other',
        ])
      )
      .min(1, 'Please select at least one interest')
      .max(6),
    other_interest_detail: z.string().max(500).optional(),
    has_ai_history: z.enum(['extensive', 'some', 'willing', 'none']).optional(),
  })
  .refine(
    (data) => {
      // If 'other' is selected, other_interest_detail must be provided
      if (data.interests.includes('other')) {
        return data.other_interest_detail && data.other_interest_detail.trim().length > 0;
      }
      return true;
    },
    {
      message: 'Please describe what you\'re interested in',
      path: ['other_interest_detail'],
    }
  );

/**
 * ChatGPT analysis request schema
 */
export const analyzeRequestSchema = z.object({
  shareUrl: z.string().url('Invalid URL').max(2048),
  category: z.enum(['hiring', 'dating', 'cofounder']),
  manualText: z.string().max(50000).optional(),
});
