/**
 * OpenAI Analysis Prompts
 *
 * Prompt templates for personality analysis of ChatGPT conversations.
 */

import { ParsedConversation } from '../chatgpt/parser';

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
