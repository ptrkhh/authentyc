/** @jest-environment node */
import { parseJsonLenient } from '@/lib/utils/json';

describe('parseJsonLenient', () => {
  it('parses plain JSON', () => {
    expect(parseJsonLenient('{"a":1}')).toEqual({ a: 1 });
  });

  it('strips ```json code fences', () => {
    expect(parseJsonLenient('```json\n{"a":1}\n```')).toEqual({ a: 1 });
  });

  it('strips bare ``` code fences', () => {
    expect(parseJsonLenient('```\n{"a":1}\n```')).toEqual({ a: 1 });
  });

  it('extracts a JSON object embedded in prose', () => {
    expect(parseJsonLenient('Here you go:\n{"a":1}\nHope that helps')).toEqual({ a: 1 });
  });

  it('tolerates leading/trailing whitespace', () => {
    expect(parseJsonLenient('  \n {"a":1}  ')).toEqual({ a: 1 });
  });

  it('throws when no JSON object is present', () => {
    expect(() => parseJsonLenient('not json at all')).toThrow();
  });

  it('throws on truncated/incomplete JSON (retry territory, not salvageable)', () => {
    expect(() => parseJsonLenient('{"characters":[{"name":"A"')).toThrow();
  });
});
