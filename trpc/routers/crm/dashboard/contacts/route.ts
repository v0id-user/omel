import { createTRPCRouter, protectedProcedure } from '@/trpc/init';
import { z } from 'zod';
import {
  createNewContact,
  updateContact,
  getContactsByPage,
  getTotalContactPages,
  getContactsByIds,
} from '@/services/crm/dashboard';
import { CreateContactInput, UpdateContactInput } from '@/database/types/contacts';
import { validateEmail } from '@/utils/emails';
import { TRPCError } from '@trpc/server';
import { validatePhoneGeneral } from '@/utils/phone/validate';
import { Contact } from '@/database/types/contacts';

const contactInputSchema = z.custom<CreateContactInput>();
const contactUpdateInputSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().nullish(),
  phone: z.string().nullish(),
  city: z.string().nullish(),
  country: z.string().nullish(),
  address: z.string().nullish(),
  region: z.string().nullish(),
  postalCode: z.string().nullish(),
  contactType: z.enum(['person', 'company']).nullish(),
  domain: z.string().nullish(),
  additionalPhones: z.array(z.string()).nullish(),
  taxId: z.string().nullish(),
  businessType: z.string().nullish(),
  employees: z.string().nullish(),
});

const contactPagesInputSchema = z.object({
  length: z.number().min(1).max(100).default(10),
});

const contactPageInputSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(50).default(10),
});

const contactIdsInputSchema = z.object({
  ids: z.array(z.string()).min(1).max(50),
});

// Middleware for validating contact inputs
const validateContactInput = async (input: CreateContactInput | UpdateContactInput) => {
  if (!input.email || !input.phone) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: 'البريد الإلكتروني ورقم الهاتف مطلوبين',
    });
  }

  // Validate the email
  console.log('[server - trpc - contact - validateContactInput] Validating email:', input.email);
  if (!(await validateEmail(input.email))) {
    console.log('[server - trpc - contact - validateContactInput] Email validation failed');
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: 'البريد الإلكتروني غير صالح',
    });
  }
  console.log('[server - trpc - contact - validateContactInput] Email validation successful');

  // Validate the phone
  console.log('[server - trpc - contact - validateContactInput] Validating phone:', input.phone);
  if ((await validatePhoneGeneral(input.phone)) !== undefined) {
    console.log('[server - trpc - contact - validateContactInput] Phone validation failed');
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: 'رقم الهاتف غير صالح',
    });
  }
  console.log('[server - trpc - contact - validateContactInput] Phone validation successful');
};

export const contactRouter = createTRPCRouter({
  new: protectedProcedure.input(contactInputSchema).mutation(async ({ ctx, input }) => {
    await validateContactInput(input);
    return await createNewContact(
      ctx.session.session.activeOrganizationId!,
      ctx.session.user.id,
      input
    );
  }),
  update: protectedProcedure.input(contactUpdateInputSchema).mutation(async ({ ctx, input }) => {
    const { id, ...contactData } = input;
    await validateContactInput(contactData);
    return await updateContact(id, ctx.session.user.id, contactData);
  }),

  getByPage: protectedProcedure.input(contactPageInputSchema).query(async ({ ctx, input }) => {
    return await getContactsByPage(
      ctx.session.session.activeOrganizationId!,
      input.page,
      input.limit
    );
  }),

  getByIds: protectedProcedure.input(contactIdsInputSchema).query(async ({ ctx, input }) => {
    return await getContactsByIds(ctx.session.session.activeOrganizationId!, input.ids);
  }),

  pages: protectedProcedure.input(contactPagesInputSchema).query(async ({ ctx, input }) => {
    return await getTotalContactPages(ctx.session.session.activeOrganizationId!, input.length);
  }),
});
