import { createTRPCRouter, protectedProcedure } from '@/trpc/init';
import {
  createTasksInputSchema,
  taskDeleteInputSchema,
  tasksDeleteManyInputSchema,
  updateTaskInputSchema,
} from '@/features/crm/tasks/contracts';
import {
  createNewTasks,
  deleteTask,
  deleteTasksByIds,
  getTasksForOrganization,
  updateTask,
} from '@/features/crm/tasks/server/service';

export const taskRouter = createTRPCRouter({
  getTasks: protectedProcedure.query(async ({ ctx }) => {
    return await getTasksForOrganization(ctx.session.session.activeOrganizationId!);
  }),

  new: protectedProcedure.input(createTasksInputSchema).mutation(async ({ ctx, input }) => {
    return await createNewTasks(
      ctx.session.session.activeOrganizationId!,
      ctx.session.user.id,
      input
    );
  }),

  update: protectedProcedure.input(updateTaskInputSchema).mutation(async ({ ctx, input }) => {
    return await updateTask(input.id, ctx.session.user.id, input);
  }),

  delete: protectedProcedure.input(taskDeleteInputSchema).mutation(async ({ ctx, input }) => {
    return await deleteTask(ctx.session.session.activeOrganizationId!, input.id);
  }),

  deleteMany: protectedProcedure
    .input(tasksDeleteManyInputSchema)
    .mutation(async ({ ctx, input }) => {
      return await deleteTasksByIds(ctx.session.session.activeOrganizationId!, input.ids);
    }),
});
