import { z } from 'zod';
import { baseProcedure, createTRPCRouter } from '../init';
import { testsRouter } from './tests/proc';

export const appRouter = createTRPCRouter({
  tests: testsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
