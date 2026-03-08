import { beforeEach, describe, expect, it, mock } from 'bun:test';
import { NextRequest } from 'next/server';

const getSessionMock = mock<(options: { headers: Headers }) => Promise<unknown | null>>(() =>
  Promise.resolve(null)
);

mock.module('@/lib/betterauth/auth', () => ({
  auth: {
    api: {
      getSession: getSessionMock,
    },
  },
}));

import { config, proxy } from '@/proxy';

describe('proxy', () => {
  beforeEach(() => {
    getSessionMock.mockReset();
  });

  it('redirects unauthenticated dashboard requests to sign-in', async () => {
    getSessionMock.mockResolvedValue(null);
    const request = new NextRequest('http://localhost:3000/dashboard');

    const response = await proxy(request);

    expect(getSessionMock).toHaveBeenCalledWith({
      headers: request.headers,
    });
    expect(response.status).toBe(307);
    expect(response.headers.get('location')).toBe('http://localhost:3000/sign-in');
  });

  it('passes through authenticated dashboard requests', async () => {
    getSessionMock.mockResolvedValue({
      session: { id: 'session-id', activeOrganizationId: 'org-id' },
      user: { id: 'user-id' },
    });
    const request = new NextRequest('http://localhost:3000/dashboard/tasks');

    const response = await proxy(request);

    expect(response.headers.get('x-middleware-next')).toBe('1');
    expect(response.headers.get('location')).toBeNull();
  });

  it('keeps the dashboard matcher configuration', () => {
    expect(config).toEqual({
      matcher: ['/dashboard', '/dashboard/:path*'],
    });
  });
});
