# Autoque

Comparador personal de autos usados con React, Vite y TypeScript. La API corre en Node.js con Express y guarda el inventario en PostgreSQL mediante Knex. Incluye cuatro fichas ficticias en soles peruanos, entre ellas un Audi Q5 y un BMW X3.

## Arrancar la demo

Requiere Node.js 22.18 o superior y npm. Desde la carpeta del proyecto:

```sh
npm ci
npm run dev
```

Abre [http://127.0.0.1:5173](http://127.0.0.1:5173). Node sirve la API y la aplicación Vite desde el mismo puerto. Sin `DATABASE_URL`, aplica las migraciones al iniciar y guarda los datos en PostgreSQL embebido (PGlite), dentro de `.data/autoque`. Si ya existe `.data/autoficha` y aún no existe `.data/autoque`, reutiliza la carpeta anterior. Ejecuta una instancia de la aplicación por carpeta de datos.

## Conectar un servidor PostgreSQL

1. Para Docker, copia `.env.example` a `.env`. Activa `POSTGRES_PASSWORD` y `DATABASE_URL`, reemplaza los marcadores con una contraseña local y codifica los caracteres especiales dentro de la URL. Ejecuta `docker compose up -d --wait db`.
2. Si ya tienes un servidor PostgreSQL, configura `DATABASE_URL` en `.env.local` con una base dedicada y omite Docker.
3. Ejecuta `npm run db:migrate` antes de arrancar la app con `npm run dev`.

Git ignora los archivos de entorno locales, los datos embebidos, las claves y las carpetas de credenciales y respaldos. `.env.example` contiene marcadores. Usa una base dedicada a esta demo de un solo usuario.

Si ya usabas Docker con la versión anterior, detén el contenedor previo y conserva su `DATABASE_URL` y su contraseña. En `.env`, define también `POSTGRES_USER` y `POSTGRES_DB` con los valores anteriores y `POSTGRES_VOLUME` con el nombre del volumen existente. Puedes consultarlo con `docker volume ls`. Luego levanta el servicio `db` y aplica las migraciones.

## Migraciones con Knex

`npm run db:migrate` ejecuta las migraciones pendientes de `db/migrations/` y registra las aplicadas en `knex_migrations`. La primera reconoce una tabla `cars` existente. La segunda inserta los ejemplos faltantes y conserva los favoritos ya guardados. Las dos migraciones iniciales admiten solo avances para proteger inventarios creados antes del cambio.

Para agregar tablas o columnas, crea un archivo numerado en `db/migrations/` con funciones `up` y `down`, y vuelve a ejecutar `npm run db:migrate`. Detén el servidor antes de ejecutar ese comando contra la base embebida. `npm run db:init` es un alias del comando de migración.

## Recorrido de demo

1. Busca **Audi Q5** y revisa su versión, precio y kilometraje. Limpia la búsqueda.
2. Selecciona **Añadir a comparación** en el Audi Q5 y el BMW X3. Pulsa **Comparar**. La diferencia inicial es S/ 11 400 y 15 500 km.
3. Cierra la comparación y marca el BMW como favorito. Entra a **Favoritos** y recarga para comprobar que se conserva. La recarga vuelve a la vista inicial.
4. Pulsa **Registrar auto** y agrega una ficha ficticia. Usa **Precio máximo** y **Ordenar por** para encontrarla. Recarga para comprobar que se guardó.

## Código y compilación

- `client/` contiene la interfaz React y las llamadas a la API.
- `server/cars.ts` expone `GET /api/cars`, `POST /api/cars` y `PATCH /api/cars/:id/favorite`.
- `server/db.ts` configura Knex para PostgreSQL embebido o externo.
- `lib/cars.ts` contiene los tipos, filtros y formato de unidades.
- `npm run check` comprueba TypeScript. `npm run build` comprueba los tipos y genera `dist/` con Vite. `npm start` sirve la compilación y la API en [http://127.0.0.1:3000](http://127.0.0.1:3000). Los dos servidores aceptan `PORT`.

Las [tareas de sesión](SESIONES.md) siguen abiertas para que cada propuesta de IA parta de la misma base.
