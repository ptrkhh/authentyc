# ChatGPT Parser Structured Extraction Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the heuristic string-scraping body of `parseChatGPTShareHTML` with a structured decode of ChatGPT's React Router turbo-stream payload, so the parser reads the conversation by its real data shape and fails loud (typed, coded errors) when ChatGPT changes its data layer.

**Architecture:** ChatGPT's `/share/` page streams a `turbo-stream`-encoded payload via `window.__reactRouterContext.streamController.enqueue("…")`. Decoding it yields `loaderData → <share route> → serverResponse → data → linear_conversation`, an array of message nodes each carrying an explicit `author.role`, `content.content_type`, `content.parts`, and `metadata.is_visually_hidden_from_conversation`. We extract the enqueue payloads with a regex, decode them with `turbo-stream@2`, navigate to `linear_conversation`, and filter to visible text user/assistant turns. There is a single code path and no heuristic fallback: each failure stage throws a `ChatGPTParseError` with a distinct `code`.

**Tech Stack:** TypeScript, Next.js 14 (Node runtime for the API route), `turbo-stream@^2.4.1`, Jest (`next/jest`, jsdom default — parser tests override to the `node` environment).

---

## Deviation from spec (read before starting)

The spec's Approach section says the route is "untouched" and the signature is unchanged. `turbo-stream`'s `decode` is **async**, so `parseChatGPTShareHTML` must become `async` and return `Promise<ParsedConversation>`. Its single caller (`app/api/analyze-chat/route.ts:206`) therefore needs a one-line `await` added. This is a mechanical change with no behavioral/logic difference and no error-mapping (error mapping remains out of scope — a thrown `ChatGPTParseError` still surfaces as the route's existing generic 500 via its `try/catch`). Task 3 includes this one-line edit.

## File Structure

- **Modify** `lib/chatgpt/parser.ts` — swap the `cheerio` import for `turbo-stream`; delete four dead heuristic helpers (`unescapeString`, `isTechnicalString`, `isConversationMessage`, `extractMessagesFromJSON`); add `ChatGPTParseError` + four structured helpers; rewrite `parseChatGPTShareHTML` as `async`. Everything from `findFirstMismatchPosition` onward (validation, response parsing) is untouched.
- **Modify** `app/api/analyze-chat/route.ts:206` — add `await` to the now-async call.
- **Create** `__tests__/chatgpt-parser.test.ts` — version guard, structural canary, and four fail-loud tests. Starts with `/** @jest-environment node */`.
- **Create** `__tests__/fixtures/chatgpt-share-sample.html` — copy of the committed `/share/` capture (happy-path canary input).
- **Create** `__tests__/fixtures/thread.html` — copy of the committed logged-in DOM capture (0 enqueue calls → `TRANSPORT_CHANGED` input).
- **Modify** `package.json` + `package-lock.json` — add `turbo-stream@^2.4.1`.

`cheerio` stays in `package.json` (six root-level dev scripts still import it); only its use inside `parser.ts` is removed.

All commands below are run from the `landing_page/` directory.

---

### Task 1: Add `turbo-stream` dependency, guarded by a major-version test

`turbo-stream@3.x` mis-decodes ChatGPT's v2 payload silently (it produces a numeric-keyed graph and throws nothing, which would surface downstream as `SCHEMA_CHANGED`). This task installs v2 and adds a test so a future `npm update` to v3 fails loudly in CI.

**Files:**
- Create: `__tests__/chatgpt-parser.test.ts`
- Modify: `package.json`, `package-lock.json`

- [ ] **Step 1: Write the failing version-guard test**

Create `__tests__/chatgpt-parser.test.ts`:

```ts
/** @jest-environment node */
// ReadableStream (used by the decode path) is undefined under jsdom; the
// production route runs under Node, so only the tests need this override.

describe('turbo-stream dependency', () => {
  it('is pinned to major version 2 (v3 mis-decodes ChatGPT payloads)', () => {
    const { version } = require('turbo-stream/package.json');
    expect(version.split('.')[0]).toBe('2');
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx jest __tests__/chatgpt-parser.test.ts`
Expected: FAIL — `Cannot find module 'turbo-stream/package.json'` (not installed yet).

- [ ] **Step 3: Install turbo-stream v2**

Run: `npm install turbo-stream@^2.4.1`
Expected: `package.json` gains `"turbo-stream": "^2.4.1"` under `dependencies`; `package-lock.json` updates.

- [ ] **Step 4: Run the test to verify it passes**

Run: `npx jest __tests__/chatgpt-parser.test.ts`
Expected: PASS (1 test).

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json __tests__/chatgpt-parser.test.ts
git commit -m "chore: add turbo-stream@2 with major-version guard test"
```

---

### Task 2: Add the fixture and the structural canary test (red)

The canary decodes the real committed `/share/` capture end-to-end and asserts the exact message count, roles, and title. Written now, it fails against the current heuristic parser; Task 3 makes it pass.

**Files:**
- Create: `__tests__/fixtures/chatgpt-share-sample.html` (copy)
- Modify: `__tests__/chatgpt-parser.test.ts`

- [ ] **Step 1: Copy the committed capture into the fixtures directory**

```bash
mkdir -p __tests__/fixtures
cp chatgpt-share-sample.html __tests__/fixtures/chatgpt-share-sample.html
```

(We copy rather than move: the file is git-tracked and read by root-level dev scripts; the test suite owns its own stable copy.)

- [ ] **Step 2: Append the structural canary test**

Add to `__tests__/chatgpt-parser.test.ts`, after the existing `describe`:

```ts
import { readFileSync } from 'fs';
import { join } from 'path';
import { parseChatGPTShareHTML } from '@/lib/chatgpt/parser';

const fixture = (name: string) =>
  readFileSync(join(__dirname, 'fixtures', name), 'utf-8');

describe('parseChatGPTShareHTML — structural canary (real /share/ capture)', () => {
  it('extracts exactly the 18 visible user/assistant messages', async () => {
    const parsed = await parseChatGPTShareHTML(fixture('chatgpt-share-sample.html'));

    expect(parsed.messageCount).toBe(18);
    expect(parsed.messages).toHaveLength(18);
    expect(parsed.messages[0].role).toBe('user');
    expect(parsed.messages[17].role).toBe('assistant');
    expect(parsed.messages.every((m) => m.content.trim().length > 0)).toBe(true);
    expect(parsed.title).toBe('Life partner reflection questions');
  });
});
```

(Move the two `import` lines to the top of the file with the docblock-respecting placement — i.e. directly under the `/** @jest-environment node */` block. Imports must precede the `describe` blocks.)

- [ ] **Step 3: Run the canary to verify it fails**

Run: `npx jest __tests__/chatgpt-parser.test.ts -t "structural canary"`
Expected: FAIL — the current heuristic parser does not return exactly 18 clean messages and reports the `<title>`-tag title (`"ChatGPT - Life partner reflection questions"`), so the count/title assertions fail.

- [ ] **Step 4: Commit the red test + fixture**

```bash
git add __tests__/fixtures/chatgpt-share-sample.html __tests__/chatgpt-parser.test.ts
git commit -m "test: add failing structural canary for ChatGPT share parser"
```

---

### Task 3: Implement structured extraction (green) and update the caller

Replace the parser's extraction internals and make the function async. This is one cohesive unit (a single-function rewrite plus its dead-code removal and the caller's `await`).

**Files:**
- Modify: `lib/chatgpt/parser.ts` (lines 14–230)
- Modify: `app/api/analyze-chat/route.ts:206`

- [ ] **Step 1: Replace `lib/chatgpt/parser.ts` lines 14 through 230 with the block below**

Lines 1–13 (the file header comment) and lines 231+ (`findFirstMismatchPosition`, `validatePromptExactMatch`, `validateParsedConversation`, `parseResponse`, `extractSummary`, `validateRating`, `RATING_THRESHOLDS`, `getRatingCategory`) remain unchanged. Replace the region that currently starts at the `import * as cheerio` line and ends at the closing `}` of `parseChatGPTShareHTML` with:

```ts
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
        payloads.push(JSON.parse(match[1]));
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
```

Note: `debugSaveHTML` is intentionally preserved in this block (it is still called by `validatePromptExactMatch` further down the file). The old `debugSaveHTML(html, 'parsed.txt')` call inside the extraction path is dropped along with the rest of the old function body. The `cheerio` import is gone; `IS_DEVELOPMENT` stays.

- [ ] **Step 2: Add `await` to the caller**

In `app/api/analyze-chat/route.ts`, line 206:

```ts
      parsed = await parseChatGPTShareHTML(fetchResult.html);
