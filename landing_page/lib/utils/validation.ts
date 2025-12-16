/**
 * Validation Schemas
 *
 * Zod schemas for request validation.
 */

import { z } from 'zod';

/**
 * Waitlist submission schema
 */
export const waitlistSchema = z
  .object({
    email: z.string().email('Invalid email address'),
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
      .min(1, 'Please select at least one interest'),
    other_interest_detail: z.string().optional(),
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
  shareUrl: z.string().url('Invalid URL'),
  category: z.enum(['hiring', 'dating', 'founder']),
  manualText: z.string().optional(),
});
