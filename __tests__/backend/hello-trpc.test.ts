// import { test, expect } from '@jest/globals';
// import { appRouter } from '@/trpc/routers/_app';
// import type { TRPCContext } from '@/trpc/init';

// test('Testing calling a non-protected route', async () => {
//   const ctx: TRPCContext = { session: null, req: undefined, resHeaders: new Headers() };

//   const caller = appRouter.createCaller(ctx);

//   const result = await caller.tests.nonProtectedHello();
//   console.log(result);
//   expect(result).toBe('Hello, world!');
// });

// test('Testing calling a protected route', async () => {
//   const ctx: TRPCContext = {
//     session: {
//       session: {
//         id: 'test-session-id',
//         createdAt: new Date(),
//         updatedAt: new Date(),
//         userId: 'test-user-id',
//         expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
//         token: 'test-token',
//       },
//       user: {
//         id: 'test-user-id',
//         name: 'Test User',
//         email: 'test@example.com',
//         emailVerified: true,
//         createdAt: new Date(),
//         updatedAt: new Date(),
//         twoFactorEnabled: false,
//       },
//       req: undefined,
//       resHeaders: new Headers(),
//     },
//   };

//   const caller = appRouter.createCaller(ctx);

//   const result = await caller.tests.protectedHello();
//   expect(result).toBe('Hello, test@example.com!');
// });
import { describe, expect, it, jest } from '@jest/globals';

jest.mock('@/lib/betterauth/auth', () => ({
  auth: {
    api: {
      getSession: jest.fn(),
    },
  },
}));

jest.mock('@/lib/ratelimt', () => ({
  ratelimit: {
    limit: jest.fn(async () => ({
      success: true,
    })),
  },
}));

jest.mock('superjson', () => ({
  __esModule: true,
  default: {
    serialize: jest.fn(value => value),
    deserialize: jest.fn(value => value),
  },
}));

jest.mock('@/trpc/routers/crm/index', () => ({
  crmRouter: {},
}));

import type { TRPCContext } from '@/trpc/init';

describe('tRPC hello routes', () => {
  it('returns hello from the public procedure', async () => {
    const { appRouter } = await import('@/trpc/routers/_app');
    const ctx = {
      session: null,
      req: undefined,
      resHeaders: new Headers(),
    } as TRPCContext;

    const caller = appRouter.createCaller(ctx);

    await expect(caller.tests.nonProtectedHello()).resolves.toBe('Hello, world!');
  });

  it('rejects the protected procedure without a session', async () => {
    const { appRouter } = await import('@/trpc/routers/_app');
    const ctx = {
      session: null,
      req: undefined,
      resHeaders: new Headers(),
    } as TRPCContext;

    const caller = appRouter.createCaller(ctx);

    await expect(caller.tests.protectedHello()).rejects.toMatchObject({
      code: 'UNAUTHORIZED',
    });
  });
});
