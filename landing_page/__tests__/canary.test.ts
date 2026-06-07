/** @jest-environment node */
import { isCanaryRequest } from '@/lib/utils/canary';

describe('isCanaryRequest', () => {
  it('is canary when the secret is set AND the header matches', () => {
    expect(isCanaryRequest('s', 's')).toBe(true);
  });

  it('is not canary when the header does not match the secret', () => {
    expect(isCanaryRequest('x', 's')).toBe(false);
  });

  it('is not canary when no header is present', () => {
    expect(isCanaryRequest(null, 's')).toBe(false);
  });

  it('is not canary when the secret env is unset', () => {
    expect(isCanaryRequest('s', undefined)).toBe(false);
  });

  it('is never canary for an empty secret, even with a matching empty header', () => {
    expect(isCanaryRequest('', '')).toBe(false);
  });

  it('is not canary — and does not throw — when header and secret differ in length', () => {
    expect(isCanaryRequest('ab', 's')).toBe(false);
  });
});
