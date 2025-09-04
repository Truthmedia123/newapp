CREATE TABLE "weddings" (
	"id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	"bride_name" text NOT NULL,
	"groom_name" text NOT NULL,
	"wedding_date" timestamp NOT NULL,
	"venue" text NOT NULL,
	"venue_address" text NOT NULL,
	"ceremony_time" text NOT NULL,
	"reception_time" text,
	"cover_image" text,
	"gallery_images" text,
	"story" text,
	"slug" text NOT NULL,
	"rsvp_deadline" timestamp,
	"max_guests" integer DEFAULT 100,
	"is_public" boolean DEFAULT true,
	"contact_email" text NOT NULL,
	"contact_phone" text,
	"created_at" timestamp DEFAULT (unixepoch())
);

CREATE TABLE "rsvps" (
	"id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	"wedding_id" integer NOT NULL,
	"guest_name" text NOT NULL,
	"guest_email" text NOT NULL,
	"guest_phone" text,
	"attending_ceremony" boolean DEFAULT true,
	"attending_reception" boolean DEFAULT true,
	"number_of_guests" integer DEFAULT 1,
	"dietary_restrictions" text,
	"message" text,
	"created_at" timestamp DEFAULT (unixepoch()),
	FOREIGN KEY ("wedding_id") REFERENCES "weddings"("id")
);