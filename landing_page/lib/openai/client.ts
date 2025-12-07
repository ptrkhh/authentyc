/**
 * Gemini AI Client
 *
 * Wrapper for Google Gemini API using gemini-2.5-flash for cost-effective analysis.
 */

import { GoogleGenerativeAI } from '@google/generative-ai';

if (!process.env.GEMINI_API_KEY) {
  throw new Error('Missing GEMINI_API_KEY environment variable');
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Use gemini-2.5-flash for cost-effectiveness
export const MODEL = 'gemini-2.5-flash';

export const gemini = genAI.getGenerativeModel({
  model: MODEL,
  generationConfig: {
    temperature: 0.7,
    maxOutputTokens: 4096, // Increased to allow full character generation without truncation
    responseMimeType: "application/json",
  },
});
