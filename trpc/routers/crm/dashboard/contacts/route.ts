import { createTRPCRouter, protectedProcedure } from '@/trpc/init';
import { validateEmail } from '@/utils/emails';
import { TRPCError } from '@trpc/server';
import { validatePhoneGeneral } from '@/utils/phone/validate';
import {
  bulkContactsInputSchema,
  CreateContactInput,
  contactDeleteInputSchema,
  contactIdsInputSchema,
  contactPageInputSchema,
  contactPagesInputSchema,
  createContactInputSchema,
  searchContactsInputSchema,
  UpdateContactInput,
  updateContactInputSchema,
} from '@/features/crm/contacts/contracts';
import {
  createNewContact,
  deleteContact,
  deleteContactsByIds,
  getBulkContacts,
  getContactsByIds,
  getContactsByPage,
  getTotalContactPages,
  searchContacts,
  updateContact,
} from '@/features/crm/contacts/server/service';

// Middleware for validating contact inputs
const validateContactInput = async (input: CreateContactInput | Omit<UpdateContactInput, 'id'>) => {
  if (!input.email || !input.phone) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: 'البريد الإلكتروني ورقم الهاتف مطلوبين',
    });
  }

  // Validate the email
  if (!(await validateEmail(input.email))) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: 'البريد الإلكتروني غير صالح',
    });
  }

  // Validate the phone
  if ((await validatePhoneGeneral(input.phone)) !== undefined) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: 'رقم الهاتف غير صالح',
    });
  }
};

export const contactRouter = createTRPCRouter({
  new: protectedProcedure.input(createContactInputSchema).mutation(async ({ ctx, input }) => {
    await validateContactInput(input);
    return await createNewContact(
      ctx.session.session.activeOrganizationId!,
      ctx.session.user.id,
      input
    );
  }),
  update: protectedProcedure.input(updateContactInputSchema).mutation(async ({ ctx, input }) => {
    const { id, ...contactData } = input;
    await validateContactInput(contactData);
    return await updateContact(input.id, ctx.session.user.id, input);
  }),

  getByPage: protectedProcedure.input(contactPageInputSchema).query(async ({ ctx, input }) => {
    return await getContactsByPage(
      ctx.session.session.activeOrganizationId!,
      input.page,
      input.limit
    );
  }),

  getBulk: protectedProcedure.input(bulkContactsInputSchema).query(async ({ ctx, input }) => {
    return await getBulkContacts(ctx.session.session.activeOrganizationId!, input.limit);
  }),

  search: protectedProcedure.input(searchContactsInputSchema).query(async ({ ctx, input }) => {
    return await searchContacts(
      ctx.session.session.activeOrganizationId!,
      input.searchTerm,
      input.page,
      input.limit
    );
  }),

  getByIds: protectedProcedure.input(contactIdsInputSchema).query(async ({ ctx, input }) => {
    return await getContactsByIds(ctx.session.session.activeOrganizationId!, input.ids);
  }),

  delete: protectedProcedure.input(contactDeleteInputSchema).mutation(async ({ ctx, input }) => {
    return await deleteContact(ctx.session.session.activeOrganizationId!, input.id);
  }),

  deleteMany: protectedProcedure.input(contactIdsInputSchema).mutation(async ({ ctx, input }) => {
    return await deleteContactsByIds(ctx.session.session.activeOrganizationId!, input.ids);
  }),

  pages: protectedProcedure.input(contactPagesInputSchema).query(async ({ ctx, input }) => {
    return await getTotalContactPages(ctx.session.session.activeOrganizationId!, input.length);
  }),
});
