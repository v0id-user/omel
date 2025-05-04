export const CONTACT_STATUSES = ['active', 'inactive'] as const;

export type ContactStatus = (typeof CONTACT_STATUSES)[number];

export const CONTACT_TYPES = ['person', 'company'] as const;

export type ContactType = (typeof CONTACT_TYPES)[number];
