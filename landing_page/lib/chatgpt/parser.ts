/**
 * ChatGPT HTML Parser
 *
 * ⚠️  CRITICAL WARNING: This is the most fragile component.
 * ChatGPT's HTML structure changes frequently without notice.
 * Expect to update this parser monthly.
 *
 * Current implementation (Dec 2024):
 * Parses React Server Components format by extracting JSON payloads
 * from window.__reactRouterContext scripts and recursively searching
 * for conversation messages within the JSON structure.
 */

import * as cheerio from 'cheerio';
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
 * Unescape JSON string escape sequences
 */
function unescapeString(str: string): string {
    return str
        .replace(/\\\\/g, '\x00')  // Temporarily store backslashes
        .replace(/\\n/g, '\n')
        .replace(/\\r/g, '\r')
        .replace(/\\t/g, '\t')
        .replace(/\\"/g, '"')
        .replace(/\\'/g, "'")
        .replace(/\x00/g, '\\');   // Restore single backslashes
}

/**
 * Check if a string looks like technical metadata rather than conversation content
 */
function isTechnicalString(str: string): boolean {
    return (
        str.startsWith('http') ||
        str.startsWith('https://') ||
        str.includes('cdn.oaistatic') ||
        str.includes('window.') ||
        str.includes('function(') ||
        str.includes('import ') ||
        !!str.match(/^[a-f0-9-]{36}$/i) ||  // UUIDs
        str.includes('_v4.0') ||             // Model names
        str.startsWith(':') ||               // Technical data
        !!str.match(/^[\d\.,\[\]\{\}\\:]+/) || // Starts with JSON-like chars
        str.length < 20 ||
        !str.match(/[a-z]{3,}/i)             // Must contain actual words
    );
}

/**
 * Check if a string looks like a conversation message
 */
function isConversationMessage(str: string): boolean {
    return (
        str.length > 50 &&
        !str.startsWith('http') &&
        !str.includes('cdn.oaistatic') &&
        !str.includes('window.') &&
        !str.includes('function(') &&
        !!str.match(/[a-z]{10,}/i)
    );
}

/**
 * Recursively extract message-like strings from parsed JSON structure
 */
function extractMessagesFromJSON(obj: any, depth: number = 0): string[] {
    if (depth > 20) return []; // Prevent infinite recursion

    const found: string[] = [];

    if (typeof obj === 'string' && isConversationMessage(obj)) {
        found.push(obj);
    } else if (Array.isArray(obj)) {
        for (const item of obj) {
            found.push(...extractMessagesFromJSON(item, depth + 1));
        }
    } else if (typeof obj === 'object' && obj !== null) {
        for (const key in obj) {
            found.push(...extractMessagesFromJSON(obj[key], depth + 1));
        }
    }

    return found;
}

/**
 * Debug helper to save HTML content for analysis (development only)
 */
async function debugSaveHTML(html: string, filename: string): Promise<void> {
    if (!IS_DEVELOPMENT) return;

    try {
        const {writeFile} = await import('fs/promises');
        const {join} = await import('path');
        const filePath = join(process.cwd(), filename);
        await writeFile(filePath, html, 'utf-8');
        console.log(`[parser] Debug: Saved ${filename}`);
    } catch (error) {
        console.error(`[parser] Debug: Failed to save ${filename}:`, error);
    }
}

/**
 * Parse ChatGPT share link HTML to extract conversation
 */
export function parseChatGPTShareHTML(html: string): ParsedConversation {
    const $ = cheerio.load(html);
    const messages: ParsedConversation['messages'] = [];

    console.log('[parser] Parsing HTML, length:', html.length);
    debugSaveHTML(html, 'parsed.txt');

    // Parse React Server Components format (ChatGPT as of Dec 2024)
    try {
        const scripts = $('script');
        let foundData = false;

        scripts.each((i, el) => {
            const scriptContent = $(el).html() || '';

            // Look for large script tags with React Router context data
            if (scriptContent.includes('window.__reactRouterContext') && scriptContent.length > 10000) {
                console.log(`[parser] Found React Router context in script ${i}`);
                foundData = true;

                // Extract all quoted strings from the script
                const stringPattern = /"((?:[^"\\]|\\.)*)"/g;
                const allStringMatches = [...scriptContent.matchAll(stringPattern)];
                const stringMatches = allStringMatches.filter(match => match[1].length >= 50);

                console.log(`[parser] Found ${stringMatches.length} strings >= 50 chars (from ${allStringMatches.length} total)`);

                const conversationMessages: string[] = [];
                let processedCount = 0;
                let filteredOutCount = 0;

                for (const match of stringMatches) {
                    processedCount++;
                    const unescaped = unescapeString(match[1]);

                    // Check if this is a large JSON payload containing messages
                    if (unescaped.length > 10000 && (unescaped.startsWith('[{') || unescaped.startsWith('{"'))) {
                        console.log(`[parser] Detected JSON payload (${unescaped.length} chars), parsing...`);
                        try {
                            const parsed = JSON.parse(unescaped);
                            const extractedMessages = extractMessagesFromJSON(parsed);
                            console.log(`[parser] Extracted ${extractedMessages.length} messages from JSON`);
                            conversationMessages.push(...extractedMessages);
                            filteredOutCount++;
                            continue;
                        } catch (e) {
                            console.log('[parser] Failed to parse as JSON, treating as regular string');
                        }
                    }

                    // Filter out technical/metadata strings
                    if (isTechnicalString(unescaped)) {
                        filteredOutCount++;
                        continue;
                    }

                    conversationMessages.push(unescaped);
                }

                console.log(`[parser] Processed ${processedCount} strings: ${conversationMessages.length} messages, ${filteredOutCount} filtered`);

                // Assign roles alternating user/assistant (ChatGPT conversations always alternate)
                conversationMessages.forEach((content, index) => {
                    const role = index % 2 === 0 ? 'user' : 'assistant';
                    messages.push({role, content});
                });

                console.log('[parser] Extracted', messages.length, 'messages');
            }
        });

        if (!foundData) {
            console.log('[parser] No React Router context found');
        }
    } catch (e) {
        console.error('[parser] Error during parsing:', e);
    }

    // Analyze conversation quality
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

    // Log final results
    console.log('[parser] ========== PARSING COMPLETE ==========');
    console.log('[parser] Messages:', messages.length);
    console.log('[parser] Has personality prompt:', hasPersonalityPrompt);
    console.log('[parser] Quality:', estimatedQuality);
    console.log('[parser] Title:', $('title').text().trim());
    if (messages.length > 0) {
        console.log('[parser] First message:', messages[0].content.substring(0, 100) + '...');
    }
    console.log('[parser] ==========================================');

    return {
        messages,
        messageCount: messages.length,
        title: $('title').text().trim() || undefined,
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
 * Extract context around a specific position for debugging
 */
function getContextAroundPosition(text: string, position: number, contextLength: number = 50): string {
    const start = Math.max(0, position - contextLength);
    const end = Math.min(text.length, position + contextLength);
    const before = text.substring(start, position);
    const at = text[position] || '[END]';
    const after = text.substring(position + 1, end);
    return `...${before}[→${at}←]${after}...`;
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

    let matchedPromptCategory: string | undefined;
    let detailedMismatchReason: string | undefined;

    const matchesPrompt = conversationPrompts.some((prompt) => {
        debugSaveHTML(prompt.prompt, 'prompt_reference.txt');
        const isMatch = userPrompt === prompt.prompt;

        if (!isMatch) {
            const lengthDiff = userPrompt.length - prompt.prompt.length;
            const mismatchPos = findFirstMismatchPosition(userPrompt, prompt.prompt);

            console.log('[validatePromptExactMatch] ❌ Mismatch with', prompt.category);
            console.log('[validatePromptExactMatch] Length diff:', lengthDiff);

            if (mismatchPos !== -1) {
                console.log('[validatePromptExactMatch] Mismatch at position:', mismatchPos);
                console.log('[validatePromptExactMatch] User:', getContextAroundPosition(userPrompt, mismatchPos));
                console.log('[validatePromptExactMatch] Expected:', getContextAroundPosition(prompt.prompt, mismatchPos));

                if (!detailedMismatchReason) {
                    detailedMismatchReason = `Length: ${userPrompt.length} vs ${prompt.prompt.length} (diff: ${lengthDiff}). Mismatch at position ${mismatchPos}.`;
                }
            }
        } else {
            console.log('[validatePromptExactMatch] ✅ Matched:', prompt.category);
            matchedPromptCategory = prompt.category;
        }

        return isMatch;
    });

    if (!matchesPrompt) {
        console.log('[validatePromptExactMatch] ❌ No prompt matched');
        return {
            valid: false,
            reason: 'The prompt in this conversation has been modified. Please go back to the instructions page and copy-paste the predefined prompt exactly without any modifications. This ensures consistent and accurate personality analysis.' +
                    (detailedMismatchReason ? ` (Debug: ${detailedMismatchReason})` : '')
        };
    }

    console.log('[validatePromptExactMatch] ✅ Matched category:', matchedPromptCategory);
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

    if (parsed.messageCount < 2) {
        return {
            valid: false,
            reason: 'This conversation is too short. Please have at least 5-10 message exchanges for accurate analysis.'
        };
    }

    const totalContent = parsed.messages.reduce((sum, m) => sum + m.content.length, 0);
    if (totalContent < 100) {
        return {
            valid: false,
            reason: 'This conversation doesn\'t have enough content. Try having a longer, more detailed conversation (5-10 exchanges).'
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
    console.log('[parser] Parsing response, length:', chatGPTOutput.length);

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
            console.log('[parser] Rating matched pattern:', pattern.source);
            break;
        }
    }

    const completenessRating = validateRating(rawRating);
    if (completenessRating === null) {
        console.warn('[parser] Failed to extract rating');
    } else {
        console.log('[parser] Rating:', completenessRating);
    }

    // Extract assessment details if present (new format)
    const assessmentPattern = /--- ASSESSMENT ---\s*OVERALL COMPLETENESS:\s*(\d+)\/10\s*(?:Rating Criteria:[\s\S]*?)?\s*ANALYSIS:\s*([\s\S]*?)--- END ASSESSMENT ---/;
    const assessmentMatch = chatGPTOutput.match(assessmentPattern);

    let assessmentDetails;
    if (assessmentMatch) {
        assessmentDetails = {
            rating: parseInt(assessmentMatch[1], 10),
            analysis: assessmentMatch[2].trim(),
        };
        console.log('[parser] Assessment rating:', assessmentDetails.rating);
        console.log('[parser] Analysis length:', assessmentDetails.analysis.length);
    }

    const summary = extractSummary(chatGPTOutput);
    console.log('[parser] Summary length:', summary.length);

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
