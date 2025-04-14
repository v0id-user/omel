ALTER TABLE "accounts" ALTER COLUMN "id" SET DEFAULT 'd20mbb16wfr6gaeu7q1ssi3x';--> statement-breakpoint
ALTER TABLE "rate_limits" ALTER COLUMN "id" SET DEFAULT 'lwhu9t28wbp99j84hmvx5fsd';--> statement-breakpoint
ALTER TABLE "sessions" ALTER COLUMN "id" SET DEFAULT 'f7xl335zawsum0m56aiylzja';--> statement-breakpoint
ALTER TABLE "two_factors" ALTER COLUMN "id" SET DEFAULT 'co2xjuhetohcjtsxxvu4x0cg';--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "id" SET DEFAULT 'imrjwg302854xclix9vcmadp';--> statement-breakpoint
ALTER TABLE "verifications" ALTER COLUMN "id" SET DEFAULT 'qup36c0om6zvptjfhnj1cmh2';--> statement-breakpoint
ALTER TABLE "categories" ALTER COLUMN "id" SET DEFAULT 'zur051hjwwmxllelaj1f2n7l';--> statement-breakpoint
ALTER TABLE "contacts" ALTER COLUMN "id" SET DEFAULT 'tjrhgntdhap0lh6932bcl8wn';--> statement-breakpoint
ALTER TABLE "tasks" ALTER COLUMN "id" SET DEFAULT 'lu25j02i8fub2tz4l0pfhyih';--> statement-breakpoint
ALTER TABLE "sessions" ADD COLUMN "metadata" text;