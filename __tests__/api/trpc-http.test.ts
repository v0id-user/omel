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
      clientIp: '127.0.0.1',
      req: request,
      resHeaders,
    }),
  });

  return { response, resHeaders };
}

describe('tRPC HTTP contract: public validations', () => {
  it('validates a phone number without a session', async () => {
    const { response } = await callTRPC('validations.validatePhoneArab', {
      method: 'POST',
      body: { json: '+966501234567' },
    });
    expect(response.status).toBe(200);

    const body = await response.json();
    expect(body.result.data.json).toBe(true);
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
    const { response } = await callTRPC('validations.validateEmail', {
      method: 'POST',
      body: 'not-an-email',
    });
    expect(response.status).toBe(400);

    const body = await response.json();
    expect(body.error.json.data.code).toBe('BAD_REQUEST');
    expect(body.error.json.data.httpStatus).toBe(400);
  });
});
