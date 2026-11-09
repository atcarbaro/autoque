import { existsSync } from "node:fs";
import { mkdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { PGlite } from "@electric-sql/pglite";
import { Pool } from "pg";
import type { Car } from "./cars";

type Database = {
  query: (sql: string, params?: (number | string | boolean)[]) => Promise<{ rows: Car[] }>;
};

const runtime = globalThis as typeof globalThis & {
  autoqueDb?: Promise<Database>;
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
  const currentPath = join(dataDir, "autoque");
  const legacyPath = join(dataDir, "autoficha");
  const db = new PGlite(!existsSync(currentPath) && existsSync(legacyPath) ? legacyPath : currentPath);
  try {
    await db.exec(setup);
    return { query: (sql, params) => db.query<Car>(sql, params) };
  } catch (error) {
    await db.close();
    throw error;
  }
}

export function database() {
  runtime.autoqueDb ??= openDatabase().catch((error) => {
    delete runtime.autoqueDb;
    throw error;
  });
  return runtime.autoqueDb;
}
