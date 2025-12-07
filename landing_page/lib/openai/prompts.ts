/**
 * OpenAI Analysis Prompts
 *
 * Prompt templates for personality analysis of ChatGPT conversations.
 */

import { ParsedConversation } from '../chatgpt/parser';
import { CHARACTER_TEMPLATES } from '@/lib/constants/simulated-characters';
import type { Category, SimulatedCharacter } from '@/components/landing/SimulationResults';

/**
 * Build a prompt for quick personality analysis (3 key insights)
 */
export function buildQuickAnalysisPrompt(conversation: ParsedConversation): string {
  const conversationText = conversation.messages
    .map((m) => `${m.role.toUpperCase()}: ${m.content}`)
    .join('\n\n');

  return `Analyze this ChatGPT conversation and provide 3 key personality insights.

CONVERSATION:
${conversationText}

Provide exactly 3 concise insights (each 1-2 sentences) about this person's:
1. Communication style
2. Problem-solving approach
3. One notable strength or characteristic

Format as JSON:
{
  "insights": ["insight 1", "insight 2", "insight 3"],
  "overall_vibe": "one sentence summary"
}

Be objective and evidence-based. Return ONLY valid JSON.`;
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
 * Build prompt for generating 5 personalized character matches
 *
 * Design Principles:
 * - Reference existing templates as structural examples (few-shot learning)
 * - Ensure diversity in match scores (not all 90%+)
 * - Context-aware: Use personality analysis results
 * - Specific to category (hiring/dating/founder)
 */
export function buildCharacterGenerationPrompt(
  personalityAnalysis: {
    overall_vibe: string;
    insights: string[];
  },
  category: Category,
  conversationSample: string
): string {
  // Category-specific guidance
  const CATEGORY_GUIDANCE = {
    hiring: {
      entityType: 'companies/roles',
      roleExamples: ['Senior Software Engineer at TechNova', 'Product Manager at BlueSky Analytics'],
      focusAreas: 'work style, collaboration preferences, technical environment, team dynamics',
      matchScoreRange: [62, 94],
    },
    dating: {
      entityType: 'potential partners',
      roleExamples: ['Creative Professional', 'Software Developer', 'Marketing Manager'],
      focusAreas: 'communication style, emotional needs, lifestyle preferences, relationship values',
      matchScoreRange: [58, 92],
    },
    founder: {
      entityType: 'co-founders',
      roleExamples: ['Technical Co-founder', 'Growth Expert', 'Product Visionary'],
      focusAreas: 'decision-making style, risk tolerance, work pace, complementary skills',
      matchScoreRange: [65, 93],
    },
  };

  const guidance = CATEGORY_GUIDANCE[category];

  return `You are an expert matchmaking system generating realistic ${category} matches.

PERSONALITY ANALYSIS RESULTS:
Overall Vibe: ${personalityAnalysis.overall_vibe}
Key Insights:
${personalityAnalysis.insights.map((insight, index) => `${index + 1}. ${insight}`).join('\n')}

CONVERSATION SAMPLE:
${conversationSample}

TASK: Generate 5 diverse ${guidance.entityType} that would match this person's personality with varying compatibility levels.

CRITICAL REQUIREMENTS:
1. DIVERSE MATCH SCORES: Generate scores distributed across the range ${guidance.matchScoreRange[0]}-${guidance.matchScoreRange[1]}%
   - 1 high match (${guidance.matchScoreRange[1] - 5} to ${guidance.matchScoreRange[1]}%)
   - 2 good matches (${guidance.matchScoreRange[1] - 15} to ${guidance.matchScoreRange[1] - 8}%)
   - 1 medium match (${Math.floor((guidance.matchScoreRange[0] + guidance.matchScoreRange[1]) / 2) - 5} to ${Math.floor((guidance.matchScoreRange[0] + guidance.matchScoreRange[1]) / 2) + 5}%)
   - 1 lower match (${guidance.matchScoreRange[0]} to ${guidance.matchScoreRange[0] + 10}%)

2. REALISTIC NAMES: Use real-sounding names/company names (not generic like "John Doe" or "Acme Corp")

3. ALIGNMENT POINTS: Each character must have EXACTLY 3 alignment points that:
   - Are specific and evidence-based (reference the personality analysis)
   - Explain WHY this person would work well with this ${category === 'hiring' ? 'role/company' : 'match'}
   - Focus on: ${guidance.focusAreas}

4. CHALLENGES: Each character must have EXACTLY 2 challenge points that:
   - Are realistic potential friction points
   - NOT dealbreakers (these are workable challenges)
   - Framed constructively ("may need to...", "could differ on...")

5. DIVERSITY: Ensure the 5 characters represent diverse:
   - Match scores (as specified above)
   - Personality types (e.g., introverted vs extroverted, analytical vs creative)
   - ${category === 'hiring' ? 'Company cultures and role types' : category === 'dating' ? 'Lifestyle and communication styles' : 'Founder archetypes and skill sets'}

REFERENCE EXAMPLES (for structure only - do NOT copy these verbatim):
${JSON.stringify(getTemplateExamples(category), null, 2)}

OUTPUT FORMAT (valid JSON):
{
  "characters": [
    {
      "name": "string (realistic name)",
      "role": "string (${guidance.roleExamples[0]} format)",
      "matchScore": number (${guidance.matchScoreRange[0]}-${guidance.matchScoreRange[1]}),
      "alignment": ["string", "string", "string"],
      "challenges": ["string", "string"]
    }
    // ... 4 more characters
  ]
}

IMPORTANT:
- Return ONLY valid JSON
- Exactly 5 characters
- Match scores distributed as specified
- Each character unique and personalized to the personality analysis
- Alignment and challenges directly reference the personality insights when relevant`;
}
