/**
 * Conversation Starter Prompts
 *
 * Pre-written prompts users can copy to ChatGPT to generate
 * authentic conversations for personality analysis.
 *
 * NOTE: Prompts are now fetched from the database for easy updates
 * without redeployment.
 */

import { getPrompts } from '@/lib/prompts/service';

export interface ConversationPrompt {
  category: 'hiring' | 'dating' | 'cofounder';
  title: string;
  prompt: string;
  description: string;
}

/**
 * Fetch all conversation starter prompts from database
 */
export async function getConversationPrompts(): Promise<ConversationPrompt[]> {
  const promptKeys = ['conversation-hiring', 'conversation-dating', 'conversation-cofounder'];
  const prompts = await getPrompts(promptKeys);

  const conversationPrompts: ConversationPrompt[] = [];

  const categories: Array<'hiring' | 'dating' | 'cofounder'> = ['hiring', 'dating', 'cofounder'];
  categories.forEach((category) => {
    const key = `conversation-${category}`;
    const prompt = prompts.get(key);

    if (prompt) {
      conversationPrompts.push({
        category,
        title: prompt.metadata.title || '',
        prompt: prompt.content,
        description: prompt.metadata.description || '',
      });
    }
  });

  return conversationPrompts;
}

/**
 * Get prompt by category
 */
export async function getPromptByCategory(
  category: 'hiring' | 'dating' | 'cofounder'
): Promise<ConversationPrompt | null> {
  const prompts = await getConversationPrompts();
  return prompts.find((p) => p.category === category) || null;
}
