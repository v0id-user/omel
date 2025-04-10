// import { test, expect, describe, beforeEach } from '@jest/globals';
// import { appRouter } from '@/trpc/routers/_app';
// import type { TRPCContext } from '@/trpc/init';
// import { NextRequest } from 'next/server';
// import { RequestCookie } from 'next/dist/compiled/@edge-runtime/cookies';

// describe('TRPC Header Tests', () => {
//   // Mock for resHeaders
//   let mockResHeaders: Headers;
//   // Mock for request headers and cookies
//   let mockRequestHeaders: Headers;
//   let mockRequestCookies: Map<string, string>;
//   // Mock for NextRequest
//   let mockRequest: Partial<NextRequest>;
//   // Context for our caller
//   let ctx: TRPCContext;

//   beforeEach(() => {
//     // Reset mocks before each test
//     mockResHeaders = new Headers();
//     mockRequestHeaders = new Headers({
//       'content-type': 'application/json',
//       'user-agent': 'jest-test',
//     });
//     mockRequestCookies = new Map([
//       ['existingCookie', 'existingValue'],
//       ['sessionId', '123456'],
//     ]);

//     // Convert to RequestCookie objects
//     const cookiesArray = Array.from(mockRequestCookies.entries()).map(
//       ([name, value]) => ({ name, value } as RequestCookie)
//     );

//     // Create a partial NextRequest mock
//     mockRequest = {
//       headers: mockRequestHeaders,
//       cookies: {
//         get: (name: string) => {
//           const value = mockRequestCookies.get(name);
//           return value ? { name, value } as RequestCookie : undefined;
//         },
//         getAll: () => cookiesArray,
//         [Symbol.iterator]: function* () {
//           yield* cookiesArray;
//         },
//       } as any, // Using 'any' to bypass the strict typing for the mock
//     };

//     // Set up context with our mocks
//     ctx = {
//       session: null,
//       req: mockRequest as NextRequest,
//       resHeaders: mockResHeaders,
//     };
//   });

//   test('Setting a cookie in response headers', async () => {
//     const caller = appRouter.createCaller(ctx);

//     const result = await caller.headerTests.setCookie({
//       name: 'testCookie',
//       value: 'cookieValue',
//       maxAge: 3600
//     });

//     expect(result.success).toBe(true);
//     expect(mockResHeaders.has('Set-Cookie')).toBe(true);

//     // Headers.getAll is not standard in all environments, so we use get and check the value
//     const setCookieHeader = mockResHeaders.get('Set-Cookie');
//     expect(setCookieHeader).toContain('testCookie=cookieValue');
//     expect(setCookieHeader).toContain('Max-Age=3600');
//   });

//   test('Setting a custom header in response', async () => {
//     const caller = appRouter.createCaller(ctx);

//     const result = await caller.headerTests.setHeader({
//       name: 'X-Custom-Header',
//       value: 'custom-value'
//     });

//     expect(result.success).toBe(true);
//     expect(mockResHeaders.get('X-Custom-Header')).toBe('custom-value');
//   });

//   test('Reading request headers', async () => {
//     const caller = appRouter.createCaller(ctx);

//     // Get a specific header
//     const userAgentResult = await caller.headerTests.getRequestHeaders({
//       headerName: 'user-agent'
//     });

//     expect(userAgentResult['user-agent']).toBe('jest-test');

//     // Get all headers
//     const allHeaders = await caller.headerTests.getRequestHeaders({});
//     expect(allHeaders['content-type']).toBe('application/json');
//     expect(allHeaders['user-agent']).toBe('jest-test');
//   });

//   test('Reading request cookies', async () => {
//     const caller = appRouter.createCaller(ctx);

//     const cookies = await caller.headerTests.getRequestCookies();

//     expect(cookies).toEqual({
//       'existingCookie': 'existingValue',
//       'sessionId': '123456'
//     });
//   });
// });
