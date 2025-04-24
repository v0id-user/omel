import { createTRPCRouter, protectedProcedure } from '@/trpc/init';
import { z } from 'zod';
import { createNewTask } from '@/services/crm/dashboard';
import { CreateTask } from '@/database/types/task';

export const taskRouter = createTRPCRouter({
  new: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        organizationId: z.string(),
        description: z.string().optional(),
        category: z.string().optional(),
        assignedTo: z.string().optional(),
        createdBy: z.string().optional(),
        updatedBy: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return createNewTask(input as CreateTask);
    }),
});
