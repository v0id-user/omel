CREATE TABLE "subscriptions" (
	"id" text PRIMARY KEY DEFAULT 'vgouhr2lx1pp1gqvimki2a1e' NOT NULL,
	"email" text NOT NULL,
	"user_id" text NOT NULL,
	"tier" text NOT NULL,
	"status" text NOT NULL,
	"start_date" timestamp NOT NULL,
	"end_date" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "accounts" ALTER COLUMN "id" SET DEFAULT 'laid9k2xbo4qkaf0tbw4mml9';--> statement-breakpoint
ALTER TABLE "rate_limits" ALTER COLUMN "id" SET DEFAULT 'pynu4cg9s74lp2c6pqjxcikr';--> statement-breakpoint
ALTER TABLE "sessions" ALTER COLUMN "id" SET DEFAULT 'v2zr9old0p5y67dupr4anbo6';--> statement-breakpoint
ALTER TABLE "two_factors" ALTER COLUMN "id" SET DEFAULT 'l9m41mddimy77a9e6imfzkvk';--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "id" SET DEFAULT 'rqe42ih9x9lhv1aoux92g1us';--> statement-breakpoint
ALTER TABLE "verifications" ALTER COLUMN "id" SET DEFAULT 'gkep6grbdfain6pwc2px123w';--> statement-breakpoint
ALTER TABLE "categories" ALTER COLUMN "id" SET DEFAULT 'shhx20ekrgjwodp0u0f5key5';--> statement-breakpoint
ALTER TABLE "contacts" ALTER COLUMN "id" SET DEFAULT 'do50y5aj6xgp6gyagg8d5arz';--> statement-breakpoint
ALTER TABLE "tasks" ALTER COLUMN "id" SET DEFAULT 'ps3n4lw4son4j061zqo3vv7d';--> statement-breakpoint
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "subscription_user_id_idx" ON "subscriptions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "subscription_email_idx" ON "subscriptions" USING btree ("email");--> statement-breakpoint
CREATE INDEX "subscription_status_idx" ON "subscriptions" USING btree ("status");--> statement-breakpoint
CREATE INDEX "category_org_id_idx" ON "categories" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "category_name_idx" ON "categories" USING btree ("name");--> statement-breakpoint
CREATE INDEX "contact_org_id_idx" ON "contacts" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "contact_email_idx" ON "contacts" USING btree ("email");--> statement-breakpoint
CREATE INDEX "contact_name_idx" ON "contacts" USING btree ("name");--> statement-breakpoint
CREATE INDEX "task_org_id_idx" ON "tasks" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "task_assigned_to_idx" ON "tasks" USING btree ("assigned_to");--> statement-breakpoint
CREATE INDEX "task_status_idx" ON "tasks" USING btree ("status");--> statement-breakpoint
CREATE INDEX "task_due_date_idx" ON "tasks" USING btree ("due_date");--> statement-breakpoint
CREATE INDEX "task_created_by_idx" ON "tasks" USING btree ("created_by");