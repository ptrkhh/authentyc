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
import {
  parseChatGPTShareHTML,
  validateParsedConversation,
  parseResponse
} from '@/lib/chatgpt/parser';
import { gemini } from '@/lib/openai/client';
import { buildQuickAnalysisPrompt } from '@/lib/openai/prompts';
import { supabaseServer } from '@/lib/supabase/server';
import { generatePersonalizedCharacters } from '@/lib/openai/character-generator';
import { generateSimulatedCharacters } from '@/lib/constants/simulated-characters';
import type { Category } from '@/components/landing/SimulationResults';
import { checkRateLimit } from '@/lib/utils/ratelimit';

const geminiApiTimeoutMilliseconds = 30000;
const geminiApiMaxRetries = 3;
const geminiApiRetryDelayMilliseconds = [1000, 2000, 4000];

async function generateContentWithTimeout(
  prompt: string,
  timeoutMs: number = geminiApiTimeoutMilliseconds
): Promise<any> {
  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      reject(new Error('Gemini API request timed out'));
    }, timeoutMs);

    gemini.generateContent(prompt)
      .then((result) => {
        clearTimeout(timeoutId);
        resolve(result);
      })
      .catch((error) => {
        clearTimeout(timeoutId);
        reject(error);
      });
  });
}

async function generateContentWithRetry(
  prompt: string,
  maxRetries: number = geminiApiMaxRetries
): Promise<any> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      console.log(`[analyze-chat] Gemini API attempt ${attempt + 1}/${maxRetries}`);
      const result = await generateContentWithTimeout(prompt);
      return result;
    } catch (error: any) {
      lastError = error;
      console.warn(`[analyze-chat] Gemini API attempt ${attempt + 1} failed:`, error.message);

      if (attempt < maxRetries - 1) {
        const delayMs = geminiApiRetryDelayMilliseconds[attempt] || 1000;
        console.log(`[analyze-chat] Retrying in ${delayMs}ms...`);
        await new Promise(resolve => setTimeout(resolve, delayMs));
      }
    }
  }

  throw lastError || new Error('Gemini API failed after retries');
}

