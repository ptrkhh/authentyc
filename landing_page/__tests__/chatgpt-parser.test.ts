/** @jest-environment node */
// ReadableStream (used by the decode path) is undefined under jsdom; the
// production route runs under Node, so only the tests need this override.

// Prevent module-level Supabase env-var throw from breaking the test suite.
// parseChatGPTShareHTML itself never touches Supabase; only validatePromptExactMatch
// does (called from a separate function further down the import chain).
jest.mock('../lib/supabase/server', () => ({ supabaseServer: {} }));

import { readFileSync } from 'fs';
import { join } from 'path';
import { encode } from 'turbo-stream';
import { parseChatGPTShareHTML, ChatGPTParseError } from '@/lib/chatgpt/parser';

const fixture = (name: string) =>
  readFileSync(join(__dirname, 'fixtures', name), 'utf-8');

describe('turbo-stream dependency', () => {
  it('is pinned to major version 2 (v3 mis-decodes ChatGPT payloads)', () => {
    const { version } = require('turbo-stream/package.json');
    expect(version.split('.')[0]).toBe('2');
  });
});

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
