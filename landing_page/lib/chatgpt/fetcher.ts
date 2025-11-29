/**
 * ChatGPT Share Link Fetcher
 *
 * Fetches HTML from ChatGPT shared links.
 * Validates domain and response content.
 */

import { createHash } from 'crypto';

export interface FetchResult {
  success: boolean;
  html?: string;
  error?: string;
  statusCode?: number;
}

/**
 * Fetch HTML from a ChatGPT share link
 */
export async function fetchChatGPTShareLink(shareUrl: string): Promise<FetchResult> {
  try {
    const url = new URL(shareUrl);

    // Validate domain
    if (!url.hostname.includes('chatgpt.com') && !url.hostname.includes('chat.openai.com')) {
      return {
        success: false,
        error: 'Invalid ChatGPT share link. Must be from chatgpt.com',
      };
    }

    if (!url.pathname.includes('/share/')) {
      return {
        success: false,
        error: 'Invalid share link format. Must contain /share/',
      };
    }

    // Fetch with respectful User-Agent
    const response = await fetch(shareUrl, {
      headers: {
        'User-Agent': 'Authentyc Bot/1.0 (https://authentyc.ai; contact@authentyc.ai)',
        Accept: 'text/html,application/xhtml+xml',
        'Accept-Language': 'en-US,en;q=0.9',
      },
      signal: AbortSignal.timeout(10000), // 10s timeout
    });

    if (!response.ok) {
      return {
        success: false,
        error: `Failed to fetch: ${response.status}`,
        statusCode: response.status,
      };
    }

    const html = await response.text();

    // Basic validation
    if (!html.includes('ChatGPT') && !html.includes('OpenAI')) {
      return {
        success: false,
        error: 'Invalid response - not a ChatGPT share page',
      };
    }

    return { success: true, html, statusCode: 200 };
  } catch (error: any) {
    return {
      success: false,
      error:
        error.name === 'AbortError'
          ? 'Request timeout'
          : `Network error: ${error.message}`,
    };
  }
}

/**
 * Create SHA-256 hash of share URL for privacy
 */
export function hashShareUrl(url: string): string {
  return createHash('sha256').update(url).digest('hex');
}
