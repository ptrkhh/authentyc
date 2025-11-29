/**
 * ChatGPT Share Link Validator
 *
 * Validates share link format before attempting to fetch.
 */

/**
 * Validate ChatGPT share link format
 */
export function validateShareLinkFormat(url: string): {
  valid: boolean;
  error?: string;
} {
  try {
    const parsedUrl = new URL(url);

    // Check domain
    if (
      !parsedUrl.hostname.includes('chatgpt.com') &&
      !parsedUrl.hostname.includes('chat.openai.com')
    ) {
      return {
        valid: false,
        error: 'Invalid domain. Must be chatgpt.com or chat.openai.com',
      };
    }

    // Check path contains /share/
    if (!parsedUrl.pathname.includes('/share/')) {
      return {
        valid: false,
        error: 'Invalid path. Must be a share link (contains /share/)',
      };
    }

    return { valid: true };
  } catch (error) {
    return {
      valid: false,
      error: 'Invalid URL format',
    };
  }
}
