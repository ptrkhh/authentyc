/** @jest-environment node */
// VERCEL_ENV gates the CSRF block (production only); set it per-test.

import { NextRequest } from 'next/server';
import { middleware } from '@/middleware';

const ORIGINAL_VERCEL_ENV = process.env.VERCEL_ENV;

beforeEach(() => {
  process.env.VERCEL_ENV = 'production';
});

afterEach(() => {
  process.env.VERCEL_ENV = ORIGINAL_VERCEL_ENV;
});

function postFrom(host: string, headers: Record<string, string>) {
  return middleware(
    new NextRequest(`https://${host}/api/analyze-chat`, {
      method: 'POST',
      headers: { host, 'content-type': 'application/json', ...headers },
    })
  );
}

describe('middleware CSRF — same-origin invariant (production)', () => {
  it('allows a same-origin POST on the apex domain', () => {
    const res = postFrom('authentyc.ai', { origin: 'https://authentyc.ai' });
    expect(res.status).not.toBe(403);
  });

  it('allows a same-origin POST on the www domain', () => {
    const res = postFrom('www.authentyc.ai', { origin: 'https://www.authentyc.ai' });
    expect(res.status).not.toBe(403);
  });

  it('treats www and apex as the same origin', () => {
    const res = postFrom('authentyc.ai', { origin: 'https://www.authentyc.ai' });
    expect(res.status).not.toBe(403);
  });

  // Regression: the production bug. A POST served on the deployment's own
  // vercel.app host, with a matching Origin, must pass regardless of how
  // NEXT_PUBLIC_SITE_URL is configured.
  it('allows a same-origin POST on the deployment vercel.app host', () => {
    const host = 'authentyc-landing-page-548aotesp-patricks-projects-e1981fad.vercel.app';
    const res = postFrom(host, { origin: `https://${host}` });
    expect(res.status).not.toBe(403);
  });

  it('falls back to Referer when Origin is absent', () => {
    const res = postFrom('authentyc.ai', { referer: 'https://authentyc.ai/' });
    expect(res.status).not.toBe(403);
  });

  it('rejects a cross-site POST (forged Origin)', () => {
    const res = postFrom('authentyc.ai', { origin: 'https://evil.com' });
    expect(res.status).toBe(403);
  });

  it('rejects a POST with neither Origin nor Referer', () => {
    const res = postFrom('authentyc.ai', {});
    expect(res.status).toBe(403);
  });
});
