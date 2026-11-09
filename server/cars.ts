import { Router } from "express";
import type { Knex } from "knex";
import type { Car } from "../lib/cars.ts";

function field(data: Record<string, unknown>, name: string) {
  const value = data[name];
  return typeof value === "string" ? value.trim() : "";
}

function parseCar(data: Record<string, unknown>) {
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

  return { car: { make, model, trim, year: Number(year), price_cents: priceCents, mileage: Number(mileage) } };
}

export function carsRouter(db: Knex) {
  const router = Router();

  router.get("/", async (_request, response) => {
    const cars = await db<Car>("cars").select("*").orderBy("id", "desc");
    response.json({ cars });
  });

  router.post("/", async (request, response) => {
    const result = parseCar(request.body ?? {});
    if (!result.car) {
      response.status(400).json({ error: result.error });
      return;
    }

    const [car] = await db<Car>("cars").insert(result.car).returning("*");
    response.status(201).json({ car });
  });

  router.patch("/:id/favorite", async (request, response) => {
    const id = Number(request.params.id);
    const favorite = request.body?.favorite;
    if (!/^\d+$/.test(request.params.id) || !Number.isInteger(id) || id < 1 || id > 2147483647 || typeof favorite !== "boolean") {
      response.status(400).json({ error: "La ficha solicitada o el marcador de favorito no son válidos." });
      return;
    }

    const [car] = await db<Car>("cars").where({ id }).update({ favorite }).returning("*");
    if (!car) {
      response.status(404).json({ error: "No encontramos esa ficha." });
      return;
    }
    response.json({ car });
  });

  return router;
}
