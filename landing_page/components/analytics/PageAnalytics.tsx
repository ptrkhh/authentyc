/**
 * Page Analytics Wrapper
 *
 * Client component that handles page-level analytics tracking
 * including scroll depth tracking.
 */

'use client';

import { useScrollTracking } from '@/lib/analytics/useScrollTracking';

export function PageAnalytics() {
  useScrollTracking();
  return null;
}
