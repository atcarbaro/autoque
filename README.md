# Autoque

Comparador personal de autos usados hecho con Next.js (App Router), TypeScript y PostgreSQL. Incluye cuatro fichas ficticias en soles peruanos, entre ellas un Audi Q5 y un BMW X3. Las ilustraciones son genéricas.

## Arrancar la demo

Requiere Node.js 22 o superior y npm. Desde la carpeta del proyecto:

```sh
npm ci
npm run dev
```

Abre [http://127.0.0.1:3000](http://127.0.0.1:3000). La primera visita inicializa PostgreSQL embebido con PGlite. Las fichas y favoritos se conservan en `.data/autoque` al recargar o reiniciar el servidor. Si actualizas desde la versión anterior en la misma carpeta, Autoque reutiliza `.data/autoficha` cuando aún no existe `.data/autoque`. Ejecuta una instancia de la aplicación por carpeta de datos.

## Conectar un servidor PostgreSQL

1. Para Docker, copia `.env.example` a `.env`. Activa `POSTGRES_PASSWORD` y `DATABASE_URL`, reemplaza los marcadores con una contraseña local y codifica los caracteres especiales dentro de la URL. Ejecuta `docker compose up -d --wait db`.
2. Si ya tienes un servidor PostgreSQL, configura `DATABASE_URL` en `.env.local` con una base dedicada y omite Docker.
3. Ejecuta `npm run db:init` y después `npm run dev`.

Git ignora `.env`, `.env.local` y las demás variantes locales de entorno, además de `.data/`, archivos de claves y carpetas de credenciales y respaldos. `.env.example` contiene solo marcadores. Si exportas un respaldo SQL, guárdalo dentro de `backups/` o `dumps/`.

El inicializador crea la tabla y agrega los ejemplos de forma repetible. La base embebida y la externa son independientes. Usa una base dedicada a esta demo, que funciona como un inventario local de un solo usuario.

Si ya usabas Docker con la versión anterior, detén el contenedor previo y conserva su `DATABASE_URL` y su contraseña. En `.env`, define también `POSTGRES_USER` y `POSTGRES_DB` con los valores anteriores (`autoficha` por defecto) y `POSTGRES_VOLUME` con el nombre del volumen existente. Puedes consultarlo con `docker volume ls`. Luego levanta el servicio `db`.

## Recorrido de demo

1. Busca **Audi Q5**. Revisa su versión, precio y kilometraje. Limpia la búsqueda.
2. Selecciona **Añadir a comparación** en el Audi Q5 y el BMW X3. Pulsa **Comparar** para ver las fichas en paralelo. Con los datos iniciales, la diferencia es S/ 11 400 y 15 500 km.
3. Cierra la comparación y marca el BMW como favorito. Entra a **Favoritos** y recarga para comprobar que el marcador se conserva. La recarga vuelve a la vista inicial.
4. Pulsa **Registrar auto** y agrega una ficha ficticia. Usa **Precio máximo** y **Ordenar por** para encontrarla. Recarga para comprobar que la ficha se guardó.

## Código y verificación

- `app/garage.tsx` contiene la interfaz, el formulario y la selección temporal de dos fichas.
- `app/actions.ts` valida y guarda las mutaciones mediante consultas parametrizadas.
- `lib/db.ts` elige PostgreSQL embebido o externo. Ambos usan `db/setup.sql`.
- `lib/cars.ts` contiene los filtros y el formato de unidades.
- `npm run check` comprueba TypeScript. `npm run build` genera la compilación de producción y `npm start` la sirve.

Las [tareas de sesión](SESIONES.md) se dejaron abiertas para que cada propuesta de IA parta de la misma base.
