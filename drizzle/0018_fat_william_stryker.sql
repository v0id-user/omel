ALTER TABLE "contacts" DROP CONSTRAINT "contacts_email_unique";--> statement-breakpoint
ALTER TABLE "contacts" DROP CONSTRAINT "contacts_phone_unique";--> statement-breakpoint
ALTER TABLE "accounts" ALTER COLUMN "id" SET DEFAULT 'b7fvx9ay3ivdrep25b1sm8wx';--> statement-breakpoint
ALTER TABLE "rate_limits" ALTER COLUMN "id" SET DEFAULT 'ira2uwdwocdxg65uorf9cn8p';--> statement-breakpoint
ALTER TABLE "sessions" ALTER COLUMN "id" SET DEFAULT 'v5btou7j3exom9vzvpmroujn';--> statement-breakpoint
ALTER TABLE "two_factors" ALTER COLUMN "id" SET DEFAULT 'qlbcqvkz49kylj109kp0mb9b';--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "id" SET DEFAULT 'qrzgsz06yltcz5l3ycaa7k37';--> statement-breakpoint
ALTER TABLE "verifications" ALTER COLUMN "id" SET DEFAULT 'r09cfe37tppj05l0rpc8so0g';--> statement-breakpoint
ALTER TABLE "categories" ALTER COLUMN "id" SET DEFAULT 'xkb8qk129p7u1rjoszp7bj0a';--> statement-breakpoint
ALTER TABLE "contacts" ALTER COLUMN "id" SET DEFAULT 'xe6e0k959liqvrctghkuxor0';--> statement-breakpoint
ALTER TABLE "subscriptions" ALTER COLUMN "id" SET DEFAULT 'zl39w9ekoe6nc5c6at0zfx8e';--> statement-breakpoint
ALTER TABLE "tasks" ALTER COLUMN "id" SET DEFAULT 'yb9jddl4sc9vkhv1hfwhpfrq';--> statement-breakpoint
ALTER TABLE "usage_counters" ALTER COLUMN "id" SET DEFAULT 'zo6gg7kpxjby0alktp9qh4yc';