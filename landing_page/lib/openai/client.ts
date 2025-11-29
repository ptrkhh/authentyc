/**
 * OpenAI Client
 *
 * Wrapper for OpenAI API using gpt-4o-mini for cost-effective analysis.
 */

import OpenAI from 'openai';

if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing OPENAI_API_KEY environment variable');
}

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Use gpt-4o-mini for cost-effectiveness (~$0.15 per 1M input tokens)
export const MODEL = 'gpt-4o-mini';
