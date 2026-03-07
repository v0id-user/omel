import { createTRPCRouter, protectedProcedure } from '@/trpc/init';
import {
  bulkContactsInputSchema,
  contactDeleteInputSchema,
  contactIdsInputSchema,
  contactPageInputSchema,
  contactPagesInputSchema,
  createContactInputSchema,
  searchContactsInputSchema,
  updateContactInputSchema,
} from '../contracts';
import * as service from './service';

export const contactRouter = createTRPCRouter({
  new: protectedProcedure.input(createContactInputSchema).mutation(async ({ ctx, input }) => {
    return service.createNewContact(
      ctx.session.session.activeOrganizationId!,
      ctx.session.user.id,
      input
    );
  }),

  update: protectedProcedure.input(updateContactInputSchema).mutation(async ({ ctx, input }) => {
    return service.updateContact(input.id, ctx.session.user.id, input);
  }),

  getByPage: protectedProcedure.input(contactPageInputSchema).query(async ({ ctx, input }) => {
    return service.getContactsByPage(
      ctx.session.session.activeOrganizationId!,
      input.page,
      input.limit
    );
  }),

  getBulk: protectedProcedure.input(bulkContactsInputSchema).query(async ({ ctx, input }) => {
    return service.getBulkContacts(ctx.session.session.activeOrganizationId!, input.limit);
  }),

  search: protectedProcedure.input(searchContactsInputSchema).query(async ({ ctx, input }) => {
    return service.searchContacts(
      ctx.session.session.activeOrganizationId!,
      input.searchTerm,
      input.page,
      input.limit
    );
  }),

  getByIds: protectedProcedure.input(contactIdsInputSchema).query(async ({ ctx, input }) => {
    return service.getContactsByIds(ctx.session.session.activeOrganizationId!, input.ids);
  }),

  delete: protectedProcedure.input(contactDeleteInputSchema).mutation(async ({ ctx, input }) => {
    return service.deleteContact(ctx.session.session.activeOrganizationId!, input.id);
  }),

  deleteMany: protectedProcedure.input(contactIdsInputSchema).mutation(async ({ ctx, input }) => {
    return service.deleteContactsByIds(ctx.session.session.activeOrganizationId!, input.ids);
  }),

  pages: protectedProcedure.input(contactPagesInputSchema).query(async ({ ctx, input }) => {
    return service.getTotalContactPages(ctx.session.session.activeOrganizationId!, input.length);
  }),
});
