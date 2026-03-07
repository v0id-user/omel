import { afterEach, beforeEach, describe, expect, it, mock, spyOn } from 'bun:test';
import { validateEmail } from '@/utils/emails/validate';

describe('validateEmail', () => {
  const originalApiKey = process.env.ABSTRACT_API_KEY;
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    delete process.env.ABSTRACT_API_KEY;
    globalThis.fetch = originalFetch;
    spyOn(console, 'warn').mockImplementation(() => undefined);
    spyOn(console, 'error').mockImplementation(() => undefined);
  });

  afterEach(() => {
    if (originalApiKey === undefined) {
      delete process.env.ABSTRACT_API_KEY;
    } else {
      process.env.ABSTRACT_API_KEY = originalApiKey;
    }
    globalThis.fetch = originalFetch;
  });

  it('accepts a valid non-disposable email without the API key', async () => {
    expect(await validateEmail('person@example.com')).toBe(true);
  });

  it('rejects a disposable email without the API key', async () => {
    expect(await validateEmail('person@mailinator.com')).toBe(false);
  });

  it('rejects malformed domains during fallback validation', async () => {
    expect(await validateEmail('person@-example..com')).toBe(false);
  });

  it('rejects disposable emails reported by the API', async () => {
    process.env.ABSTRACT_API_KEY = 'test-key';
    globalThis.fetch = mock(() =>
      Promise.resolve({
        ok: true,
        json: async () => ({
          is_valid_format: { value: true },
          is_disposable_email: { value: true },
          is_mx_found: { value: true },
          deliverability: 'DELIVERABLE',
        }),
      } as Response)
    ) as unknown as typeof fetch;

    expect(await validateEmail('person@example.com')).toBe(false);
  });

  it('falls back to local validation when the API request fails', async () => {
    process.env.ABSTRACT_API_KEY = 'test-key';
    globalThis.fetch = mock(() =>
      Promise.reject(new Error('network down'))
    ) as unknown as typeof fetch;

    expect(await validateEmail('person@example.com')).toBe(true);
  });
});
