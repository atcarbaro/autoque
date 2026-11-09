import { existsSync } from "node:fs";
import { mkdir } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { PGlite } from "@electric-sql/pglite";
import { PGLiteSocketServer } from "@electric-sql/pglite-socket";
import knex, { type Knex } from "knex";

const migrations = {
  directory: fileURLToPath(new URL("../db/migrations", import.meta.url)),
  loadExtensions: [".js"],
};

export async function openDatabase() {
  let embedded: PGlite | undefined;
  let socket: PGLiteSocketServer | undefined;
  let db: Knex | undefined;

  async function close() {
    try {
      await db?.destroy();
    } finally {
      try {
        await socket?.stop();
      } finally {
        await embedded?.close();
      }
    }
  }

  try {
    let connection: Knex.PgConnectionConfig | string = process.env.DATABASE_URL || "";
    if (!connection) {
      const dataDir = join(process.cwd(), ".data");
      await mkdir(dataDir, { recursive: true });
      const currentPath = join(dataDir, "autoque");
      const legacyPath = join(dataDir, "autoficha");
      embedded = await PGlite.create(!existsSync(currentPath) && existsSync(legacyPath) ? legacyPath : currentPath);
      socket = new PGLiteSocketServer({ db: embedded, host: "127.0.0.1", port: 0 });
      await socket.start();
      const [host, port] = socket.getServerConn().split(":");
      connection = { host, port: Number(port), user: "postgres", database: "postgres" };
    }

    db = knex({
      client: "pg",
      connection,
      migrations,
      pool: { min: 0, max: embedded ? 1 : 10 },
      acquireConnectionTimeout: 5000,
    });

    return { db, close, embedded: Boolean(embedded) };
  } catch (error) {
    await close();
    throw error;
  }
}
