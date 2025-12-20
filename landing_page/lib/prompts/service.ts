/**
 * Prompt Service
 *
 * Fetches prompts from database and handles placeholder substitution.
 * Supports versioning and usage tracking.
 */

import { supabaseServer } from '@/lib/supabase/server';

export interface PromptRecord {
  id: string;
  key: string;
  version: number;
  content: string;
  metadata: {
    title?: string;
    description?: string;
    category?: string;
    type?: string;
    placeholders?: string[];
  };
}

/**
 * Fetch active prompt by key
 */
export async function getPrompt(key: string): Promise<PromptRecord | null> {
  const { data, error } = await supabaseServer
    .from('prompts')
    .select('id, key, version, content, metadata')
    .eq('key', key)
    .eq('is_active', true)
    .single();

  if (error) {
    console.error(`[prompts] Error fetching prompt ${key}:`, error);
    return null;
  }

  return data;
}

/**
 * Fetch multiple prompts by keys
 */
export async function getPrompts(keys: string[]): Promise<Map<string, PromptRecord>> {
  const { data, error } = await supabaseServer
    .from('prompts')
    .select('id, key, version, content, metadata')
    .in('key', keys)
    .eq('is_active', true);

  if (error) {
    console.error('[prompts] Error fetching prompts:', error);
    return new Map();
  }

  const prompts = new Map<string, PromptRecord>();
  data?.forEach((prompt) => {
    prompts.set(prompt.key, prompt);
  });

  return prompts;
}

/**
 * Replace placeholders in prompt content
 *
 * Example: replacePlaceholders(content, { CONVERSATION: "..." })
 * Replaces {{CONVERSATION}} with the provided value
 */
export function replacePlaceholders(
  content: string,
  values: Record<string, string | number>
): string {
  let result = content;

  Object.entries(values).forEach(([key, value]) => {
    const placeholder = `{{${key}}}`;
    result = result.replace(new RegExp(placeholder, 'g'), String(value));
  });

  return result;
}

/**
 * Increment usage count for a prompt
 */
export async function trackPromptUsage(
  promptId: string,
  wasSuccessful?: boolean
): Promise<void> {
  const { error } = await supabaseServer.rpc('increment_prompt_usage', {
    prompt_id: promptId,
    was_successful: wasSuccessful ?? null,
  });

  if (error) {
    console.error('[prompts] Error tracking usage:', error);
  }
}

/**
 * Get all prompts by category (for conversation starters)
 */
export async function getPromptsByCategory(
  category: 'hiring' | 'dating' | 'cofounder'
): Promise<PromptRecord[]> {
  const { data, error } = await supabaseServer
    .from('prompts')
    .select('id, key, version, content, metadata')
    .eq('is_active', true)
    .contains('metadata', { category });

  if (error) {
    console.error(`[prompts] Error fetching prompts for category ${category}:`, error);
    return [];
  }

  return data || [];
}
