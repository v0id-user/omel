ALTER TABLE "accounts" ALTER COLUMN "id" SET DEFAULT 'r7z8bg8shbpxd1i2k55o95ac';--> statement-breakpoint
ALTER TABLE "rate_limits" ALTER COLUMN "id" SET DEFAULT 'rd71czuj2c3416nztnoshjkt';--> statement-breakpoint
ALTER TABLE "sessions" ALTER COLUMN "id" SET DEFAULT 'frttsyuigntc8pq1q4dckapi';--> statement-breakpoint
ALTER TABLE "two_factors" ALTER COLUMN "id" SET DEFAULT 'yq35n6sb0wf8y4179pl16tp8';--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "id" SET DEFAULT 'ss9nokjl930r426z8inpv87x';--> statement-breakpoint
ALTER TABLE "verifications" ALTER COLUMN "id" SET DEFAULT 'pvcs4skkhkrymzcfuby9kxvz';--> statement-breakpoint
ALTER TABLE "categories" ALTER COLUMN "id" SET DEFAULT 'gcsrb77okw8xw7muaiuk9oav';--> statement-breakpoint
ALTER TABLE "contacts" ALTER COLUMN "id" SET DEFAULT 'e4vly3i9oa1a41gsonjp4wad';--> statement-breakpoint
ALTER TABLE "subscriptions" ALTER COLUMN "id" SET DEFAULT 'rsvjn11g5r40h6jix31iv2kn';--> statement-breakpoint
ALTER TABLE "tasks" ALTER COLUMN "id" SET DEFAULT 'rrj2zx4z7bv8zpbh0dquhw2b';--> statement-breakpoint
ALTER TABLE "usage_counters" ALTER COLUMN "id" SET DEFAULT 'erwz0m3fj7d9q2ukyw1iv5ma';--> statement-breakpoint
ALTER TABLE "accounts" ADD COLUMN "deleted_at" timestamp;--> statement-breakpoint
ALTER TABLE "invitations" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "invitations" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "invitations" ADD COLUMN "deleted_at" timestamp;--> statement-breakpoint
ALTER TABLE "members" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "members" ADD COLUMN "deleted_at" timestamp;--> statement-breakpoint
ALTER TABLE "organizations" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "organizations" ADD COLUMN "deleted_at" timestamp;--> statement-breakpoint
ALTER TABLE "rate_limits" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "rate_limits" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "rate_limits" ADD COLUMN "deleted_at" timestamp;--> statement-breakpoint
ALTER TABLE "sessions" ADD COLUMN "deleted_at" timestamp;--> statement-breakpoint
ALTER TABLE "two_factors" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "two_factors" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "two_factors" ADD COLUMN "deleted_at" timestamp;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "deleted_at" timestamp;--> statement-breakpoint
ALTER TABLE "verifications" ADD COLUMN "deleted_at" timestamp;--> statement-breakpoint
ALTER TABLE "usage_counters" ADD COLUMN "deleted_at" timestamp;