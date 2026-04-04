/**
 * Next.js Middleware
 *
 * Adds security headers, CORS, and CSP to all responses.
 */

import { NextRequest, NextResponse } from 'next/server';

const ALLOWED_ORIGIN = process.env.NEXT_PUBLIC_SITE_URL || 'https://authentyc.ai';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const { pathname } = request.nextUrl;

  // --- Security Headers ---
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  response.headers.set(
    'Strict-Transport-Security',
    'max-age=63072000; includeSubDomains; preload'
  );

  // --- Content Security Policy ---
  const isDev = process.env.NODE_ENV === 'development';
  const csp = [
    "default-src 'self'",
    // unsafe-inline needed for Next.js bootstrap scripts; unsafe-eval only needed in dev (HMR)
    isDev
      ? "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://us.i.posthog.com"
      : "script-src 'self' 'unsafe-inline' https://us.i.posthog.com",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https://epdjtermjtfijzmhxzoo.supabase.co",
    "font-src 'self'",
    `connect-src 'self' https://epdjtermjtfijzmhxzoo.supabase.co https://us.i.posthog.com https://us.posthog.com https://api.resend.com`,
    "frame-ancestors 'none'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join('; ');

  response.headers.set('Content-Security-Policy', csp);

  // --- CORS for API routes ---
  if (pathname.startsWith('/api/')) {
    const origin = request.headers.get('origin');

    if (origin === ALLOWED_ORIGIN || process.env.NODE_ENV === 'development') {
      response.headers.set('Access-Control-Allow-Origin', origin || '*');
    }

    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
    response.headers.set('Access-Control-Max-Age', '86400');

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new NextResponse(null, { status: 204, headers: response.headers });
    }

    // --- CSRF protection for state-changing requests ---
    if (request.method === 'POST' || request.method === 'PUT' || request.method === 'DELETE') {
      const origin = request.headers.get('origin');
      const referer = request.headers.get('referer');

      // In production, require origin or referer to match our domain
      if (process.env.NODE_ENV === 'production') {
        const isValidOrigin = origin && new URL(origin).hostname === new URL(ALLOWED_ORIGIN).hostname;
        const isValidReferer = referer && new URL(referer).hostname === new URL(ALLOWED_ORIGIN).hostname;

        if (!isValidOrigin && !isValidReferer) {
          return NextResponse.json(
            { error: 'Forbidden' },
            { status: 403 }
          );
        }
      }
    }
  }

  return response;
}

export const config = {
  matcher: [
    // Match all paths except static files and Next.js internals
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
};
