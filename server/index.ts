import { createServer } from "node:http";
import { fileURLToPath } from "node:url";
import express, { type ErrorRequestHandler } from "express";
import { carsRouter } from "./cars.ts";
import { openDatabase } from "./db.ts";

const development = process.argv.includes("--dev");
const host = process.env.HOST || "127.0.0.1";
const port = Number(process.env.PORT || (development ? 5173 : 3000));
const app = express();
const server = createServer(app);
const database = await openDatabase();
let closeVite: (() => Promise<void>) | undefined;

const apiError: ErrorRequestHandler = (error, _request, response, _next) => {
  if (error.status === 400 || error.status === 413) {
    response.status(error.status).json({ error: "El cuerpo de la solicitud no es válido." });
    return;
  }

  console.error("Error de la API de Autoque:", error);
  response.status(500).json({ error: "No se pudo completar la operación. Vuelve a intentarlo." });
};

app.disable("x-powered-by");
app.use("/api", (_request, response, next) => {
  response.set("Cache-Control", "no-store");
  next();
});
app.use("/api/cars", express.json({ limit: "8kb" }), carsRouter(database.db));
app.use("/api", (_request, response) => {
  response.status(404).json({ error: "Ruta de API no encontrada." });
});
app.use("/api", apiError);

try {
  if (database.embedded) await database.db.migrate.latest();

  if (development) {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true, hmr: { server } },
    });
    closeVite = () => vite.close();
    app.use(vite.middlewares);
  } else {
    app.use(express.static(fileURLToPath(new URL("../dist", import.meta.url))));
  }

  await new Promise<void>((resolve, reject) => {
    server.once("error", reject);
    server.listen(port, host, () => {
      server.off("error", reject);
      resolve();
    });
  });
  console.log(`Autoque disponible en http://${host}:${port}`);
} catch (error) {
  await closeVite?.();
  await database.close();
  throw error;
}

async function shutdown() {
  try {
    await closeVite?.();
    await new Promise<void>((resolve, reject) => {
      server.close((error) => error ? reject(error) : resolve());
    });
  } finally {
    await database.close();
  }
}

function stop() {
  process.off("SIGINT", stop);
  process.off("SIGTERM", stop);
  shutdown().catch((error) => {
    console.error("Error al cerrar Autoque:", error);
    process.exitCode = 1;
  });
}

process.on("SIGINT", stop);
process.on("SIGTERM", stop);
