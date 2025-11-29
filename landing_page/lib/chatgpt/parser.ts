/**
 * ChatGPT HTML Parser
 *
 * ⚠️  CRITICAL WARNING: This is the most fragile component.
 * ChatGPT's HTML structure changes frequently without notice.
 * Expect to update this parser monthly.
 *
 * Implements multiple parsing strategies for robustness.
 */

import * as cheerio from 'cheerio';

export interface ParsedConversation {
  messages: Array<{
    role: 'user' | 'assistant';
    content: string;
  }>;
  messageCount: number;
  title?: string;
  hasPersonalityPrompt: boolean;
  estimatedQuality: 'high' | 'medium' | 'low';
}

/**
 * Parse ChatGPT share link HTML to extract conversation
 */
export function parseChatGPTShareHTML(html: string): ParsedConversation {
  const $ = cheerio.load(html);
  const messages: ParsedConversation['messages'] = [];

  // Strategy 1: Try to parse __NEXT_DATA__ script tag
  try {
    const nextDataScript = $('script#__NEXT_DATA__').html();
    if (nextDataScript) {
      const data = JSON.parse(nextDataScript);
      // Navigate to conversation in props (structure varies)
      // This is very fragile and may break
      const conversation = data?.props?.pageProps?.serverResponse?.data;
      if (conversation?.linear_conversation) {
        // Extract messages from linear conversation
        for (const node of conversation.linear_conversation) {
          if (node.message?.content?.parts) {
            messages.push({
              role: node.message.author.role === 'user' ? 'user' : 'assistant',
              content: node.message.content.parts.join('\n'),
            });
          }
        }
      }
    }
  } catch (e) {
    // Strategy 1 failed, continue to Strategy 2
  }

  // Strategy 2: Parse visible HTML elements
  if (messages.length === 0) {
    // Look for message containers
    // TODO: Update these selectors as ChatGPT UI changes
    $('.group\\/conversation-turn, [data-testid*="conversation"]').each((index, element) => {
      const $el = $(element);
      const content = $el.text().trim();

      if (content.length > 10) {
        const role = index % 2 === 0 ? 'user' : 'assistant';
        messages.push({ role, content });
      }
    });
  }

  // Check for personality prompt keywords
  const fullText = messages.map((m) => m.content).join(' ').toLowerCase();
  const hasPersonalityPrompt =
    fullText.includes('personality') ||
    fullText.includes('communication style') ||
    fullText.includes('objective analysis');

  // Estimate quality
  let estimatedQuality: 'high' | 'medium' | 'low' = 'low';
  if (messages.length >= 2) {
    const avgLength =
      messages.reduce((sum, m) => sum + m.content.length, 0) / messages.length;
    if (avgLength > 500 && hasPersonalityPrompt) {
      estimatedQuality = 'high';
    } else if (avgLength > 200) {
      estimatedQuality = 'medium';
    }
  }

  return {
    messages,
    messageCount: messages.length,
    title: $('title').text().trim() || undefined,
    hasPersonalityPrompt,
    estimatedQuality,
  };
}

/**
 * Validate parsed conversation quality
 */
export function validateParsedConversation(parsed: ParsedConversation): {
  valid: boolean;
  reason?: string;
} {
  if (parsed.messageCount === 0) {
    return { valid: false, reason: 'No messages found in conversation' };
  }

  if (parsed.messageCount < 2) {
    return { valid: false, reason: 'Conversation too short (need at least 2 messages)' };
  }

  const totalContent = parsed.messages.reduce((sum, m) => sum + m.content.length, 0);
  if (totalContent < 100) {
    return { valid: false, reason: 'Conversation content too short' };
  }

  return { valid: true };
}
