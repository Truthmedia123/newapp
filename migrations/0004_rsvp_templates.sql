-- Create rsvp_templates table
CREATE TABLE "rsvp_templates" (
	"id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	"name" text NOT NULL,
	"type" text NOT NULL,
	"config" text NOT NULL,
	"created_at" timestamp DEFAULT (unixepoch())
);

-- Create index for faster queries
CREATE INDEX "rsvp_templates_type_idx" ON "rsvp_templates" ("type");