import { z } from 'zod';
import { CONTACT_TYPES } from '@/database/types/contacts';

const optionalStringSchema = z.string().optional().nullable();

export const contactTypeSchema = z.enum(CONTACT_TYPES);

export const createContactInputSchema = z.object({
  name: z.string().min(1),
  email: z.string().min(1),
  phone: z.string().min(1),
  address: optionalStringSchema,
  city: optionalStringSchema,
  region: optionalStringSchema,
  country: optionalStringSchema,
  postalCode: optionalStringSchema,
  contactType: contactTypeSchema.optional(),
  domain: optionalStringSchema,
  additionalPhones: z.array(z.string()).optional().nullable(),
  taxId: optionalStringSchema,
  businessType: optionalStringSchema,
  employees: optionalStringSchema,
});

export const updateContactInputSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  email: optionalStringSchema,
  phone: optionalStringSchema,
  address: optionalStringSchema,
  city: optionalStringSchema,
  region: optionalStringSchema,
  country: optionalStringSchema,
  postalCode: optionalStringSchema,
  contactType: contactTypeSchema.optional().nullable(),
  domain: optionalStringSchema,
  additionalPhones: z.array(z.string()).optional().nullable(),
  taxId: optionalStringSchema,
  businessType: optionalStringSchema,
  employees: optionalStringSchema,
});

export const contactPagesInputSchema = z.object({
  length: z.number().min(1).max(100).default(10),
});

export const contactPageInputSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(50).default(10),
});

export const contactIdsInputSchema = z.object({
  ids: z.array(z.string()).min(1).max(50),
});

export const contactDeleteInputSchema = z.object({
  id: z.string().min(1),
});

export const bulkContactsInputSchema = z.object({
  limit: z.number().min(10).max(100).default(50),
});

export const searchContactsInputSchema = z.object({
  searchTerm: z.string().min(1).trim(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20),
});

export type CreateContactInput = z.infer<typeof createContactInputSchema>;
export type UpdateContactInput = z.infer<typeof updateContactInputSchema>;
