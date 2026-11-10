import { createTRPCRouter, protectedProcedure } from '@/trpc/init';
import {
  createTasksInputSchema,
  taskDeleteInputSchema,
  tasksDeleteManyInputSchema,
  updateTaskInputSchema,
} from '../contracts';
import * as service from './service';

export const taskRouter = createTRPCRouter({
  getTasks: protectedProcedure.query(async ({ ctx }) => {
    return service.getTasksForOrganization(ctx.organizationId);
  }),

  new: protectedProcedure.input(createTasksInputSchema).mutation(async ({ ctx, input }) => {
    return service.createNewTasks(ctx.organizationId, ctx.session.user.id, input);
  }),

  update: protectedProcedure.input(updateTaskInputSchema).mutation(async ({ ctx, input }) => {
    return service.updateTask(ctx.organizationId, ctx.session.user.id, input);
  }),

  delete: protectedProcedure.input(taskDeleteInputSchema).mutation(async ({ ctx, input }) => {
    return service.deleteTask(ctx.organizationId, input.id, ctx.session.user.id);
  }),

  deleteMany: protectedProcedure
    .input(tasksDeleteManyInputSchema)
    .mutation(async ({ ctx, input }) => {
      return service.deleteTasksByIds(ctx.organizationId, input.ids, ctx.session.user.id);
    }),
});
