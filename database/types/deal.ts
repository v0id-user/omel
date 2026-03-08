import { deals } from '@/database/schemas/app-schema';

export const DEAL_STAGES = ['lead', 'qualified', 'proposal', 'negotiation', 'won', 'lost'] as const;

export const DEAL_STATUSES = ['open', 'won', 'lost', 'archived'] as const;

export type DealStage = (typeof DEAL_STAGES)[number];
export type DealStatus = (typeof DEAL_STATUSES)[number];

export type Deal = Omit<typeof deals.$inferSelect, 'deletedAt'>;
export type NewDeal = Omit<typeof deals.$inferInsert, 'organizationId' | 'deletedAt'>;

export type DealFilters = {
  stage?: DealStage;
  status?: DealStatus;
  ownerId?: string;
  contactId?: string;
  search?: string;
};
