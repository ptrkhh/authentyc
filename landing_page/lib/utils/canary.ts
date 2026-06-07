import { timingSafeEqual } from 'crypto';

/**
 * True only when a canary secret is configured AND the request's
 * `x-canary-secret` header matches it. Constant-time compare; the length guard
 * runs first because `timingSafeEqual` throws on unequal-length buffers. An
 * empty/undefined secret is never a canary.
 */
export const isCanaryRequest = (header: string | null, secret?: string): boolean => {
  if (!secret || header == null) return false;
  const a = Buffer.from(header);
  const b = Buffer.from(secret);
  return a.length === b.length && timingSafeEqual(a, b);
};
