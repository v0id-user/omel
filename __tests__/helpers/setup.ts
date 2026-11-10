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
    ratelimit: { limit: () => Promise.resolve({ success: true }) },
    publicRatelimit: { limit: () => Promise.resolve({ success: true }) },
    signupRatelimit: { limit: () => Promise.resolve({ success: true }) },
  }));

  mock.module('@/features/crm/shared/server/ownership', () => ({
    assertReferencesInOrganization: () => Promise.resolve(),
    getMemberRole: () => Promise.resolve('owner'),
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
