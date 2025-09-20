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