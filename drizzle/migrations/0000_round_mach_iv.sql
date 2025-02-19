CREATE TABLE "deals" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"location" text NOT NULL,
	"category" text,
	"price" numeric,
	"created_at" timestamp DEFAULT now() NOT NULL
);
