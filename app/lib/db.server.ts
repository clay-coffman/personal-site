import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "~/db/schema";
import { getEnv } from "./env.server";
import { mkdirSync, existsSync } from "fs";
import { dirname } from "path";

let db: ReturnType<typeof createDb>;

function createDb() {
  const dbPath = getEnv().DATABASE_PATH;
  const dir = dirname(dbPath);
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
  const sqlite = new Database(dbPath);
  sqlite.pragma("journal_mode = WAL");
  return drizzle(sqlite, { schema });
}

export function getDb() {
  if (db) return db;
  db = createDb();
  return db;
}
