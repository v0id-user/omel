import { createTRPCRouter } from '@/trpc/init';
import { CRMRouter } from './new/proc';

export const crmRouter = createTRPCRouter({
  new: CRMRouter,
});
