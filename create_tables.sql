-- Create weddings table (core table needed for RSVP)
CREATE TABLE IF NOT EXISTS weddings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  bride_name TEXT NOT NULL,
  groom_name TEXT NOT NULL,
  wedding_date INTEGER NOT NULL,
  venue TEXT NOT NULL,
  venue_address TEXT NOT NULL,
  ceremony_time TEXT NOT NULL,
  reception_time TEXT,
  cover_image TEXT,
  gallery_images TEXT,
  story TEXT,
  slug TEXT NOT NULL,
  rsvp_deadline INTEGER,
  max_guests INTEGER DEFAULT 100,
  is_public INTEGER DEFAULT 1,
  contact_email TEXT NOT NULL,
  contact_phone TEXT,
  created_at INTEGER,
  -- Added separate ceremony and reception venues
  ceremony_venue TEXT,
  ceremony_venue_address TEXT,
  reception_venue TEXT,
  reception_venue_address TEXT
);

-- Create rsvp_invitations table
CREATE TABLE IF NOT EXISTS rsvp_invitations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  wedding_id INTEGER NOT NULL,
  guest_name TEXT NOT NULL,
  guest_email TEXT NOT NULL,
  invitation_code TEXT NOT NULL UNIQUE,
  max_guests INTEGER DEFAULT 1,
  allow_plus_one INTEGER DEFAULT 0,
  invited_events TEXT,
  is_family INTEGER DEFAULT 0,
  status TEXT DEFAULT 'sent',
  sent_at INTEGER,
  viewed_at INTEGER,
  created_at INTEGER,
  FOREIGN KEY (wedding_id) REFERENCES weddings(id)
);

-- Create rsvps table
CREATE TABLE IF NOT EXISTS rsvps (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  wedding_id INTEGER NOT NULL,
  invitation_id INTEGER NOT NULL,
  guest_name TEXT NOT NULL,
  guest_email TEXT NOT NULL,
  guest_phone TEXT,
  attending_ceremony INTEGER DEFAULT 1,
  attending_reception INTEGER DEFAULT 1,
  number_of_guests INTEGER DEFAULT 1,
  dietary_restrictions TEXT,
  message TEXT,
  created_at INTEGER,
  FOREIGN KEY (wedding_id) REFERENCES weddings(id),
  FOREIGN KEY (invitation_id) REFERENCES rsvp_invitations(id)
);

-- Create rsvp_questions table
CREATE TABLE IF NOT EXISTS rsvp_questions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  wedding_id INTEGER NOT NULL,
  question TEXT NOT NULL,
  type TEXT NOT NULL,
  options TEXT,
  required INTEGER DEFAULT 0,
  event_specific TEXT,
  order_col INTEGER DEFAULT 0,
  FOREIGN KEY (wedding_id) REFERENCES weddings(id)
);

-- Create rsvp_responses table
CREATE TABLE IF NOT EXISTS rsvp_responses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  rsvp_id INTEGER NOT NULL,
  question_id INTEGER NOT NULL,
  answer TEXT NOT NULL,
  FOREIGN KEY (rsvp_id) REFERENCES rsvps(id),
  FOREIGN KEY (question_id) REFERENCES rsvp_questions(id)
);

-- Create wedding_events table
CREATE TABLE IF NOT EXISTS wedding_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  wedding_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  date INTEGER NOT NULL,
  start_time TEXT NOT NULL,
  end_time TEXT,
  venue TEXT NOT NULL,
  address TEXT NOT NULL,
  dress_code TEXT,
  is_private INTEGER DEFAULT 0,
  max_guests INTEGER,
  order_col INTEGER DEFAULT 0,
  FOREIGN KEY (wedding_id) REFERENCES weddings(id)
);