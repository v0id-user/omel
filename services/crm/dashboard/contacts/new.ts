import { CreateContactInput, UpdateContactInput } from '@/database/types/contacts';
import { createContact, updateContact as updateContactQuery } from '@/database/queries/contacts';

export async function createNewContact(contact_input: CreateContactInput) {
  return createContact(contact_input);
}

export async function updateContact(contact_id: string, contact_input: UpdateContactInput) {
  return updateContactQuery(contact_id, contact_input);
}
