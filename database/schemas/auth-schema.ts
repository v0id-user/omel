import { pgTable, text, integer, bigint, timestamp, boolean, index } from 'drizzle-orm/pg-core';
import { createId } from '@paralleldrive/cuid2';

export const user = pgTable(
  'user',
  {
    id: text('id').primaryKey().default(createId()),
    name: text('name').notNull(),
    email: text('email').notNull().unique(),
    emailVerified: boolean('email_verified').notNull(),
    image: text('image'),
    createdAt: timestamp('created_at').notNull(),
    updatedAt: timestamp('updated_at').notNull(),
    normalizedEmail: text('normalized_email').unique(),
    twoFactorEnabled: boolean('two_factor_enabled'),
  },
  table => [index('email_index').on(table.email)]
);

export const session = pgTable(
  'session',
  {
    id: text('id').primaryKey().default(createId()),
    expiresAt: timestamp('expires_at').notNull(),
    token: text('token').notNull().unique(),
    createdAt: timestamp('created_at').notNull(),
    updatedAt: timestamp('updated_at').notNull(),
    ipAddress: text('ip_address'),
    userAgent: text('user_agent'),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    // All users must be in an organization
    activeOrganizationId: text('active_organization_id')
      .notNull()
      .references(() => organization.id, { onDelete: 'cascade' }),
  },
  table => [
    index('token_index').on(table.token),
    index('user_id_index').on(table.userId),
    index('active_organization_id_index').on(table.activeOrganizationId),
  ]
);

export const account = pgTable(
  'account',
  {
    id: text('id').primaryKey().default(createId()),
    accountId: text('account_id').notNull(),
    providerId: text('provider_id').notNull(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    accessToken: text('access_token'),
    refreshToken: text('refresh_token'),
    idToken: text('id_token'),
    accessTokenExpiresAt: timestamp('access_token_expires_at'),
    refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
    scope: text('scope'),
    password: text('password'),
    createdAt: timestamp('created_at').notNull(),
    updatedAt: timestamp('updated_at').notNull(),
  },
  table => [index('user_id_index').on(table.userId)]
);

export const organization = pgTable('organization', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').unique(),
  logo: text('logo'),
  createdAt: timestamp('created_at').notNull(),
  metadata: text('metadata'),
});

export const member = pgTable('member', {
  id: text('id').primaryKey(),
  organizationId: text('organization_id')
    .notNull()
    .references(() => organization.id, { onDelete: 'cascade' }),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  role: text('role').notNull(),
  createdAt: timestamp('created_at').notNull(),
});

export const invitation = pgTable('invitation', {
  id: text('id').primaryKey(),
  organizationId: text('organization_id')
    .notNull()
    .references(() => organization.id, { onDelete: 'cascade' }),
  email: text('email').notNull(),
  role: text('role'),
  status: text('status').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  inviterId: text('inviter_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
});

export const verification = pgTable(
  'verification',
  {
    id: text('id').primaryKey().default(createId()),
    identifier: text('identifier').notNull(),
    value: text('value').notNull(),
    expiresAt: timestamp('expires_at').notNull(),
    createdAt: timestamp('created_at'),
    updatedAt: timestamp('updated_at'),
  },
  table => [index('identifier_index').on(table.identifier)]
);

export const twoFactor = pgTable(
  'two_factor',
  {
    id: text('id').primaryKey().default(createId()),
    secret: text('secret').notNull(),
    backupCodes: text('backup_codes').notNull(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
  },
  table => [index('user_id_index').on(table.userId), index('secret_index').on(table.secret)]
);

export const rateLimit = pgTable(
  'rate_limit',
  {
    id: text('id').primaryKey().default(createId()),
    key: text('key'),
    count: integer('count'),
    lastRequest: bigint('last_request', { mode: 'number' }),
  },
  table => [index('key_index').on(table.key)]
);
