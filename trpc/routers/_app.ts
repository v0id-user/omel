import { createTRPCRouter } from '../init';
import { testsRouter } from './tests/proc';
import { validationsRouter } from './validations/proc';

export const appRouter = createTRPCRouter({
  tests: testsRouter,
  validations: validationsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
