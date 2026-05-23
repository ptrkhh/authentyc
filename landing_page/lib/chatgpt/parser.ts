/**
 * ChatGPT HTML Parser
 *
 * Extracts the conversation from a ChatGPT /share/ page by decoding the
 * React Router turbo-stream payload embedded in the page's
 * `streamController.enqueue(...)` calls, then reading messages by structured
 * field path (loaderData -> serverResponse -> data -> linear_conversation).
 *
 * Single path, no heuristic fallback: parseChatGPTShareHTML throws a
 * ChatGPTParseError with a stage-specific code if ChatGPT's data format
 * changes, rather than silently mis-parsing.
 */

import { decode } from 'turbo-stream';
import {getConversationPrompts} from '../constants/conversation-prompts';

const IS_DEVELOPMENT = process.env.NODE_ENV === 'development';

export interface ParsedConversation {
    messages: Array<{
        role: 'user' | 'assistant';
        content: string;
    }>;
    messageCount: number;
    title?: string;
    hasPersonalityPrompt: boolean;
    estimatedQuality: 'high' | 'medium' | 'low';
}

export interface ParsedChatGPTResponse {
    summary: string;
    completenessRating: number | null;
    assessmentDetails?: {
        rating: number;
        analysis: string;
    };
}

/**
 * Distinct failure stages of the structured share-page parser. The code lets
 * server logs identify which layer of ChatGPT's data format changed.
 */
export type ChatGPTParseErrorCode =
    | 'TRANSPORT_CHANGED'   // no streamController.enqueue payloads in the HTML
    | 'DECODE_FAILED'       // turbo-stream decode threw (corrupt/truncated payload)
    | 'SCHEMA_CHANGED'      // linear_conversation not found in the decoded graph
    | 'EMPTY';              // no visible user/assistant text messages survived filtering

export class ChatGPTParseError extends Error {
    code: ChatGPTParseErrorCode;
    constructor(code: ChatGPTParseErrorCode, options?: { cause?: unknown }) {
        super(code, options);
        this.name = 'ChatGPTParseError';
        this.code = code;
    }
}

/**
 * Debug helper to save content for analysis (development only).
 */
async function debugSaveHTML(html: string, filename: string): Promise<void> {
    if (!IS_DEVELOPMENT) return;

    try {
        const {writeFile} = await import('fs/promises');
        const {join} = await import('path');
        const filePath = join(process.cwd(), filename);
        await writeFile(filePath, html, 'utf-8');
    } catch {
        // Debug file save failed — not critical
    }
}

/**
 * Extract the string argument of every `streamController.enqueue("…")` call.
 * Each captured group is a JS string literal; JSON.parse un-escapes it.
 */
function extractEnqueuePayloads(html: string): string[] {
    const payloads: string[] = [];
    const pattern = /streamController\.enqueue\(("(?:[^"\\]|\\.)*")\)/g;
    let match: RegExpExecArray | null;
    while ((match = pattern.exec(html)) !== null) {
        try {
            payloads.push(JSON.parse(match[1]));
        } catch (cause) {
            throw new ChatGPTParseError('DECODE_FAILED', {cause});
        }
    }
    if (payloads.length === 0) {
        throw new ChatGPTParseError('TRANSPORT_CHANGED');
    }
    return payloads;
}

/**
 * Decode the React Router turbo-stream payload chunks into an object graph.
 */
async function decodeReactRouterStream(payloads: string[]): Promise<unknown> {
    const stream = new ReadableStream<Uint8Array>({
        start(controller) {
            const encoder = new TextEncoder();
            for (const payload of payloads) {
                controller.enqueue(encoder.encode(payload));
            }
            controller.close();
        },
    });

    try {
        const decoded = await decode(stream);
        await decoded.done;
        return decoded.value;
    } catch (cause) {
        throw new ChatGPTParseError('DECODE_FAILED', {cause});
    }
}

interface ConversationData {
    title?: string;
    linear_conversation: unknown[];
}

/**
 * Navigate the decoded graph to the conversation data object. Searches
 * loaderData entries by the presence of `linear_conversation` rather than
 * hardcoding the route key, so a route-segment rename does not break it.
 */
function findConversationData(value: unknown): ConversationData {
    const loaderData = (value as {loaderData?: Record<string, unknown>})?.loaderData;
    if (loaderData && typeof loaderData === 'object') {
        for (const entry of Object.values(loaderData)) {
            const data = (entry as {serverResponse?: {data?: unknown}})?.serverResponse?.data;
            if (
                data &&
                typeof data === 'object' &&
                'linear_conversation' in data &&
                Array.isArray((data as {linear_conversation?: unknown}).linear_conversation)
            ) {
                const conv = data as {title?: unknown; linear_conversation: unknown[]};
                return {
                    title: typeof conv.title === 'string' ? conv.title : undefined,
                    linear_conversation: conv.linear_conversation,
                };
            }
        }
    }
    throw new ChatGPTParseError('SCHEMA_CHANGED');
}

