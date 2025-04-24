ALTER TABLE "accounts" ALTER COLUMN "id" SET DEFAULT 'kopl2k1w5lrl9q0niwlylvpx';--> statement-breakpoint
ALTER TABLE "rate_limits" ALTER COLUMN "id" SET DEFAULT 'tbp38b51fx1evkxjcrudn5ep';--> statement-breakpoint
ALTER TABLE "sessions" ALTER COLUMN "id" SET DEFAULT 'rqckarjpafsgfczet224rfy9';--> statement-breakpoint
ALTER TABLE "two_factors" ALTER COLUMN "id" SET DEFAULT 'ujw09gwkpaonynr9rqfvn3zq';--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "id" SET DEFAULT 'eqp3uizmulp6s17a0alvla38';--> statement-breakpoint
ALTER TABLE "verifications" ALTER COLUMN "id" SET DEFAULT 'ssp83kbgra205sbu14henp9i';--> statement-breakpoint
ALTER TABLE "categories" ALTER COLUMN "id" SET DEFAULT 'geno5zwpnp4lmwzjtzufe9m3';--> statement-breakpoint
ALTER TABLE "contacts" ALTER COLUMN "id" SET DEFAULT 'go8007skq13yfzj4n29rtx4z';--> statement-breakpoint
ALTER TABLE "tasks" ALTER COLUMN "id" SET DEFAULT 'gdep9zmbr8dfhrb1lr3uvg5c';--> statement-breakpoint
ALTER TABLE "tasks" ADD COLUMN "due_date" timestamp;--> statement-breakpoint
ALTER TABLE "tasks" ADD COLUMN "status" text DEFAULT 'pending' NOT NULL;