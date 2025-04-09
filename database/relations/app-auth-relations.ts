import { relations } from 'drizzle-orm';
import { contacts, categories, tasks } from '@/database/schemas/app-schema';
import { users } from '@/database/schemas/auth-schema';

export const userRelations = relations(users, ({ many }) => ({
  tasks: many(tasks),
  contacts: many(contacts),
  categories: many(categories),
}));
