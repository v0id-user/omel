import { CreateContactInput, UpdateContactInput } from '@/database/types/contacts';
import { contacts } from '@/database/schemas/app-schema';
import { db } from '@/database/db';
import { desc, and, eq, isNull } from 'drizzle-orm';
import { Contact } from '@/database/types/contacts';

export async function getContactsWithCursor(
  organizationId: string,
  cursor: string | null
): Promise<{ data: Contact[]; nextCursor: string | null }> {
  const { data, nextCursor } = await db.$paginateCursor(contacts, {
    where: and(eq(contacts.organizationId, organizationId), isNull(contacts.deletedAt)),
    cursor,
    limit: 10,
    direction: 'desc',
  });

  return { data, nextCursor };
}

export async function createContact(
  organization_id: string,
  created_by: string,
  contact_input: CreateContactInput
) {
  return await db.insert(contacts).values({
    ...contact_input,
    organizationId: organization_id,
    createdBy: created_by,
    updatedBy: created_by,
  });
}

export async function updateContact(
  contact_id: string,
  updated_by: string,
  contact_input: UpdateContactInput
) {
  return await db
    .update(contacts)
    .set({ ...contact_input, updatedBy: updated_by })
    .where(eq(contacts.id, contact_id));
}

export async function deleteContact(contact_id: string) {
  return await db.$softDelete(contacts, contact_id);
}
