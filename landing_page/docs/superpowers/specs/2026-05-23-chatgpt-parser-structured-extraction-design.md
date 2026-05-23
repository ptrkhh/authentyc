# ChatGPT Parser: Structured turbo-stream Extraction

**Date:** 2026-05-23
**Scope:** `landing_page/lib/chatgpt/parser.ts` — `parseChatGPTShareHTML` only.
**Status:** Revised 2026-05-23 after an evidence-grounded writer-vs-critic review.
Every claim below was verified against an installed `turbo-stream` and the
committed capture `landing_page/chatgpt-share-sample.html`. Pending
implementation.

## Problem

`parseChatGPTShareHTML` extracts conversation messages from a ChatGPT share
page's HTML. The current implementation is the most fragile component in the
app. It:

- loads HTML with cheerio, finds the `<script>` containing
  `window.__reactRouterContext`,
- regex-scrapes **every** quoted string ≥50 chars from that script,
- guesses which strings are messages via heuristics (`isConversationMessage`,
  `isTechnicalString`, length thresholds),
- guesses each message's role by Authentyc-specific content markers
  (`PRIMARY DIRECTIVE`, `--- ASSESSMENT ---`) and otherwise falls back to
  alternating index.

It throws away the structure that is actually present in the page and relies on
presentation-coupled heuristics, so it breaks whenever ChatGPT changes its
frontend.

## Key finding

ChatGPT's share page embeds the full conversation as structured data, not just
rendered DOM. The React Router runtime streams a
[turbo-stream](https://www.npmjs.com/package/turbo-stream)-encoded payload via
`window.__reactRouterContext.streamController.enqueue("…")` calls. Decoding it
yields a real object graph containing `linear_conversation` — an array of
message nodes, each with an explicit `author.role`, `content.content_type`, and
`content.parts`.

Verified 2026-05-23 against the committed capture
`landing_page/chatgpt-share-sample.html` (443 KB; canonical
`https://chatgpt.com/share/69355c5c-3c24-8004-a863-3bc2bb96ea56`) using
`turbo-stream@2.4.1`:

- The page emits **2** `streamController.enqueue("…")` chunks: chunk 1 = 179,459
  chars (carries the conversation); chunk 2 = 78 chars (`P20:[…]`, resolves an
  unrelated deferred promise).
- Decoded path: `loaderData["routes/share.$shareId.($action)"].serverResponse
  .data.linear_conversation` — **21 nodes**. `data.title` =
  `"Life partner reflection questions"`.
- Filtering to visible text messages (see step 4) yields **18** user/assistant
  messages. Dropped: the root node (no `message`), one `system` node
  (`is_visually_hidden_from_conversation: true`), one assistant
  `model_editable_context` node. Roles come straight from `author.role`.

**Wire-format note.** ChatGPT emits the **turbo-stream v2** format.
`turbo-stream@3.x` is a breaking change — `decode` becomes
`(ReadableStream<string>) ⇒ Promise<T>` — and it **mis-decodes this payload**
(the decoded graph has top-level numeric keys; `linear_conversation` is absent,
no error thrown). The `^2.4.1` pin is therefore load-bearing — see Dependency.

The ChatGPT `backend-api/share/<id>` JSON endpoint was also tested and returns
**HTTP 403** (Cloudflare) for our bot, so a clean-JSON API path is not viable;
we must parse the served HTML.

## Approach

Replace the body of `parseChatGPTShareHTML` with a structured decode. **Single
path, no heuristic fallback, fail loud.** The function keeps its exact signature
and `ParsedConversation` return type, so `validateParsedConversation`,
`validatePromptExactMatch`, `parseResponse`, and the `/api/analyze-chat` route
are untouched.

This single-path posture is verified for `/share/` pages only. The `/s/`
short-link case is **unverified** and called out separately below (see
"`/s/` short-links").

Resilience posture: this couples the parser to the **data layer** (turbo-stream
transport + ChatGPT conversation schema), which is far more stable than the
DOM/CSS the old heuristics depended on. When ChatGPT does change the data layer,
the parser throws a typed, coded error that pinpoints which layer broke —
instead of silently mis-parsing.

## Detailed design

All steps internal to `parser.ts`.

1. **`extractEnqueuePayloads(html: string): string[]`**
   Regex `/streamController\.enqueue\(("(?:[^"\\]|\\.)*")\)/g`; `JSON.parse`
   each captured string literal to un-escape it. (Verified: extracts exactly the
   2 chunks from the committed capture, including the 179 KB escaped chunk.)
   Empty result ⇒ throw `ChatGPTParseError('TRANSPORT_CHANGED')`.

2. **`decodeReactRouterStream(payloads: string[]): Promise<unknown>`**
   Build a `ReadableStream` that enqueues each payload as a UTF-8 chunk
   (`Uint8Array`) and closes; `const decoded = await decode(stream);
   await decoded.done;` return `decoded.value`. Any throw ⇒ wrap as
   `ChatGPTParseError('DECODE_FAILED', { cause })`.
   This matches the `turbo-stream@2.4.1` API:
   `decode(ReadableStream<Uint8Array>) ⇒ Promise<{ done: Promise<undefined>;
   value: unknown }>`. v3's API differs (string chunks, returns the value
   directly) and is incompatible — see Dependency.

