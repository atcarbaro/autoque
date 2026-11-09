import { mkdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { PGlite } from "@electric-sql/pglite";
import { Pool } from "pg";
import type { Car } from "./cars";

type Database = {
  query: (sql: string, params?: (number | string | boolean)[]) => Promise<{ rows: Car[] }>;
};

const runtime = globalThis as typeof globalThis & {
  autofichaDb?: Promise<Database>;
};

async function openDatabase(): Promise<Database> {
  if (process.env.DATABASE_URL) {
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      connectionTimeoutMillis: 5000,
    });
    pool.on("error", (error) => console.error("Conexión inactiva de PostgreSQL:", error.message));
    return { query: (sql, params) => pool.query<Car>(sql, params) };
  }

  const setup = await readFile(join(process.cwd(), "db", "setup.sql"), "utf8");
  const dataDir = join(process.cwd(), ".data");
  await mkdir(dataDir, { recursive: true });
  const db = new PGlite(join(dataDir, "autoficha"));
  try {
    await db.exec(setup);
    return { query: (sql, params) => db.query<Car>(sql, params) };
  } catch (error) {
    await db.close();
    throw error;
  }
}

export function database() {
  runtime.autofichaDb ??= openDatabase().catch((error) => {
    delete runtime.autofichaDb;
    throw error;
  });
  return runtime.autofichaDb;
}
