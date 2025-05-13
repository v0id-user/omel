import { z } from 'zod';
import { validateEmail } from '@/utils/emails';
import { createTRPCRouter, baseProcedure } from '@/trpc/init';
import { validatePhoneArab } from '@/utils/phone/validate';

export const validationsRouter = createTRPCRouter({
  validateEmail: baseProcedure.input(z.string().email()).mutation(async ({ input }) => {
    return await validateEmail(input);
  }),
  validatePhoneArab: baseProcedure.input(z.string()).mutation(async ({ input }) => {
    return await validatePhoneArab(input);
  }),
});
