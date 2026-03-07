import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';
import { validateEmail } from '@/utils/emails/validate';

describe('validateEmail', () => {
  const originalApiKey = process.env.ABSTRACT_API_KEY;
  const originalFetch = global.fetch;

  beforeEach(() => {
    jest.restoreAllMocks();
    delete process.env.ABSTRACT_API_KEY;
    global.fetch = originalFetch;
    jest.spyOn(console, 'warn').mockImplementation(() => undefined);
    jest.spyOn(console, 'error').mockImplementation(() => undefined);
  });

  afterEach(() => {
    if (originalApiKey === undefined) {
      delete process.env.ABSTRACT_API_KEY;
    } else {
      process.env.ABSTRACT_API_KEY = originalApiKey;
    }
    global.fetch = originalFetch;
  });

  it('accepts a valid non-disposable email without the API key', async () => {
    await expect(validateEmail('person@example.com')).resolves.toBe(true);
  });

  it('rejects a disposable email without the API key', async () => {
    await expect(validateEmail('person@mailinator.com')).resolves.toBe(false);
  });

  it('rejects malformed domains during fallback validation', async () => {
    await expect(validateEmail('person@-example..com')).resolves.toBe(false);
  });

  it('rejects disposable emails reported by the API', async () => {
    process.env.ABSTRACT_API_KEY = 'test-key';
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        is_valid_format: { value: true },
        is_disposable_email: { value: true },
        is_mx_found: { value: true },
        deliverability: 'DELIVERABLE',
      }),
    } as Response);

    await expect(validateEmail('person@example.com')).resolves.toBe(false);
  });

  it('falls back to local validation when the API request fails', async () => {
    process.env.ABSTRACT_API_KEY = 'test-key';
    global.fetch = jest.fn().mockRejectedValue(new Error('network down'));

    await expect(validateEmail('person@example.com')).resolves.toBe(true);
  });
});
