import { contacts } from '@/database/schemas/app-schema';

// Base contact type from database schema
export type Contact = typeof contacts.$inferSelect;
export type NewContact = typeof contacts.$inferInsert;

export const CONTACT_STATUSES = ['active', 'inactive'] as const;

export type ContactStatus = (typeof CONTACT_STATUSES)[number];

export const CONTACT_TYPES = ['person', 'company'] as const;

export type ContactType = (typeof CONTACT_TYPES)[number];

export const CONTACT_SOURCES = [
  'website',
  'referral',
  'social_media',
  'email',
  'phone',
  'other',
] as const;

export type ContactSource = (typeof CONTACT_SOURCES)[number];

// Form schemas for contact operations
export type ContactFormData = {
  name: string;
  description?: string;
  status: ContactStatus;
  type: ContactType;
  source: ContactSource;
};

export type ContactUpdateFormData = Partial<ContactFormData>;

// Database operation types
export type CreateContactInput = Omit<
  Contact,
  'id' | 'createdBy' | 'updatedBy' | 'organizationId' | 'deletedAt' | 'createdAt' | 'updatedAt'
>;
export type UpdateContactInput = Partial<CreateContactInput>;

// Query filters
export type ContactFilters = {
  status?: ContactStatus;
  type?: ContactType;
  source?: ContactSource;
};
