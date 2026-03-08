import { createTRPCRouter } from '@/trpc/init';
import { taskRouter } from '@/features/crm/tasks/server/router';
import { contactRouter } from '@/features/crm/contacts/server/router';
import { dealRouter } from '@/features/crm/deals/server/router';
import { interactionRouter } from '@/features/crm/interactions/server/router';
export const CRMRouter = createTRPCRouter({
  task: taskRouter,
  contact: contactRouter,
  deal: dealRouter,
  interaction: interactionRouter,
});
