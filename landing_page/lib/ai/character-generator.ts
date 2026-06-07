/**
 * AI-Powered Character Generation
 *
 * Generates personalized character matches using Gemini API
 * Falls back to template-based generation on failure
 */

import { createModelWithSystemInstruction } from './client';
import { buildCharacterGenerationPrompt } from './prompts';
import { generateSimulatedCharacters, CHARACTER_TEMPLATES } from '@/lib/constants/simulated-characters';
import { withRetry } from '@/lib/utils/retry';
import { parseJsonLenient } from '@/lib/utils/json';
import type { SimulatedCharacter, Category } from '@/components/landing/SimulationResults';

interface GenerationInput {
  personalityAnalysis: {
    overall_vibe: string;
    insights: string[];
  };
  category: Category;
  conversationSample: string;
}

interface GeminiCharacterResponse {
  characters: Array<{
    name: string;
    role: string;
    matchScore: number;
    alignment: string[];
    challenges: string[];
  }>;
}

/**
 * Generate 6 personalized characters using Gemini
 *
 * @throws Error if generation fails (caller should handle fallback)
 */
export async function generatePersonalizedCharacters(
  input: GenerationInput
): Promise<SimulatedCharacter[]> {
  const { personalityAnalysis, category, conversationSample } = input;

  // Build structured prompt once (fetches from database; not re-fetched per retry).
  const { systemInstruction, userContent } = await buildCharacterGenerationPrompt(
    personalityAnalysis,
    category,
    conversationSample
  );

  // Larger token budget than the shared 4096 default: six fully-populated
  // characters can run long and truncate into invalid JSON.
  const model = createModelWithSystemInstruction(systemInstruction, { maxOutputTokens: 8192 });

  // Retry the whole generate→parse→validate cycle. The char-gen path previously
  // had NO retry (unlike analysis), so a single truncated/malformed Gemini roll
  // fell straight through to template fallback (used_fallback:true). Re-rolling
  // recovers the common transient case before we give up.
  return withRetry(async () => {
    const result = await model.generateContent(userContent);
    const response = await result.response;

    if (response.promptFeedback?.blockReason) {
      throw new Error(`Content blocked: ${response.promptFeedback.blockReason}`);
    }

    const responseText = response.text();
    if (!responseText) {
      const finishReason = response.candidates?.[0]?.finishReason;
      throw new Error(`Empty response from Gemini (finishReason: ${finishReason ?? 'unknown'})`);
    }

    // Parse JSON response (tolerant of fences/prose; truncation still throws → retry)
    let parsed: GeminiCharacterResponse;
    try {
      parsed = parseJsonLenient<GeminiCharacterResponse>(responseText);
    } catch {
      const finishReason = response.candidates?.[0]?.finishReason;
      console.error(
        `[character-generator] JSON parse error (finishReason: ${finishReason ?? 'unknown'}, len: ${responseText.length}): ${responseText.slice(0, 200)}`
      );
      throw new Error('Invalid JSON response from Gemini');
    }

    // Validate response structure
    if (!parsed.characters || !Array.isArray(parsed.characters)) {
      throw new Error('Invalid response structure: missing characters array');
    }

    if (parsed.characters.length !== 6) {
      throw new Error(`Expected 6 characters, got ${parsed.characters.length}`);
    }

    // Transform to SimulatedCharacter format
    const characters: SimulatedCharacter[] = parsed.characters.map((char, index) => {
      // Validate required fields
      if (!char.name || !char.role || typeof char.matchScore !== 'number') {
        throw new Error(`Character ${index} missing required fields`);
      }

      if (!Array.isArray(char.alignment) || char.alignment.length !== 3) {
        throw new Error(`Character ${index} must have exactly 3 alignment points`);
      }

      if (!Array.isArray(char.challenges) || char.challenges.length !== 2) {
        throw new Error(`Character ${index} must have exactly 2 challenges`);
      }

      // Assign avatar color from template pool
      const template = CHARACTER_TEMPLATES[category];
      const avatarColor = template.avatarColors[index % template.avatarColors.length];

      return {
        id: `${category}-gen-${index}`,
        name: char.name,
        role: char.role,
        avatarColor,
        matchScore: char.matchScore,
        alignment: char.alignment,
        challenges: char.challenges,
        category,
      };
    });

    // Sort by match score descending
    characters.sort((a, b) => b.matchScore - a.matchScore);

    return characters;
  }, { attempts: 3, baseDelayMs: 500 });
}

/**
 * Fallback: Generate characters using templates
 * This is the existing implementation
 */
export function generateFallbackCharacters(category: Category): SimulatedCharacter[] {
  return generateSimulatedCharacters(category);
}
