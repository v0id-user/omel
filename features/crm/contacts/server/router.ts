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
    return service.createNewContact(ctx.organizationId, ctx.session.user.id, input);
  }),

  update: protectedProcedure.input(updateContactInputSchema).mutation(async ({ ctx, input }) => {
    return service.updateContact(ctx.organizationId, ctx.session.user.id, input);
  }),

  getByPage: protectedProcedure.input(contactPageInputSchema).query(async ({ ctx, input }) => {
    return service.getContactsByPage(ctx.organizationId, input.page, input.limit);
  }),

  getBulk: protectedProcedure.input(bulkContactsInputSchema).query(async ({ ctx, input }) => {
    return service.getBulkContacts(ctx.organizationId, input.limit);
  }),

  search: protectedProcedure.input(searchContactsInputSchema).query(async ({ ctx, input }) => {
    return service.searchContacts(ctx.organizationId, input.searchTerm, input.page, input.limit);
  }),

  getByIds: protectedProcedure.input(contactIdsInputSchema).query(async ({ ctx, input }) => {
    return service.getContactsByIds(ctx.organizationId, input.ids);
  }),

  delete: protectedProcedure.input(contactDeleteInputSchema).mutation(async ({ ctx, input }) => {
    return service.deleteContact(ctx.organizationId, input.id, ctx.session.user.id);
  }),

  deleteMany: protectedProcedure.input(contactIdsInputSchema).mutation(async ({ ctx, input }) => {
    return service.deleteContactsByIds(ctx.organizationId, input.ids, ctx.session.user.id);
  }),

  pages: protectedProcedure.input(contactPagesInputSchema).query(async ({ ctx, input }) => {
    return service.getTotalContactPages(ctx.organizationId, input.length);
  }),
});
