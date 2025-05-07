import { pgTable, text, integer, bigint, timestamp, boolean, index } from 'drizzle-orm/pg-core';
import { createId } from '@paralleldrive/cuid2';
import { timestamps } from '@/database/schemas/timestamps';

export const users = pgTable(
  'users',
  {
    id: text('id').primaryKey().default(createId()),
    name: text('name').notNull(),
    email: text('email').notNull().unique(),
    emailVerified: boolean('email_verified').notNull(),
    image: text('image'),
    normalizedEmail: text('normalized_email').unique(),
    twoFactorEnabled: boolean('two_factor_enabled'),
    phoneNumber: text('phone_number').unique(),
    phoneNumberVerified: boolean('phone_number_verified'),
    ...timestamps,
  },
  table => [index('user_email_idx').on(table.email)]
);

export const sessions = pgTable(
  'sessions',
  {
    id: text('id').primaryKey().default(createId()),
    expiresAt: timestamp('expires_at').notNull(),
    token: text('token').notNull().unique(),
    ipAddress: text('ip_address'),
    userAgent: text('user_agent'),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    activeOrganizationId: text('active_organization_id').references(() => organizations.id, {
      onDelete: 'cascade',
    }),
    metadata: text('metadata'),
    ...timestamps,
  },
  table => [
    index('session_token_idx').on(table.token),
    index('session_user_id_idx').on(table.userId),
    index('session_org_id_idx').on(table.activeOrganizationId),
  ]
);

export const accounts = pgTable(
  'accounts',
  {
    id: text('id').primaryKey().default(createId()),
    accountId: text('account_id').notNull(),
    providerId: text('provider_id').notNull(),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    accessToken: text('access_token'),
    refreshToken: text('refresh_token'),
    idToken: text('id_token'),
    accessTokenExpiresAt: timestamp('access_token_expires_at'),
    refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
    scope: text('scope'),
    password: text('password'),
    ...timestamps,
  },
  table => [index('account_user_id_idx').on(table.userId)]
);

export const organizations = pgTable('organizations', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').unique(),
  logo: text('logo'),
  metadata: text('metadata'),
  ...timestamps,
});

export const members = pgTable('members', {
  id: text('id').primaryKey(),
  organizationId: text('organization_id')
    .notNull()
    .references(() => organizations.id, { onDelete: 'cascade' }),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  role: text('role').notNull(),
  ...timestamps,
});

export const invitations = pgTable('invitations', {
  id: text('id').primaryKey(),
  organizationId: text('organization_id')
    .notNull()
    .references(() => organizations.id, { onDelete: 'cascade' }),
  email: text('email').notNull(),
  role: text('role'),
  status: text('status').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  inviterId: text('inviter_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  ...timestamps,
});

export const verifications = pgTable(
  'verifications',
  {
    id: text('id').primaryKey().default(createId()),
    identifier: text('identifier').notNull(),
    value: text('value').notNull(),
    expiresAt: timestamp('expires_at').notNull(),
    ...timestamps,
  },
  table => [index('verification_identifier_idx').on(table.identifier)]
);

export const twoFactors = pgTable(
  'two_factors',
  {
    id: text('id').primaryKey().default(createId()),
    secret: text('secret').notNull(),
    backupCodes: text('backup_codes').notNull(),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    ...timestamps,
  },
  table => [
    index('two_factor_user_id_idx').on(table.userId),
    index('two_factor_secret_idx').on(table.secret),
  ]
);

export const rateLimits = pgTable(
  'rate_limits',
  {
    id: text('id').primaryKey().default(createId()),
    key: text('key'),
    count: integer('count'),
    lastRequest: bigint('last_request', { mode: 'number' }),
    ...timestamps,
  },
  table => [index('rate_limit_key_idx').on(table.key)]
);