```

(Was `parsed = parseChatGPTShareHTML(fetchResult.html);`. The enclosing `POST` is already `async`.)

- [ ] **Step 3: Run the canary to verify it passes**

Run: `npx jest __tests__/chatgpt-parser.test.ts -t "structural canary"`
Expected: PASS — 18 messages, `messages[0]` user, `messages[17]` assistant, title `"Life partner reflection questions"`.

- [ ] **Step 4: Typecheck the changed files**

Run: `npx tsc --noEmit`
Expected: no errors. (If `tsc` is not wired for the app, run `npm run build` instead and confirm it compiles.)

- [ ] **Step 5: Commit**

```bash
git add lib/chatgpt/parser.ts app/api/analyze-chat/route.ts
git commit -m "feat: structured turbo-stream extraction for ChatGPT share parser"
```

---

### Task 4: Add the fail-loud tests (green)

One test per `ChatGPTParseErrorCode`. `TRANSPORT_CHANGED` uses the committed `thread.html` (logged-in DOM, zero enqueue calls); `SCHEMA_CHANGED` and `EMPTY` build synthetic payloads with `turbo-stream`'s own `encode` so the inputs are guaranteed-valid turbo-stream that decodes but fails the later stages.

**Files:**
- Create: `__tests__/fixtures/thread.html` (copy)
- Modify: `__tests__/chatgpt-parser.test.ts`

- [ ] **Step 1: Copy the no-enqueue fixture**

```bash
cp thread.html __tests__/fixtures/thread.html
```

- [ ] **Step 2: Append the fail-loud tests**

Add `encode` to the turbo-stream import context and append to `__tests__/chatgpt-parser.test.ts`:

```ts
import { encode } from 'turbo-stream';
import { ChatGPTParseError } from '@/lib/chatgpt/parser';

