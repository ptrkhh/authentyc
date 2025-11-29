/**
 * Rate Limiting
 *
 * Simple IP-based rate limiting using Supabase.
 * For production, consider upgrading to Redis (Upstash).
 */

import { supabaseServer } from '../supabase/server';

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: Date;
}

/**
 * Check if request is rate limited
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

  // Query existing rate limit records
  const { data: existing, error } = await supabaseServer
    .from('rate_limits')
    .select('*')
    .eq('identifier', identifier)
    .eq('endpoint', endpoint)
    .gte('window_start', windowStart.toISOString())
    .order('window_start', { ascending: false })
    .limit(1)
    .single();

  if (error && error.code !== 'PGRST116') {
    // PGRST116 = no rows returned
    console.error('Rate limit check error:', error);
  }

  if (existing) {
    const count = existing.request_count;
    if (count >= limit) {
      // Rate limited
      return {
        allowed: false,
        remaining: 0,
        resetAt: new Date(new Date(existing.window_start).getTime() + windowMs),
      };
    }

    // Increment count
    await supabaseServer
      .from('rate_limits')
      .update({ request_count: count + 1 })
      .eq('id', existing.id);

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
