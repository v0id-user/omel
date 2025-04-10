import { test, expect } from '@jest/globals';
import { appRouter } from '@/trpc/routers/_app';
import type { TRPCContext } from '@/trpc/init';
import { NewCRMUserInfo } from '@/interfaces/crm';
test('create crm', async () => {
  const ctx: TRPCContext = { session: null };

  const caller = appRouter.createCaller(ctx);
  try {
    const newCRM: NewCRMUserInfo = {
      email: 'test@gmail.com',
      password: 'password',
      personalInfo: {
        firstName: 'Test',
        lastName: 'Test',
        phone: '+966511111111',
      },
      companyInfo: {
        name: 'Test Company',
        website: 'https://test.com',
        address: '123 Test St, Test City, Test Country',
        size: '1-9',
      },
    };
    const result = await caller.crm.new.create(newCRM);
    console.log(result);
    expect(result.status).toBe('ok');
  } catch (error) {
    console.error(error);
    throw error;
  }
});
