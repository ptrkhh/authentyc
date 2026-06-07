export interface RetryOptions {
  /** Total attempts (including the first). Default 3. */
  attempts?: number;
  /** Base delay between attempts in ms; the nth retry waits baseDelayMs * n. Default 500. */
  baseDelayMs?: number;
}

/**
 * Run an async function, retrying on any thrown error up to `attempts` times.
 * Returns the first successful result; rethrows the last error if all attempts fail.
 * Pass baseDelayMs: 0 in tests to avoid real waits.
 */
export async function withRetry<T>(fn: () => Promise<T>, opts: RetryOptions = {}): Promise<T> {
  const attempts = opts.attempts ?? 3;
  const baseDelayMs = opts.baseDelayMs ?? 500;
  let lastError: unknown;

  for (let attempt = 0; attempt < attempts; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      if (attempt < attempts - 1 && baseDelayMs > 0) {
        await new Promise((resolve) => setTimeout(resolve, baseDelayMs * (attempt + 1)));
      }
    }
  }

  throw lastError instanceof Error ? lastError : new Error(String(lastError));
}
