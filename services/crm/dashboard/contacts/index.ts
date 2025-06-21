import { CreateContactInput, UpdateContactInput } from '@/database/types/contacts';
import {
  createContact,
  updateContact as updateContactQuery,
  getContactsByPage as getContactsByPageQuery,
  getTotalContactPages as getTotalContactPagesQuery,
} from '@/database/queries/contacts';

export async function createNewContact(
  organization_id: string,
  created_by: string,
  contact_input: CreateContactInput
) {
  return await createContact(organization_id, created_by, contact_input);
}

export async function updateContact(
  contact_id: string,
  updated_by: string,
  contact_input: UpdateContactInput
) {
  return await updateContactQuery(contact_id, updated_by, contact_input);
}

export async function getContactsByPage(organizationId: string, page: number, limit: number = 10) {
  return await getContactsByPageQuery(organizationId, page, limit);
}

export async function getTotalContactPages(organizationId: string, length: number) {
  return await getTotalContactPagesQuery(organizationId, length);
}
