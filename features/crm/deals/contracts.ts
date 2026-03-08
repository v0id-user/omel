import { z } from 'zod';
import { DEAL_STAGES, DEAL_STATUSES } from '@/database/types/deal';

const optionalStringSchema = z.string().optional().nullable();

export const dealStageSchema = z.enum(DEAL_STAGES);
export const dealStatusSchema = z.enum(DEAL_STATUSES);

export const createDealInputSchema = z.object({
  title: z.string().min(1),
  description: optionalStringSchema,
  amount: z.string().min(1),
  currency: z.string().min(1).max(8).default('SAR'),
  stage: dealStageSchema.optional(),
  status: dealStatusSchema.optional(),
  probability: z.number().min(0).max(100).optional(),
  expectedCloseDate: z.date().optional().nullable(),
  contactId: optionalStringSchema,
  ownerId: z.string().min(1),
  tags: z.array(z.string()).optional().nullable(),
});

export const updateDealInputSchema = createDealInputSchema.partial().extend({
  id: z.string().min(1),
});

export const dealDeleteInputSchema = z.object({
  id: z.string().min(1),
});

export const listDealsInputSchema = z.object({
  stage: dealStageSchema.optional(),
  status: dealStatusSchema.optional(),
  ownerId: z.string().min(1).optional(),
  contactId: z.string().min(1).optional(),
  search: z.string().trim().optional(),
  limit: z.number().min(1).max(100).default(100),
});

export const dealByContactInputSchema = z.object({
  contactId: z.string().min(1),
});

export const dealByIdInputSchema = z.object({
  id: z.string().min(1),
});

export type CreateDealInput = z.infer<typeof createDealInputSchema>;
export type UpdateDealInput = z.infer<typeof updateDealInputSchema>;
export type ListDealsInput = z.infer<typeof listDealsInputSchema>;