interface MessageNode {
    message?: {
        author?: {role?: string};
        content?: {content_type?: string; parts?: unknown[]};
        metadata?: {is_visually_hidden_from_conversation?: boolean};
    };
}

/**
 * Filter conversation nodes to visible text user/assistant turns and map them
 * to {role, content}. Roles come straight from author.role — no guessing.
 */
function mapMessages(nodes: unknown[]): ParsedConversation['messages'] {
    const messages: ParsedConversation['messages'] = [];
    for (const node of nodes as MessageNode[]) {
        const msg = node?.message;
        if (!msg) continue;
        const role = msg.author?.role;
        if (role !== 'user' && role !== 'assistant') continue;
        if (msg.content?.content_type !== 'text') continue;
        if (msg.metadata?.is_visually_hidden_from_conversation === true) continue;
        const parts = msg.content?.parts ?? [];
        const content = parts.filter((p): p is string => typeof p === 'string').join('');
        if (!content.trim()) continue;
        messages.push({role, content});
    }
    if (messages.length === 0) {
        throw new ChatGPTParseError('EMPTY');
    }
    return messages;
}

/**
 * Parse ChatGPT share link HTML to extract the conversation.
 *
 * Structured single-path parser: decodes the React Router turbo-stream payload
 * and reads messages by their data shape. Throws ChatGPTParseError (with a
 * stage-specific code) instead of silently mis-parsing when the format changes.
 */
export async function parseChatGPTShareHTML(html: string): Promise<ParsedConversation> {
    const payloads = extractEnqueuePayloads(html);
    const decoded = await decodeReactRouterStream(payloads);
    const data = findConversationData(decoded);
    const messages = mapMessages(data.linear_conversation);

    const fullText = messages.map((m) => m.content).join(' ').toLowerCase();
    const hasPersonalityPrompt =
        fullText.includes('personality') ||
        fullText.includes('communication style') ||
        fullText.includes('objective analysis');

    let estimatedQuality: 'high' | 'medium' | 'low' = 'low';
    if (messages.length >= 2) {
        const avgLength = messages.reduce((sum, m) => sum + m.content.length, 0) / messages.length;
        if (avgLength > 500 && hasPersonalityPrompt) {
            estimatedQuality = 'high';
        } else if (avgLength > 200) {
            estimatedQuality = 'medium';
        }
    }

    return {
        messages,
        messageCount: messages.length,
        title: data.title,
        hasPersonalityPrompt,
        estimatedQuality,
    };
}

/**
 * Find the first character position where two strings differ
 */
function findFirstMismatchPosition(stringA: string, stringB: string): number {
    const shorterLength = Math.min(stringA.length, stringB.length);

    for (let i = 0; i < shorterLength; i++) {
        if (stringA[i] !== stringB[i]) {
            return i;
        }
    }

    return stringA.length !== stringB.length ? shorterLength : -1;
}

/**
 * Validate that the first message matches exactly one of the predefined prompts
 */
export async function validatePromptExactMatch(parsed: ParsedConversation): Promise<{
    valid: boolean;
    reason?: string;
}> {
    if (parsed.messages.length === 0) {
        return {valid: false, reason: 'No messages found in conversation.'};
    }

    // Fallback: if only assistant response is available (SSR only embeds last message for /s/ links),
    // validate by checking the assessment format markers are present
    const hasAssessmentMarkers = parsed.messages.some(m =>
        m.role === 'assistant' &&
        m.content.includes('--- ASSESSMENT ---') &&
        m.content.includes('OVERALL COMPLETENESS:')
    );
    if (hasAssessmentMarkers && !parsed.messages.some(m => m.role === 'user')) {
        return {valid: true};
    }

    const firstUserMessage = parsed.messages.find(m => m.role === 'user');
    if (!firstUserMessage) {
        return {valid: false, reason: 'No user message found in conversation.'};
    }

    const conversationPrompts = await getConversationPrompts();
    if (!conversationPrompts || conversationPrompts.length === 0) {
        throw new Error('Failed to load conversation prompts from database');
    }

    const userPrompt = firstUserMessage.content;
    debugSaveHTML(userPrompt, 'prompt_user.txt');

    let detailedMismatchReason: string | undefined;

    const matchesPrompt = conversationPrompts.some((prompt) => {
        debugSaveHTML(prompt.prompt, 'prompt_reference.txt');
        const isMatch = userPrompt === prompt.prompt;

        if (!isMatch) {
            const lengthDiff = userPrompt.length - prompt.prompt.length;
            const mismatchPos = findFirstMismatchPosition(userPrompt, prompt.prompt);

            if (mismatchPos !== -1 && !detailedMismatchReason) {
                detailedMismatchReason = `Length: ${userPrompt.length} vs ${prompt.prompt.length} (diff: ${lengthDiff}). Mismatch at position ${mismatchPos}.`;
            }
        }

        return isMatch;
    });

    // Also accept if no user message matched but an assistant message has assessment markers
    if (!matchesPrompt && hasAssessmentMarkers) {
        return {valid: true};
    }

    if (!matchesPrompt) {
        return {
            valid: false,
            reason: 'The prompt in this conversation has been modified. Please go back to the instructions page and copy-paste the predefined prompt exactly without any modifications. This ensures consistent and accurate personality analysis.' +
                    (detailedMismatchReason ? ` (Debug: ${detailedMismatchReason})` : '')
        };
    }

    return {valid: true};
}

