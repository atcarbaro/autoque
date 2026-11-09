"use client";

export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main className="failure">
      <p className="eyebrow">AUTOFICHA</p>
      <h1>No pudimos cargar tus autos</h1>
      <p>Verifica la conexión a PostgreSQL o revisa la consola si estás usando la demo local.</p>
      <button className="primary" onClick={reset}>Reintentar</button>
    </main>
  );
}
