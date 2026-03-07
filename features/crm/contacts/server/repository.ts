import { db } from '@/database/db';
import { contacts } from '@/database/schemas/app-schema';
import { ContactRecord } from '../types';
import { CreateContactInput, UpdateContactInput } from '../contracts';
import { and, count, desc, eq, ilike, inArray, isNull, or } from 'drizzle-orm';

export async function getContactsByPage(
  organizationId: string,
  page: number,
  limit: number
): Promise<{ data: ContactRecord[]; total: number; currentPage: number; totalPages: number }> {
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

  return {
    data,
    total,
    currentPage: page,
    totalPages: Math.ceil(total / limit),
  };
}

export async function createContact(
  organizationId: string,
  createdBy: string,
  input: CreateContactInput
) {
  return db.insert(contacts).values({
    ...input,
    organizationId,
    createdBy,
    updatedBy: createdBy,
  });
}

export async function updateContact(
  contactId: string,
  updatedBy: string,
  input: Omit<UpdateContactInput, 'id'>
) {
  return db
    .update(contacts)
    .set({ ...input, updatedBy })
    .where(eq(contacts.id, contactId));
}

export async function getContactsByIds(organizationId: string, contactIds: string[]) {
  if (contactIds.length === 0) {
    return [];
  }

  return db
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
  const total = await db
    .select({ count: count() })
    .from(contacts)
    .where(and(eq(contacts.organizationId, organizationId), isNull(contacts.deletedAt)));

  return Math.ceil(Number(total[0].count) / length);
}

export async function getBulkContacts(organizationId: string, limit: number) {
  return db
    .select()
    .from(contacts)
    .where(and(eq(contacts.organizationId, organizationId), isNull(contacts.deletedAt)))
    .limit(limit)
    .orderBy(desc(contacts.createdAt));
}

export async function searchContacts(
  organizationId: string,
  searchTerm: string,
  page: number,
  limit: number
): Promise<{ data: ContactRecord[]; total: number; currentPage: number; totalPages: number }> {
  const offset = (page - 1) * limit;
  const searchPattern = `%${searchTerm}%`;
  const searchConditions = and(
    eq(contacts.organizationId, organizationId),
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

  const [data, totalResult] = await Promise.all([
    db
      .select()
      .from(contacts)
      .where(searchConditions)
      .limit(limit)
      .offset(offset)
      .orderBy(desc(contacts.createdAt)),
    db.select({ count: count() }).from(contacts).where(searchConditions),
  ]);

  const total = Number(totalResult[0].count);

  return {
    data,
    total,
    currentPage: page,
    totalPages: Math.ceil(total / limit),
  };
}

export async function deleteContact(organizationId: string, contactId: string) {
  return db
    .update(contacts)
    .set({ deletedAt: new Date(), updatedAt: new Date() })
    .where(
      and(
        eq(contacts.organizationId, organizationId),
        eq(contacts.id, contactId),
        isNull(contacts.deletedAt)
      )
    )
    .returning({ id: contacts.id });
}

export async function deleteContactsByIds(organizationId: string, contactIds: string[]) {
  if (contactIds.length === 0) {
    return [];
  }

  return db
    .update(contacts)
    .set({ deletedAt: new Date(), updatedAt: new Date() })
    .where(
      and(
        eq(contacts.organizationId, organizationId),
        inArray(contacts.id, contactIds),
        isNull(contacts.deletedAt)
      )
    )
    .returning({ id: contacts.id });
}
