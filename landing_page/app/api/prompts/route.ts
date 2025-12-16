/**
 * API Route: /api/prompts
 *
 * Fetches conversation starter prompts from the database.
 * Used by client components to get the latest prompts without redeployment.
 */

import { NextResponse } from 'next/server';
import { getConversationPrompts } from '@/lib/constants/conversation-prompts';

export const dynamic = 'force-dynamic'; // Always fetch fresh data

/**
 * GET /api/prompts
 *
 * Returns all active conversation starter prompts
 */
export async function GET() {
  try {
    const prompts = await getConversationPrompts();

    if (!prompts || prompts.length === 0) {
      return NextResponse.json(
        { error: 'No prompts found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      prompts,
      cached: false,
    });
  } catch (error) {
    console.error('[api/prompts] Error fetching prompts:', error);

    return NextResponse.json(
      { error: 'Failed to fetch prompts' },
      { status: 500 }
    );
  }
}
