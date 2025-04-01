import { z } from 'zod';
import { validateEmail } from '@/utils/emails';
import { createTRPCRouter, baseProcedure } from '@/trpc/init';

export const validationsRouter = createTRPCRouter({
  validateEmail: baseProcedure.input(z.string().email()).query(async ({ input }) => {
    return validateEmail(input);
  }),
});
