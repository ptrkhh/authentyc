/**
 * AI-Powered Character Generation
 *
 * Generates personalized character matches using Gemini API
 * Falls back to template-based generation on failure
 */

import { gemini } from './client';
import { buildCharacterGenerationPrompt } from './prompts';
import { generateSimulatedCharacters, CHARACTER_TEMPLATES } from '@/lib/constants/simulated-characters';
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
 * Generate 5 personalized characters using Gemini
 *
 * @throws Error if generation fails (caller should handle fallback)
 */
export async function generatePersonalizedCharacters(
  input: GenerationInput
): Promise<SimulatedCharacter[]> {
  const { personalityAnalysis, category, conversationSample } = input;

  // Build prompt
  const prompt = buildCharacterGenerationPrompt(
    personalityAnalysis,
    category,
    conversationSample
  );

  console.log('[character-generator] Generating characters for category:', category);
  console.log('[character-generator] Prompt length:', prompt.length);

  // Call Gemini API
  const result = await gemini.generateContent(prompt);
  const response = await result.response;

  // Check for errors
  if (response.promptFeedback?.blockReason) {
    throw new Error(`Content blocked: ${response.promptFeedback.blockReason}`);
  }

  const responseText = response.text();
  if (!responseText) {
    throw new Error('Empty response from Gemini');
  }

  console.log('[character-generator] Response length:', responseText.length);

  // Parse JSON response
  let parsed: GeminiCharacterResponse;
  try {
    parsed = JSON.parse(responseText);
  } catch (parseError) {
    console.error('[character-generator] JSON parse error:', parseError);
    console.error('[character-generator] Raw response:', responseText.substring(0, 500));
    throw new Error('Invalid JSON response from Gemini');
  }

  // Validate response structure
  if (!parsed.characters || !Array.isArray(parsed.characters)) {
    throw new Error('Invalid response structure: missing characters array');
  }

  if (parsed.characters.length !== 5) {
    throw new Error(`Expected 5 characters, got ${parsed.characters.length}`);
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

  console.log('[character-generator] Successfully generated characters:',
    characters.map(character => `${character.name} (${character.matchScore}%)`).join(', ')
  );

  return characters;
}

/**
 * Fallback: Generate characters using templates
 * This is the existing implementation
 */
export function generateFallbackCharacters(category: Category): SimulatedCharacter[] {
  console.log('[character-generator] Using fallback template generation');
  return generateSimulatedCharacters(category);
}
