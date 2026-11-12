/**
 * Application constants
 * Centralized configuration values
 */

/**
 * Social media links
 */
export const SOCIAL_LINKS = {
  TWITTER: 'https://x.com/AuthentycAI',
  LINKEDIN: 'https://www.linkedin.com/company/authentyc',
  EMAIL: 'mailto:hello@authentyc.ai',
} as const;

/**
 * Launch date information
 */
export const LAUNCH_COPY = {
  // No date: the last one (Q2 2026) passed while still on the site.
  // SHORT is used as "launch in {SHORT}".
  FULL: 'Invite-only launch coming soon',
  SHORT: 'the coming months',
} as const;

/**
 * Products under the Authentyc umbrella
 */
export const PRODUCTS = {
  LEETVIBECODE: {
    NAME: 'LeetVibeCode',
    URL: 'https://leetvibecode.authentyc.ai',
  },
} as const;

/**
 * Company information
 */
export const COMPANY_INFO = {
  NAME: 'Authentyc',
  TAGLINE: 'Match people by who they really are.',
  EMAIL: 'hello@authentyc.ai',
  LEGAL_NAME: 'Authentyc AI, Inc.',
  YEAR: '2026',
} as const;
