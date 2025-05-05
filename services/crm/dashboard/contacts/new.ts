import { CreateContactInput, UpdateContactInput } from '@/database/types/contacts';
import { createContact, updateContact as updateContactQuery } from '@/database/queries/contacts';

export async function createNewContact(
  organization_id: string,
  created_by: string,
  contact_input: CreateContactInput
) {
  return createContact(organization_id, created_by, contact_input);
}

export async function updateContact(
  contact_id: string,
  updated_by: string,
  contact_input: UpdateContactInput
) {
  return updateContactQuery(contact_id, updated_by, contact_input);
}
