import { db } from '@/database/db';
import { contacts, deals, interactions } from '@/database/schemas/app-schema';
import { users } from '@/database/schemas/auth-schema';
import {
  CreateInteractionInput,
  ListInteractionsInput,
  UpdateInteractionInput,
} from '@/features/crm/interactions/contracts';
import { and, desc, eq, ilike, isNull, or } from 'drizzle-orm';
import { InteractionWithRelations } from '../types';

export async function listInteractionsForOrganization(
  organizationId: string,
  filters: ListInteractionsInput
): Promise<InteractionWithRelations[]> {
  const conditions = [
    eq(interactions.organizationId, organizationId),
    isNull(interactions.deletedAt),
  ];

  if (filters.type) {
    conditions.push(eq(interactions.type, filters.type));
  }

  if (filters.contactId) {
    conditions.push(eq(interactions.contactId, filters.contactId));
  }

  if (filters.dealId) {
    conditions.push(eq(interactions.dealId, filters.dealId));
  }

  const searchTerm = filters.search?.trim();
  const searchCondition = searchTerm
    ? or(
        ilike(interactions.subject, `%${searchTerm}%`),
        ilike(interactions.content, `%${searchTerm}%`),
        ilike(contacts.name, `%${searchTerm}%`),
        ilike(deals.title, `%${searchTerm}%`)
      )
    : undefined;

  const rows = await db
    .select({
      interaction: interactions,
      authorName: users.name,
      contactName: contacts.name,
      dealTitle: deals.title,
    })
    .from(interactions)
    .leftJoin(users, eq(interactions.createdBy, users.id))
    .leftJoin(contacts, eq(interactions.contactId, contacts.id))
    .leftJoin(deals, eq(interactions.dealId, deals.id))
    .where(and(...conditions, ...(searchCondition ? [searchCondition] : [])))
    .orderBy(desc(interactions.occurredAt), desc(interactions.createdAt))
    .limit(filters.limit);

  return rows.map(row => ({
    ...row.interaction,
    authorName: row.authorName ?? undefined,
    contactName: row.contactName ?? undefined,
    dealTitle: row.dealTitle ?? undefined,
  }));
}

export async function getInteractionById(organizationId: string, interactionId: string) {
  const rows = await db
    .select({
      interaction: interactions,
      authorName: users.name,
      contactName: contacts.name,
      dealTitle: deals.title,
    })
    .from(interactions)
    .leftJoin(users, eq(interactions.createdBy, users.id))
    .leftJoin(contacts, eq(interactions.contactId, contacts.id))
    .leftJoin(deals, eq(interactions.dealId, deals.id))
    .where(
      and(
        eq(interactions.organizationId, organizationId),
        eq(interactions.id, interactionId),
        isNull(interactions.deletedAt)
      )
    )
    .limit(1);

  const [row] = rows;

  if (!row) {
    return null;
  }

  return {
    ...row.interaction,
    authorName: row.authorName ?? undefined,
    contactName: row.contactName ?? undefined,
    dealTitle: row.dealTitle ?? undefined,
  };
}

export async function createInteraction(
  organizationId: string,
  createdBy: string,
  input: CreateInteractionInput
) {
  return db
    .insert(interactions)
    .values({
      ...input,
      occurredAt: input.occurredAt ?? new Date(),
      organizationId,
      createdBy,
      updatedBy: createdBy,
    })
    .returning({ id: interactions.id });
}

export async function updateInteraction(
  interactionId: string,
  updatedBy: string,
  input: UpdateInteractionInput
) {
  return db
    .update(interactions)
    .set({
      ...input,
      occurredAt: input.occurredAt ?? undefined,
      updatedBy,
      updatedAt: new Date(),
    })
    .where(and(eq(interactions.id, interactionId), isNull(interactions.deletedAt)))
    .returning({ id: interactions.id });
}

export async function deleteInteraction(organizationId: string, interactionId: string) {
  return db
    .update(interactions)
    .set({ deletedAt: new Date(), updatedAt: new Date() })
    .where(
      and(
        eq(interactions.organizationId, organizationId),
        eq(interactions.id, interactionId),
        isNull(interactions.deletedAt)
      )
    )
    .returning({ id: interactions.id });
}
