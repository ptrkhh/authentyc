/**
 * OpenAI Analysis Prompts
 *
 * Prompt templates for personality analysis of ChatGPT conversations.
 *
 * NOTE: Prompts are now fetched from the database for easy updates
 * without redeployment.
 */

import { ParsedConversation } from '../chatgpt/parser';
import { CHARACTER_TEMPLATES } from '@/lib/constants/simulated-characters';
import type { Category, SimulatedCharacter } from '@/components/landing/SimulationResults';
import { getPrompt, replacePlaceholders, trackPromptUsage } from '@/lib/prompts/service';

/**
 * Build a prompt for quick personality analysis (3 key insights)
 */
export async function buildQuickAnalysisPrompt(conversation: ParsedConversation): Promise<string> {
  const conversationText = conversation.messages
    .map((m) => `${m.role.toUpperCase()}: ${m.content}`)
    .join('\n\n');

  // Fetch prompt from database
  const promptRecord = await getPrompt('analysis-quick');

  if (!promptRecord) {
    throw new Error('Quick analysis prompt not found in database');
  }

  // Replace placeholders
  const prompt = replacePlaceholders(promptRecord.content, {
    CONVERSATION: conversationText,
  });

  return prompt;
}

/**
 * Get 2 template examples for few-shot learning
 */
function getTemplateExamples(category: Category): SimulatedCharacter[] {
  const template = CHARACTER_TEMPLATES[category];
  return [
    {
      id: `${category}-example-1`,
      name: template.names[0],
      role: template.roles[0],
      avatarColor: template.avatarColors[0],
      matchScore: 88,
      alignment: template.alignmentTemplates[0],
      challenges: template.challengeTemplates[0],
      category,
    },
    {
      id: `${category}-example-2`,
      name: template.names[1],
      role: template.roles[1],
      avatarColor: template.avatarColors[1],
      matchScore: 67,
      alignment: template.alignmentTemplates[1],
      challenges: template.challengeTemplates[1],
      category,
    },
  ];
}

/**
 * Build prompt for generating 6 personalized character matches
 *
 * Design Principles:
 * - Reference existing templates as structural examples (few-shot learning)
 * - Ensure diversity in match scores (not all 90%+)
 * - Context-aware: Use personality analysis results
 * - Specific to category (hiring/dating/founder)
 */
export async function buildCharacterGenerationPrompt(
  personalityAnalysis: {
    overall_vibe: string;
    insights: string[];
  },
  category: Category,
  conversationSample: string
): Promise<string> {
  // Category-specific guidance
  const CATEGORY_GUIDANCE = {
    hiring: {
      entityType: 'companies/roles',
      roleExamples: ['Senior Software Engineer at TechNova', 'Product Manager at BlueSky Analytics'],
      focusAreas: 'work style, collaboration preferences, technical environment, team dynamics',
      matchScoreRange: [62, 94],
      matchContext: 'role/company',
      diversityDimension: 'Company cultures and role types',
    },
    dating: {
      entityType: 'potential partners',
      roleExamples: ['Creative Professional', 'Software Developer', 'Marketing Manager'],
      focusAreas: 'communication style, emotional needs, lifestyle preferences, relationship values',
      matchScoreRange: [58, 92],
      matchContext: 'match',
      diversityDimension: 'Lifestyle and communication styles',
    },
    founder: {
      entityType: 'co-founders',
      roleExamples: ['Technical Co-founder', 'Growth Expert', 'Product Visionary'],
      focusAreas: 'decision-making style, risk tolerance, work pace, complementary skills',
      matchScoreRange: [65, 93],
      matchContext: 'match',
      diversityDimension: 'Founder archetypes and skill sets',
    },
  };

  const guidance = CATEGORY_GUIDANCE[category];

  // Fetch prompt from database
  const promptRecord = await getPrompt('character-generation');

  if (!promptRecord) {
    throw new Error('Character generation prompt not found in database');
  }

  // Calculate score ranges
  const scoreMin = guidance.matchScoreRange[0];
  const scoreMax = guidance.matchScoreRange[1];
  const scoreHighMin = scoreMax - 5;
  const scoreHighMax = scoreMax;
  const scoreGoodMin = scoreMax - 15;
  const scoreGoodMax = scoreMax - 8;
  const scoreMedMin = Math.floor((scoreMin + scoreMax) / 2) - 5;
  const scoreMedMax = Math.floor((scoreMin + scoreMax) / 2) + 5;
  const scoreLowMin = scoreMin;
  const scoreLowMax = scoreMin + 10;

  // Format insights
  const insightsFormatted = personalityAnalysis.insights
    .map((insight, index) => `${index + 1}. ${insight}`)
    .join('\n');

  // Get template examples
  const templateExamples = JSON.stringify(getTemplateExamples(category), null, 2);

  // Replace all placeholders
  const prompt = replacePlaceholders(promptRecord.content, {
    CATEGORY: category,
    OVERALL_VIBE: personalityAnalysis.overall_vibe,
    INSIGHTS: insightsFormatted,
    CONVERSATION_SAMPLE: conversationSample,
    ENTITY_TYPE: guidance.entityType,
    SCORE_MIN: scoreMin,
    SCORE_MAX: scoreMax,
    SCORE_HIGH_MIN: scoreHighMin,
    SCORE_HIGH_MAX: scoreHighMax,
    SCORE_GOOD_MIN: scoreGoodMin,
    SCORE_GOOD_MAX: scoreGoodMax,
    SCORE_MED_MIN: scoreMedMin,
    SCORE_MED_MAX: scoreMedMax,
    SCORE_LOW_MIN: scoreLowMin,
    SCORE_LOW_MAX: scoreLowMax,
    MATCH_CONTEXT: guidance.matchContext,
    FOCUS_AREAS: guidance.focusAreas,
    DIVERSITY_DIMENSION: guidance.diversityDimension,
    TEMPLATE_EXAMPLES: templateExamples,
    ROLE_EXAMPLE: guidance.roleExamples[0],
  });

  return prompt;
}
