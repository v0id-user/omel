import { db } from '@/database/db';
import { contacts, deals } from '@/database/schemas/app-schema';
import { users } from '@/database/schemas/auth-schema';
import { CreateDealInput, ListDealsInput, UpdateDealInput } from '@/features/crm/deals/contracts';
import { and, desc, eq, ilike, isNull, or } from 'drizzle-orm';
import { DealSummary, DealWithRelations } from '../types';

export async function getDealsForOrganization(
  organizationId: string,
  filters: ListDealsInput
): Promise<DealWithRelations[]> {
  const conditions = [eq(deals.organizationId, organizationId), isNull(deals.deletedAt)];

  if (filters.stage) {
    conditions.push(eq(deals.stage, filters.stage));
  }

  if (filters.status) {
    conditions.push(eq(deals.status, filters.status));
  }

  if (filters.ownerId) {
    conditions.push(eq(deals.ownerId, filters.ownerId));
  }

  if (filters.contactId) {
    conditions.push(eq(deals.contactId, filters.contactId));
  }

  const searchTerm = filters.search?.trim();
  const searchCondition = searchTerm
    ? or(
        ilike(deals.title, `%${searchTerm}%`),
        ilike(deals.description, `%${searchTerm}%`),
        ilike(contacts.name, `%${searchTerm}%`)
      )
    : undefined;

  const rows = await db
    .select({
      deal: deals,
      ownerName: users.name,
      contactName: contacts.name,
    })
    .from(deals)
    .leftJoin(users, eq(deals.ownerId, users.id))
    .leftJoin(contacts, eq(deals.contactId, contacts.id))
    .where(and(...conditions, ...(searchCondition ? [searchCondition] : [])))
    .orderBy(desc(deals.expectedCloseDate), desc(deals.createdAt))
    .limit(filters.limit);

  return rows.map(row => ({
    ...row.deal,
    ownerName: row.ownerName ?? undefined,
    contactName: row.contactName ?? undefined,
  }));
}

export async function getDealById(organizationId: string, dealId: string) {
  const rows = await db
    .select({
      deal: deals,
      ownerName: users.name,
      contactName: contacts.name,
    })
    .from(deals)
    .leftJoin(users, eq(deals.ownerId, users.id))
    .leftJoin(contacts, eq(deals.contactId, contacts.id))
    .where(
      and(eq(deals.organizationId, organizationId), eq(deals.id, dealId), isNull(deals.deletedAt))
    )
    .limit(1);

  const [row] = rows;

  if (!row) {
    return null;
  }

  return {
    ...row.deal,
    ownerName: row.ownerName ?? undefined,
    contactName: row.contactName ?? undefined,
  };
}

export async function getDealsByContactId(organizationId: string, contactId: string) {
  return getDealsForOrganization(organizationId, {
    contactId,
    limit: 100,
  });
}

export async function createDeal(
  organizationId: string,
  createdBy: string,
  input: CreateDealInput
) {
  return db
    .insert(deals)
    .values({
      ...input,
      organizationId,
      createdBy,
      updatedBy: createdBy,
    })
    .returning({ id: deals.id });
}

export async function updateDeal(dealId: string, updatedBy: string, input: UpdateDealInput) {
  return db
    .update(deals)
    .set({
      ...input,
      closedAt:
        input.status === 'won' || input.status === 'lost'
          ? new Date()
          : input.status === 'open'
            ? null
            : undefined,
      updatedBy,
      updatedAt: new Date(),
    })
    .where(and(eq(deals.id, dealId), isNull(deals.deletedAt)))
    .returning({ id: deals.id });
}

export async function deleteDeal(organizationId: string, dealId: string) {
  return db
    .update(deals)
    .set({ deletedAt: new Date(), updatedAt: new Date() })
    .where(
      and(eq(deals.organizationId, organizationId), eq(deals.id, dealId), isNull(deals.deletedAt))
    )
    .returning({ id: deals.id });
}

export async function getDealSummary(organizationId: string): Promise<DealSummary> {
  const rows = await getDealsForOrganization(organizationId, { limit: 500 });

  const byStageMap = new Map<string, { count: number; value: number }>();

  for (const deal of rows) {
    const numericAmount = Number(deal.amount ?? 0);
    const stageMetrics = byStageMap.get(deal.stage) ?? { count: 0, value: 0 };
    stageMetrics.count += 1;
    stageMetrics.value += numericAmount;
    byStageMap.set(deal.stage, stageMetrics);
  }

  return {
    total: rows.length,
    open: rows.filter(deal => deal.status === 'open').length,
    won: rows.filter(deal => deal.status === 'won').length,
    lost: rows.filter(deal => deal.status === 'lost').length,
    pipelineValue: rows
      .filter(deal => deal.status === 'open')
      .reduce((sum, deal) => sum + Number(deal.amount ?? 0), 0),
    wonValue: rows
      .filter(deal => deal.status === 'won')
      .reduce((sum, deal) => sum + Number(deal.amount ?? 0), 0),
    byStage: Array.from(byStageMap.entries()).map(([stage, metrics]) => ({
      stage,
      count: metrics.count,
      value: metrics.value,
    })),
  };
}
