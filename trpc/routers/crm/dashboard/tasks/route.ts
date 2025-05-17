import { createTRPCRouter, protectedProcedure } from '@/trpc/init';
import { z } from 'zod';
import { createNewTasks } from '@/services/crm/dashboard';
import { CreateTaskInput } from '@/database/types/task';
import { TRPCError } from '@trpc/server';

const taskInputSchema = z.array(z.custom<CreateTaskInput>());

export const taskRouter = createTRPCRouter({
  new: protectedProcedure.input(taskInputSchema).mutation(async ({ ctx, input }) => {
    return await createNewTasks(
      ctx.session.session.activeOrganizationId!,
      ctx.session.user.id,
      input
    );
  }),
});
