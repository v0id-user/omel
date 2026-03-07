import { mock } from 'bun:test';

export function setupTRPCMocks() {
  mock.module('@/lib/betterauth/auth', () => ({
    auth: {
      api: {
        getSession: () => Promise.resolve(null),
      },
    },
  }));

  mock.module('@/lib/ratelimt', () => ({
    ratelimit: {
      limit: () => Promise.resolve({ success: true }),
    },
  }));

  mock.module('superjson', () => ({
    default: {
      serialize: (value: unknown) => value,
      deserialize: (value: unknown) => value,
    },
  }));

  mock.module('@/trpc/routers/crm/index', () => ({
    crmRouter: {},
  }));
}
