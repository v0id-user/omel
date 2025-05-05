import { createTRPCRouter, protectedProcedure } from '@/trpc/init';
import { z } from 'zod';
import { createNewContact, updateContact } from '@/services/crm/dashboard';
import { CreateContactInput, UpdateContactInput } from '@/database/types/contacts';

const contactInputSchema = z.custom<CreateContactInput>();
const contactUpdateInputSchema = z.object({
  contact_id: z.string(),
  contact_input: z.custom<UpdateContactInput>(),
});

export const contactRouter = createTRPCRouter({
  new: protectedProcedure.input(contactInputSchema).mutation(async ({ ctx, input }) => {
    return createNewContact(ctx.session.session.activeOrganizationId!, ctx.session.user.id, input);
  }),
  update: protectedProcedure.input(contactUpdateInputSchema).mutation(async ({ ctx, input }) => {
    return updateContact(input.contact_id, ctx.session.user.id, input.contact_input);
  }),
});
