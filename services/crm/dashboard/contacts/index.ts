import { CreateContactInput, UpdateContactInput } from '@/database/types/contacts';
import {
  createContact,
  updateContact as updateContactQuery,
  getContactsByPage as getContactsByPageQuery,
  getTotalContactPages as getTotalContactPagesQuery,
  getContactsByIds as getContactsByIdsQuery,
  getBulkContacts as getBulkContactsQuery,
  searchContacts as searchContactsQuery,
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

export async function getContactsByIds(organizationId: string, contactIds: string[]) {
  return await getContactsByIdsQuery(organizationId, contactIds);
}

export async function getBulkContacts(organizationId: string, limit: number = 50) {
  return await getBulkContactsQuery(organizationId, limit);
}

export async function searchContacts(
  organizationId: string,
  searchTerm: string,
  page: number = 1,
  limit: number = 20
) {
  return await searchContactsQuery(organizationId, searchTerm, page, limit);
}
