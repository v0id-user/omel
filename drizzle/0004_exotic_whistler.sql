ALTER TABLE "accounts" ALTER COLUMN "id" SET DEFAULT 'y259ak8kwziritgbfjac8j4b';--> statement-breakpoint
ALTER TABLE "rate_limits" ALTER COLUMN "id" SET DEFAULT 'wz7a3757ijd7i2ybmu489nql';--> statement-breakpoint
ALTER TABLE "sessions" ALTER COLUMN "id" SET DEFAULT 'l5asbte49atquwzvqtqk0na2';--> statement-breakpoint
ALTER TABLE "two_factors" ALTER COLUMN "id" SET DEFAULT 'ot7alo6m0mzfq8gydpzjk5dz';--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "id" SET DEFAULT 'nx4ece2q37zlymkee4w4kt7c';--> statement-breakpoint
ALTER TABLE "verifications" ALTER COLUMN "id" SET DEFAULT 'o6kgxynzjz3xdf0n24o2ra6n';--> statement-breakpoint
ALTER TABLE "categories" ALTER COLUMN "id" SET DEFAULT 'awhnzj10pd5uucxx8xdr0yil';--> statement-breakpoint
ALTER TABLE "contacts" ALTER COLUMN "id" SET DEFAULT 'cbtaa8c92dayakohy28u3osu';--> statement-breakpoint
ALTER TABLE "tasks" ALTER COLUMN "id" SET DEFAULT 'tk0cmft4bwfk25ipw37j0ic3';--> statement-breakpoint
ALTER TABLE "tasks" ADD COLUMN "assigned_to" text NOT NULL;--> statement-breakpoint
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_assigned_to_users_id_fk" FOREIGN KEY ("assigned_to") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;