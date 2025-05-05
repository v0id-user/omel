import { CreateContactInput, UpdateContactInput } from '@/database/types/contacts';
import { contacts } from '@/database/schemas/app-schema';
import { db } from '@/database/db';
import { eq } from 'drizzle-orm';

export async function createContact(
  organization_id: string,
  created_by: string,
  contact_input: CreateContactInput
) {
  return db.insert(contacts).values({
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
  return db
    .update(contacts)
    .set({ ...contact_input, updatedBy: updated_by })
    .where(eq(contacts.id, contact_id));
}
