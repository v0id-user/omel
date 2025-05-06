import { text, timestamp } from 'drizzle-orm/pg-core';
import { pgTable, index } from 'drizzle-orm/pg-core';
import { createId } from '@paralleldrive/cuid2';
import { users, organizations } from '@/database/schemas/auth-schema';
import { TaskPriority, TaskStatus } from '@/database/types/task';
import { SubscriptionTier, SubscriptionStatus } from '@/database/types/subscriptions';
import { ContactType } from '@/database/types/contacts';
import { ResourceType } from '@/database/types/usage';
export const subscriptions = pgTable(
  'subscriptions',
  {
    id: text('id').primaryKey().default(createId()),
    email: text('email').notNull(),
    deletedAt: timestamp('deleted_at'),
    userId: text('user_id')
      .notNull()
      .references(() => users.id),
    tier: text('tier').notNull().$type<SubscriptionTier>(),
    status: text('status').notNull().$type<SubscriptionStatus>(),
    startDate: timestamp('start_date').notNull(),
    endDate: timestamp('end_date'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  table => [
    index('subscription_user_id_idx').on(table.userId),
    index('subscription_email_idx').on(table.email),
    index('subscription_status_idx').on(table.status),
  ]
);

export const contacts = pgTable(
  'contacts',
  {
    id: text('id').primaryKey().default(createId()),
    name: text('name').notNull(),
    email: text('email'),
    phone: text('phone'),
    deletedAt: timestamp('deleted_at'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
    contactType: text('contact_type').$type<ContactType>().default('person'),
    createdBy: text('created_by')
      .notNull()
      .references(() => users.id),
    updatedBy: text('updated_by')
      .notNull()
      .references(() => users.id),
    organizationId: text('organization_id')
      .notNull()
      .references(() => organizations.id),
  },
  table => [
    index('contact_org_id_idx').on(table.organizationId),
    index('contact_email_idx').on(table.email),
    index('contact_name_idx').on(table.name),
  ]
);

export const categories = pgTable(
  'categories',
  {
    id: text('id').primaryKey().default(createId()),
    name: text('name').notNull(),
    deletedAt: timestamp('deleted_at'),
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
  },
  table => [
    index('category_org_id_idx').on(table.organizationId),
    index('category_name_idx').on(table.name),
  ]
);

export const tasks = pgTable(
  'tasks',
  {
    id: text('id').primaryKey().default(createId()),
    name: text('name').notNull(),
    deletedAt: timestamp('deleted_at'),
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
  },
  table => [
    index('task_org_id_idx').on(table.organizationId),
    index('task_assigned_to_idx').on(table.assignedTo),
    index('task_status_idx').on(table.status),
    index('task_due_date_idx').on(table.dueDate),
    index('task_created_by_idx').on(table.createdBy),
  ]
);

export const usageCounters = pgTable(
  'usage_counters',
  {
    id: text('id').primaryKey().default(createId()),
    userId: text('user_id')
      .notNull()
      .references(() => users.id),
    resourceType: text('resource_type').notNull().$type<ResourceType>(),
    count: text('count').notNull().default('0'),
    limit: text('limit').notNull().default('0'),
    periodStart: timestamp('period_start').notNull(),
    periodEnd: timestamp('period_end').notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
    organizationId: text('organization_id')
      .notNull()
      .references(() => organizations.id),
  },
  table => [
    index('usage_counter_org_id_idx').on(table.organizationId),
    index('usage_counter_user_resource_idx').on(table.userId, table.resourceType),
  ]
);
