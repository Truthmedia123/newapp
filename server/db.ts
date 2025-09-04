import { D1Database } from "@cloudflare/workers-types";
import { drizzle } from "drizzle-orm/d1";
import * as schema from "@shared/schema";

export interface Env { 
  DB?: D1Database 
}

export function getDb(env: Env) {
  if (env.DB) {
    return drizzle(env.DB, { schema });
  }
  
  // Fallback for local development - use in-memory SQLite
  if (typeof process !== 'undefined' && process.env.NODE_ENV === 'development') {
    console.warn("D1 database not available, using in-memory fallback for development");
    // For now, return a mock database
    return {
      select: () => ({ from: () => ({ where: () => ({ all: () => [], get: () => null }) }) }),
      insert: () => ({ values: () => ({ returning: () => ({ get: () => null }) }) }),
      update: () => ({ set: () => ({ where: () => ({ returning: () => ({ get: () => null }) }) }) }),
      delete: () => ({ where: () => ({ returning: () => ({ get: () => null }) }) }),
    } as any;
  }
  
  throw new Error("D1 database not available and no fallback configured");
}
