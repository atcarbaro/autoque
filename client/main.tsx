import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";
import { createRoot } from "react-dom/client";
import { carsKey, listCars } from "./api";
import Garage from "./garage";
import "./styles.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false, networkMode: "always" },
    mutations: { retry: false, networkMode: "always" },
  },
});

function App() {
  const inventory = useQuery({ queryKey: carsKey, queryFn: ({ signal }) => listCars(signal) });

  if (inventory.data) return <Garage cars={inventory.data} />;

  return (
    <main className="failure">
      <p className="eyebrow">AUTOQUE</p>
      {inventory.isError && !inventory.isFetching ? (
        <>
          <h1>No pudimos cargar tus autos</h1>
          <p>Verifica que el servidor de Autoque pueda conectarse a PostgreSQL.</p>
          <button className="primary" onClick={() => inventory.refetch()}>Reintentar</button>
        </>
      ) : <p role="status">Cargando inventario…</p>}
    </main>
  );
}

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>,
);
