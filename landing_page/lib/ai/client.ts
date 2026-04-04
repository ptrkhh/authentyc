/**
 * Gemini AI Client
 *
 * Wrapper for Google Gemini API using gemini-2.5-flash for cost-effective analysis.
 *
 * Uses structured input (systemInstruction + user content) to prevent
 * prompt injection from user-provided conversation text.
 */

import { GoogleGenerativeAI } from '@google/generative-ai';

if (!process.env.GEMINI_API_KEY) {
  throw new Error('Missing GEMINI_API_KEY environment variable');
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Use gemini-2.5-flash for cost-effectiveness
export const MODEL = 'gemini-2.5-flash';

const BASE_GENERATION_CONFIG = {
  temperature: 0.7,
  maxOutputTokens: 4096,
  responseMimeType: "application/json" as const,
};

/**
 * Default model instance (no system instruction).
 * Prefer createModelWithSystemInstruction() for requests involving user data.
 */
export const gemini = genAI.getGenerativeModel({
  model: MODEL,
  generationConfig: BASE_GENERATION_CONFIG,
});

/**
 * Create a Gemini model instance with a system instruction.
 *
 * This separates system-level instructions from user-provided content,
 * preventing user text from being interpreted as system instructions.
 */
export function createModelWithSystemInstruction(systemInstruction: string) {
  return genAI.getGenerativeModel({
    model: MODEL,
    generationConfig: BASE_GENERATION_CONFIG,
    systemInstruction,
  });
}
