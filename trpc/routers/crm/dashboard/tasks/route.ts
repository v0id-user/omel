import { createTRPCRouter, protectedProcedure } from '@/trpc/init';
import { z } from 'zod';
import { createNewTasks } from '@/services/crm/dashboard';
import { CreateTaskInput } from '@/database/types/task';

export const taskRouter = createTRPCRouter({
  new: protectedProcedure
    .input(z.array(z.custom<CreateTaskInput>()))
    .mutation(async ({ ctx, input }) => {
      return createNewTasks(input);
    }),
});
