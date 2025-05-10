ALTER TABLE "accounts" ALTER COLUMN "id" SET DEFAULT 'e9rlevcg7v6ywu1u3h14v7d1';--> statement-breakpoint
ALTER TABLE "rate_limits" ALTER COLUMN "id" SET DEFAULT 'enz5rmnjz995kd9ar355uj3u';--> statement-breakpoint
ALTER TABLE "sessions" ALTER COLUMN "id" SET DEFAULT 'obaj1rfa1my8y83vzujbf1wd';--> statement-breakpoint
ALTER TABLE "two_factors" ALTER COLUMN "id" SET DEFAULT 'apbxs68rv8yczot0sl03u702';--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "id" SET DEFAULT 'nmii1cgy4pd90cm2tqhsnm5y';--> statement-breakpoint
ALTER TABLE "verifications" ALTER COLUMN "id" SET DEFAULT 'jyz604o500bfhgzu2q69jm5g';--> statement-breakpoint
ALTER TABLE "categories" ALTER COLUMN "id" SET DEFAULT 'osn68w96m2rjtnq7wumcrq97';--> statement-breakpoint
ALTER TABLE "contacts" ALTER COLUMN "id" SET DEFAULT 'f8b3kew1w1qb5yib1wqxrhu3';--> statement-breakpoint
ALTER TABLE "subscriptions" ALTER COLUMN "id" SET DEFAULT 'giz5ajwpr9gxd3jmloy5dbks';--> statement-breakpoint
ALTER TABLE "tasks" ALTER COLUMN "id" SET DEFAULT 'g92pmrhwrja0g2yg0nxu2tgi';--> statement-breakpoint
ALTER TABLE "usage_counters" ALTER COLUMN "id" SET DEFAULT 'ishbeyva79h2xx2lrmtic19i';--> statement-breakpoint
ALTER TABLE "contacts" ADD CONSTRAINT "contacts_email_unique" UNIQUE("email");--> statement-breakpoint
ALTER TABLE "contacts" ADD CONSTRAINT "contacts_phone_unique" UNIQUE("phone");