/**
 * Validate parsed conversation quality
 */
export async function validateParsedConversation(parsed: ParsedConversation): Promise<{
    valid: boolean;
    reason?: string;
}> {
    if (parsed.messageCount === 0) {
        return {
            valid: false,
            reason: 'This shared link appears to be empty. Please make sure you have a conversation with at least 5-10 message exchanges before sharing the link.'
        };
    }

    const promptValidation = await validatePromptExactMatch(parsed);
    if (!promptValidation.valid) {
        return promptValidation;
    }

    return {valid: true};
}

/**
 * Extract the summary text from ChatGPT output
 */
function extractSummary(chatGPTOutput: string): string {
    // Try to extract from new format (ANALYSIS section)
    const analysisMatch = chatGPTOutput.match(/ANALYSIS:\s*([\s\S]*?)--- END ASSESSMENT ---/);
    if (analysisMatch) {
        return analysisMatch[1].trim();
    }

    // Fallback: remove entire assessment section if present
    let text = chatGPTOutput;
    text = text.replace(/--- ASSESSMENT ---[\s\S]*?--- END ASSESSMENT ---/, '').trim();

    // Remove legacy rating line if present
    text = text.replace(/COMPLETENESS RATING: \d+\/10\s*$/, '').trim();

    return text;
}

/**
 * Validate rating is within expected range (1-10)
 */
function validateRating(rating: number | null): number | null {
    if (rating === null || rating < 1 || rating > 10) {
        if (rating !== null) {
            console.error(`[parser] Invalid rating: ${rating}. Expected 1-10.`);
        }
        return null;
    }
    return rating;
}

/**
 * Parse ChatGPT API response to extract summary, rating, and assessment details
 */
export function parseResponse(chatGPTOutput: string): ParsedChatGPTResponse {
    // Try multiple rating patterns for robustness (ordered by priority)
    const ratingPatterns = [
        /OVERALL COMPLETENESS:\s*(\d+)\/10/i,  // New format (highest priority)
        /COMPLETENESS RATING:\s*(\d+)\/10/i,   // Legacy format
        /RATING:\s*(\d+)\/10/i,
        /(\d+)\s*\/\s*10/,
        /score[:\s]+(\d+)/i,
    ];

    let rawRating: number | null = null;
    for (const pattern of ratingPatterns) {
        const match = chatGPTOutput.match(pattern);
        if (match) {
            rawRating = parseInt(match[1], 10);
            break;
        }
    }

    const completenessRating = validateRating(rawRating);

    // Extract assessment details if present (new format)
    const assessmentPattern = /--- ASSESSMENT ---\s*OVERALL COMPLETENESS:\s*(\d+)\/10\s*(?:Rating Criteria:[\s\S]*?)?\s*ANALYSIS:\s*([\s\S]*?)--- END ASSESSMENT ---/;
    const assessmentMatch = chatGPTOutput.match(assessmentPattern);

    let assessmentDetails;
    if (assessmentMatch) {
        assessmentDetails = {
            rating: parseInt(assessmentMatch[1], 10),
            analysis: assessmentMatch[2].trim(),
        };
    }

    const summary = extractSummary(chatGPTOutput);

    return {
        summary,
        completenessRating,
        assessmentDetails,
    };
}

/**
 * Rating thresholds for categorizing completeness ratings
 */
export const RATING_THRESHOLDS = {
    EXCELLENT: 9,
    GOOD: 7,
    MINIMAL: 4,
    INSUFFICIENT: 1,
} as const;

export type RatingCategory = keyof typeof RATING_THRESHOLDS;

/**
 * Determine the category for a given completeness rating
 */
export function getRatingCategory(rating: number): RatingCategory {
    if (rating >= RATING_THRESHOLDS.EXCELLENT) return 'EXCELLENT';
    if (rating >= RATING_THRESHOLDS.GOOD) return 'GOOD';
    if (rating >= RATING_THRESHOLDS.MINIMAL) return 'MINIMAL';
    return 'INSUFFICIENT';
}
