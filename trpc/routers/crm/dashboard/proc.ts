import { createTRPCRouter } from '@/trpc/init';
import { taskRouter } from './tasks';

export const CRMRouter = createTRPCRouter({
  task: taskRouter,
});
