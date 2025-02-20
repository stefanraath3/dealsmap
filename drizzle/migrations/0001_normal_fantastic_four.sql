ALTER TABLE "deals" ALTER COLUMN "price" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "deals" ADD COLUMN "day" text;--> statement-breakpoint
ALTER TABLE "deals" ADD COLUMN "time_window" text;