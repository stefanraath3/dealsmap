CREATE TABLE "deals" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"location" text NOT NULL,
	"latitude" numeric NOT NULL,
	"longitude" numeric NOT NULL,
	"category" text,
	"price" text,
	"original_price" text,
	"day" text NOT NULL,
	"is_recurring" boolean DEFAULT true NOT NULL,
	"time_window" text,
	"start_time" text,
	"end_time" text,
	"images" text[],
	"operating_hours" jsonb,
	"start_date" timestamp,
	"end_date" timestamp,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE INDEX "day_idx" ON "deals" USING btree ("day");--> statement-breakpoint
CREATE INDEX "location_idx" ON "deals" USING btree ("location");--> statement-breakpoint
CREATE INDEX "category_idx" ON "deals" USING btree ("category");--> statement-breakpoint
CREATE INDEX "active_idx" ON "deals" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX "geo_idx" ON "deals" USING btree ("latitude","longitude");