import { z } from 'zod';
import { validateEmail } from '@/utils/emails';
import { createTRPCRouter, baseProcedure } from '@/trpc/init';
import { validatePhone } from '@/utils/phone/validate';

export const validationsRouter = createTRPCRouter({
  validateEmail: baseProcedure.input(z.string().email()).mutation(async ({ input }) => {
    return await validateEmail(input);
  }),
  validatePhone: baseProcedure.input(z.string()).mutation(async ({ input }) => {
    return await validatePhone(input);
  }),
});
