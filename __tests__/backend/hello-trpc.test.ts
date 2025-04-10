import { test, expect } from '@jest/globals';
import { appRouter } from '@/trpc/routers/_app';
import type { TRPCContext } from '@/trpc/init';

test('Testing calling a non-protected route', async () => {
  const ctx: TRPCContext = { session: null };

  const caller = appRouter.createCaller(ctx);

  const result = await caller.tests.nonProtectedHello();
  console.log(result);
  expect(result).toBe('Hello, world!');
});

test('Testing calling a protected route', async () => {
  const ctx: TRPCContext = {
    session: {
      session: {
        id: 'test-session-id',
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: 'test-user-id',
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        token: 'test-token',
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
  };

  const caller = appRouter.createCaller(ctx);

  const result = await caller.tests.protectedHello();
  expect(result).toBe('Hello, test@example.com!');
});
