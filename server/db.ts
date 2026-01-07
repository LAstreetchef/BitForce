import { drizzle } from "drizzle-orm/node-postgres";
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

// Check for DATABASE_URL with diagnostic information
const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  const availableVars = Object.keys(process.env)
    .filter(k => k.includes("PG") || k.includes("DATABASE"))
    .join(", ") || "none";
  console.error("=".repeat(60));
  console.error("[database] FATAL: DATABASE_URL environment variable is not set");
  console.error("[database] Available related env vars:", availableVars);
  console.error("[database] NODE_ENV:", process.env.NODE_ENV || "not set");
  console.error("=".repeat(60));
  throw new Error(
    "DATABASE_URL must be set. Check that your database is provisioned and secrets are configured for deployment."
  );
}

console.log(`[database] Connecting to: ${extractDbInfo(databaseUrl)}`);

// Create pool with error handling
let pool: pg.Pool;
try {
  pool = new Pool({ connectionString: databaseUrl });
  
  pool.on('error', (err) => {
    console.error('[database] Pool connection error:', err.message);
  });
  
  console.log("[database] Database connection pool created successfully");
} catch (err) {
  console.error("=".repeat(60));
  console.error("[database] FATAL: Failed to create connection pool");
  console.error("[database] Error:", err);
  console.error("=".repeat(60));
  throw err;
}

export { pool };
export const db = drizzle(pool, { schema });
