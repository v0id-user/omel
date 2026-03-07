import { describe, it, expect, mock } from 'bun:test';
import { setupTRPCMocks } from '@/__tests__/helpers/setup';
import { NextRequest } from 'next/server';

setupTRPCMocks();

import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { appRouter } from '@/trpc/routers/_app';

async function callTRPC(path: string, opts: { method?: string; body?: unknown } = {}) {
  const url = `http://localhost:3000/api/v1/${path}`;
  const resHeaders = new Headers();

  const request = new NextRequest(url, {
    method: opts.method || 'GET',
    headers: { 'Content-Type': 'application/json' },
    ...(opts.body ? { body: JSON.stringify(opts.body) } : {}),
  });

  const response = await fetchRequestHandler({
    endpoint: '/api/v1',
    req: request,
    router: appRouter,
    createContext: async () => ({
      session: null,
      req: request,
      resHeaders,
    }),
  });

  return { response, resHeaders };
}

describe('tRPC HTTP contract: tests.nonProtectedHello', () => {
  it('responds with 200 and correct JSON shape', async () => {
    const { response } = await callTRPC('tests.nonProtectedHello');
    expect(response.status).toBe(200);

    const body = await response.json();
    expect(body).toBeDefined();
    expect(body.result).toBeDefined();
    expect(body.result.data).toBeDefined();
    expect(body.result.data.json).toBe('Hello, world!');
  });
});

describe('tRPC HTTP contract: tests.protectedHello', () => {
  it('responds with 401 and UNAUTHORIZED error shape', async () => {
    const { response } = await callTRPC('tests.protectedHello');
    expect(response.status).toBe(401);

    const body = await response.json();
    expect(body.error).toBeDefined();
    expect(body.error.json).toBeDefined();
    expect(body.error.json.data.code).toBe('UNAUTHORIZED');
    expect(body.error.json.data.httpStatus).toBe(401);
    expect(typeof body.error.json.message).toBe('string');
  });
});

describe('tRPC HTTP contract: headerTests.setHeader (mutation)', () => {
  it('responds with 200 and success payload', async () => {
    const { response, resHeaders } = await callTRPC('headerTests.setHeader', {
      method: 'POST',
      body: { json: { name: 'X-Test-Header', value: 'test-value' } },
    });

    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.result).toBeDefined();
    expect(body.result.data.json.success).toBe(true);
    expect(body.result.data.json.message).toContain('X-Test-Header');
  });
});

describe('tRPC HTTP contract: headerTests.setCookie (mutation)', () => {
  it('responds with success and sets cookie header', async () => {
    const { response, resHeaders } = await callTRPC('headerTests.setCookie', {
      method: 'POST',
      body: { json: { name: 'myCookie', value: 'myValue', maxAge: 7200 } },
    });

    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.result.data.json.success).toBe(true);
    expect(resHeaders.get('Set-Cookie')).toContain('myCookie=myValue');
    expect(resHeaders.get('Set-Cookie')).toContain('Max-Age=7200');
  });
});

describe('tRPC HTTP contract: error payload format', () => {
  it('returns 404 with NOT_FOUND for missing procedures', async () => {
    const { response } = await callTRPC('nonexistent.procedure');
    expect(response.status).toBe(404);

    const body = await response.json();
    expect(body.error).toBeDefined();
    expect(body.error.json).toBeDefined();
    expect(body.error.json.data.code).toBe('NOT_FOUND');
    expect(body.error.json.data.httpStatus).toBe(404);
    expect(typeof body.error.json.message).toBe('string');
  });

  it('returns 400 for invalid input on mutations', async () => {
    const { response } = await callTRPC('headerTests.setHeader', {
      method: 'POST',
    });
    expect(response.status).toBe(400);

    const body = await response.json();
    expect(body.error.json.data.code).toBe('BAD_REQUEST');
    expect(body.error.json.data.httpStatus).toBe(400);
  });
});
