CREATE TABLE "deals" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"amount" text DEFAULT '0' NOT NULL,
	"currency" text DEFAULT 'SAR' NOT NULL,
	"stage" text DEFAULT 'lead' NOT NULL,
	"status" text DEFAULT 'open' NOT NULL,
	"probability" integer DEFAULT 0 NOT NULL,
	"expected_close_date" timestamp,
	"closed_at" timestamp,
	"contact_id" text,
	"owner_id" text NOT NULL,
	"tags" text[],
	"created_by" text NOT NULL,
	"updated_by" text NOT NULL,
	"organization_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "interactions" (
	"id" text PRIMARY KEY NOT NULL,
	"type" text NOT NULL,
	"subject" text,
	"content" text,
	"occurred_at" timestamp DEFAULT now() NOT NULL,
	"contact_id" text,
	"deal_id" text,
	"task_id" text,
	"metadata" jsonb,
	"created_by" text NOT NULL,
	"updated_by" text NOT NULL,
	"organization_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "accounts" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "rate_limits" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "sessions" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "two_factors" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "verifications" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "categories" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "contacts" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "subscriptions" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "tasks" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "usage_counters" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "contacts" ADD COLUMN "status" text DEFAULT 'lead' NOT NULL;--> statement-breakpoint
ALTER TABLE "contacts" ADD COLUMN "source" text DEFAULT 'other';--> statement-breakpoint
ALTER TABLE "contacts" ADD COLUMN "owner_id" text;--> statement-breakpoint
ALTER TABLE "contacts" ADD COLUMN "tags" text[];--> statement-breakpoint
ALTER TABLE "contacts" ADD COLUMN "notes" text;--> statement-breakpoint
ALTER TABLE "contacts" ADD COLUMN "last_contacted_at" timestamp;--> statement-breakpoint
ALTER TABLE "contacts" ADD COLUMN "next_follow_up_at" timestamp;--> statement-breakpoint
ALTER TABLE "deals" ADD CONSTRAINT "deals_contact_id_contacts_id_fk" FOREIGN KEY ("contact_id") REFERENCES "public"."contacts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "deals" ADD CONSTRAINT "deals_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "deals" ADD CONSTRAINT "deals_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "deals" ADD CONSTRAINT "deals_updated_by_users_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "deals" ADD CONSTRAINT "deals_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "interactions" ADD CONSTRAINT "interactions_contact_id_contacts_id_fk" FOREIGN KEY ("contact_id") REFERENCES "public"."contacts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "interactions" ADD CONSTRAINT "interactions_deal_id_deals_id_fk" FOREIGN KEY ("deal_id") REFERENCES "public"."deals"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "interactions" ADD CONSTRAINT "interactions_task_id_tasks_id_fk" FOREIGN KEY ("task_id") REFERENCES "public"."tasks"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "interactions" ADD CONSTRAINT "interactions_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "interactions" ADD CONSTRAINT "interactions_updated_by_users_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "interactions" ADD CONSTRAINT "interactions_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "deal_org_id_idx" ON "deals" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "deal_owner_id_idx" ON "deals" USING btree ("owner_id");--> statement-breakpoint
CREATE INDEX "deal_contact_id_idx" ON "deals" USING btree ("contact_id");--> statement-breakpoint
CREATE INDEX "deal_stage_idx" ON "deals" USING btree ("stage");--> statement-breakpoint
CREATE INDEX "deal_status_idx" ON "deals" USING btree ("status");--> statement-breakpoint
CREATE INDEX "deal_expected_close_date_idx" ON "deals" USING btree ("expected_close_date");--> statement-breakpoint
CREATE INDEX "interaction_org_id_idx" ON "interactions" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "interaction_type_idx" ON "interactions" USING btree ("type");--> statement-breakpoint
CREATE INDEX "interaction_contact_id_idx" ON "interactions" USING btree ("contact_id");--> statement-breakpoint
CREATE INDEX "interaction_deal_id_idx" ON "interactions" USING btree ("deal_id");--> statement-breakpoint
CREATE INDEX "interaction_task_id_idx" ON "interactions" USING btree ("task_id");--> statement-breakpoint
CREATE INDEX "interaction_occurred_at_idx" ON "interactions" USING btree ("occurred_at");--> statement-breakpoint
ALTER TABLE "contacts" ADD CONSTRAINT "contacts_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "contact_status_idx" ON "contacts" USING btree ("status");--> statement-breakpoint
CREATE INDEX "contact_source_idx" ON "contacts" USING btree ("source");--> statement-breakpoint
CREATE INDEX "contact_owner_id_idx" ON "contacts" USING btree ("owner_id");