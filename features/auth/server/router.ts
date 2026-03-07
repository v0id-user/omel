import { createTRPCRouter, baseProcedure } from '@/trpc/init';
import { createNewCRM } from './service';
import { newCRMUserInfoSchema } from '../contracts';
import { TRPCError } from '@trpc/server';

export const newCRMRouter = createTRPCRouter({
  create: baseProcedure.input(newCRMUserInfoSchema).mutation(async ({ input, ctx }) => {
    try {
      const { data, headers } = await createNewCRM(input);

      for (const [key, value] of Object.entries(headers)) {
        ctx.resHeaders.set(key, value);
      }

      return data;
    } catch (error) {
      if (error instanceof TRPCError) {
        throw error;
      }

      if (error instanceof Error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message || 'فشل في إنشاء حساب جديد',
        });
      }

      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'فشل في إنشاء حساب جديد',
      });
    }
  }),
});
