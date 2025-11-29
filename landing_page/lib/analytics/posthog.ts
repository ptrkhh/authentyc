/**
 * PostHog Analytics Setup
 *
 * Client-side analytics initialization and event tracking.
 */

import posthog from 'posthog-js';

/**
 * Initialize PostHog (call in client component or provider)
 */
export function initPostHog() {
  if (typeof window !== 'undefined') {
    if (!process.env.NEXT_PUBLIC_POSTHOG_KEY) {
      console.warn('PostHog key not configured');
      return;
    }

    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
      api_host: 'https://app.posthog.com',
      loaded: (posthog) => {
        if (process.env.NODE_ENV === 'development') {
          posthog.debug();
        }
      },
    });
  }
}

/**
 * Track custom event
 */
export function trackEvent(eventName: string, properties?: Record<string, any>) {
  if (typeof window !== 'undefined') {
    posthog.capture(eventName, properties);
  }
}
