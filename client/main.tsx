import { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import type { Car } from "../lib/cars";
import { listCars } from "./api";
import Garage from "./garage";
import "./styles.css";

function App() {
  const [cars, setCars] = useState<Car[]>();
  const [error, setError] = useState(false);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const request = new AbortController();
    listCars(request.signal).then(setCars).catch(() => {
      if (!request.signal.aborted) setError(true);
    });
    return () => request.abort();
  }, [attempt]);

  if (cars) return <Garage initialCars={cars} />;

  return (
    <main className="failure">
      <p className="eyebrow">AUTOQUE</p>
      {error ? (
        <>
          <h1>No pudimos cargar tus autos</h1>
          <p>Verifica que el servidor de Autoque pueda conectarse a PostgreSQL.</p>
          <button className="primary" onClick={() => {
            setError(false);
            setAttempt((current) => current + 1);
          }}>Reintentar</button>
        </>
      ) : <p role="status">Cargando inventario…</p>}
    </main>
  );
}

createRoot(document.getElementById("root")!).render(<App />);
