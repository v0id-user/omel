ALTER TABLE "accounts" ALTER COLUMN "id" SET DEFAULT 'bi4gusduti2sf7evf5dcsy3w';--> statement-breakpoint
ALTER TABLE "rate_limits" ALTER COLUMN "id" SET DEFAULT 'rygsn82ah3b83q7qyy9hpm3y';--> statement-breakpoint
ALTER TABLE "sessions" ALTER COLUMN "id" SET DEFAULT 'y6y77rk6ipw7ots9olvv6al7';--> statement-breakpoint
ALTER TABLE "two_factors" ALTER COLUMN "id" SET DEFAULT 'oavdfupm6hu4gcq2yarwjgqs';--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "id" SET DEFAULT 'c4fwjtz03micfk4a64tuwrb1';--> statement-breakpoint
ALTER TABLE "verifications" ALTER COLUMN "id" SET DEFAULT 'hgo05pjf0xa1kpqi9ji5jzex';--> statement-breakpoint
ALTER TABLE "categories" ALTER COLUMN "id" SET DEFAULT 'elsj8hus2c7x9kiiajapzzvw';--> statement-breakpoint
ALTER TABLE "contacts" ALTER COLUMN "id" SET DEFAULT 'p2fl450bs1tzb8egy0xh4pe8';--> statement-breakpoint
ALTER TABLE "tasks" ALTER COLUMN "id" SET DEFAULT 't6zoxdb3fnjzisptf2vliru4';--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "phone_number" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "phone_number_verified" boolean;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_phone_number_unique" UNIQUE("phone_number");