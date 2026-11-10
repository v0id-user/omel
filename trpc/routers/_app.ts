import { createTRPCRouter } from '../init';
import { validationsRouter } from './validations/proc';
import { crmRouter } from './crm/index';

export const appRouter = createTRPCRouter({
  validations: validationsRouter,
  crm: crmRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
