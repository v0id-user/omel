import { createTRPCRouter } from '@/trpc/init';
import { taskRouter } from './tasks/route';
import { contactRouter } from './contacts';
export const CRMRouter = createTRPCRouter({
  task: taskRouter,
  contact: contactRouter,
});
