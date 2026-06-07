/**
 * Parse JSON that may be wrapped in markdown code fences or surrounded by prose.
 *
 * Tries, in order: direct parse → strip ```json/``` fences → extract the first
 * `{ … }` span. Throws if none yield valid JSON. Does NOT salvage truncated JSON
 * (an incomplete object can't be repaired) — that case is handled by retrying the
 * upstream call.
 */
export function parseJsonLenient<T = unknown>(text: string): T {
  const trimmed = text.trim();

  try {
    return JSON.parse(trimmed) as T;
  } catch {
    // fall through
  }

  const fence = trimmed.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  if (fence) {
    try {
      return JSON.parse(fence[1].trim()) as T;
    } catch {
      // fall through
    }
  }

  const first = trimmed.indexOf('{');
  const last = trimmed.lastIndexOf('}');
  if (first !== -1 && last > first) {
    try {
      return JSON.parse(trimmed.slice(first, last + 1)) as T;
    } catch {
      // fall through
    }
  }

  throw new Error('No valid JSON object found in text');
}