3. **`findLinearConversation(value): MessageNode[]`**
   Iterate `value.loaderData` entries; return the first
   `…serverResponse.data.linear_conversation` array found (search by presence of
   the `linear_conversation` key rather than hardcoding the route key, which
   tolerates a route-segment rename). Not found ⇒ throw
   `ChatGPTParseError('SCHEMA_CHANGED')`.

4. **`mapMessages(nodes): ParsedConversation['messages']`**
   Keep a node when:
   - `node.message` exists,
   - `message.author.role === 'user' || === 'assistant'`,
   - `message.content.content_type === 'text'`,
   - `message.metadata?.is_visually_hidden_from_conversation !== true`.

   Content = `message.content.parts.filter(p => typeof p === 'string').join('')`;
   drop messages whose content is empty after trimming.
   0 messages ⇒ throw `ChatGPTParseError('EMPTY')`.

   `EMPTY` fires only when **zero** visible user/assistant text nodes survive the
   filter; it does **not** require a user message. A capture exposing only a
   visible assistant turn (possible for some `/s/` SSR payloads) must yield 1
   assistant message, which preserves the SSR-only-assistant branch in
   `validatePromptExactMatch` (parser.ts:258-267, out of scope).

   This filter drops, against the committed capture:
   - the root node (no `message`),
   - all `system` nodes,
   - non-text assistant nodes (e.g. `content_type: model_editable_context`),
   - and — **defensively** — any node marked
     `is_visually_hidden_from_conversation: true`. In the committed capture the
     only hidden node is the `system` node, which is already excluded by the
     role gate; the hidden gate is therefore precautionary against captures that
     carry hidden *user* turns (e.g. an injected "Original custom instructions
     no longer available" placeholder). That scenario is **not present** in the
     committed capture (unverified against real hidden-user data).

   Note: the `content_type === 'text'` gate also drops `multimodal_text`
   (image+text) turns entirely — their text parts are not extracted. Acceptable
   for the plain-text assessment flow; revisit if image inputs are ever
   supported. Roles come straight from `author.role` — no marker/alternating
   guessing.

5. **Assemble `ParsedConversation`**
   `title` from `data.title`. Compute `hasPersonalityPrompt` and
   `estimatedQuality` with the existing logic, unchanged.

   **Output note:** `title` now comes from `data.title`
   (`"Life partner reflection questions"`) rather than the `<title>` tag
   (`"ChatGPT - Life partner reflection questions"`). The presentational
   `"ChatGPT - "` prefix is intentionally dropped. `title` is display-only
   metadata (not used by validation or analysis), so this is a benign, intended
   value change; the `ParsedConversation` **shape** is unchanged.

## Fail-loud errors

```ts
type ChatGPTParseErrorCode =
  | 'TRANSPORT_CHANGED'   // no enqueue payloads in HTML
  | 'DECODE_FAILED'       // turbo-stream decode threw
  | 'SCHEMA_CHANGED'      // linear_conversation not found in decoded graph
  | 'EMPTY';              // no visible user/assistant text messages

class ChatGPTParseError extends Error {
  code: ChatGPTParseErrorCode;
  constructor(code: ChatGPTParseErrorCode, options?: { cause?: unknown });
}
```

Each throw site sets a distinct `code`, so server logs identify the broken
layer. The `/api/analyze-chat` route's existing `try/catch` already
`console.error`s — that is the alert signal. The route is intentionally **not**
modified (extraction-only scope); a failed parse surfaces as the route's
existing generic 500.

**Reachability note.** A format/version mismatch that still *decodes* (e.g. a
wrong turbo-stream major, or a future ChatGPT wire-format bump) does **not**
raise `DECODE_FAILED` — it surfaces as `SCHEMA_CHANGED`, because
`linear_conversation` won't be found in the mis-shaped graph. (Verified:
decoding the v2 payload with `turbo-stream@3.2.0` produced a numeric-keyed graph
and threw nothing.) `DECODE_FAILED` is reserved for an actual exception inside
`decode` (truncated/corrupt payload). The version-guard test (Dependency)
catches the wrong-major case earlier, in CI.

