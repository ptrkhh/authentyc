/**
 * Health Check API Route
 *
 * GET /api/health
 * Returns basic status for unauthenticated requests.
 * Returns full diagnostics (table names, connectivity) only with valid auth.
 *
 * Auth: Bearer token via HEALTH_CHECK_SECRET env var.
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase/server';

interface TableStatus {
  name: string;
  accessible: boolean;
}

interface HealthResponse {
  status: string;
  timestamp: string;
  service: string;
  database?: {
    connected: boolean;
    tables: TableStatus[];
    error?: string;
  };
}

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const expectedToken = process.env.HEALTH_CHECK_SECRET;
  const isAuthorized = !!(expectedToken && authHeader === `Bearer ${expectedToken}`);

  const checks: HealthResponse = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'authentyc-landing-page',
  };

  try {
    const tables = ['waitlist_leads', 'chat_analyses', 'rate_limits', 'email_jobs'];

    if (isAuthorized) {
      checks.database = { connected: false, tables: [] };
    }

    let allAccessible = true;

    for (const table of tables) {
      const { error } = await supabaseServer
        .from(table)
        .select('count')
        .limit(0);

      if (error) {
        allAccessible = false;
        checks.status = 'degraded';
        if (isAuthorized && checks.database) {
          checks.database.tables.push({ name: table, accessible: false });
        }
      } else if (isAuthorized && checks.database) {
        checks.database.tables.push({ name: table, accessible: true });
      }
    }

    if (isAuthorized && checks.database) {
      checks.database.connected = allAccessible;
    }

  } catch {
    checks.status = 'error';
    if (isAuthorized) {
      checks.database = { connected: false, tables: [], error: 'Connection failed' };
    }
  }

  const statusCode = checks.status === 'ok' ? 200 : 503;

  return NextResponse.json(checks, { status: statusCode });
}
