import { drizzle, NodePgDatabase } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "@shared/schema";

const { Pool } = pg;

function extractDbInfo(url: string): string {
  try {
    const parsed = new URL(url);
    const port = parsed.port || "5432";
    return `${parsed.protocol}//${parsed.hostname}:${port}/${parsed.pathname.slice(1)}`;
  } catch {
    return "unknown";
  }
}

let pool: pg.Pool | null = null;
let db: NodePgDatabase<typeof schema> | null = null;
let initializationError: Error | null = null;
let isInitialized = false;
let initializationAttempts = 0;
const MAX_INIT_ATTEMPTS = 3;

export function initializeDatabase(): boolean {
  if (isInitialized && pool !== null && db !== null) {
    return true;
  }
  
  initializationAttempts++;
  
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    const availableVars = Object.keys(process.env)
      .filter(k => k.includes("PG") || k.includes("DATABASE"))
      .join(", ") || "none";
    console.warn("=".repeat(60));
    console.warn("[database] WARNING: DATABASE_URL environment variable is not set");
    console.warn("[database] Available related env vars:", availableVars);
    console.warn("[database] NODE_ENV:", process.env.NODE_ENV || "not set");
    console.warn("[database] Database-dependent features will be unavailable");
    console.warn("=".repeat(60));
    initializationError = new Error("DATABASE_URL not set");
    return false;
  }

  console.log(`[database] Connecting to: ${extractDbInfo(databaseUrl)} (attempt ${initializationAttempts})`);

  try {
    pool = new Pool({ connectionString: databaseUrl });
    
    pool.on('error', (err) => {
      console.error('[database] Pool connection error:', err.message);
      pool = null;
      db = null;
      isInitialized = false;
    });
    
    db = drizzle(pool, { schema });
    isInitialized = true;
    initializationError = null;
    console.log("[database] Database connection pool created successfully");
    return true;
  } catch (err) {
    console.error("=".repeat(60));
    console.error("[database] WARNING: Failed to create connection pool");
    console.error("[database] Error:", err);
    console.error("[database] Database-dependent features will be unavailable");
    console.error("=".repeat(60));
    initializationError = err as Error;
    pool = null;
    db = null;
    isInitialized = false;
    return false;
  }
}

export function getPool(): pg.Pool {
  if (!pool) {
    if (initializationAttempts < MAX_INIT_ATTEMPTS) {
      console.log("[database] Attempting to reinitialize database connection...");
      if (initializeDatabase()) {
        return pool!;
      }
    }
    throw new Error("Database not initialized. Call initializeDatabase() first.");
  }
  return pool;
}

export function getDb(): NodePgDatabase<typeof schema> {
  if (!db) {
    if (initializationAttempts < MAX_INIT_ATTEMPTS) {
      console.log("[database] Attempting to reinitialize database connection...");
      if (initializeDatabase()) {
        return db!;
      }
    }
    throw new Error("Database not initialized. Call initializeDatabase() first.");
  }
  return db;
}

export function isDatabaseAvailable(): boolean {
  if (pool !== null && db !== null) {
    return true;
  }
  if (initializationAttempts < MAX_INIT_ATTEMPTS) {
    return initializeDatabase();
  }
  return false;
}

export function getDatabaseError(): Error | null {
  return initializationError;
}

export function resetDatabaseConnection(): void {
  if (pool) {
    try {
      pool.end();
    } catch (e) {
      console.error("[database] Error closing pool:", e);
    }
  }
  pool = null;
  db = null;
  isInitialized = false;
  initializationAttempts = 0;
  initializationError = null;
}

export { pool, db };
