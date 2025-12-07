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
        error: 'Please use a valid ChatGPT share link from chatgpt.com (not a regular chat URL)',
      };
    }

    if (!url.pathname.includes('/share/')) {
      return {
        success: false,
        error: 'This doesn\'t appear to be a shared link. Make sure to click the share icon and copy the share link.',
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
      console.error('[fetcher] HTTP error:', response.status, shareUrl);
      return {
        success: false,
        error: `Unable to access the shared link (HTTP ${response.status}). Please make sure the link is publicly accessible.`,
        statusCode: response.status,
      };
    }

    const html = await response.text();

    console.log('[fetcher] Response received');
    console.log('[fetcher] Response status:', response.status);
    console.log('[fetcher] Response content-type:', response.headers.get('content-type'));
    console.log('[fetcher] HTML length:', html.length);
    console.log('[fetcher] HTML preview (first 1000 chars):', html.substring(0, 1000));

    // Basic validation
    if (!html.includes('ChatGPT') && !html.includes('OpenAI')) {
      console.log('[fetcher] Validation failed: HTML does not contain ChatGPT or OpenAI');
      return {
        success: false,
        error: 'Invalid response - not a ChatGPT share page',
      };
    }

    console.log('[fetcher] Validation passed');
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
