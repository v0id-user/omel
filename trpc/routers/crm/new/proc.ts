import { createTRPCRouter, baseProcedure } from '@/trpc/init';
import { z } from 'zod';
import { createNewCRM } from '@/services/crm/new';
import { NewCRMUserInfo } from '@/interfaces/crm';
import { TRPCError } from '@trpc/server';

export const newCRMRouter = createTRPCRouter({
  create: baseProcedure
    .input(z.custom<NewCRMUserInfo>())
    .mutation(async ({ input: newUserInfo, ctx }) => {
      try {
        let { data, headers: betterAuthHeaders } = await createNewCRM(newUserInfo);

        for (const [key, value] of Object.entries(betterAuthHeaders)) {
          ctx.resHeaders.set(key, value);
        }

        return data;
      } catch (error) {
        console.error('Error creating new CRM:', error);

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
