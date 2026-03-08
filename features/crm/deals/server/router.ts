import { createTRPCRouter, protectedProcedure } from '@/trpc/init';
import {
  createDealInputSchema,
  dealByContactInputSchema,
  dealByIdInputSchema,
  dealDeleteInputSchema,
  listDealsInputSchema,
  updateDealInputSchema,
} from '../contracts';
import {
  createNewDeal,
  deleteDeal,
  getDealById,
  getDealSummary,
  getDealsByContactId,
  listDealsForOrganization,
  updateDeal,
} from './service';

export const dealRouter = createTRPCRouter({
  list: protectedProcedure.input(listDealsInputSchema.optional()).query(async ({ ctx, input }) => {
    return listDealsForOrganization(ctx.session.session.activeOrganizationId!, input ?? {});
  }),

  summary: protectedProcedure.query(async ({ ctx }) => {
    return getDealSummary(ctx.session.session.activeOrganizationId!);
  }),

  getById: protectedProcedure.input(dealByIdInputSchema).query(async ({ ctx, input }) => {
    return getDealById(ctx.session.session.activeOrganizationId!, input.id);
  }),

  getByContact: protectedProcedure.input(dealByContactInputSchema).query(async ({ ctx, input }) => {
    return getDealsByContactId(ctx.session.session.activeOrganizationId!, input.contactId);
  }),

  new: protectedProcedure.input(createDealInputSchema).mutation(async ({ ctx, input }) => {
    return createNewDeal(ctx.session.session.activeOrganizationId!, ctx.session.user.id, input);
  }),

  update: protectedProcedure.input(updateDealInputSchema).mutation(async ({ ctx, input }) => {
    return updateDeal(input.id, ctx.session.user.id, input);
  }),

  delete: protectedProcedure.input(dealDeleteInputSchema).mutation(async ({ ctx, input }) => {
    return deleteDeal(ctx.session.session.activeOrganizationId!, ctx.session.user.id, input.id);
  }),
});
