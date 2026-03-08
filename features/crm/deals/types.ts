import { Deal as DatabaseDeal } from '@/database/types/deal';

export type DealRecord = DatabaseDeal;

export type DealWithRelations = DealRecord & {
  ownerName?: string;
  contactName?: string;
};

export type DealSummary = {
  total: number;
  open: number;
  won: number;
  lost: number;
  pipelineValue: number;
  wonValue: number;
  byStage: Array<{
    stage: string;
    count: number;
    value: number;
  }>;
};
