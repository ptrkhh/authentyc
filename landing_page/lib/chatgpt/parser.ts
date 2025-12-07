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

  console.log('[parser] HTML length:', html.length);
  console.log('[parser] HTML preview (first 500 chars):', html.substring(0, 500));
  console.log('[parser] HTML preview (last 500 chars):', html.substring(html.length - 500));

  // Strategy 1: Try to parse __NEXT_DATA__ script tag
  try {
    const nextDataScript = $('script#__NEXT_DATA__').html();
    console.log('[parser] Strategy 1: __NEXT_DATA__ found:', !!nextDataScript);

    if (nextDataScript) {
      console.log('[parser] __NEXT_DATA__ length:', nextDataScript.length);
      const data = JSON.parse(nextDataScript);
      console.log('[parser] Parsed __NEXT_DATA__, top-level keys:', Object.keys(data));
      console.log('[parser] data.props keys:', data?.props ? Object.keys(data.props) : 'no props');
      console.log('[parser] data.props.pageProps keys:', data?.props?.pageProps ? Object.keys(data.props.pageProps) : 'no pageProps');

      // Navigate to conversation in props (structure varies)
      // This is very fragile and may break
      const conversation = data?.props?.pageProps?.serverResponse?.data;
      console.log('[parser] conversation data:', !!conversation);
      console.log('[parser] conversation keys:', conversation ? Object.keys(conversation) : 'no conversation');

      if (conversation?.linear_conversation) {
        console.log('[parser] linear_conversation length:', conversation.linear_conversation.length);
        // Extract messages from linear conversation
        for (const node of conversation.linear_conversation) {
          if (node.message?.content?.parts) {
            messages.push({
              role: node.message.author.role === 'user' ? 'user' : 'assistant',
              content: node.message.content.parts.join('\n'),
            });
          }
        }
        console.log('[parser] Strategy 1: Extracted', messages.length, 'messages');
      } else {
        console.log('[parser] Strategy 1: No linear_conversation found');
      }
    }
  } catch (e) {
    console.error('[parser] Strategy 1 error:', e);
    // Strategy 1 failed, continue to Strategy 2
  }

  // Strategy 2: Parse React Server Components format (ChatGPT as of Dec 2024)
  if (messages.length === 0) {
    console.log('[parser] Strategy 2: Attempting to parse React Server Components');
    try {
      // Find script tags containing window.__reactRouterContext
      const scripts = $('script');
      let foundData = false;

      scripts.each((i, el) => {
        const scriptContent = $(el).html() || '';

        if (scriptContent.includes('window.__reactRouterContext') && scriptContent.length > 10000) {
          console.log(`[parser] Strategy 2: Found React Router context in script ${i}`);
          foundData = true;

          // Extract all strings longer than 50 chars - these are likely messages
          const stringPattern = /"([^"]{50,})"/g;
          const stringMatches = [...scriptContent.matchAll(stringPattern)];

          console.log(`[parser] Strategy 2: Found ${stringMatches.length} potential strings`);

          // Filter to only conversation messages
          const conversationMessages: string[] = [];
          for (const match of stringMatches) {
            const content = match[1];

            // Unescape the content
            const unescaped = content
              .replace(/\\n/g, '\n')
              .replace(/\\r/g, '\r')
              .replace(/\\"/g, '"')
              .replace(/\\\\/g, '\\')
              .replace(/\\t/g, '\t');

            // Filter out URLs, technical strings, metadata
            if (
              unescaped.startsWith('http') ||
              unescaped.startsWith('https://') ||
              unescaped.includes('cdn.oaistatic') ||
              unescaped.includes('window.') ||
              unescaped.includes('function(') ||
              unescaped.includes('import ') ||
              unescaped.match(/^[a-f0-9-]{36}$/i) || // UUIDs
              unescaped.includes('_v4.0') || // Model names
              unescaped.startsWith(':') || // Technical data like ":239},0.071673..."
              unescaped.match(/^[\d\.,\[\]\{\}\\:]+/) || // Starts with numbers/brackets
              unescaped.length < 20 || // Too short to be meaningful
              !unescaped.match(/[a-z]{3,}/i) // Must contain actual words
            ) {
              continue;
            }

            conversationMessages.push(unescaped);
          }

          console.log(`[parser] Strategy 2: Filtered to ${conversationMessages.length} conversation messages`);

          // Assign roles using simple alternation starting with user
          // This heuristic works because ChatGPT conversations typically alternate user/assistant
          conversationMessages.forEach((content, index) => {
            const role = index % 2 === 0 ? 'user' : 'assistant';
            messages.push({ role, content });
          });

          console.log('[parser] Strategy 2: Extracted', messages.length, 'messages');
        }
      });

      if (!foundData) {
        console.log('[parser] Strategy 2: No React Router context found');
      }
    } catch (e) {
      console.error('[parser] Strategy 2 error:', e);
    }
  }

  // Strategy 3: Fallback - parse visible HTML elements
  if (messages.length === 0) {
    console.log('[parser] Strategy 3: Attempting to parse visible HTML elements (fallback)');
    // Look for message containers
    const selector = '.group\\/conversation-turn, [data-testid*="conversation"]';
    const elements = $(selector);
    console.log('[parser] Strategy 3: Found', elements.length, 'elements with selector:', selector);

    elements.each((index, element) => {
      const $el = $(element);
      const content = $el.text().trim();
      console.log(`[parser] Strategy 3: Element ${index} - content length:`, content.length);

      if (content.length > 10) {
        const role = index % 2 === 0 ? 'user' : 'assistant';
        messages.push({ role, content });
      }
    });

    console.log('[parser] Strategy 3: Extracted', messages.length, 'messages');
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

  console.log('[parser] ========== FINAL PARSING RESULTS ==========');
  console.log('[parser] Messages extracted:', messages.length);
  console.log('[parser] Has personality prompt:', hasPersonalityPrompt);
  console.log('[parser] Estimated quality:', estimatedQuality);
  console.log('[parser] Page title:', $('title').text().trim());
  if (messages.length > 0) {
    console.log('[parser] First message preview:', messages[0].content.substring(0, 100));
  }
  console.log('[parser] ===============================================');

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
    return {
      valid: false,
      reason: 'This shared link appears to be empty. Please make sure you have a conversation with at least 5-10 message exchanges before sharing the link.'
    };
  }

  if (parsed.messageCount < 2) {
    return {
      valid: false,
      reason: 'This conversation is too short. Please have at least 5-10 message exchanges for accurate analysis.'
    };
  }

  const totalContent = parsed.messages.reduce((sum, m) => sum + m.content.length, 0);
  if (totalContent < 100) {
    return {
      valid: false,
      reason: 'This conversation doesn\'t have enough content. Try having a longer, more detailed conversation (5-10 exchanges).'
    };
  }

  return { valid: true };
}
