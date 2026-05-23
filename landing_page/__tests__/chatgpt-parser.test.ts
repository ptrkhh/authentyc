/** @jest-environment node */
// ReadableStream (used by the decode path) is undefined under jsdom; the
// production route runs under Node, so only the tests need this override.

describe('turbo-stream dependency', () => {
  it('is pinned to major version 2 (v3 mis-decodes ChatGPT payloads)', () => {
    const { version } = require('turbo-stream/package.json');
    expect(version.split('.')[0]).toBe('2');
  });
});
