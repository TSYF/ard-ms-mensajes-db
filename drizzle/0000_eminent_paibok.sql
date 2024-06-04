CREATE TABLE IF NOT EXISTS "ar"."message" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"email" varchar NOT NULL,
	"message" varchar NOT NULL
);
