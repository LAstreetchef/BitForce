import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "@shared/schema";

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

function extractDbInfo(url: string): string {
  try {
    const parsed = new URL(url);
    const port = parsed.port || "5432";
    return `${parsed.protocol}//${parsed.hostname}:${port}/${parsed.pathname.slice(1)}`;
  } catch {
    return "unknown";
  }
}

console.log(`[database] Connecting to: ${extractDbInfo(process.env.DATABASE_URL)}`);

export const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle(pool, { schema });