function parseManualText(text: string) {
  const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
  const messages: Array<{ role: 'user' | 'assistant'; content: string }> = [];

  let currentRole: 'user' | 'assistant' = 'user';
  let currentContent = '';

  for (const line of lines) {
    const lowerLine = line.toLowerCase();

    if (lowerLine.startsWith('user:') || lowerLine.startsWith('you:') || lowerLine.startsWith('me:')) {
      if (currentContent.trim()) {
        messages.push({ role: currentRole, content: currentContent.trim() });
      }
      currentRole = 'user';
      currentContent = line.substring(line.indexOf(':') + 1).trim();
    } else if (lowerLine.startsWith('assistant:') || lowerLine.startsWith('chatgpt:') || lowerLine.startsWith('ai:')) {
      if (currentContent.trim()) {
        messages.push({ role: currentRole, content: currentContent.trim() });
      }
      currentRole = 'assistant';
      currentContent = line.substring(line.indexOf(':') + 1).trim();
    } else {
      currentContent += '\n' + line;
    }
  }

  if (currentContent.trim()) {
    messages.push({ role: currentRole, content: currentContent.trim() });
  }

  const fullText = messages.map(m => m.content).join(' ').toLowerCase();
  const hasPersonalityPrompt =
    fullText.includes('personality') ||
    fullText.includes('communication style') ||
    fullText.includes('objective analysis');

  return {
    messages,
    messageCount: messages.length,
    hasPersonalityPrompt,
    estimatedQuality: messages.length >= 4 && hasPersonalityPrompt ? 'high' : 'medium' as 'high' | 'medium' | 'low'
  };
}

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    const ipAddress = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    const rateLimitMaxRequests = 3;
    const rateLimitWindowMilliseconds = 60 * 60 * 1000;

    const rateLimit = await checkRateLimit(
      ipAddress,
      '/api/analyze-chat',
      rateLimitMaxRequests,
      rateLimitWindowMilliseconds
    );

    if (!rateLimit.allowed) {
      console.warn('[analyze-chat] Rate limit exceeded for IP:', ipAddress);
      return NextResponse.json(
        {
          error: 'Rate limit exceeded. Please try again later.',
          resetAt: rateLimit.resetAt
        },
        { status: 429 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    console.log('[analyze-chat] Received request:', { body });
    const { shareUrl, category, manualText } = analyzeRequestSchema.parse(body);

    const urlHash = hashShareUrl(shareUrl);

    // Check cache for existing analysis with this category
    const { data: existing } = await supabaseServer
      .from('chat_analyses')
      .select('*')
      .eq('share_url_hash', urlHash)
      .eq('category', category)
      .single();

    if (existing && existing.generated_characters) {
      return NextResponse.json({
        success: true,
        cached: true,
        analysis: {
          overall_vibe: existing.personality_summary,
          insights: existing.traits,
        },
        characters: existing.generated_characters,
        completenessRating: existing.completeness_rating || null,
        assessmentDetails: undefined,
      });
    }

    let parsed;

    // If manual text is provided, use it directly instead of fetching HTML
    if (manualText && manualText.trim()) {
      console.log('[analyze-chat] Using manual text input, length:', manualText.length);
      parsed = parseManualText(manualText.trim());
      console.log('[analyze-chat] Manual text parsed:', {
        messageCount: parsed.messageCount,
        hasPersonalityPrompt: parsed.hasPersonalityPrompt,
        quality: parsed.estimatedQuality
      });
    } else {
      // Fetch ChatGPT share link HTML
      console.log('[analyze-chat] Fetching share link:', shareUrl);
      const fetchResult = await fetchChatGPTShareLink(shareUrl);
      console.log('[analyze-chat] Fetch result:', { success: fetchResult.success, error: fetchResult.error, htmlLength: fetchResult.html?.length });

      if (!fetchResult.success || !fetchResult.html) {
        console.error('[analyze-chat] Fetch failed:', fetchResult.error);
        return NextResponse.json(
          { error: fetchResult.error || 'Failed to fetch' },
          { status: 400 }
        );
      }

      // Parse HTML to extract conversation
      parsed = parseChatGPTShareHTML(fetchResult.html);
    }

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

    // Extract completeness rating from the last assistant message
    const lastAssistantMessage = [...parsed.messages]
      .reverse()
      .find(message => message.role === 'assistant');

    let completenessRating = null;
    let assessmentDetails = undefined;

    if (lastAssistantMessage) {
      console.log('[analyze-chat] Extracting completeness rating from last assistant message');
      const parsedResponse = parseResponse(lastAssistantMessage.content);
      completenessRating = parsedResponse.completenessRating;
      assessmentDetails = parsedResponse.assessmentDetails;

      console.log('[analyze-chat] Completeness rating:', completenessRating);
      if (assessmentDetails) {
        console.log('[analyze-chat] Assessment rating:', assessmentDetails.rating);
      }
    } else {
      console.warn('[analyze-chat] No assistant message found in conversation');
    }

    // Analyze with Gemini
    const prompt = buildQuickAnalysisPrompt(parsed);
    const fullPrompt = `You are a personality analysis expert.\n\n${prompt}`;

    console.log('[analyze-chat] Sending prompt to Gemini, length:', fullPrompt.length);

    let result;
    try {
      result = await generateContentWithRetry(fullPrompt);
      console.log('[analyze-chat] Got result from Gemini');
    } catch (err: any) {
      console.error('[analyze-chat] Gemini API error:', err);

      if (err.message === 'Gemini API request timed out') {
        return NextResponse.json(
          { error: 'Analysis timed out. Please try again.' },
          { status: 504 }
        );
      }

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

    let analysis;
    try {
      analysis = JSON.parse(analysisText);
    } catch (parseError) {
      console.error('[analyze-chat] Invalid JSON from Gemini:', parseError);
      console.error('[analyze-chat] Raw response:', analysisText.substring(0, 500));
      return NextResponse.json(
        { error: 'AI returned invalid response. Please try again.' },
        { status: 500 }
      );
    }

    if (!analysis.overall_vibe || !analysis.insights) {
      console.error('[analyze-chat] Incomplete analysis structure:', {
        hasOverallVibe: !!analysis.overall_vibe,
        hasInsights: !!analysis.insights
      });
      return NextResponse.json(
        { error: 'Incomplete analysis from AI. Please try again.' },
        { status: 500 }
      );
    }

    // Generate personalized characters after successful personality analysis
    const characterGenStartTime = Date.now();
    let generatedCharacters;
    let usedFallback = false;

    try {
      generatedCharacters = await generatePersonalizedCharacters({
        personalityAnalysis: {
          overall_vibe: analysis.overall_vibe,
          insights: analysis.insights,
        },
        category,
        conversationSample: parsed.messages
          .slice(0, 3)
          .map(message => `${message.role}: ${message.content}`)
          .join('\n')
          .substring(0, 500),
      });
    } catch (error) {
      console.error('[analyze-chat] Character generation failed, using fallback:', error);
      // Fallback to template-based generation
      generatedCharacters = generateSimulatedCharacters(category);
      usedFallback = true;
    }

    const characterGenTime = Date.now() - characterGenStartTime;

    // Store results in database with characters
    await supabaseServer.from('chat_analyses').insert({
      share_url_hash: urlHash,
      category,
      personality_summary: analysis.overall_vibe || 'Analysis complete',
      traits: analysis.insights || {},
      generated_characters: generatedCharacters,
      processing_time_ms: Date.now() - startTime,
      character_generation_time_ms: characterGenTime,
      message_count: parsed.messageCount,
      used_fallback_templates: usedFallback,
      completeness_rating: completenessRating,
    });

    return NextResponse.json({
      success: true,
      cached: false,
      analysis: {
        insights: analysis.insights || [],
        overall_vibe: analysis.overall_vibe || '',
      },
      characters: generatedCharacters,
      completenessRating,
      assessmentDetails,
      metadata: {
        message_count: parsed.messageCount,
        quality: parsed.estimatedQuality,
        processing_time_ms: Date.now() - startTime,
        used_fallback: usedFallback,
      },
    });
  } catch (error: any) {
    console.error('[analyze-chat] Analysis error:', error);
    console.error('[analyze-chat] Error stack:', error.stack);
    console.error('[analyze-chat] Error name:', error.name);
    console.error('[analyze-chat] Error message:', error.message);

    if (error.name === 'ZodError') {
      console.error('[analyze-chat] Zod validation error:', JSON.stringify(error.errors, null, 2));
      return NextResponse.json(
        { error: 'Invalid request', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: error.message || 'Failed to analyze. Please try again.' },
      { status: 500 }
    );
  }
}
