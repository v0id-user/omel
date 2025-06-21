import { CreateContactInput, UpdateContactInput } from '@/database/types/contacts';
import { contacts } from '@/database/schemas/app-schema';
import { db } from '@/database/db';
import { and, count, eq, isNull, desc } from 'drizzle-orm';
import { Contact } from '@/database/types/contacts';

export async function getContactsByPage(
  organizationId: string,
  page: number,
  limit: number = 10
): Promise<{ data: Contact[]; total: number; currentPage: number; totalPages: number }> {
  if (page < 1) throw new Error('Page must be greater than 0');
  if (limit <= 0) throw new Error('Limit must be greater than 0');

  const offset = (page - 1) * limit;

  const [data, totalResult] = await Promise.all([
    db
      .select()
      .from(contacts)
      .where(and(eq(contacts.organizationId, organizationId), isNull(contacts.deletedAt)))
      .limit(limit)
      .offset(offset)
      .orderBy(desc(contacts.createdAt)),
    db
      .select({ count: count() })
      .from(contacts)
      .where(and(eq(contacts.organizationId, organizationId), isNull(contacts.deletedAt))),
  ]);

  const total = Number(totalResult[0].count);
  const totalPages = Math.ceil(total / limit);

  return {
    data,
    total,
    currentPage: page,
    totalPages,
  };
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

export async function getTotalContactPages(organizationId: string, length: number) {
  if (length <= 0) throw new Error('Page length must be greater than zero');

  const total = await db
    .select({ count: count() })
    .from(contacts)
    .where(and(eq(contacts.organizationId, organizationId), isNull(contacts.deletedAt)));

  const rawCount = Number(total[0].count);
  return Math.ceil(rawCount / length);
}
