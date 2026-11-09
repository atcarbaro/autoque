"use server";

import { database } from "../lib/db";
import type { Car } from "../lib/cars";

type Result = { car: Car } | { error: string };

function field(data: FormData, name: string) {
  const value = data.get(name);
  return typeof value === "string" ? value.trim() : "";
}

export async function createCar(data: FormData): Promise<Result> {
  const make = field(data, "make");
  const model = field(data, "model");
  const trim = field(data, "trim");
  const year = field(data, "year");
  const price = field(data, "price");
  const mileage = field(data, "mileage");
  const priceCents = Math.round(Number(price) * 100);

  if (!make || make.length > 40 || !model || model.length > 40 || !trim || trim.length > 80) {
    return { error: "Completa la marca, el modelo y la versión dentro del límite de caracteres." };
  }
  if (!/^\d{4}$/.test(year) || Number(year) < 1900 || Number(year) > 2100) {
    return { error: "Ingresa un año entre 1900 y 2100." };
  }
  if (!/^\d{1,7}(\.\d{1,2})?$/.test(price) || priceCents < 1 || priceCents > 999999999) {
    return { error: "Ingresa un precio positivo de hasta S/ 9 999 999,99 con un máximo de dos decimales." };
  }
  if (!/^\d{1,7}$/.test(mileage) || Number(mileage) > 2999999) {
    return { error: "Ingresa un kilometraje entero entre 0 y 2 999 999." };
  }

  try {
    const db = await database();
    const { rows } = await db.query(
      "INSERT INTO cars (make, model, trim, year, price_cents, mileage) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [make, model, trim, Number(year), priceCents, Number(mileage)],
    );
    return { car: rows[0] };
  } catch (error) {
    console.error("Error al registrar un auto:", error);
    return { error: "No se pudo guardar el auto. Vuelve a intentarlo." };
  }
}

export async function setFavorite(id: number, favorite: boolean): Promise<Result> {
  if (!Number.isInteger(id) || id < 1 || id > 2147483647 || typeof favorite !== "boolean") {
    return { error: "La ficha solicitada no es válida." };
  }

  try {
    const db = await database();
    const { rows } = await db.query("UPDATE cars SET favorite = $2 WHERE id = $1 RETURNING *", [id, favorite]);
    return rows[0] ? { car: rows[0] } : { error: "No encontramos esa ficha." };
  } catch (error) {
    console.error("Error al actualizar un favorito:", error);
    return { error: "No se pudo actualizar el favorito. Vuelve a intentarlo." };
  }
}
