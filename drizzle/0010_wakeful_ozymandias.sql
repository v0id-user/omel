CREATE TABLE "usage_counters" (
	"id" text PRIMARY KEY DEFAULT 'mcgs9ikrsy6lg937drgcc7y5' NOT NULL,
	"user_id" text NOT NULL,
	"resource_type" text NOT NULL,
	"count" text DEFAULT '0' NOT NULL,
	"limit" text DEFAULT '0' NOT NULL,
	"period_start" timestamp NOT NULL,
	"period_end" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"organization_id" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "accounts" ALTER COLUMN "id" SET DEFAULT 'mla0mm6irtfbtgjdvuzmc2we';--> statement-breakpoint
ALTER TABLE "rate_limits" ALTER COLUMN "id" SET DEFAULT 'ltgky4t0x7g02g2l6fc1mt74';--> statement-breakpoint
ALTER TABLE "sessions" ALTER COLUMN "id" SET DEFAULT 'cqag2219jhzyyfaj2azd3gmb';--> statement-breakpoint
ALTER TABLE "two_factors" ALTER COLUMN "id" SET DEFAULT 'z6qp8213cdb9omb0n0heopmo';--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "id" SET DEFAULT 'vk0y0a3u8z1plcbkdxnqyrqs';--> statement-breakpoint
ALTER TABLE "verifications" ALTER COLUMN "id" SET DEFAULT 'dnmfu6bdlxt04p3u5tems1k7';--> statement-breakpoint
ALTER TABLE "categories" ALTER COLUMN "id" SET DEFAULT 'e5b9rpztia0ixk11nfiyb8zt';--> statement-breakpoint
ALTER TABLE "contacts" ALTER COLUMN "id" SET DEFAULT 'c9s66z2v3xmup2tx6v9cgzf2';--> statement-breakpoint
ALTER TABLE "subscriptions" ALTER COLUMN "id" SET DEFAULT 'arsk6nprlxvi7b0cjqe5gutc';--> statement-breakpoint
ALTER TABLE "tasks" ALTER COLUMN "id" SET DEFAULT 'zvd3uxl68hx749idpd13ljw2';--> statement-breakpoint
ALTER TABLE "usage_counters" ADD CONSTRAINT "usage_counters_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "usage_counters" ADD CONSTRAINT "usage_counters_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "usage_counter_org_id_idx" ON "usage_counters" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "usage_counter_user_resource_idx" ON "usage_counters" USING btree ("user_id","resource_type");