## Removals (dead code)

Delete, since the structured path replaces them entirely:

- `unescapeString`
- `isTechnicalString`
- `isConversationMessage`
- `extractMessagesFromJSON`
- the `import * as cheerio` import
- the `debugSaveHTML(html, 'parsed.txt')` call in extraction

Keep `debugSaveHTML` itself (still used at parser.ts:280 and :285 inside
`validatePromptExactMatch`) and everything from `validatePromptExactMatch`
onward (out of scope). (Verified by grep: the deleted functions and the cheerio
import are used only inside the old extraction path; `parseChatGPTShareHTML` has
a single caller at route.ts:206.)

## Dependency (required implementation action)

`turbo-stream` is absent from `package.json` **and** `node_modules`. This is an
action, not a documentation note — the structural canary test cannot run until
it is installed.

- Run `npm install turbo-stream@^2.4.1`; commit the pinned `^2.4.1` range and
  the updated lockfile. Zero-dependency, ~3 KB; the same decoder React Router
  uses.
- ChatGPT emits the v2 wire format. `turbo-stream@3.x` (latest is 3.2.0) is a
  breaking change in both the input chunk type (`Uint8Array` → `string`) and the
  return shape (`{ done, value }` → `Promise<T>`), and it mis-decodes this
  payload (verified). Match major version 2.
- Add a **major-version guard test** that fails if the installed major ≠ 2, so a
  careless `npm update` to v3 fails loudly in CI instead of silently surfacing as
  a runtime `SCHEMA_CHANGED`:
  `expect(require('turbo-stream/package.json').version.split('.')[0]).toBe('2')`.

## Testing — the future-proofing canary

All parser tests in this suite **MUST** begin with the docblock
`/** @jest-environment node */`. The decode path constructs a `ReadableStream`,
which is `undefined` under the repo's default `jsdom` test environment
(`jest.config.ts` → `testEnvironment: 'jsdom'`, no polyfill). The production
route runs under Node, so prod is unaffected; only the tests need the override.

