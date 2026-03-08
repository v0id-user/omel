import { integer, jsonb, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { pgTable, index } from 'drizzle-orm/pg-core';
import { createId } from '@paralleldrive/cuid2';
import { users, organizations } from '@/database/schemas/auth-schema';
import { TaskPriority, TaskStatus } from '@/database/types/task';
import { SubscriptionTier, SubscriptionStatus } from '@/database/types/subscriptions';
import { ContactSource, ContactStatus, ContactType } from '@/database/types/contacts';
import { ResourceType } from '@/database/types/usage';
import { timestamps } from '@/database/schemas/timestamps';
import { sql } from 'drizzle-orm';
import { DealStage, DealStatus } from '@/database/types/deal';
import { InteractionType } from '@/database/types/interaction';

export const subscriptions = pgTable(
  'subscriptions',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => createId()),
    email: text('email').notNull(),
    userId: text('user_id')
      .notNull()
      .references(() => users.id),
    tier: text('tier').notNull().$type<SubscriptionTier>(),
    status: text('status').notNull().$type<SubscriptionStatus>(),
    startDate: timestamp('start_date').notNull(),
    endDate: timestamp('end_date'),
    ...timestamps,
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
    id: text('id')
      .primaryKey()
      .$defaultFn(() => createId()),
    name: text('name').notNull(),
    email: text('email'),
    phone: text('phone'),
    address: text('address'),
    city: text('city'),
    region: text('region'),
    country: text('country'),
    postalCode: text('postal_code'),
    contactType: text('contact_type').$type<ContactType>().default('person'),
    domain: text('domain'),
    additionalPhones: text('additional_phones').array(),
    taxId: text('tax_id'),
    businessType: text('business_type'),
    employees: text('employees'),
    status: text('status').notNull().default('lead').$type<ContactStatus>(),
    source: text('source').default('other').$type<ContactSource>(),
    ownerId: text('owner_id').references(() => users.id),
    tags: text('tags').array(),
    notes: text('notes'),
    lastContactedAt: timestamp('last_contacted_at'),
    nextFollowUpAt: timestamp('next_follow_up_at'),
    createdBy: text('created_by')
      .notNull()
      .references(() => users.id),
    updatedBy: text('updated_by')
      .notNull()
      .references(() => users.id),
    organizationId: text('organization_id')
      .notNull()
      .references(() => organizations.id),
    ...timestamps,
  },
  table => [
    index('contact_org_id_idx').on(table.organizationId),
    index('contact_email_idx').on(table.email),
    index('contact_name_idx').on(table.name),
    index('contact_phone_idx').on(table.phone),
    index('contact_type_idx').on(table.contactType),
    index('contact_status_idx').on(table.status),
    index('contact_source_idx').on(table.source),
    index('contact_owner_id_idx').on(table.ownerId),
  ]
);

export const categories = pgTable(
  'categories',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => createId()),
    name: text('name').notNull(),
    createdBy: text('created_by')
      .notNull()
      .references(() => users.id),
    updatedBy: text('updated_by')
      .notNull()
      .references(() => users.id),
    organizationId: text('organization_id')
      .notNull()
      .references(() => organizations.id),
    ...timestamps,
  },
  table => [
    index('category_org_id_idx').on(table.organizationId),
    index('category_name_idx').on(table.name),
  ]
);

export const tasks = pgTable(
  'tasks',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => createId()),
    description: text('description'),
    category: text('category'),
    dueDate: timestamp('due_date'),
    status: text('status').$type<TaskStatus>().notNull().default('pending'),
    priority: text('priority').$type<TaskPriority>().notNull().default('low'),
    relatedTo: text('related_to').references(() => contacts.id),
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
    ...timestamps,
  },
  table => [
    index('task_org_id_idx').on(table.organizationId),
    index('task_assigned_to_idx').on(table.assignedTo),
    index('task_status_idx').on(table.status),
    index('task_due_date_idx').on(table.dueDate),
    index('task_created_by_idx').on(table.createdBy),
    index('task_related_to_idx').on(table.relatedTo),
  ]
);

