import { createTRPCRouter, baseProcedure } from '@/trpc/init';
import { z } from 'zod';
import { createNewCRM } from '../../../../services/crm/createNewCRM';
import { NewCRMUserInfo } from '@/interfaces/crm';

export const CRMRouter = createTRPCRouter({
  create: baseProcedure
    .input(z.custom<NewCRMUserInfo>())
    .mutation(async ({ input: newUserInfo }) => {
      return await createNewCRM(newUserInfo);
    }),
});
