import { describe, it, expect, beforeEach } from 'bun:test';
import { setupTRPCMocks } from '@/__tests__/helpers/setup';

setupTRPCMocks();

import type { TRPCContext } from '@/trpc/init';
import type { NextRequest } from 'next/server';
import { appRouter } from '@/trpc/routers/_app';

describe('tRPC header tests', () => {
  let ctx: TRPCContext;
  let resHeaders: Headers;

  beforeEach(() => {
    resHeaders = new Headers();

    ctx = {
      session: null,
      req: {
        headers: new Headers({
          'content-type': 'application/json',
          'user-agent': 'bun-test',
        }),
        cookies: new Map([
          ['existingCookie', 'existingValue'],
          ['sessionId', '123456'],
        ]),
      } as unknown as NextRequest,
      resHeaders,
    } as TRPCContext;
  });

  it('sets response headers', async () => {
    const caller = appRouter.createCaller(ctx);
    const result = await caller.headerTests.setHeader({
      name: 'X-Custom-Header',
      value: 'custom-value',
    });

    expect(result.success).toBe(true);
    expect(resHeaders.get('X-Custom-Header')).toBe('custom-value');
  });

  it('sets cookies on response headers', async () => {
    const caller = appRouter.createCaller(ctx);
    const result = await caller.headerTests.setCookie({
      name: 'testCookie',
      value: 'cookieValue',
      maxAge: 3600,
    });

    expect(result.success).toBe(true);
    const setCookie = resHeaders.get('Set-Cookie');
    expect(setCookie).toContain('testCookie=cookieValue');
    expect(setCookie).toContain('Max-Age=3600');
  });

  it('reads request headers', async () => {
    const caller = appRouter.createCaller(ctx);
    const headersResult = await caller.headerTests.getRequestHeaders({
      headerName: 'user-agent',
    });

    expect(headersResult['user-agent']).toBe('bun-test');
  });

  it('reads request cookies', async () => {
    const caller = appRouter.createCaller(ctx);
    const cookiesResult = await caller.headerTests.getRequestCookies();

    expect(cookiesResult).toEqual({
      existingCookie: 'existingValue',
      sessionId: '123456',
    });
  });

  it('returns all request headers when no specific header requested', async () => {
    const caller = appRouter.createCaller(ctx);
    const headersResult = await caller.headerTests.getRequestHeaders({});

    expect(headersResult['content-type']).toBe('application/json');
    expect(headersResult['user-agent']).toBe('bun-test');
  });
});
