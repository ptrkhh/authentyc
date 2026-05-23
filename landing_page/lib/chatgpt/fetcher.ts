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

    // Enforce HTTPS
    if (url.protocol !== 'https:') {
      return {
        success: false,
        error: 'Only HTTPS links are supported. Please use a link starting with https://',
      };
    }

    // Validate domain
    if (url.hostname !== 'chatgpt.com' && url.hostname !== 'chat.openai.com') {
      return {
        success: false,
        error: 'Please use a valid ChatGPT share link from chatgpt.com (not a regular chat URL)',
      };
    }

    if (!url.pathname.includes('/share/') && !url.pathname.startsWith('/s/')) {
      return {
        success: false,
        error: 'This doesn\'t appear to be a shared link. Make sure to click the share icon and copy the share link.',
      };
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    let response;
    try {
      response = await fetch(shareUrl, {
        headers: {
          'User-Agent': 'Authentyc Bot/1.0 (https://authentyc.ai; hello@authentyc.ai)',
          Accept: 'text/html,application/xhtml+xml',
          'Accept-Language': 'en-US,en;q=0.9',
        },
        redirect: 'manual',
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
    } catch (fetchError: unknown) {
      clearTimeout(timeoutId);
      throw fetchError;
    }

    if (response.status >= 300 && response.status < 400) {
      return {
        success: false,
        error: 'The share link redirected to a different URL. Please use a direct ChatGPT share link.',
        statusCode: response.status,
      };
    }

    if (!response.ok) {
      console.error('[fetcher] HTTP error:', response.status);
      return {
        success: false,
        error: `Unable to access the shared link (HTTP ${response.status}). Please make sure the link is publicly accessible.`,
        statusCode: response.status,
      };
    }

    const html = await response.text();

    if (!html.includes('ChatGPT') && !html.includes('OpenAI')) {
      return {
        success: false,
        error: 'Invalid response - not a ChatGPT share page',
      };
    }

    return { success: true, html, statusCode: 200 };
  } catch (error: unknown) {

    let errorMessage = 'Network error';
    if (error instanceof Error && error.name === 'AbortError') {
      errorMessage = 'Request timed out after 10 seconds. The ChatGPT share link may be slow to respond.';
    } else if (error instanceof Error && error.message.includes('fetch failed')) {
      errorMessage = 'Unable to connect to ChatGPT. This may be due to network restrictions or the share link being private. Please ensure the link is publicly accessible.';
    } else if (error instanceof Error) {
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
