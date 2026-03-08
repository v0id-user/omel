import { createTRPCRouter, protectedProcedure } from '@/trpc/init';
import {
  createInteractionInputSchema,
  interactionByIdInputSchema,
  interactionDeleteInputSchema,
  listInteractionsInputSchema,
  updateInteractionInputSchema,
} from '../contracts';
import {
  createNewInteraction,
  deleteInteraction,
  getInteractionById,
  listInteractionsForOrganization,
  updateInteraction,
} from './service';

export const interactionRouter = createTRPCRouter({
  list: protectedProcedure
    .input(listInteractionsInputSchema.optional())
    .query(async ({ ctx, input }) => {
      return listInteractionsForOrganization(
        ctx.session.session.activeOrganizationId!,
        input ?? {}
      );
    }),

  getById: protectedProcedure.input(interactionByIdInputSchema).query(async ({ ctx, input }) => {
    return getInteractionById(ctx.session.session.activeOrganizationId!, input.id);
  }),

  new: protectedProcedure.input(createInteractionInputSchema).mutation(async ({ ctx, input }) => {
    return createNewInteraction(
      ctx.session.session.activeOrganizationId!,
      ctx.session.user.id,
      input
    );
  }),

  update: protectedProcedure
    .input(updateInteractionInputSchema)
    .mutation(async ({ ctx, input }) => {
      return updateInteraction(input.id, ctx.session.user.id, input);
    }),

  delete: protectedProcedure
    .input(interactionDeleteInputSchema)
    .mutation(async ({ ctx, input }) => {
      return deleteInteraction(
        ctx.session.session.activeOrganizationId!,
        ctx.session.user.id,
        input.id
      );
    }),
});
