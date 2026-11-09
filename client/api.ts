import type { Car } from "../lib/cars";

type Result = { car: Car } | { error: string };

export async function listCars(signal: AbortSignal) {
  const response = await fetch("/api/cars", { signal });
  if (!response.ok) throw new Error("No se pudo cargar el inventario.");
  return (await response.json() as { cars: Car[] }).cars;
}

async function writeCar(path: string, method: "POST" | "PATCH", body: object): Promise<Result> {
  const response = await fetch(path, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return response.json();
}

export function createCar(data: FormData) {
  return writeCar("/api/cars", "POST", Object.fromEntries(data));
}

export function setFavorite(id: number, favorite: boolean) {
  return writeCar(`/api/cars/${id}/favorite`, "PATCH", { favorite });
}
