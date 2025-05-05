import { createTRPCRouter } from '@/trpc/init';
import { taskRouter } from './tasks';
import { contactRouter } from './contacts';
export const CRMRouter = createTRPCRouter({
  task: taskRouter,
  contact: contactRouter,
});
