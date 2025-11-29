/**
 * Scroll Depth Tracking Hook
 *
 * Tracks how far users scroll down the page using PostHog.
 * Records milestones at 25%, 50%, 75%, and 100% scroll depth.
 */

'use client';

import { useEffect, useRef } from 'react';
import { trackEvent } from './posthog';

export function useScrollTracking() {
  const milestones = useRef(new Set<number>());

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;

      // Calculate scroll percentage
      const scrollPercentage = Math.round(
        ((scrollTop + windowHeight) / documentHeight) * 100
      );

      // Track milestones: 25%, 50%, 75%, 100%
      const checkpoints = [25, 50, 75, 100];

      checkpoints.forEach(checkpoint => {
        if (scrollPercentage >= checkpoint && !milestones.current.has(checkpoint)) {
          milestones.current.add(checkpoint);
          trackEvent('scroll_depth', {
            depth: checkpoint,
            page: window.location.pathname,
          });
        }
      });
    };

    // Throttle scroll events to avoid excessive tracking
    let ticking = false;
    const throttledScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', throttledScroll, { passive: true });

    // Check initial scroll position
    handleScroll();

    return () => {
      window.removeEventListener('scroll', throttledScroll);
    };
  }, []);
}
