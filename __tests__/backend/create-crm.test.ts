// import { test, expect } from '@jest/globals';
// import { appRouter } from '@/trpc/routers/_app';
// import type { TRPCContext } from '@/trpc/init';
// import { NewCRMUserInfo } from '@/interfaces/crm';
// test('create crm', async () => {
//   const ctx: TRPCContext = { session: null };

//   const caller = appRouter.createCaller(ctx);
//   try {
//     const newCRM: NewCRMUserInfo = {
//       email: 'test@gmail.com',
//       password: 'password',
//       personalInfo: {
//         firstName: 'Test',
//         lastName: 'Test',
//         phone: '+966511111111',
//       },
//       companyInfo: {
//         name: 'Test Company',
//         website: 'https://test.com',
//         address: '123 Test St, Test City, Test Country',
//         size: '1-9',
//       },
//     };
//     const result = await caller.crm.new.create(newCRM);
//     console.log(result);
//     expect(result.status).toBe('ok');
//   } catch (error) {
//     console.error(error);
//     throw error;
//   }
// });
import { describe, expect, it } from '@jest/globals';
import { newCRMUserInfoSchema } from '@/features/auth/contracts';

describe('create CRM contracts', () => {
  it('accepts a valid CRM signup payload', () => {
    const result = newCRMUserInfoSchema.safeParse({
      email: 'test@gmail.com',
      password: 'password123',
      personalInfo: {
        firstName: 'Test',
        lastName: 'User',
        phone: '+966511111111',
      },
      companyInfo: {
        name: 'Test Company',
        website: 'https://test.com',
        address: '123 Test St',
        size: '1-9',
      },
    });

    expect(result.success).toBe(true);
  });

  it('rejects invalid email payloads', () => {
    const result = newCRMUserInfoSchema.safeParse({
      email: 'not-an-email',
      password: 'password123',
      personalInfo: {
        firstName: 'Test',
        lastName: 'User',
        phone: '+966511111111',
      },
      companyInfo: {},
    });

    expect(result.success).toBe(false);
  });
});
