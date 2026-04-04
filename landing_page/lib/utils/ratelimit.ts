/**
 * Rate Limiting
 *
 * IP-based rate limiting using Supabase.
 *
 * Fail-closed: If Supabase throws an error, the exception propagates to the
 * caller's outer try/catch, which returns a 500 response. This is intentional
 * — it protects the Gemini API from unmetered usage when the rate limiter is
 * unavailable.
 */

import { NextRequest } from 'next/server';
import { supabaseServer } from '../supabase/server';

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: Date;
}

/**
 * Extract client IP from request headers.
 *
 * Prefers x-real-ip (set by Vercel's edge network, trustworthy).
 * Falls back to first IP in x-forwarded-for (validated format).
 */
export function getClientIP(request: NextRequest): string {
  const realIp = request.headers.get('x-real-ip');
  if (realIp) {
    return realIp.trim();
  }

  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    const firstIp = forwardedFor.split(',')[0].trim();
    if (/^[\d.:a-fA-F]+$/.test(firstIp)) {
      return firstIp;
    }
  }

  return 'unknown';
}

/**
 * Check if request is rate limited.
 *
 * Uses optimistic concurrency control to prevent race conditions:
 * - Reads current count
 * - Updates only if count hasn't changed (WHERE request_count = old_count)
 * - Retries once on conflict
 *
 * @param identifier - IP address or user ID
 * @param endpoint - API endpoint being accessed
 * @param limit - Max requests per window
 * @param windowMs - Time window in milliseconds
 */
export async function checkRateLimit(
  identifier: string,
  endpoint: string,
  limit: number,
  windowMs: number
): Promise<RateLimitResult> {
  const now = new Date();
  const windowStart = new Date(now.getTime() - windowMs);

  // Query existing rate limit record
  const { data: existing, error } = await supabaseServer
    .from('rate_limits')
    .select('id, request_count, window_start')
    .eq('identifier', identifier)
    .eq('endpoint', endpoint)
    .gte('window_start', windowStart.toISOString())
    .order('window_start', { ascending: false })
    .limit(1)
    .single();

  if (error && error.code !== 'PGRST116') {
    throw error;
  }

  if (existing) {
    const count = existing.request_count;
    if (count >= limit) {
      return {
        allowed: false,
        remaining: 0,
        resetAt: new Date(new Date(existing.window_start).getTime() + windowMs),
      };
    }

    // Optimistic concurrency: only update if count hasn't changed
    const { data: incrementResult, error: incError } = await supabaseServer
      .from('rate_limits')
      .update({ request_count: count + 1 })
      .eq('id', existing.id)
      .eq('request_count', count)
      .select('request_count')
      .single();

    if (incError && incError.code !== 'PGRST116') {
      throw incError;
    }

    // Race condition: another request incremented first
    if (!incrementResult) {
      const { data: recheck } = await supabaseServer
        .from('rate_limits')
        .select('request_count, window_start')
        .eq('id', existing.id)
        .single();

      if (recheck && recheck.request_count >= limit) {
        return {
          allowed: false,
          remaining: 0,
          resetAt: new Date(new Date(recheck.window_start).getTime() + windowMs),
        };
      }

      // Retry increment once
      if (recheck) {
        await supabaseServer
          .from('rate_limits')
          .update({ request_count: recheck.request_count + 1 })
          .eq('id', existing.id);
      }

      return {
        allowed: true,
        remaining: Math.max(0, limit - (recheck?.request_count ?? count) - 1),
        resetAt: new Date(new Date(existing.window_start).getTime() + windowMs),
      };
    }

    return {
      allowed: true,
      remaining: limit - count - 1,
      resetAt: new Date(new Date(existing.window_start).getTime() + windowMs),
    };
  }

  // Create new rate limit record
  await supabaseServer.from('rate_limits').insert({
    identifier,
    endpoint,
    request_count: 1,
    window_start: now.toISOString(),
  });

  return {
    allowed: true,
    remaining: limit - 1,
    resetAt: new Date(now.getTime() + windowMs),
  };
}
