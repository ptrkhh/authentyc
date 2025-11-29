/**
 * Validation Schemas
 *
 * Zod schemas for request validation.
 */

import { z } from 'zod';

/**
 * Waitlist submission schema
 */
export const waitlistSchema = z.object({
  email: z.string().email('Invalid email address'),
  primary_interest: z.enum([
    'hiring_recruiter',
    'hiring_jobseeker',
    'dating',
    'cofounder',
    'mastermind',
    'other',
  ]),
  other_interest_detail: z.string().optional(),
  has_ai_history: z.enum(['extensive', 'some', 'none']).optional(),
});

/**
 * ChatGPT analysis request schema
 */
export const analyzeRequestSchema = z.object({
  shareUrl: z.string().url('Invalid URL'),
});
