export type Car = {
  id: number;
  make: string;
  model: string;
  trim: string;
  year: number;
  price_cents: number;
  mileage: number;
  favorite: boolean;
  sample_key: string | null;
};

export type CarFilters = {
  search: string;
  make: string;
  maxPrice: string;
  favoritesOnly: boolean;
  sort: "recent" | "price" | "mileage";
};

function normalize(value: string) {
  return value.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase();
}

export function filterCars(cars: Car[], filters: CarFilters) {
  const terms = normalize(filters.search.trim()).split(/\s+/).filter(Boolean);
  const maxCents = filters.maxPrice === "" ? Infinity : Math.round(Number(filters.maxPrice) * 100);

  const matches = cars.filter((car) => {
    const label = normalize([car.make, car.model, car.trim, car.year].join(" "));
    return terms.every((term) => label.includes(term))
      && (!filters.make || car.make === filters.make)
      && car.price_cents <= maxCents
      && (!filters.favoritesOnly || car.favorite);
  });

  return matches.sort((a, b) => {
    if (filters.sort === "price") return a.price_cents - b.price_cents || b.id - a.id;
    if (filters.sort === "mileage") return a.mileage - b.mileage || b.id - a.id;
    return b.id - a.id;
  });
}

const soles = new Intl.NumberFormat("es-PE", { style: "currency", currency: "PEN" });
const integer = new Intl.NumberFormat("es-PE");

export const formatPrice = (cents: number) => soles.format(cents / 100);
export const formatKm = (km: number) => integer.format(km) + " km";
