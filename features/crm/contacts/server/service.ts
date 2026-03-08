import { TRPCError } from '@trpc/server';
import { validateEmail } from '@/utils/emails';
import { validatePhoneGeneral } from '@/utils/phone/validate';
import {
  CreateContactInput,
  UpdateContactInput,
  bulkContactsInputSchema,
  contactPageInputSchema,
  contactPagesInputSchema,
  searchContactsInputSchema,
} from '../contracts';
import { logCRMActivity } from '@/features/crm/activity/server/service';
import * as repository from './repository';

async function validateContactInput(input: { email?: string | null; phone?: string | null }) {
  if (!input.email || !input.phone) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: 'البريد الإلكتروني ورقم الهاتف مطلوبين',
    });
  }

  if (!(await validateEmail(input.email))) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: 'البريد الإلكتروني غير صالح',
    });
  }

  if (validatePhoneGeneral(input.phone) !== undefined) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: 'رقم الهاتف غير صالح',
    });
  }
}

export async function createNewContact(
  organizationId: string,
  createdBy: string,
  input: CreateContactInput
) {
  await validateContactInput(input);
  const [result] = await repository.createContact(organizationId, createdBy, input);

  if (result?.id) {
    await logCRMActivity({
      actorId: createdBy,
      targetId: result.id,
      targetType: 'contact',
      action: 'created',
      metadata: {
        name: input.name,
        contactType: input.contactType ?? 'person',
      },
    });
  }

  return result;
}

export async function updateContact(
  contactId: string,
  updatedBy: string,
  input: UpdateContactInput
) {
  const { id, ...contactInput } = input;

  if (contactInput.email || contactInput.phone) {
    await validateContactInput({
      email: contactInput.email ?? undefined,
      phone: contactInput.phone ?? undefined,
    });
  }

  const [result] = await repository.updateContact(contactId, updatedBy, contactInput);

  if (result?.id) {
    await logCRMActivity({
      actorId: updatedBy,
      targetId: result.id,
      targetType: 'contact',
      action: 'updated',
      metadata: contactInput,
    });
  }

  return result;
}

export async function getContactsByPage(organizationId: string, page: number, limit: number) {
  const validatedInput = contactPageInputSchema.parse({ page, limit });
  return repository.getContactsByPage(organizationId, validatedInput.page, validatedInput.limit);
}

export async function getTotalContactPages(organizationId: string, length: number) {
  const validatedInput = contactPagesInputSchema.parse({ length });
  return repository.getTotalContactPages(organizationId, validatedInput.length);
}

export async function getContactsByIds(organizationId: string, contactIds: string[]) {
  return repository.getContactsByIds(organizationId, contactIds);
}

export async function getBulkContacts(organizationId: string, limit: number) {
  const validatedInput = bulkContactsInputSchema.parse({ limit });
  return repository.getBulkContacts(organizationId, validatedInput.limit);
}

export async function searchContacts(
  organizationId: string,
  searchTerm: string,
  page: number,
  limit: number
) {
  const validatedInput = searchContactsInputSchema.parse({ searchTerm, page, limit });
  return repository.searchContacts(
    organizationId,
    validatedInput.searchTerm,
    validatedInput.page,
    validatedInput.limit
  );
}

export async function deleteContact(
  organizationId: string,
  contactId: string,
  deletedBy: string = organizationId
) {
  const [result] = await repository.deleteContact(organizationId, contactId);

  if (result?.id) {
    await logCRMActivity({
      actorId: deletedBy,
      targetId: result.id,
      targetType: 'contact',
      action: 'deleted',
    });
  }

  return result;
}

export async function deleteContactsByIds(
  organizationId: string,
  contactIds: string[],
  deletedBy: string = organizationId
) {
  const results = await repository.deleteContactsByIds(organizationId, contactIds);

  await Promise.all(
    results.map(result =>
      logCRMActivity({
        actorId: deletedBy,
        targetId: result.id,
        targetType: 'contact',
        action: 'deleted',
      })
    )
  );

  return results;
}
