import { z } from 'zod';
import { INTERACTION_TYPES } from '@/database/types/interaction';

const optionalStringSchema = z.string().max(2000).optional().nullable();

export const interactionTypeSchema = z.enum(INTERACTION_TYPES);

export const createInteractionInputSchema = z.object({
  type: interactionTypeSchema,
  subject: optionalStringSchema,
  content: optionalStringSchema,
  occurredAt: z.date().optional().nullable(),
  contactId: optionalStringSchema,
  dealId: optionalStringSchema,
  taskId: optionalStringSchema,
  metadata: z
    .record(z.string(), z.unknown())
    .refine(value => JSON.stringify(value).length <= 4000, 'metadata is too large')
    .optional()
    .nullable(),
});

export const updateInteractionInputSchema = createInteractionInputSchema.partial().extend({
  id: z.string().min(1),
});

export const interactionDeleteInputSchema = z.object({
  id: z.string().min(1),
});

export const listInteractionsInputSchema = z.object({
  type: interactionTypeSchema.optional(),
  contactId: z.string().min(1).optional(),
  dealId: z.string().min(1).optional(),
  search: z.string().trim().max(100).optional(),
  limit: z.number().min(1).max(100).default(100),
});

export const interactionByIdInputSchema = z.object({
  id: z.string().min(1),
});

export type CreateInteractionInput = z.infer<typeof createInteractionInputSchema>;
export type UpdateInteractionInput = z.infer<typeof updateInteractionInputSchema>;
export type ListInteractionsInput = z.infer<typeof listInteractionsInputSchema>;
