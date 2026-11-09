import { connection } from "next/server";
import { database } from "../lib/db";
import Garage from "./garage";

export default async function Page() {
  await connection();
  const db = await database();
  const { rows } = await db.query("SELECT * FROM cars ORDER BY id DESC");
  return <Garage initialCars={rows} />;
}
