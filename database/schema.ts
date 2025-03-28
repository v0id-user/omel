import { bigint, numeric, text, timestamp, uniqueIndex } from 'drizzle-orm/pg-core';
import { pgTable } from 'drizzle-orm/pg-core';

export const customers = pgTable(
  'customers',
  {
    id: bigint('id', { mode: 'bigint' }).primaryKey().notNull(),
    firstName: text('first_name').notNull(),
    lastName: text('last_name').notNull(),
    email: text('email').notNull(),
    phone: text('phone'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  table => {
    return [uniqueIndex('email_idx').on(table.email)];
  }
);

export const contacts = pgTable('contacts', {
  id: bigint('id', { mode: 'bigint' }).primaryKey().notNull(),
  customerId: bigint('customer_id', { mode: 'bigint' }).references(() => customers.id, {
    onDelete: 'cascade',
  }),
  contactType: text('contact_type').notNull(),
  contactValue: text('contact_value').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const interactions = pgTable('interactions', {
  id: bigint('id', { mode: 'bigint' }).primaryKey().notNull(),
  customerId: bigint('customer_id', { mode: 'bigint' }).references(() => customers.id, {
    onDelete: 'cascade',
  }),
  interactionType: text('interaction_type').notNull(),
  interactionDate: timestamp('interaction_date', { withTimezone: true }).defaultNow().notNull(),
  notes: text('notes'),
});

export const deals = pgTable('deals', {
  id: bigint('id', { mode: 'bigint' }).primaryKey().notNull(),
  customerId: bigint('customer_id', { mode: 'bigint' }).references(() => customers.id, {
    onDelete: 'cascade',
  }),
  dealName: text('deal_name').notNull(),
  dealValue: numeric('deal_value').notNull(),
  status: text('status').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const tasks = pgTable('tasks', {
  id: bigint('id', { mode: 'bigint' }).primaryKey().notNull(),
  customerId: bigint('customer_id', { mode: 'bigint' }).references(() => customers.id, {
    onDelete: 'cascade',
  }),
  taskName: text('task_name').notNull(),
  dueDate: timestamp('due_date', { withTimezone: true }),
  status: text('status').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});
