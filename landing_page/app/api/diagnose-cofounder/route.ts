/**
 * Diagnostic API endpoint to check why conversation-cofounder is not being returned
 */

import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const results: any = {
    timestamp: new Date().toISOString(),
    tests: [],
  };

  try {
    // Test 1: Check if row exists at all (no filters)
    console.log('\n=== Test 1: Row exists? ===');
    const { data: allRows, error: allError } = await supabaseServer
      .from('prompts')
      .select('key, is_active, content, metadata')
      .eq('key', 'conversation-cofounder');

    if (allError) {
      results.tests.push({
        name: 'Row Exists Check',
        status: 'error',
        error: allError.message,
      });
      return NextResponse.json(results);
    }

    results.tests.push({
      name: 'Row Exists Check',
      status: allRows.length > 0 ? 'pass' : 'fail',
      rowsFound: allRows.length,
      data: allRows.length > 0 ? {
        is_active: allRows[0].is_active,
        is_active_type: typeof allRows[0].is_active,
        content_length: allRows[0].content?.length || 0,
        metadata: allRows[0].metadata,
      } : null,
    });

    if (allRows.length === 0) {
      results.conclusion = '❌ Row does not exist in database!';
      return NextResponse.json(results);
    }

    // Test 2: Check with is_active=true filter
    console.log('\n=== Test 2: is_active filter ===');
    const { data: activeRows, error: activeError } = await supabaseServer
      .from('prompts')
      .select('key, is_active, content, metadata')
      .eq('key', 'conversation-cofounder')
      .eq('is_active', true);

    if (activeError) {
      results.tests.push({
        name: 'is_active Filter Check',
        status: 'error',
        error: activeError.message,
      });
      return NextResponse.json(results);
    }

    results.tests.push({
      name: 'is_active Filter Check',
      status: activeRows.length > 0 ? 'pass' : 'fail',
      rowsFound: activeRows.length,
      note: activeRows.length === 0 ? 'Row exists but is_active is not true!' : null,
    });

    if (activeRows.length === 0) {
      results.conclusion = `❌ Row exists but is_active=${allRows[0].is_active} (type: ${typeof allRows[0].is_active})`;
      results.fix = 'UPDATE prompts SET is_active = true WHERE key = \'conversation-cofounder\';';
      return NextResponse.json(results);
    }

    // Test 3: Check with .in() filter (production query)
    console.log('\n=== Test 3: .in() filter (production query) ===');
    const { data: inRows, error: inError } = await supabaseServer
      .from('prompts')
      .select('id, key, version, content, metadata')
      .in('key', ['conversation-hiring', 'conversation-dating', 'conversation-cofounder'])
      .eq('is_active', true);

    if (inError) {
      results.tests.push({
        name: 'Production Query (.in) Check',
        status: 'error',
        error: inError.message,
      });
      return NextResponse.json(results);
    }

    const cofounderInResult = inRows?.find(r => r.key === 'conversation-cofounder');

    results.tests.push({
      name: 'Production Query (.in) Check',
      status: cofounderInResult ? 'pass' : 'fail',
      totalRowsFound: inRows?.length || 0,
      keys: inRows?.map(r => r.key) || [],
      cofounderFound: !!cofounderInResult,
    });

    if (!cofounderInResult) {
      results.conclusion = '❌ Row exists, is_active=true, but NOT returned by .in() query!';
      results.possibleCauses = [
        'Database index issue',
        'RLS policy blocking the row',
        'Query planner issue',
        'Row corruption',
      ];
      return NextResponse.json(results);
    }

    // All tests passed!
    results.conclusion = '✅ All tests passed! Row should be working.';
    results.note = 'If you still see the issue, try: 1) Clear browser cache, 2) Restart dev server, 3) Check for caching layers';
    results.rowData = {
      key: cofounderInResult.key,
      content_length: cofounderInResult.content?.length || 0,
      metadata: cofounderInResult.metadata,
    };

  } catch (error: any) {
    results.tests.push({
      name: 'Fatal Error',
      status: 'error',
      error: error.message,
      stack: error.stack,
    });
  }

  return NextResponse.json(results, { status: 200 });
}
