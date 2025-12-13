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
    console.log('[fetcher] Starting fetch for URL:', shareUrl);
    const url = new URL(shareUrl);

    // Validate domain
    if (!url.hostname.includes('chatgpt.com') && !url.hostname.includes('chat.openai.com')) {
      console.log('[fetcher] Invalid domain:', url.hostname);
      return {
        success: false,
        error: 'Please use a valid ChatGPT share link from chatgpt.com (not a regular chat URL)',
      };
    }

    if (!url.pathname.includes('/share/')) {
      console.log('[fetcher] Not a share link:', url.pathname);
      return {
        success: false,
        error: 'This doesn\'t appear to be a shared link. Make sure to click the share icon and copy the share link.',
      };
    }

    // Fetch with respectful User-Agent and timeout
    console.log('[fetcher] Creating fetch request with timeout...');
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      console.log('[fetcher] Timeout triggered, aborting request');
      controller.abort();
    }, 10000); // 10s timeout

    let response;
    try {
      response = await fetch(shareUrl, {
        headers: {
          'User-Agent': 'Authentyc Bot/1.0 (https://authentyc.ai; contact@authentyc.ai)',
          Accept: 'text/html,application/xhtml+xml',
          'Accept-Language': 'en-US,en;q=0.9',
        },
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      console.log('[fetcher] Fetch completed successfully');
    } catch (fetchError: any) {
      clearTimeout(timeoutId);
      console.error('[fetcher] Fetch failed:', fetchError.name, fetchError.message);
      throw fetchError;
    }

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
    console.error('[fetcher] Error caught:', error.name, error.message);
    console.error('[fetcher] Error stack:', error.stack);

    let errorMessage = 'Network error';
    if (error.name === 'AbortError') {
      errorMessage = 'Request timed out after 10 seconds. The ChatGPT share link may be slow to respond.';
    } else if (error.message.includes('fetch failed')) {
      errorMessage = 'Unable to connect to ChatGPT. This may be due to network restrictions or the share link being private. Please ensure the link is publicly accessible.';
    } else {
      errorMessage = `Network error: ${error.message}`;
    }

    return {
      success: false,
      error: errorMessage,
    };
  }
}

/**
 * Create SHA-256 hash of share URL for privacy
 */
export function hashShareUrl(url: string): string {
  return createHash('sha256').update(url).digest('hex');
}
