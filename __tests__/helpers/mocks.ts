import type { TRPCContext } from '@/trpc/init';

export function createMockSession(overrides?: Partial<TRPCContext>): TRPCContext {
  return {
    session: {
      session: {
        id: 'test-session-id',
        createdAt: new Date('2025-01-01'),
        updatedAt: new Date('2025-01-01'),
        userId: 'test-user-id',
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        token: 'test-token',
        activeOrganizationId: 'test-org-id',
      },
      user: {
        id: 'test-user-id',
        name: 'Test User',
        email: 'test@example.com',
        emailVerified: true,
        createdAt: new Date('2025-01-01'),
        updatedAt: new Date('2025-01-01'),
        twoFactorEnabled: false,
      },
    },
    req: undefined,
    resHeaders: new Headers(),
    ...overrides,
  } as TRPCContext;
}

export function createUnauthenticatedContext(overrides?: Partial<TRPCContext>): TRPCContext {
  return {
    session: null,
    req: undefined,
    resHeaders: new Headers(),
    ...overrides,
  } as TRPCContext;
}
