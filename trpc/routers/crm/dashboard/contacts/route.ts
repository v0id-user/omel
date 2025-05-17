import { createTRPCRouter, protectedProcedure } from '@/trpc/init';
import { z } from 'zod';
import { createNewContact, updateContact, getContactsWithCursor } from '@/services/crm/dashboard';
import { CreateContactInput, UpdateContactInput } from '@/database/types/contacts';
import { validateEmail } from '@/utils/emails';
import { TRPCError } from '@trpc/server';
import { validatePhoneGeneral } from '@/utils/phone/validate';

const contactInputSchema = z.custom<CreateContactInput>();
const contactUpdateInputSchema = z.object({
  contact_id: z.string(),
  contact_input: z.custom<UpdateContactInput>(),
});

const contactGetInputSchema = z.object({
  cursor: z.string().nullable(),
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
  console.log('Validating email:', input.email);
  if (!(await validateEmail(input.email))) {
    console.log('Email validation failed');
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: 'البريد الإلكتروني غير صالح',
    });
  }
  console.log('Email validation successful');

  // Validate the phone
  console.log('Validating phone:', input.phone);
  if (!(await validatePhoneGeneral(input.phone))) {
    console.log('Phone validation failed');
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: 'رقم الهاتف غير صالح',
    });
  }
  console.log('Phone validation successful');
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
    await validateContactInput(input.contact_input);
    return await updateContact(input.contact_id, ctx.session.user.id, input.contact_input);
  }),
  get: protectedProcedure.input(contactGetInputSchema).query(async ({ ctx, input }) => {
    const { data, nextCursor } = await getContactsWithCursor(
      ctx.session.session.activeOrganizationId!,
      input.cursor
    );
    if (data.length === 0) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'لا يوجد عملاء بعد! أنشئ عميلك الأول للبدء.',
      });
    }

    return { data, nextCursor };
  }),
});
