ALTER TABLE "accounts" ALTER COLUMN "id" SET DEFAULT 'guxuwxlqn6rrb8qzu8cjdabw';--> statement-breakpoint
ALTER TABLE "rate_limits" ALTER COLUMN "id" SET DEFAULT 'tryg244qsbey5jjrf456azwd';--> statement-breakpoint
ALTER TABLE "sessions" ALTER COLUMN "id" SET DEFAULT 'hglk1h4nmt2us842xpamg2fl';--> statement-breakpoint
ALTER TABLE "two_factors" ALTER COLUMN "id" SET DEFAULT 'u0fyx44rmax3ir4hbtx7wf7o';--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "id" SET DEFAULT 'm51e955xnw8m100808fl5qdj';--> statement-breakpoint
ALTER TABLE "verifications" ALTER COLUMN "id" SET DEFAULT 'uzl1x3c1wxlf31tjinxzie08';--> statement-breakpoint
ALTER TABLE "categories" ALTER COLUMN "id" SET DEFAULT 'jgq8ip77s10h9bccjdcer6r3';--> statement-breakpoint
ALTER TABLE "contacts" ALTER COLUMN "id" SET DEFAULT 'bku85cqq9v0aqzqr7uzq0vps';--> statement-breakpoint
ALTER TABLE "tasks" ALTER COLUMN "id" SET DEFAULT 'xs6t8y8oj9xprcjhmzaflqlv';--> statement-breakpoint
ALTER TABLE "tasks" ADD COLUMN "priority" text DEFAULT 'low' NOT NULL;