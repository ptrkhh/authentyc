/** @jest-environment node */
// ReadableStream (used by the decode path) is undefined under jsdom; the
// production route runs under Node, so only the tests need this override.

// Prevent module-level Supabase env-var throw from breaking the test suite.
// parseChatGPTShareHTML itself never touches Supabase; only validatePromptExactMatch
// does (called from a separate function further down the import chain).
jest.mock('../lib/supabase/server', () => ({ supabaseServer: {} }));

import { readFileSync } from 'fs';
import { join } from 'path';
import { parseChatGPTShareHTML } from '@/lib/chatgpt/parser';

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
