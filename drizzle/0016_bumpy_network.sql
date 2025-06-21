CREATE TABLE "activity_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"actor_type" text NOT NULL,
	"actor_id" text NOT NULL,
	"target_type" text NOT NULL,
	"target_id" text NOT NULL,
	"action" text NOT NULL,
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "accounts" ALTER COLUMN "id" SET DEFAULT 'orwmw5z7ufh1q0hcbnt6fx7z';--> statement-breakpoint
ALTER TABLE "rate_limits" ALTER COLUMN "id" SET DEFAULT 'ocojpdlq78z0k42ztkfnexul';--> statement-breakpoint
ALTER TABLE "sessions" ALTER COLUMN "id" SET DEFAULT 'sbxu5iysosss1ogbz67j97p6';--> statement-breakpoint
ALTER TABLE "two_factors" ALTER COLUMN "id" SET DEFAULT 'd36ifyhsoj0vqfst46xo9zvr';--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "id" SET DEFAULT 'r53smu9d28tcez6mt2adala4';--> statement-breakpoint
ALTER TABLE "verifications" ALTER COLUMN "id" SET DEFAULT 'p86eaftlvtfxi99c7f12y2m5';--> statement-breakpoint
ALTER TABLE "categories" ALTER COLUMN "id" SET DEFAULT 'kgcvh9hqqjp2hb68jo8nj0j1';--> statement-breakpoint
ALTER TABLE "contacts" ALTER COLUMN "id" SET DEFAULT 'v3lz3fjcjpnktckovvvpl8ns';--> statement-breakpoint
ALTER TABLE "subscriptions" ALTER COLUMN "id" SET DEFAULT 'v22e1xfvfhtpqx826eglbhdd';--> statement-breakpoint
ALTER TABLE "tasks" ALTER COLUMN "id" SET DEFAULT 'anebld01fp9cvibnfashyao3';--> statement-breakpoint
ALTER TABLE "usage_counters" ALTER COLUMN "id" SET DEFAULT 'q58ooamo1sgfw9aywf0goo81';--> statement-breakpoint
CREATE INDEX "activity_logs_actor_idx" ON "activity_logs" USING btree ("actor_type","actor_id");--> statement-breakpoint
CREATE INDEX "activity_logs_target_idx" ON "activity_logs" USING btree ("target_type","target_id");