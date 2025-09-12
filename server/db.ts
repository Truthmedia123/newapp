import { D1Database } from "@cloudflare/workers-types";
import { drizzle } from "drizzle-orm/d1";
import { drizzle as drizzleBetterSQLite } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import * as schema from "@shared/schema";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { mkdirSync } from 'fs';

export interface Env { 
  DB?: D1Database 
}

// Global database instance for development
let devDb: ReturnType<typeof drizzleBetterSQLite> | null = null;

function getDevDatabase() {
  if (!devDb) {
    try {
      // Ensure the directory exists
      const __filename = fileURLToPath(import.meta.url);
      const __dirname = dirname(__filename);
      const dbDir = join(__dirname, '../.db');
      mkdirSync(dbDir, { recursive: true });
      
      const sqlite = new Database(join(dbDir, 'dev.db'));
      devDb = drizzleBetterSQLite(sqlite, { schema });
      
      // Initialize tables
      sqlite.exec(`
        CREATE TABLE IF NOT EXISTS vendors (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          category TEXT NOT NULL,
          description TEXT NOT NULL,
          phone TEXT NOT NULL,
          email TEXT NOT NULL,
          whatsapp TEXT NOT NULL,
          location TEXT NOT NULL,
          address TEXT,
          website TEXT,
          instagram TEXT,
          youtube TEXT,
          facebook TEXT,
          profile_image TEXT,
          cover_image TEXT,
          gallery TEXT,
          services TEXT,
          price_range TEXT,
          featured INTEGER DEFAULT 0,
          verified INTEGER DEFAULT 0,
          rating REAL DEFAULT 0,
          review_count INTEGER DEFAULT 0,
          created_at INTEGER
        );
        
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
          created_at INTEGER
        );
        
        CREATE TABLE IF NOT EXISTS rsvp_invitations (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          wedding_id INTEGER NOT NULL REFERENCES weddings(id),
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
          created_at INTEGER
        );
        
        CREATE TABLE IF NOT EXISTS rsvps (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          wedding_id INTEGER NOT NULL REFERENCES weddings(id),
          invitation_id INTEGER NOT NULL REFERENCES rsvp_invitations(id),
          guest_name TEXT NOT NULL,
          guest_email TEXT NOT NULL,
          guest_phone TEXT,
          attending_ceremony INTEGER DEFAULT 1,
          attending_reception INTEGER DEFAULT 1,
          number_of_guests INTEGER DEFAULT 1,
          dietary_restrictions TEXT,
          message TEXT,
          created_at INTEGER
        );
        
        CREATE TABLE IF NOT EXISTS rsvp_questions (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          wedding_id INTEGER NOT NULL REFERENCES weddings(id),
          question TEXT NOT NULL,
          type TEXT NOT NULL,
          options TEXT,
          required INTEGER DEFAULT 0,
          event_specific TEXT,
          "order" INTEGER DEFAULT 0
        );
        
        CREATE TABLE IF NOT EXISTS rsvp_responses (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          rsvp_id INTEGER NOT NULL REFERENCES rsvps(id),
          question_id INTEGER NOT NULL REFERENCES rsvp_questions(id),
          answer TEXT NOT NULL
        );
        
        CREATE TABLE IF NOT EXISTS wedding_events (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          wedding_id INTEGER NOT NULL REFERENCES weddings(id),
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
          "order" INTEGER DEFAULT 0
        );
      `);
      
      console.log('✅ Local SQLite database initialized');
    } catch (error) {
      console.error('Failed to initialize local database:', error);
      throw error;
    }
  }
  return devDb;
}

export function getDb(env: Env) {
  if (env.DB) {
    return drizzle(env.DB, { schema });
  }
  
  // Use local SQLite database for development
  if (typeof process !== 'undefined' && process.env.NODE_ENV === 'development') {
    return getDevDatabase();
  }
  
  throw new Error("D1 database not available and no fallback configured");
}
