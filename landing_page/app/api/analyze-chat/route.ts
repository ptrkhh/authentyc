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
import { gemini } from '@/lib/openai/client';
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
      console.error('[analyze-chat] Validation failed:', {
        reason: validation.reason,
        messageCount: parsed.messageCount,
        hasPersonalityPrompt: parsed.hasPersonalityPrompt,
        quality: parsed.estimatedQuality,
      });
      return NextResponse.json(
        { error: validation.reason || 'Invalid conversation' },
        { status: 400 }
      );
    }

    // Analyze with Gemini
    const prompt = buildQuickAnalysisPrompt(parsed);
    const fullPrompt = `You are a personality analysis expert.\n\n${prompt}`;

    console.log('[analyze-chat] Sending prompt to Gemini, length:', fullPrompt.length);

    let result;
    try {
      result = await gemini.generateContent(fullPrompt);
      console.log('[analyze-chat] Got result from Gemini');
    } catch (err: any) {
      console.error('[analyze-chat] Gemini API error:', err);
      throw new Error(`Gemini API failed: ${err.message}`);
    }

    const response = await result.response;
    console.log('[analyze-chat] Response details:', {
      candidates: response.candidates?.length,
      promptFeedback: response.promptFeedback,
      firstCandidate: response.candidates?.[0] ? {
        finishReason: response.candidates[0].finishReason,
        safetyRatings: response.candidates[0].safetyRatings,
        hasContent: !!response.candidates[0].content,
      } : null
    });

    // Check for blocked content
    if (response.promptFeedback?.blockReason) {
      console.error('[analyze-chat] Prompt blocked:', response.promptFeedback.blockReason);
      throw new Error(`Content blocked: ${response.promptFeedback.blockReason}`);
    }

    const analysisText = response.text();
    console.log('[analyze-chat] Analysis text length:', analysisText?.length);

    if (!analysisText) {
      console.error('[analyze-chat] Empty response from Gemini');
      console.error('[analyze-chat] Full response:', JSON.stringify(response, null, 2));
      throw new Error('No response from Gemini');
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
