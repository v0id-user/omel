import { createTRPCRouter } from '../init';
import { testsRouter } from './tests/proc';
import { headerTestRouter } from './tests/header-test';
import { validationsRouter } from './validations/proc';
import { crmRouter } from './crm/index';

export const appRouter = createTRPCRouter({
  tests: testsRouter,
  headerTests: headerTestRouter,
  validations: validationsRouter,
  crm: crmRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
