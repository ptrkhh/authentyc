/**
 * Waitlist Count API Route
 *
 * GET /api/waitlist/count
 * Returns the current count of waitlist signups.
 */

import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase/server';

export async function GET() {
  try {
    const { count, error } = await supabaseServer
      .from('waitlist_leads')
      .select('*', { count: 'exact', head: true });

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      count: count || 0,
    });
  } catch (error: any) {
    console.error('Waitlist count error:', error);

    return NextResponse.json(
      { error: 'Failed to get waitlist count', count: 0 },
      { status: 500 }
    );
  }
}