export const deals = pgTable(
  'deals',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => createId()),
    title: text('title').notNull(),
    description: text('description'),
    amount: text('amount').notNull().default('0'),
    currency: text('currency').notNull().default('SAR'),
    stage: text('stage').notNull().default('lead').$type<DealStage>(),
    status: text('status').notNull().default('open').$type<DealStatus>(),
    probability: integer('probability').notNull().default(0),
    expectedCloseDate: timestamp('expected_close_date'),
    closedAt: timestamp('closed_at'),
    contactId: text('contact_id').references(() => contacts.id),
    ownerId: text('owner_id')
      .notNull()
      .references(() => users.id),
    tags: text('tags').array(),
    createdBy: text('created_by')
      .notNull()
      .references(() => users.id),
    updatedBy: text('updated_by')
      .notNull()
      .references(() => users.id),
    organizationId: text('organization_id')
      .notNull()
      .references(() => organizations.id),
    ...timestamps,
  },
  table => [
    index('deal_org_id_idx').on(table.organizationId),
    index('deal_owner_id_idx').on(table.ownerId),
    index('deal_contact_id_idx').on(table.contactId),
    index('deal_stage_idx').on(table.stage),
    index('deal_status_idx').on(table.status),
    index('deal_expected_close_date_idx').on(table.expectedCloseDate),
  ]
);

export const interactions = pgTable(
  'interactions',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => createId()),
    type: text('type').notNull().$type<InteractionType>(),
    subject: text('subject'),
    content: text('content'),
    occurredAt: timestamp('occurred_at').notNull().defaultNow(),
    contactId: text('contact_id').references(() => contacts.id),
    dealId: text('deal_id').references(() => deals.id),
    taskId: text('task_id').references(() => tasks.id),
    metadata: jsonb('metadata'),
    createdBy: text('created_by')
      .notNull()
      .references(() => users.id),
    updatedBy: text('updated_by')
      .notNull()
      .references(() => users.id),
    organizationId: text('organization_id')
      .notNull()
      .references(() => organizations.id),
    ...timestamps,
  },
  table => [
    index('interaction_org_id_idx').on(table.organizationId),
    index('interaction_type_idx').on(table.type),
    index('interaction_contact_id_idx').on(table.contactId),
    index('interaction_deal_id_idx').on(table.dealId),
    index('interaction_task_id_idx').on(table.taskId),
    index('interaction_occurred_at_idx').on(table.occurredAt),
  ]
);

export const usageCounters = pgTable(
  'usage_counters',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => createId()),
    userId: text('user_id')
      .notNull()
      .references(() => users.id),
    resourceType: text('resource_type').notNull().$type<ResourceType>(),
    count: text('count').notNull().default('0'),
    limit: text('limit').notNull().default('0'),
    periodStart: timestamp('period_start').notNull(),
    periodEnd: timestamp('period_end').notNull(),
    organizationId: text('organization_id')
      .notNull()
      .references(() => organizations.id),
    ...timestamps,
  },
  table => [
    index('usage_counter_org_id_idx').on(table.organizationId),
    index('usage_counter_user_resource_idx').on(table.userId, table.resourceType),
  ]
);

/**
 * Activity Log Schema Mental Model
 * -------------------------------
 * The activity log tracks user and system actions with the following structure:
 *
 * Actor (Who):
 * - actor_type: The type of entity performing the action (user, system, bot)
 * - actor_id: Unique identifier of the actor
 *
 * Target (What):
 * - target_type: The type of entity being acted upon
 * - target_id: Unique identifier of the target
 *
 * Action:
 * - action: The specific operation or change that occurred
 *
 * Context:
 * - metadata: Optional JSON data providing additional details about the action
 */
export const activityLogs = pgTable(
  'activity_logs',
  {
    id: uuid('id')
      .primaryKey()
      .default(sql`gen_random_uuid()`),

    // Who did the action (can be user, system, bot, etc.)
    actorType: text('actor_type').notNull(),
    actorId: text('actor_id').notNull(),

    // What the action was done to
    targetType: text('target_type').notNull(),
    targetId: text('target_id').notNull(),

    // What happened
    action: text('action').notNull(),

    // Additional metadata
    metadata: jsonb('metadata'),

    // When it happened
    createdAt: timestamp('created_at').defaultNow(),
  },
  table => [
    index('activity_logs_actor_idx').on(table.actorType, table.actorId),
    index('activity_logs_target_idx').on(table.targetType, table.targetId),
  ]
);
