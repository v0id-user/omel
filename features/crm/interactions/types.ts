import { Interaction as DatabaseInteraction } from '@/database/types/interaction';

export type InteractionRecord = DatabaseInteraction;

export type InteractionWithRelations = InteractionRecord & {
  authorName?: string;
  contactName?: string;
  dealTitle?: string;
};