async function streamToString(stream: ReadableStream<Uint8Array>): Promise<string> {
  const reader = stream.getReader();
  const decoder = new TextDecoder();
  let out = '';
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    out += decoder.decode(value, { stream: true });
  }
  out += decoder.decode();
  return out;
}

// Wrap an arbitrary value as a ChatGPT-style enqueue script using real
// turbo-stream encoding, so the payload decodes but exercises later stages.
async function makeShareHtml(value: unknown): Promise<string> {
  const payload = await streamToString(encode(value));
  return `<script>window.__reactRouterContext.streamController.enqueue(${JSON.stringify(payload)})</script>`;
}

describe('parseChatGPTShareHTML — fail-loud errors', () => {
  it('throws TRANSPORT_CHANGED when no enqueue payloads are present', async () => {
    await expect(parseChatGPTShareHTML(fixture('thread.html'))).rejects.toMatchObject({
      name: 'ChatGPTParseError',
      code: 'TRANSPORT_CHANGED',
    });
    await expect(parseChatGPTShareHTML('<html><body>no stream here</body></html>')).rejects.toBeInstanceOf(
      ChatGPTParseError,
    );
  });

  it('throws DECODE_FAILED when the enqueue payload is corrupt', async () => {
    const html = '<script>window.__reactRouterContext.streamController.enqueue("[broken")</script>';
    await expect(parseChatGPTShareHTML(html)).rejects.toMatchObject({ code: 'DECODE_FAILED' });
  });

  it('throws SCHEMA_CHANGED when the decoded graph has no linear_conversation', async () => {
    const html = await makeShareHtml({ loaderData: { root: { serverResponse: { data: { foo: 1 } } } } });
    await expect(parseChatGPTShareHTML(html)).rejects.toMatchObject({ code: 'SCHEMA_CHANGED' });
  });

  it('throws EMPTY when only hidden/system/non-text nodes are present', async () => {
    const systemHidden = {
      message: {
        author: { role: 'system' },
        content: { content_type: 'text', parts: ['x'] },
        metadata: { is_visually_hidden_from_conversation: true },
      },
    };
    const hiddenUser = {
      message: {
        author: { role: 'user' },
        content: { content_type: 'text', parts: ['secret'] },
        metadata: { is_visually_hidden_from_conversation: true },
      },
    };
    const html = await makeShareHtml({
      loaderData: { r: { serverResponse: { data: { title: 't', linear_conversation: [systemHidden, hiddenUser] } } } },
    });
    await expect(parseChatGPTShareHTML(html)).rejects.toMatchObject({ code: 'EMPTY' });
  });
});
```

(Consolidate the three `import` statements that reference `@/lib/chatgpt/parser` / `turbo-stream` at the top of the file — `parseChatGPTShareHTML`, `ChatGPTParseError`, and `encode` — rather than repeating imports mid-file. Final top-of-file import order: the `@jest-environment` docblock, then `fs`/`path`, then `turbo-stream` `encode`, then `@/lib/chatgpt/parser` named imports.)

- [ ] **Step 3: Run the full test file to verify all pass**

Run: `npx jest __tests__/chatgpt-parser.test.ts`
Expected: PASS — 6 tests (version guard, canary, 4 fail-loud).

- [ ] **Step 4: Commit**

```bash
git add __tests__/fixtures/thread.html __tests__/chatgpt-parser.test.ts
git commit -m "test: cover fail-loud error codes for ChatGPT share parser"
```

---

### Task 5: Full-suite verification

- [ ] **Step 1: Run the entire test suite**

Run: `npm test`
Expected: PASS — the new `chatgpt-parser` suite plus the pre-existing `accessibility` and `static-cards` suites. No regressions.

- [ ] **Step 2: Production build sanity check**

Run: `npm run build`
Expected: compiles with no type errors (confirms the async signature change and the `route.ts` `await` are consistent end-to-end).

- [ ] **Step 3: Commit any lockfile/incidental changes (only if the working tree is dirty)**

```bash
git status --porcelain
# If anything is uncommitted from the build/test run:
git add -A
git commit -m "chore: finalize ChatGPT parser structured extraction"
```

---

## Follow-up TODOs (tracked in the spec, out of scope for this plan)

These are documented in `docs/superpowers/specs/2026-05-23-chatgpt-parser-structured-extraction-design.md` and are **not** implemented here:

1. **`/s/` short-link verification.** `fetcher.ts:40` accepts `/s/` links, but we have no `/s/` capture. The new parser hard-requires an enqueue stream and will throw `TRANSPORT_CHANGED`/`SCHEMA_CHANGED` if a `/s/` page is SSR-DOM-only — a possible regression on a shipping input. Capture a real `/s/` page, save as `__tests__/fixtures/chatgpt-s-short-link-<date>.html`, and decide whether a dedicated `/s/` path is needed before advertising `/s/` support.
2. **Assessment-flow canary.** No fixture exists for the product-critical 2-turn assessment conversation (user prompt == a DB prompt; assistant == an `--- ASSESSMENT ---` payload). Producing one is blocked by the `/share/` 403 to our bot UA; generate it manually from the live product flow and add a test that asserts the assessment markers extract and `validatePromptExactMatch` passes.

## Self-Review

- **Spec coverage:** structured pipeline (steps 1–5) → Task 3; fail-loud codes → Task 3 (throws) + Task 4 (tests); dependency + v2 pin + version guard → Task 1; dead-code removal + cheerio import removal → Task 3; structural canary + node env + fixtures → Tasks 2/4; `/s/` and assessment TODOs → carried as follow-ups. The async/route deviation is called out explicitly. Out-of-scope items (validation, response parsing, route error mapping, fetcher) are not modified.
- **Placeholder scan:** none — every step has concrete code/commands and expected output.
- **Type consistency:** `ChatGPTParseError`/`ChatGPTParseErrorCode`, `ParsedConversation`, `ConversationData`, `MessageNode`, and the helper names (`extractEnqueuePayloads`, `decodeReactRouterStream`, `findConversationData`, `mapMessages`) are defined in Task 3 and referenced consistently in Task 4's tests. `parseChatGPTShareHTML` is `async`/`Promise<ParsedConversation>` everywhere it appears, including the awaited caller.
