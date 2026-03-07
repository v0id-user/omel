import { createTRPCRouter } from '@/trpc/init';
import { taskRouter } from '@/features/crm/tasks/server/router';
import { contactRouter } from '@/features/crm/contacts/server/router';
export const CRMRouter = createTRPCRouter({
  task: taskRouter,
  contact: contactRouter,
});
