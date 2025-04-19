import { createTRPCRouter } from '@/trpc/init';
import { newCRMRouter } from './new/proc';
import { CRMRouter } from './dashboard/proc';

export const crmRouter = createTRPCRouter({
  new: newCRMRouter,
  dashboard: CRMRouter,
});
