/**
 * ChatGPT Analysis API Route
 *
 * POST /api/analyze-chat
 * Analyzes a ChatGPT shared link and returns personality insights.
 *
 * This is the core feature that differentiates the landing page.
 */

import { NextRequest, NextResponse } from 'next/server';
import { analyzeRequestSchema, MAX_BODY_SIZE, sanitizeUserInput } from '@/lib/utils/validation';
import { fetchChatGPTShareLink, hashShareUrl } from '@/lib/chatgpt/fetcher';
import {
  parseChatGPTShareHTML,
  validateParsedConversation,
  parseResponse
} from '@/lib/chatgpt/parser';
import { createModelWithSystemInstruction } from '@/lib/ai/client';
import { buildQuickAnalysisPrompt } from '@/lib/ai/prompts';
import { supabaseServer } from '@/lib/supabase/server';
import { generatePersonalizedCharacters } from '@/lib/ai/character-generator';
import { generateSimulatedCharacters } from '@/lib/constants/simulated-characters';
import { checkRateLimit, getClientIP } from '@/lib/utils/ratelimit';
import { isCanaryRequest } from '@/lib/utils/canary';

const geminiApiTimeoutMilliseconds = 30000;
const geminiApiMaxRetries = 3;
const geminiApiRetryDelayMilliseconds = [1000, 2000, 4000];

interface GeminiResponse {
  promptFeedback?: { blockReason?: string };
  text: () => string;
}

interface GeminiResult {
  response: GeminiResponse;
}

async function generateContentWithTimeout(
  userContent: string,
  systemInstruction: string,
  timeoutMs: number = geminiApiTimeoutMilliseconds
): Promise<GeminiResult> {
  const model = createModelWithSystemInstruction(systemInstruction);
  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      reject(new Error('Gemini API request timed out'));
    }, timeoutMs);

    model.generateContent(userContent)
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
  userContent: string,
  systemInstruction: string,
  maxRetries: number = geminiApiMaxRetries
): Promise<GeminiResult> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const result = await generateContentWithTimeout(userContent, systemInstruction);
      return result;
    } catch (error: unknown) {
      lastError = error instanceof Error ? error : new Error(String(error));
      console.warn(`[analyze-chat] Gemini API attempt ${attempt + 1} failed:`, lastError.message);

      if (attempt < maxRetries - 1) {
        const delayMs = geminiApiRetryDelayMilliseconds[attempt] || 1000;
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
    // Enforce body size limit
    const contentLength = parseInt(request.headers.get('content-length') || '0', 10);
    if (contentLength > MAX_BODY_SIZE) {
      return NextResponse.json({ error: 'Request too large' }, { status: 413 });
    }

    const ipAddress = getClientIP(request);
    const rateLimitMaxRequests = 10;
    const rateLimitWindowMilliseconds = 60 * 60 * 1000;

    const rateLimit = await checkRateLimit(
      ipAddress,
      '/api/analyze-chat',
      rateLimitMaxRequests,
      rateLimitWindowMilliseconds
    );

    if (!rateLimit.allowed) {
      console.warn('[analyze-chat] Rate limit exceeded');
      return NextResponse.json(
        {
          error: 'Rate limit exceeded. Please try again later.',
          resetAt: rateLimit.resetAt
        },
        { status: 429 }
      );
    }

    // Canary cache-bypass: a matching x-canary-secret forces the real pipeline
    // (skip cache read + write) so the daily synthetic monitor never gets a
    // stale cached green. Bypasses ONLY the cache, never the rate limiter above.
    const isCanary = isCanaryRequest(
      request.headers.get('x-canary-secret'),
      process.env.CANARY_SECRET,
    );

    const body = await request.json();
    const { shareUrl, category, manualText } = analyzeRequestSchema.parse(body);

    // The canary never sends manualText; reject the combination so a leaked
    // secret cannot drive cache-bypassed Gemini calls over arbitrary text
    // (the manualText branch skips the chatgpt.com host allowlist).
    if (isCanary && manualText && manualText.trim()) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    const urlHash = hashShareUrl(shareUrl);

    // Check cache for existing analysis with this category.
    // Skipped on canary runs so the real fetch→parse→Gemini path always runs.
    // The cached-return block stays INSIDE this guard: `existing` is block-scoped.
    if (!isCanary) {
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
    }

    let parsed;

    // If manual text is provided, use it directly instead of fetching HTML
    if (manualText && manualText.trim()) {
      parsed = parseManualText(sanitizeUserInput(manualText.trim()));
    } else {
      const fetchResult = await fetchChatGPTShareLink(shareUrl);

      if (!fetchResult.success || !fetchResult.html) {
        return NextResponse.json(
          { error: fetchResult.error || 'Failed to fetch' },
          { status: 400 }
        );
      }

      // Parse HTML to extract conversation
      parsed = await parseChatGPTShareHTML(fetchResult.html);
    }

    const validation = await validateParsedConversation(parsed);

    if (!validation.valid) {
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
      const parsedResponse = parseResponse(lastAssistantMessage.content);
      completenessRating = parsedResponse.completenessRating;
      assessmentDetails = parsedResponse.assessmentDetails;
    }

    // Analyze with Gemini using structured input (system instruction separated from user data)
    const { systemInstruction, userContent } = await buildQuickAnalysisPrompt(parsed);
    const fullSystemInstruction = `You are a personality analysis expert.\n\n${systemInstruction}`;

    let result;
    try {
      result = await generateContentWithRetry(userContent, fullSystemInstruction);
    } catch (err: unknown) {
      console.error('[analyze-chat] Gemini API error:', err);

      if (err instanceof Error && err.message === 'Gemini API request timed out') {
        return NextResponse.json(
          { error: 'Analysis timed out. Please try again.' },
          { status: 504 }
        );
      }

      throw new Error('AI analysis unavailable. Please try again later.');
    }

    const response = await result.response;

    // Check for blocked content
    if (response.promptFeedback?.blockReason) {
      console.error('[analyze-chat] Prompt blocked:', response.promptFeedback.blockReason);
      throw new Error('Content could not be analyzed. Please try a different conversation.');
    }

    const analysisText = response.text();

    if (!analysisText) {
      console.error('[analyze-chat] Empty response from Gemini');
      throw new Error('AI analysis unavailable. Please try again later.');
    }

    let analysis;
    try {
      analysis = JSON.parse(analysisText);
    } catch {
      console.error('[analyze-chat] Invalid JSON from Gemini');
      return NextResponse.json(
        { error: 'AI returned invalid response. Please try again.' },
        { status: 500 }
      );
    }

    if (!analysis.overall_vibe || !analysis.insights) {
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

    // Store results in database with characters.
    // Skipped on canary runs so chat_analyses stays free of canary rows.
    if (!isCanary) {
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
    }

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
        canary: isCanary,
      },
    });
  } catch (error: unknown) {
    console.error('[analyze-chat] Analysis error:', error instanceof Error ? error.message : error);

    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid request data' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to analyze. Please try again.' },
      { status: 500 }
    );
  }
}

