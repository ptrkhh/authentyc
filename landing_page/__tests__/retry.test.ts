/** @jest-environment node */
import { withRetry } from '@/lib/utils/retry';

describe('withRetry', () => {
  it('returns the result without retrying when fn succeeds first try', async () => {
    let calls = 0;
    const result = await withRetry(async () => { calls++; return 'ok'; }, { attempts: 3, baseDelayMs: 0 });
    expect(result).toBe('ok');
    expect(calls).toBe(1);
  });

  it('retries until a later attempt succeeds', async () => {
    let calls = 0;
    const result = await withRetry(async () => {
      calls++;
      if (calls < 3) throw new Error('transient');
      return 'ok';
    }, { attempts: 3, baseDelayMs: 0 });
    expect(result).toBe('ok');
    expect(calls).toBe(3);
  });

  it('throws the last error after exhausting all attempts', async () => {
    let calls = 0;
    await expect(
      withRetry(async () => { calls++; throw new Error(`fail ${calls}`); }, { attempts: 3, baseDelayMs: 0 })
    ).rejects.toThrow('fail 3');
    expect(calls).toBe(3);
  });

  it('defaults to 3 attempts', async () => {
    let calls = 0;
    await expect(
      withRetry(async () => { calls++; throw new Error('boom'); }, { baseDelayMs: 0 })
    ).rejects.toThrow('boom');
    expect(calls).toBe(3);
  });
});
