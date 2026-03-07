import { createTRPCRouter, protectedProcedure } from '@/trpc/init';
import { z } from 'zod';
import {
  createNewTasks,
  getTasksForOrganization,
  updateTask,
  deleteTask,
  deleteTasksByIds,
} from '@/services/crm/dashboard';
import { CreateTaskInput, TASK_PRIORITIES, TASK_STATUSES } from '@/database/types/task';

const taskInputSchema = z.array(z.custom<CreateTaskInput>());
const taskDeleteSchema = z.object({
  id: z.string().min(1),
});
const tasksDeleteManySchema = z.object({
  ids: z.array(z.string()).min(1).max(100),
});
const taskUpdateSchema = z.object({
  id: z.string().min(1),
  description: z.string().nullish(),
  category: z.string().nullish(),
  dueDate: z.date().nullish(),
  status: z.enum(TASK_STATUSES).optional(),
  priority: z.enum(TASK_PRIORITIES).optional(),
  relatedTo: z.string().nullish(),
  assignedTo: z.string().optional(),
});

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

  update: protectedProcedure.input(taskUpdateSchema).mutation(async ({ ctx, input }) => {
    const { id, ...taskInput } = input;
    return await updateTask(id, ctx.session.user.id, taskInput);
  }),

  delete: protectedProcedure.input(taskDeleteSchema).mutation(async ({ ctx, input }) => {
    return await deleteTask(ctx.session.session.activeOrganizationId!, input.id);
  }),

  deleteMany: protectedProcedure.input(tasksDeleteManySchema).mutation(async ({ ctx, input }) => {
    return await deleteTasksByIds(ctx.session.session.activeOrganizationId!, input.ids);
  }),
});
