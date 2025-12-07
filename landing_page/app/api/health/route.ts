/**
 * Health Check API Route
 *
 * GET /api/health
 * Simple health check endpoint for monitoring.
 */

import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase/server';

export async function GET() {
  const checks: any = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'authentyc-landing-page',
    database: {
      connected: false,
      tables: [],
    },
  };

  try {
    // Test database connection by querying each table
    const tables = ['waitlist_leads', 'chat_analyses', 'rate_limits', 'email_jobs'];

    for (const table of tables) {
      const { error } = await supabaseServer
        .from(table)
        .select('count')
        .limit(0);

      if (error) {
        checks.database.tables.push({ name: table, accessible: false, error: error.message });
        checks.status = 'degraded';
      } else {
        checks.database.tables.push({ name: table, accessible: true });
      }
    }

    checks.database.connected = checks.database.tables.every((t: any) => t.accessible);

  } catch (error: any) {
    checks.status = 'error';
    checks.database.error = error.message;
  }

  const statusCode = checks.status === 'ok' ? 200 : 503;

  return NextResponse.json(checks, { status: statusCode });
}
