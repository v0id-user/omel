ALTER TABLE "accounts" ALTER COLUMN "id" SET DEFAULT 'qeuy17jgvtclyo7ejr41f0cw';--> statement-breakpoint
ALTER TABLE "rate_limits" ALTER COLUMN "id" SET DEFAULT 'x31v1bni143jerrzchzf0g8h';--> statement-breakpoint
ALTER TABLE "sessions" ALTER COLUMN "id" SET DEFAULT 'tszu3svl887pwp01gj3lpyus';--> statement-breakpoint
ALTER TABLE "two_factors" ALTER COLUMN "id" SET DEFAULT 'iwisn9s3wmmtymzqqtumzam1';--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "id" SET DEFAULT 'ppvsavejxcxhrwxouk6ggbij';--> statement-breakpoint
ALTER TABLE "verifications" ALTER COLUMN "id" SET DEFAULT 'iql05ascrq1roimb814s4z98';--> statement-breakpoint
ALTER TABLE "categories" ALTER COLUMN "id" SET DEFAULT 'ivfd0t4y5z5d5ov4jwdfcebj';--> statement-breakpoint
ALTER TABLE "contacts" ALTER COLUMN "id" SET DEFAULT 'g2y5erlm0pme8605cliy4d5x';--> statement-breakpoint
ALTER TABLE "subscriptions" ALTER COLUMN "id" SET DEFAULT 'hffn71oxasjwepfolkm41q6s';--> statement-breakpoint
ALTER TABLE "tasks" ALTER COLUMN "id" SET DEFAULT 'cu5h2juxxi95esxstopl30wz';--> statement-breakpoint
ALTER TABLE "usage_counters" ALTER COLUMN "id" SET DEFAULT 'hnjsbni4rhb37h27238czeey';--> statement-breakpoint
ALTER TABLE "contacts" ADD COLUMN "address" text;--> statement-breakpoint
ALTER TABLE "contacts" ADD COLUMN "city" text;--> statement-breakpoint
ALTER TABLE "contacts" ADD COLUMN "region" text;--> statement-breakpoint
ALTER TABLE "contacts" ADD COLUMN "country" text;--> statement-breakpoint
ALTER TABLE "contacts" ADD COLUMN "postal_code" text;--> statement-breakpoint
ALTER TABLE "contacts" ADD COLUMN "domain" text;--> statement-breakpoint
ALTER TABLE "contacts" ADD COLUMN "additional_phones" text[];--> statement-breakpoint
ALTER TABLE "contacts" ADD COLUMN "tax_id" text;--> statement-breakpoint
ALTER TABLE "contacts" ADD COLUMN "business_type" text;--> statement-breakpoint
ALTER TABLE "contacts" ADD COLUMN "employees" text;--> statement-breakpoint
CREATE INDEX "contact_phone_idx" ON "contacts" USING btree ("phone");--> statement-breakpoint
CREATE INDEX "contact_type_idx" ON "contacts" USING btree ("contact_type");