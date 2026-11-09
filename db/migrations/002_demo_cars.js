export async function up(db) {
  await db("cars").insert([
    { make: "Audi", model: "Q5", trim: "45 TFSI quattro", year: 2021, price_cents: 12990000, mileage: 48200, favorite: true, sample_key: "audi-q5" },
    { make: "BMW", model: "X3", trim: "xDrive30i", year: 2020, price_cents: 11850000, mileage: 63700, favorite: false, sample_key: "bmw-x3" },
    { make: "Volvo", model: "XC60", trim: "T5 Momentum", year: 2021, price_cents: 11200000, mileage: 56400, favorite: false, sample_key: "volvo-xc60" },
    { make: "Mazda", model: "CX-5", trim: "2.5 Signature AWD", year: 2022, price_cents: 8990000, mileage: 38900, favorite: false, sample_key: "mazda-cx5" },
  ]).onConflict("sample_key").ignore();
}

export function down() {
  throw new Error("La migración de ejemplo conserva los cambios guardados en las fichas y solo admite avances.");
}
