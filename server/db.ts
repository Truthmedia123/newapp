import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

// In development, allow running without a database by using in-memory storage instead.
// If DATABASE_URL is not set, export no-op placeholders so modules can load.
let poolLocal: Pool | undefined;
let dbLocal: any;

if (process.env.DATABASE_URL) {
  poolLocal = new Pool({ connectionString: process.env.DATABASE_URL });
  dbLocal = drizzle({ client: poolLocal, schema });
} else {
  console.warn("DATABASE_URL not set. Using in-memory storage. Database features are disabled.");
}

export const pool = poolLocal as any;
export const db = dbLocal as any;
