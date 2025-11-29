/**
 * Client Providers
 *
 * Wraps the app with client-side providers (PostHog, etc.)
 */

'use client';

import { useEffect } from 'react';
import { initPostHog } from '@/lib/analytics/posthog';

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Initialize PostHog analytics
    initPostHog();
  }, []);

  return <>{children}</>;
}