**Structural canary (required now).** Place the committed capture at
`__tests__/fixtures/chatgpt-share-sample.html` (currently at
`landing_page/chatgpt-share-sample.html`; move or copy it under
`__tests__/fixtures/`). Assert: decode ⇒ `messages.length === 18`;
`messages[0].role === 'user'`; `messages[17].role === 'assistant'`; every
message non-empty after trim; `title === 'Life partner reflection questions'`.
This exercises the whole decode → find → filter → assemble pipeline against a
real `/share/` payload. It is a generic chat with **no** assessment markers, so
it is intentionally **not** asserted against `validatePromptExactMatch`.

**Version guard.**
`expect(require('turbo-stream/package.json').version.split('.')[0]).toBe('2')`.

**Fail-loud tests** — one per code:
- HTML with no enqueue payloads ⇒ `TRANSPORT_CHANGED`. (The committed
  `thread.html` — logged-in app DOM, 0 enqueue calls — is a ready-made fixture.)
- corrupted/truncated payload ⇒ `DECODE_FAILED`.
- payload that decodes but lacks `linear_conversation` ⇒ `SCHEMA_CHANGED`.
- conversation of only hidden/system/non-text nodes ⇒ `EMPTY`.

**Deferred — assessment-flow canary (tracked TODO).** No assessment-format
fixture exists, so the product-critical 2-turn path (user message == a current
DB prompt; assistant == an assessment carrying `--- ASSESSMENT ---` /
`OVERALL COMPLETENESS:`) is currently unguarded by fixture. **Blocker:** ChatGPT
`/share/` returns 403 (Cloudflare) to our `Authentyc Bot/1.0` UA (`fetcher.ts`),
and the only committed capture has 0 assessment markers. **To produce one:** run
the live product flow end-to-end to generate a real 2-turn assessment
conversation, mint a share link via ChatGPT's UI, manually save the rendered page
as `__tests__/fixtures/chatgpt-assessment-<date>.html`, then add a test
asserting exactly 2 messages, correct roles, and that the assessment markers and
`validatePromptExactMatch` extract/pass. Until then, the assessment path (and the
`hasAssessmentMarkers` branch, parser.ts:258-267) is untested by fixture.

When ChatGPT changes its format, refreshing the structural fixture from a new
capture and re-running these tests reveals both that something changed and which
layer.

## `/s/` short-links — interim scope-out + must-verify TODO

`fetcher.ts:40` accepts **both** `/share/` and `/s/` paths as valid input, so
`/s/` is a supported, shipping input — not a hypothetical. Per the rationale on
parser.ts:258-267, `/s/` pages historically embed only the final assistant
message via SSR. The old cheerio parser was lenient (scraped quoted strings) and
could surface that lone message; the new structured parser **hard-requires**
`streamController.enqueue` → `linear_conversation` and throws
`TRANSPORT_CHANGED`/`SCHEMA_CHANGED` if they are absent. If a `/s/` page embeds
the assistant turn as plain SSR DOM rather than an enqueue stream, the new parser
throws where the old one yielded text — a genuine regression on a supported
input.

We have **zero** `/s/` captures in the repo (`thread.html` is logged-in app DOM;
`chatgpt-share-sample.html` is `/share/` canonical and confirmed to carry
`linear_conversation`). `/s/` behavior therefore **cannot be verified today** and
must not be asserted either way.

- **Interim scope decision:** `/s/` extraction is treated as **UNVERIFIED**. The
  parser ships as-is (hard-require enqueue), verified for `/share/` only.
- **TODO (blocking before advertising `/s/` support):** capture a real `/s/`
  short-link page and save it as `__tests__/fixtures/chatgpt-s-short-link-<date>.html`.
  Confirm whether it embeds an enqueue stream or only SSR DOM. If SSR-only,
  restore an explicit SSR-DOM fallback path for `/s/` (mirroring the intent of
  parser.ts:258-267) rather than throwing.

## Out of scope

- `validatePromptExactMatch` / `validateParsedConversation` (validation).
- `parseResponse` / `extractSummary` / rating extraction.
- `/api/analyze-chat` route error mapping.
- `fetcher.ts`.
