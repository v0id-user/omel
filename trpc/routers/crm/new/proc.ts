import { createTRPCRouter, baseProcedure } from '@/trpc/init';
import { z } from 'zod';
import { createNewCRM } from '../../../../services/crm/createNewCRM';
import { NewCRMUserInfo } from '@/interfaces/crm';
import { headers } from 'next/headers';
import { TRPCError } from '@trpc/server';
export const CRMRouter = createTRPCRouter({
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
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to create new CRM',
        });
      }
    }),
});
