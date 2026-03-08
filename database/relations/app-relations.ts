import { relations } from 'drizzle-orm';
import {
  contacts,
  categories,
  tasks,
  deals,
  interactions,
  subscriptions,
  usageCounters,
} from '@/database/schemas/app-schema';
import { users, organizations } from '@/database/schemas/auth-schema';

export const userRelations = relations(users, ({ many, one }) => ({
  tasks: many(tasks),
  contacts: many(contacts),
  ownedContacts: many(contacts, { relationName: 'contact_owner' }),
  deals: many(deals),
  interactions: many(interactions),
  categories: many(categories),
  usageCounters: many(usageCounters),
  subscriptions: one(subscriptions),
}));

export const organizationRelations = relations(organizations, ({ many }) => ({
  tasks: many(tasks),
  contacts: many(contacts),
  deals: many(deals),
  interactions: many(interactions),
  categories: many(categories),
  usageCounters: many(usageCounters),
}));

// Add relations for tasks and contacts
export const taskRelations = relations(tasks, ({ many, one }) => ({
  assignedUser: one(users, {
    fields: [tasks.assignedTo],
    references: [users.id],
  }),
  relatedContact: one(contacts, {
    fields: [tasks.relatedTo],
    references: [contacts.id],
  }),
  organization: one(organizations, {
    fields: [tasks.organizationId],
    references: [organizations.id],
  }),
  interactions: many(interactions),
}));

export const contactRelations = relations(contacts, ({ many, one }) => ({
  tasks: many(tasks),
  deals: many(deals),
  interactions: many(interactions),
  owner: one(users, {
    fields: [contacts.ownerId],
    references: [users.id],
    relationName: 'contact_owner',
  }),
}));

export const dealRelations = relations(deals, ({ many, one }) => ({
  contact: one(contacts, {
    fields: [deals.contactId],
    references: [contacts.id],
  }),
  owner: one(users, {
    fields: [deals.ownerId],
    references: [users.id],
  }),
  organization: one(organizations, {
    fields: [deals.organizationId],
    references: [organizations.id],
  }),
  interactions: many(interactions),
}));

export const interactionRelations = relations(interactions, ({ one }) => ({
  contact: one(contacts, {
    fields: [interactions.contactId],
    references: [contacts.id],
  }),
  deal: one(deals, {
    fields: [interactions.dealId],
    references: [deals.id],
  }),
  task: one(tasks, {
    fields: [interactions.taskId],
    references: [tasks.id],
  }),
  organization: one(organizations, {
    fields: [interactions.organizationId],
    references: [organizations.id],
  }),
  author: one(users, {
    fields: [interactions.createdBy],
    references: [users.id],
  }),
}));
