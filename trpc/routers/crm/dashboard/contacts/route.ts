import { createTRPCRouter, protectedProcedure } from '@/trpc/init';
import { z } from 'zod';
import { createNewContact, updateContact } from '@/services/crm/dashboard';
import { CreateContactInput, UpdateContactInput } from '@/database/types/contacts';
import { validateEmail } from '@/utils/emails';
import { TRPCError } from '@trpc/server';
import { validatePhoneGeneral } from '@/utils/phone/validate';

const contactInputSchema = z.custom<CreateContactInput>();
const contactUpdateInputSchema = z.object({
  contact_id: z.string(),
  contact_input: z.custom<UpdateContactInput>(),
});

// Middleware for validating contact inputs
const validateContactInput = async (input: CreateContactInput | UpdateContactInput) => {
  if (!input.email || !input.phone) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: 'Email and phone are required',
    });
  }

  // Validate the email
  console.log('Validating email:', input.email);
  if (!(await validateEmail(input.email))) {
    console.log('Email validation failed');
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: 'Invalid email - validation failed',
    });
  }
  console.log('Email validation successful');

  // Validate the phone
  console.log('Validating phone:', input.phone);
  if (!(await validatePhoneGeneral(input.phone))) {
    console.log('Phone validation failed');
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: 'Invalid phone number - validation failed',
    });
  }
  console.log('Phone validation successful');
};

export const contactRouter = createTRPCRouter({
  new: protectedProcedure.input(contactInputSchema).mutation(async ({ ctx, input }) => {
    await validateContactInput(input);
    return createNewContact(ctx.session.session.activeOrganizationId!, ctx.session.user.id, input);
  }),
  update: protectedProcedure.input(contactUpdateInputSchema).mutation(async ({ ctx, input }) => {
    await validateContactInput(input.contact_input);
    return updateContact(input.contact_id, ctx.session.user.id, input.contact_input);
  }),
});
