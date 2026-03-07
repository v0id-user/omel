import { createTRPCRouter, baseProcedure } from '@/trpc/init';
import { createNewCRM } from '@/features/auth/server/service';
import { newCRMUserInfoSchema } from '@/features/auth/contracts';
import { TRPCError } from '@trpc/server';

export const newCRMRouter = createTRPCRouter({
  create: baseProcedure.input(newCRMUserInfoSchema).mutation(async ({ input: newUserInfo, ctx }) => {
    try {
      let { data, headers: betterAuthHeaders } = await createNewCRM(newUserInfo);

      for (const [key, value] of Object.entries(betterAuthHeaders)) {
        ctx.resHeaders.set(key, value);
      }

      return data;
    } catch (error) {
      if (error instanceof TRPCError) {
        throw error;
      }

      if (error instanceof Error) {
        const errorMessage = error.message;

        if (errorMessage.includes('already exists') || errorMessage.includes('already taken')) {
          throw new TRPCError({
            code: 'CONFLICT',
            message: errorMessage || 'المستخدم أو المؤسسة موجودة بالفعل',
          });
        }

        if (errorMessage.includes('validation')) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: errorMessage || 'بيانات غير صالحة',
          });
        }

        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: errorMessage || 'فشل في إنشاء حساب جديد',
        });
      }

      // Default error
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'فشل في إنشاء حساب جديد',
      });
    }
  }),
});
