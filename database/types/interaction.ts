import { interactions } from '@/database/schemas/app-schema';

export const INTERACTION_TYPES = ['note', 'call', 'meeting', 'email', 'follow_up'] as const;

export type InteractionType = (typeof INTERACTION_TYPES)[number];

export type Interaction = Omit<typeof interactions.$inferSelect, 'deletedAt'>;
export type NewInteraction = Omit<typeof interactions.$inferInsert, 'organizationId' | 'deletedAt'>;

export type InteractionFilters = {
  type?: InteractionType;
  contactId?: string;
  dealId?: string;
  search?: string;
};
