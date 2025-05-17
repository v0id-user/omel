import { CreateContactInput, UpdateContactInput } from '@/database/types/contacts';
import {
  createContact,
  updateContact as updateContactQuery,
  getContactsWithCursor as getContactsWithCursorQuery,
  getTotalContactPages as getTotalContactPagesQuery,
} from '@/database/queries/contacts';

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

export async function getContactsWithCursor(organizationId: string, cursor: string | null) {
  return getContactsWithCursorQuery(organizationId, cursor);
}

export async function getTotalContactPages(organizationId: string, length: number) {
  return getTotalContactPagesQuery(organizationId, length);
}
