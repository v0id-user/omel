import { createTRPCRouter, baseProcedure } from '@/trpc/init';
import { createNewCRM } from './service';
import { newCRMUserInfoSchema } from '../contracts';
import { TRPCError } from '@trpc/server';
import { signupRatelimit } from '@/lib/ratelimt';

export const newCRMRouter = createTRPCRouter({
  create: baseProcedure.input(newCRMUserInfoSchema).mutation(async ({ input, ctx }) => {
    const { success: passedRatelimit } = await signupRatelimit.limit(ctx.clientIp);
    if (!passedRatelimit) {
      throw new TRPCError({
        code: 'TOO_MANY_REQUESTS',
        message: 'محاولات تسجيل كثيرة. يرجى المحاولة لاحقًا.',
      });
    }

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

      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'فشل في إنشاء حساب جديد',
      });
    }
  }),
});
