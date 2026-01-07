import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "@shared/schema";
import * as fs from "fs";

const { Pool } = pg;

function getDatabaseUrl(): string {
  const replitDbPath = "/tmp/replitdb";
  
  try {
    if (fs.existsSync(replitDbPath)) {
      const dbUrl = fs.readFileSync(replitDbPath, "utf-8").trim();
      if (dbUrl) {
        console.log("Using database URL from /tmp/replitdb (production)");
        return dbUrl;
      }
    }
  } catch (err) {
    console.log("Could not read /tmp/replitdb, falling back to DATABASE_URL");
  }
  
  if (process.env.DATABASE_URL) {
    console.log("Using database URL from DATABASE_URL environment variable");
    return process.env.DATABASE_URL;
  }
  
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

export const databaseUrl = getDatabaseUrl();
export const pool = new Pool({ connectionString: databaseUrl });
export const db = drizzle(pool, { schema });
