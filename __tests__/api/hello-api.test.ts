import { describe, it, expect, beforeEach, afterEach } from 'bun:test';
import { GET } from '@/app/api/hello/route';

describe('Hello API Route', () => {
  let originalDebug: string | undefined;

  beforeEach(() => {
    originalDebug = process.env.NEXT_PUBLIC_DEBUG;
  });

  afterEach(() => {
    process.env.NEXT_PUBLIC_DEBUG = originalDebug;
  });

  it('returns 200 with JSON message when DEBUG is true', async () => {
    process.env.NEXT_PUBLIC_DEBUG = 'true';
    const response = await GET();
    expect(response).toBeDefined();
    if (response) {
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data).toEqual({ message: 'Hello World' });
    }
  });

  it('returns undefined when DEBUG is not true', async () => {
    process.env.NEXT_PUBLIC_DEBUG = 'false';
    const response = await GET();
    expect(response).toBeUndefined();
  });

  it('response has correct content-type header', async () => {
    process.env.NEXT_PUBLIC_DEBUG = 'true';
    const response = await GET();
    expect(response).toBeDefined();
    if (response) {
      expect(response.headers.get('content-type')).toContain('application/json');
    }
  });
});
