-- Create rsvp_invitations table
CREATE TABLE "rsvp_invitations" (
	"id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	"wedding_id" integer NOT NULL,
	"guest_name" text NOT NULL,
	"guest_email" text NOT NULL,
	"invitation_code" text NOT NULL,
	"max_guests" integer DEFAULT 1,
	"allow_plus_one" boolean DEFAULT false,
	"invited_events" text,
	"is_family" boolean DEFAULT false,
	"status" text DEFAULT 'sent',
	"sent_at" timestamp,
	"viewed_at" timestamp,
	"created_at" timestamp DEFAULT (unixepoch())
);

-- Create rsvp_questions table
CREATE TABLE "rsvp_questions" (
	"id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	"wedding_id" integer NOT NULL,
	"question" text NOT NULL,
	"type" text NOT NULL,
	"options" text,
	"required" boolean DEFAULT false,
	"event_specific" text,
	"order" integer DEFAULT 0
);

-- Create rsvp_responses table
CREATE TABLE "rsvp_responses" (
	"id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	"rsvp_id" integer NOT NULL,
	"question_id" integer NOT NULL,
	"answer" text NOT NULL
);

-- Create wedding_events table
CREATE TABLE "wedding_events" (
	"id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	"wedding_id" integer NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"date" timestamp NOT NULL,
	"start_time" text NOT NULL,
	"end_time" text,
	"venue" text NOT NULL,
	"address" text NOT NULL,
	"dress_code" text,
	"is_private" boolean DEFAULT false,
	"max_guests" integer,
	"order" integer DEFAULT 0
);

-- Add foreign key constraints
CREATE INDEX "rsvp_invitations_wedding_id_idx" ON "rsvp_invitations" ("wedding_id");
CREATE INDEX "rsvp_invitations_invitation_code_idx" ON "rsvp_invitations" ("invitation_code");
CREATE INDEX "rsvp_questions_wedding_id_idx" ON "rsvp_questions" ("wedding_id");
CREATE INDEX "rsvp_responses_rsvp_id_idx" ON "rsvp_responses" ("rsvp_id");
CREATE INDEX "rsvp_responses_question_id_idx" ON "rsvp_responses" ("question_id");
CREATE INDEX "wedding_events_wedding_id_idx" ON "wedding_events" ("wedding_id");

-- Add unique constraint for invitation codes
CREATE UNIQUE INDEX "rsvp_invitations_invitation_code_unique" ON "rsvp_invitations" ("invitation_code");
