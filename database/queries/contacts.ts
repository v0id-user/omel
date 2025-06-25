import { CreateContactInput, UpdateContactInput } from '@/database/types/contacts';
import { contacts } from '@/database/schemas/app-schema';
import { db } from '@/database/db';
import { and, count, eq, isNull, desc } from 'drizzle-orm';
import { Contact } from '@/database/types/contacts';
import { z } from 'zod';
import { Effect } from 'effect';

const bulkContactsSchema = z.object({
  organizationId: z.string().min(1),
  limit: z.number().min(10).max(100).default(50),
});

const searchContactsSchema = z.object({
  organizationId: z.string().min(1),
  searchTerm: z.string().min(1).trim(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20),
});

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

export async function getContactsByIds(
  organizationId: string,
  contactIds: string[]
): Promise<Contact[]> {
  if (contactIds.length === 0) return [];

  const { inArray } = await import('drizzle-orm');

  return await db
    .select()
    .from(contacts)
    .where(
      and(
        eq(contacts.organizationId, organizationId),
        inArray(contacts.id, contactIds),
        isNull(contacts.deletedAt)
      )
    );
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

export async function getBulkContacts(
  organizationId: string,
  limit: number = 50
): Promise<Contact[]> {
  const validated = bulkContactsSchema.parse({ organizationId, limit });

  return await db
    .select()
    .from(contacts)
    .where(and(eq(contacts.organizationId, validated.organizationId), isNull(contacts.deletedAt)))
    .limit(validated.limit)
    .orderBy(desc(contacts.createdAt));
}

export async function searchContacts(
  organizationId: string,
  searchTerm: string,
  page: number = 1,
  limit: number = 20
): Promise<{ data: Contact[]; total: number; currentPage: number; totalPages: number }> {
  return await Effect.runPromise(
    Effect.gen(function* () {
      const validated = yield* Effect.try(() =>
        searchContactsSchema.parse({ organizationId, searchTerm, page, limit })
      );

      const { ilike, or } = yield* Effect.promise(() => import('drizzle-orm'));
      const offset = (validated.page - 1) * validated.limit;
      const searchPattern = `%${validated.searchTerm}%`;

      const searchConditions = and(
        eq(contacts.organizationId, validated.organizationId),
        isNull(contacts.deletedAt),
        or(
          ilike(contacts.name, searchPattern),
          ilike(contacts.email, searchPattern),
          ilike(contacts.phone, searchPattern),
          ilike(contacts.city, searchPattern),
          ilike(contacts.country, searchPattern),
          ilike(contacts.address, searchPattern),
          ilike(contacts.region, searchPattern),
          ilike(contacts.domain, searchPattern),
          ilike(contacts.businessType, searchPattern)
        )
      );

      const [data, totalResult] = yield* Effect.promise(() =>
        Promise.all([
          db
            .select()
            .from(contacts)
            .where(searchConditions)
            .limit(validated.limit)
            .offset(offset)
            .orderBy(desc(contacts.createdAt)),
          db.select({ count: count() }).from(contacts).where(searchConditions),
        ])
      );

      const total = Number(totalResult[0].count);
      const totalPages = Math.ceil(total / validated.limit);

      return {
        data,
        total,
        currentPage: validated.page,
        totalPages,
      };
    })
  );
}
