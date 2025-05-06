import { relations } from 'drizzle-orm';
import {
  contacts,
  categories,
  tasks,
  subscriptions,
  usageCounters,
} from '@/database/schemas/app-schema';
import { users, organizations } from '@/database/schemas/auth-schema';

export const userRelations = relations(users, ({ many, one }) => ({
  tasks: many(tasks),
  contacts: many(contacts),
  categories: many(categories),
  usageCounters: many(usageCounters),
  subscriptions: one(subscriptions),
}));

export const organizationRelations = relations(organizations, ({ many }) => ({
  tasks: many(tasks),
  contacts: many(contacts),
  categories: many(categories),
  usageCounters: many(usageCounters),
}));
