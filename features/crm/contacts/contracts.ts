import { z } from 'zod';
import { CONTACT_SOURCES, CONTACT_STATUSES, CONTACT_TYPES } from '@/database/types/contacts';

const optionalStringSchema = z.string().max(2000).optional().nullable();
const idSchema = z.string().min(1).max(64);
const tagsSchema = z.array(z.string().max(50)).max(20).optional().nullable();

export const contactTypeSchema = z.enum(CONTACT_TYPES);
export const contactStatusSchema = z.enum(CONTACT_STATUSES);
export const contactSourceSchema = z.enum(CONTACT_SOURCES);

export const createContactInputSchema = z.object({
  name: z.string().min(1).max(200),
  email: z.string().min(1).max(254),
  phone: z.string().min(1).max(32),
  address: optionalStringSchema,
  city: optionalStringSchema,
  region: optionalStringSchema,
  country: optionalStringSchema,
  postalCode: optionalStringSchema,
  contactType: contactTypeSchema.optional(),
  domain: optionalStringSchema,
  additionalPhones: z.array(z.string().max(32)).max(10).optional().nullable(),
  taxId: optionalStringSchema,
  businessType: optionalStringSchema,
  employees: optionalStringSchema,
  status: contactStatusSchema.optional(),
  source: contactSourceSchema.optional(),
  ownerId: optionalStringSchema,
  tags: tagsSchema,
  notes: optionalStringSchema,
  lastContactedAt: z.date().optional().nullable(),
  nextFollowUpAt: z.date().optional().nullable(),
});

export const updateContactInputSchema = z.object({
  id: idSchema,
  name: z.string().min(1).max(200),
  email: optionalStringSchema,
  phone: optionalStringSchema,
  address: optionalStringSchema,
  city: optionalStringSchema,
  region: optionalStringSchema,
  country: optionalStringSchema,
  postalCode: optionalStringSchema,
  contactType: contactTypeSchema.optional().nullable(),
  domain: optionalStringSchema,
  additionalPhones: z.array(z.string().max(32)).max(10).optional().nullable(),
  taxId: optionalStringSchema,
  businessType: optionalStringSchema,
  employees: optionalStringSchema,
  status: contactStatusSchema.optional(),
  source: contactSourceSchema.optional(),
  ownerId: optionalStringSchema,
  tags: tagsSchema,
  notes: optionalStringSchema,
  lastContactedAt: z.date().optional().nullable(),
  nextFollowUpAt: z.date().optional().nullable(),
});

export const contactPagesInputSchema = z.object({
  length: z.number().min(1).max(100).default(10),
});

export const contactPageInputSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(50).default(10),
});

export const contactIdsInputSchema = z.object({
  ids: z.array(idSchema).min(1).max(50),
});

export const contactDeleteInputSchema = z.object({
  id: z.string().min(1),
});

export const bulkContactsInputSchema = z.object({
  limit: z.number().min(10).max(100).default(50),
});

export const searchContactsInputSchema = z.object({
  searchTerm: z.string().trim().min(1).max(100),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20),
});

export type CreateContactInput = z.infer<typeof createContactInputSchema>;
export type UpdateContactInput = z.infer<typeof updateContactInputSchema>;
