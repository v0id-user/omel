import { text, timestamp } from 'drizzle-orm/pg-core';
import { pgTable } from 'drizzle-orm/pg-core';
import { createId } from '@paralleldrive/cuid2';
import { users, organizations } from '@/database/schemas/auth-schema';
import { TaskPriority, TaskStatus } from '@/database/types/task';

export const contacts = pgTable('contacts', {
  id: text('id').primaryKey().default(createId()),
  name: text('name').notNull(),
  email: text('email'),
  phone: text('phone'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  createdBy: text('created_by')
    .notNull()
    .references(() => users.id),
  updatedBy: text('updated_by')
    .notNull()
    .references(() => users.id),
  organizationId: text('organization_id')
    .notNull()
    .references(() => organizations.id),
});

export const categories = pgTable('categories', {
  id: text('id').primaryKey().default(createId()),
  name: text('name').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  createdBy: text('created_by')
    .notNull()
    .references(() => users.id),
  updatedBy: text('updated_by')
    .notNull()
    .references(() => users.id),
  organizationId: text('organization_id')
    .notNull()
    .references(() => organizations.id),
});

export const tasks = pgTable('tasks', {
  id: text('id').primaryKey().default(createId()),
  name: text('name').notNull(),
  description: text('description'),
  category: text('category'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  dueDate: timestamp('due_date'),
  status: text('status').$type<TaskStatus>().notNull().default('pending'),
  priority: text('priority').$type<TaskPriority>().notNull().default('low'),
  assignedTo: text('assigned_to')
    .notNull()
    .references(() => users.id),
  createdBy: text('created_by')
    .notNull()
    .references(() => users.id),
  updatedBy: text('updated_by')
    .notNull()
    .references(() => users.id),
  organizationId: text('organization_id')
    .notNull()
    .references(() => organizations.id),
});
