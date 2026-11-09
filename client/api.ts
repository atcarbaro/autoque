import type { Car } from "../lib/cars";

export class ApiError extends Error {}

export const carsKey = ["cars"] as const;

export async function listCars(signal: AbortSignal) {
  const response = await fetch("/api/cars", { signal });
  if (!response.ok) throw new Error("No se pudo cargar el inventario.");
  return (await response.json() as { cars: Car[] }).cars;
}

async function writeCar(path: string, method: "POST" | "PATCH", body: object): Promise<Car> {
  const response = await fetch(path, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    const payload = await response.json().catch(() => null);
    const message = typeof payload?.error === "string" ? payload.error : "No se pudo guardar el cambio.";
    throw new ApiError(message);
  }
  return (await response.json() as { car: Car }).car;
}

export function createCar(data: FormData) {
  return writeCar("/api/cars", "POST", Object.fromEntries(data));
}

export type FavoriteChange = { id: number; favorite: boolean };

export function setFavorite({ id, favorite }: FavoriteChange) {
  return writeCar(`/api/cars/${id}/favorite`, "PATCH", { favorite });
}
