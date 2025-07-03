ALTER TABLE "accounts" ALTER COLUMN "id" SET DEFAULT 'r20fltoce2mus1vtotb0zutm';--> statement-breakpoint
ALTER TABLE "rate_limits" ALTER COLUMN "id" SET DEFAULT 'ybppu6xx9yvmwyyw94a6a9pp';--> statement-breakpoint
ALTER TABLE "sessions" ALTER COLUMN "id" SET DEFAULT 'g3wjt524lh0mwjewil4p50ng';--> statement-breakpoint
ALTER TABLE "two_factors" ALTER COLUMN "id" SET DEFAULT 'o2zmz34197uoblnenawi82ws';--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "id" SET DEFAULT 'lm5u05lfk3k9ufjsmjaxk2qb';--> statement-breakpoint
ALTER TABLE "verifications" ALTER COLUMN "id" SET DEFAULT 'tifdclrku7tpysczxgyppird';--> statement-breakpoint
ALTER TABLE "categories" ALTER COLUMN "id" SET DEFAULT 'cpl1iql6s1vyyyihhzdw9474';--> statement-breakpoint
ALTER TABLE "contacts" ALTER COLUMN "id" SET DEFAULT 'eqhhulpz78mm7kxzsuvqz5zv';--> statement-breakpoint
ALTER TABLE "subscriptions" ALTER COLUMN "id" SET DEFAULT 'aoxvw02uiekbzrafbbv2xjal';--> statement-breakpoint
ALTER TABLE "tasks" ALTER COLUMN "id" SET DEFAULT 'zqdf2vzpdvjxfmteo0ogll5r';--> statement-breakpoint
ALTER TABLE "usage_counters" ALTER COLUMN "id" SET DEFAULT 'rje133ha9o2jc1oj2j9b700p';--> statement-breakpoint
ALTER TABLE "tasks" ADD COLUMN "related_to" text;--> statement-breakpoint
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_related_to_contacts_id_fk" FOREIGN KEY ("related_to") REFERENCES "public"."contacts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "task_related_to_idx" ON "tasks" USING btree ("related_to");