import { test, expect } from '@jest/globals';
import { appRouter } from '@/trpc/routers/_app';
import { createTRPCContext } from '@/trpc/init';

test('hello trpc', async () => {
  const caller = appRouter.createCaller(await createTRPCContext());
  const result = await caller.hello({ text: 'client' });
  expect(result.greeting).toBe('hello client');
});
