import { CreateContactInput, UpdateContactInput } from '@/database/types/contacts';
import { contacts } from '@/database/schemas/app-schema';
import { db } from '@/database/db';
import { eq } from 'drizzle-orm';

export async function createContact(contact_input: CreateContactInput) {
  return db.insert(contacts).values(contact_input);
}

export async function updateContact(contact_id: string, contact_input: UpdateContactInput) {
  return db.update(contacts).set(contact_input).where(eq(contacts.id, contact_id));
}
