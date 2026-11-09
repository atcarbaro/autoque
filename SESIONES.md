# Tareas para las sesiones

Usa el mismo commit inicial, las mismas fichas ficticias y el mismo enunciado para cada propuesta. Conserva cada solución en una rama separada. Elige una tarea por sesión y guarda el diff, los comandos ejecutados y el resultado que puedas reproducir.

## 1. Historial de precios

**Enunciado.** Permite editar el precio de una ficha y consultar sus cambios. Trabaja sobre `db/setup.sql`, `app/actions.ts` y la interfaz del inventario. Define cómo actualizar una base que ya contiene autos de la demo o del usuario.

**Criterios de aceptación**

- Una ficha existente conserva su precio como primer registro del historial.
- Al cambiar S/ 129 900 a S/ 125 000, la ficha y el comparador muestran el valor nuevo. El historial muestra ambos importes con sus fechas.
- El precio y el historial se actualizan en una sola transacción. Una entrada inválida o un fallo de escritura conserva el estado previo.
- Guardar el mismo importe dos veces deja un solo cambio. Las fichas y los favoritos existentes sobreviven a la migración.

## 2. Cuánto falta para la inicial

**Enunciado.** Añade al comparador un cálculo con el precio de cada auto, un porcentaje de inicial y el ahorro disponible. Los importes se muestran en PEN con dos decimales.

**Criterios de aceptación**

- Para un precio de S/ 129 900, una inicial del 20 % y S/ 15 000 de ahorro, muestra una inicial de S/ 25 980 y un faltante de S/ 10 980.
- Si el ahorro supera la inicial, el faltante es S/ 0,00.
- Un porcentaje fuera de 0 a 100 o un ahorro negativo muestra una indicación junto al campo y evita mostrar un cálculo inválido.
- Cambiar la selección actualiza el cálculo para ambos autos con los valores ingresados.

## 3. Pruebas automatizadas para los filtros

**Enunciado.** Añade pruebas para `filterCars` en `lib/cars.ts` y un comando `npm test` reproducible sin base de datos.

**Criterios de aceptación**

- Cubre búsqueda con tildes, diferencias de mayúsculas y varios términos.
- Cubre coincidencia de marca, límite de precio inclusivo, combinación de filtros con favoritos y ausencia de resultados.
- Cubre los tres modos de orden, los empates y que la colección de entrada conserve su orden.
- Incluye al menos una prueba que falle si el límite inclusivo cambia por uno estricto.

## Evaluación de propuestas

Registra qué criterios pasan, qué pasos permiten reproducirlos y qué decisiones introdujo cada propuesta. Compara el comportamiento con datos existentes y el alcance del diff. Estas tareas sirven para preparar sesiones de práctica. La aprobación del repositorio y los términos del programa dependen de Alignerr.
