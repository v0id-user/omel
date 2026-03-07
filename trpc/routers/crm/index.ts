import { createTRPCRouter } from '@/trpc/init';
import { newCRMRouter } from '@/features/auth/server/router';
import { CRMRouter } from './dashboard/proc';

export const crmRouter = createTRPCRouter({
  new: newCRMRouter,
  dashboard: CRMRouter,
});
