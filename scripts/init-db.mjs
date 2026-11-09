import { readFile } from "node:fs/promises";
import { loadEnvConfig } from "@next/env";
import pg from "pg";

loadEnvConfig(process.cwd());
const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error("Configura DATABASE_URL para inicializar un servidor PostgreSQL.");

const pool = new pg.Pool({ connectionString, connectionTimeoutMillis: 5000 });
try {
  await pool.query(await readFile(new URL("../db/setup.sql", import.meta.url), "utf8"));
  console.log("PostgreSQL listo con cuatro fichas ficticias.");
} finally {
  await pool.end();
}
