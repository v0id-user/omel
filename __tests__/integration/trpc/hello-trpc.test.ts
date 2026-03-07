import { describe, it, expect, mock, beforeEach } from 'bun:test';
import { setupTRPCMocks } from '@/__tests__/helpers/setup';

setupTRPCMocks();

import type { TRPCContext } from '@/trpc/init';
import { appRouter } from '@/trpc/routers/_app';

describe('tRPC hello routes', () => {
  it('returns hello from the public procedure', async () => {
    const ctx = {
      session: null,
      req: undefined,
      resHeaders: new Headers(),
    } as TRPCContext;

    const caller = appRouter.createCaller(ctx);
    const result = await caller.tests.nonProtectedHello();
    expect(result).toBe('Hello, world!');
  });

  it('rejects the protected procedure without a session', async () => {
    const ctx = {
      session: null,
      req: undefined,
      resHeaders: new Headers(),
    } as TRPCContext;

    const caller = appRouter.createCaller(ctx);

    try {
      await caller.tests.protectedHello();
      throw new Error('Should have thrown');
    } catch (err: any) {
      expect(err.code).toBe('UNAUTHORIZED');
    }
  });

  it('returns greeting for authenticated user', async () => {
    const ctx = {
      session: {
        session: {
          id: 'test-session-id',
          createdAt: new Date(),
          updatedAt: new Date(),
          userId: 'test-user-id',
          expiresAt: new Date(Date.now() + 86400000),
          token: 'test-token',
          activeOrganizationId: 'test-org-id',
        },
        user: {
          id: 'test-user-id',
          name: 'Test User',
          email: 'test@example.com',
          emailVerified: true,
          createdAt: new Date(),
          updatedAt: new Date(),
          twoFactorEnabled: false,
        },
      },
      req: undefined,
      resHeaders: new Headers(),
    } as TRPCContext;

    const caller = appRouter.createCaller(ctx);
    const result = await caller.tests.protectedHello();
    expect(result).toBe('Hello, test@example.com!');
  });
});
