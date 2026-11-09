import { openDatabase } from "./db.ts";

const { db, close } = await openDatabase();
try {
  const [, applied] = await db.migrate.latest();
  console.log(applied.length ? applied.join("\n") : "La base ya está al día.");
} finally {
  await close();
}
