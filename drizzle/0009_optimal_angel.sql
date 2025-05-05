ALTER TABLE "accounts" ALTER COLUMN "id" SET DEFAULT 'b8s87qgmrt0ure788gvi6fvs';--> statement-breakpoint
ALTER TABLE "rate_limits" ALTER COLUMN "id" SET DEFAULT 'ewigynrtm57wyyudkysufms4';--> statement-breakpoint
ALTER TABLE "sessions" ALTER COLUMN "id" SET DEFAULT 'b2bpni1hofjmyhx7ncjyox82';--> statement-breakpoint
ALTER TABLE "two_factors" ALTER COLUMN "id" SET DEFAULT 'oo54w2kda8msv2t977w2vmrb';--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "id" SET DEFAULT 'glcubtxekitdp1sv0jb61oz6';--> statement-breakpoint
ALTER TABLE "verifications" ALTER COLUMN "id" SET DEFAULT 'ymxmdusp5am4mhav2fr12tyw';--> statement-breakpoint
ALTER TABLE "categories" ALTER COLUMN "id" SET DEFAULT 'qffn5n5yor1zlpfu4e47ut0a';--> statement-breakpoint
ALTER TABLE "contacts" ALTER COLUMN "id" SET DEFAULT 'fu4e4l1gjn88l63sf7hn2jec';--> statement-breakpoint
ALTER TABLE "subscriptions" ALTER COLUMN "id" SET DEFAULT 'gf511uvg86qrvn1rsem7cp3w';--> statement-breakpoint
ALTER TABLE "tasks" ALTER COLUMN "id" SET DEFAULT 'iiwbq9aq2huasydu8ddp2kb0';--> statement-breakpoint
ALTER TABLE "categories" ADD COLUMN "deleted_at" timestamp;--> statement-breakpoint
ALTER TABLE "contacts" ADD COLUMN "deleted_at" timestamp;--> statement-breakpoint
ALTER TABLE "contacts" ADD COLUMN "contact_type" text DEFAULT 'person';--> statement-breakpoint
ALTER TABLE "subscriptions" ADD COLUMN "deleted_at" timestamp;--> statement-breakpoint
ALTER TABLE "tasks" ADD COLUMN "deleted_at" timestamp;