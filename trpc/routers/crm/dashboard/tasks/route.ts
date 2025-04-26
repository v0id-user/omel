import { createTRPCRouter, protectedProcedure } from '@/trpc/init';
import { z } from 'zod';
import { createNewTasks } from '@/services/crm/dashboard';
import { CreateTaskInput } from '@/database/types/task';

const taskInputSchema = z.array(z.custom<CreateTaskInput>());

export const taskRouter = createTRPCRouter({
  new: protectedProcedure.input(taskInputSchema).mutation(async ({ input }) => {
    return createNewTasks(input);
  }),
});
