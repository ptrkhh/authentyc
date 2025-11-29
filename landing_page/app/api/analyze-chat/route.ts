/**
 * ChatGPT Analysis API Route
 *
 * POST /api/analyze-chat
 * Analyzes a ChatGPT shared link and returns personality insights.
 *
 * This is the core feature that differentiates the landing page.
 */

import { NextRequest, NextResponse } from 'next/server';
import { analyzeRequestSchema } from '@/lib/utils/validation';
import { fetchChatGPTShareLink, hashShareUrl } from '@/lib/chatgpt/fetcher';
import { parseChatGPTShareHTML, validateParsedConversation } from '@/lib/chatgpt/parser';
import { openai, MODEL } from '@/lib/openai/client';
import { buildQuickAnalysisPrompt } from '@/lib/openai/prompts';
import { supabaseServer } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    // TODO: Implement rate limiting
    // const ip = request.headers.get('x-forwarded-for') || 'unknown';
    // const rateLimit = await checkRateLimit(ip, '/api/analyze-chat', 3, 60 * 60 * 1000);
    // if (!rateLimit.allowed) {
    //   return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
    // }

    // Parse and validate request body
    const body = await request.json();
    const { shareUrl } = analyzeRequestSchema.parse(body);

    const urlHash = hashShareUrl(shareUrl);

    // Check cache for existing analysis
    const { data: existing } = await supabaseServer
      .from('chat_analyses')
      .select('*')
      .eq('share_url_hash', urlHash)
      .single();

    if (existing) {
      return NextResponse.json({
        success: true,
        cached: true,
        analysis: {
          summary: existing.personality_summary,
          insights: existing.traits,
          confidence: existing.confidence_score,
        },
      });
    }

    // Fetch ChatGPT share link HTML
    const fetchResult = await fetchChatGPTShareLink(shareUrl);
    if (!fetchResult.success || !fetchResult.html) {
      return NextResponse.json(
        { error: fetchResult.error || 'Failed to fetch' },
        { status: 400 }
      );
    }

    // Parse HTML to extract conversation
    const parsed = parseChatGPTShareHTML(fetchResult.html);
    const validation = validateParsedConversation(parsed);

    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.reason || 'Invalid conversation' },
        { status: 400 }
      );
    }

    // Analyze with OpenAI
    const prompt = buildQuickAnalysisPrompt(parsed);
    const completion = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        { role: 'system', content: 'You are a personality analysis expert.' },
        { role: 'user', content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 500,
      response_format: { type: 'json_object' },
    });

    const analysisText = completion.choices[0]?.message?.content;
    if (!analysisText) {
      throw new Error('No response from OpenAI');
    }

    const analysis = JSON.parse(analysisText);

    // Store results in database
    await supabaseServer.from('chat_analyses').insert({
      share_url_hash: urlHash,
      personality_summary: analysis.overall_vibe || 'Analysis complete',
      traits: analysis.insights || {},
      processing_time_ms: Date.now() - startTime,
      message_count: parsed.messageCount,
    });

    return NextResponse.json({
      success: true,
      cached: false,
      analysis: {
        insights: analysis.insights || [],
        overall_vibe: analysis.overall_vibe || '',
        message_count: parsed.messageCount,
        quality: parsed.estimatedQuality,
      },
    });
  } catch (error: any) {
    console.error('Analysis error:', error);

    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid request', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to analyze. Please try again.' },
      { status: 500 }
    );
  }
}
