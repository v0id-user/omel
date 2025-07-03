import { createTRPCRouter, protectedProcedure } from '@/trpc/init';
import { z } from 'zod';
import { createNewTasks, getTasksForOrganization } from '@/services/crm/dashboard';
import { CreateTaskInput } from '@/database/types/task';

const taskInputSchema = z.array(z.custom<CreateTaskInput>());

export const taskRouter = createTRPCRouter({
  getTasks: protectedProcedure.query(async ({ ctx }) => {
    return await getTasksForOrganization(ctx.session.session.activeOrganizationId!);
  }),

  new: protectedProcedure.input(taskInputSchema).mutation(async ({ ctx, input }) => {
    return await createNewTasks(
      ctx.session.session.activeOrganizationId!,
      ctx.session.user.id,
      input
    );
  }),
});
