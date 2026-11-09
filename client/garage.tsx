import { useMutation, useMutationState, useQueryClient } from "@tanstack/react-query";
import { useRef, useState, type FormEvent } from "react";
import { ApiError, carsKey, createCar, setFavorite, type FavoriteChange } from "./api";
import { CarArt, Icon } from "./art";
import { filterCars, formatKm, formatPrice, type Car, type CarFilters } from "../lib/cars";

const defaults: CarFilters = { search: "", make: "", maxPrice: "", favoritesOnly: false, sort: "recent" };
const name = (car: Car) => car.make + " " + car.model;
const favoriteKey = ["cars", "favorite"] as const;

export default function Garage({ cars }: { cars: Car[] }) {
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState(defaults);
  const [selected, setSelected] = useState<number[]>([]);
  const [notice, setNotice] = useState("");
  const addDialog = useRef<HTMLDialogElement>(null);
  const compareDialog = useRef<HTMLDialogElement>(null);

  const registration = useMutation({
    mutationFn: createCar,
    onSuccess: async (car) => {
      await queryClient.cancelQueries({ queryKey: carsKey });
      queryClient.setQueryData<Car[]>(carsKey, (current = []) => [car, ...current.filter(({ id }) => id !== car.id)]);
      setFilters(defaults);
      setNotice(name(car) + " se agregó a tus autos.");
    },
  });
  const favorite = useMutation({
    mutationKey: favoriteKey,
    mutationFn: setFavorite,
    onSuccess: async (car) => {
      await queryClient.cancelQueries({ queryKey: carsKey });
      queryClient.setQueryData<Car[]>(carsKey, (current) => current?.map((item) => item.id === car.id ? car : item));
      setNotice(car.favorite ? name(car) + " se guardó en favoritos." : name(car) + " se quitó de favoritos.");
    },
    onError: (error) => setNotice(error instanceof ApiError
      ? error.message
      : "Se interrumpió la conexión. Actualiza la página y vuelve a intentarlo."),
  });
  const pending = useMutationState({
    filters: { mutationKey: favoriteKey, exact: true, status: "pending" },
    select: ({ state }) => (state.variables as FavoriteChange).id,
  });
  const saving = registration.isPending;
  const formError = registration.isError && (registration.error instanceof ApiError
    ? registration.error.message
    : "Se interrumpió la conexión. Cierra y actualiza la página para comprobar si se guardó la ficha.");

  const favorites = cars.filter((car) => car.favorite).length;
  const makes = [...new Set(cars.map((car) => car.make))].sort((a, b) => a.localeCompare(b, "es"));
  const visible = filterCars(cars, filters);
  const comparison = selected.flatMap((id) => cars.filter((car) => car.id === id));
  const [left, right] = comparison;

  function changeFilter<K extends keyof CarFilters>(key: K, value: CarFilters[K]) {
    setFilters((current) => ({ ...current, [key]: value }));
  }

  function choose(id: number) {
    if (selected.includes(id)) {
      setSelected(selected.filter((other) => other !== id));
      setNotice("");
    } else if (selected.length < 2) {
      setSelected([...selected, id]);
      setNotice("");
    } else {
      setNotice("Ya elegiste dos autos. Quita uno para cambiar la selección.");
    }
  }

  function openRegistration() {
    registration.reset();
    addDialog.current?.showModal();
  }

  function register(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    registration.mutate(new FormData(form), {
      onSuccess: () => {
        form.reset();
        addDialog.current?.close();
      },
    });
  }

  return (
    <div className="workspace">
      <aside className="sidebar">
        <div className="brand"><span className="brand-icon"><Icon name="logo" /></span><div>autoque<span>MI GARAJE DIGITAL</span></div></div>
        <nav aria-label="Vistas de inventario">
          <p>ESPACIO DE TRABAJO</p>
          <button aria-pressed={!filters.favoritesOnly} onClick={() => changeFilter("favoritesOnly", false)}><Icon name="grid" />Mis autos <span>{cars.length}</span></button>
          <button aria-pressed={filters.favoritesOnly} onClick={() => changeFilter("favoritesOnly", true)}><Icon name="heart" />Favoritos <span>{favorites}</span></button>
        </nav>
        <div className="side-note"><span className="dot" /> Entorno de demo<br/><small>Vehículos de ejemplo ficticios</small></div>
      </aside>

      <main className="main">
        <header className="top"><span>GARAJE<span className="slash">/</span> INVENTARIO</span><span className="currency">PE · PEN</span></header>
        <div className="content">
          <section className="hero" aria-labelledby="hero-title">
            <div>
              <p className="eyebrow"><span className="dot" /> COMPARADOR DE AUTOS USADOS</p>
              <h1 id="hero-title">Tu próximo auto.</h1>
              <p>Registra las opciones que estás viendo, guarda tus favoritas y pon dos fichas lado a lado antes de decidir.</p>
              <button className="primary" onClick={openRegistration}><Icon name="plus" /> Registrar auto</button>
            </div>
            <div className="hero-index" aria-hidden="true">
              <span className="hero-index-tag">AUTOQUE / 01</span>
              <svg viewBox="0 0 220 134"><circle cx="110" cy="67" r="45"/><circle cx="110" cy="67" r="60" strokeDasharray="2 5"/><path d="M10 67h200M110 5v124M40 105h140M40 30h140"/><path d="m77 66 12-22h42l12 22v22H77zM77 66h66M86 74h6m36 0h6m-50 14v9m52-9v9"/></svg>
              <span>REGISTRA · GUARDA · COMPARA</span>
            </div>
          </section>

          <section aria-labelledby="inventory-title">
            <div className="section-head">
              <div><p className="eyebrow">INVENTARIO PERSONAL</p><h2 id="inventory-title">{filters.favoritesOnly ? "Favoritos" : "Mis autos"}</h2></div>
              <span className="inventory-count" aria-live="polite">{visible.length} {visible.length === 1 ? "ficha" : "fichas"}</span>
            </div>

            <div className="filters">
              <label className="search"><span>Buscar</span><div><Icon name="search" /><input placeholder="Marca, modelo, versión o año" value={filters.search} onChange={(e) => changeFilter("search", e.target.value)} /></div></label>
              <label>Marca<select value={filters.make} onChange={(e) => changeFilter("make", e.target.value)}><option value="">Todas</option>{makes.map((make) => <option key={make}>{make}</option>)}</select></label>
              <label>Precio máximo (S/)<input type="number" min="0" step="0.01" placeholder="Sin límite" value={filters.maxPrice} onChange={(e) => changeFilter("maxPrice", e.target.value)} /></label>
              <label>Ordenar por<select value={filters.sort} onChange={(e) => changeFilter("sort", e.target.value as CarFilters["sort"])}><option value="recent">Más recientes</option><option value="price">Menor precio</option><option value="mileage">Menor kilometraje</option></select></label>
            </div>

            {visible.length > 0 ? <div className="cards">{visible.map((car) => {
              const checked = selected.includes(car.id);
              return (
                <article className="card" key={car.id} data-selected={checked}>
                  <div className="art-wrap">
                    <CarArt sample={car.sample_key} />
                    <button className="heart icon-button" aria-pressed={car.favorite} aria-label={"Favorito: " + name(car)} disabled={pending.includes(car.id)} onClick={() => favorite.mutate({ id: car.id, favorite: !car.favorite })}><Icon name="heart" /></button>
                  </div>
                  <div className="card-content">
                    <p className="car-year">{car.year}</p>
                    <h3>{name(car)}</h3>
                    <p className="trim">{car.trim}</p>
                    <div className="stats"><strong>{formatPrice(car.price_cents)}</strong><span><Icon name="gauge" />{formatKm(car.mileage)}</span></div>
                    <button className="select-car" aria-pressed={checked} aria-label={"Comparar " + name(car)} onClick={() => choose(car.id)}><Icon name={checked ? "check" : "plus"} />{checked ? "Seleccionado" : "Añadir a comparación"}</button>
                  </div>
                </article>
              );
            })}</div> : (
              <div className="empty"><h3>Sin resultados</h3><p>Prueba con otros filtros o registra una nueva opción.</p><button className="secondary" onClick={() => setFilters({ ...defaults, favoritesOnly: filters.favoritesOnly })}>Limpiar filtros</button></div>
            )}
          </section>
        </div>

        <div className="dock">
          <p className="notice" role="status">{notice}</p>
          <div className="dock-inner">
            <div className="dock-label"><span className="dock-icon"><Icon name="compare" /></span><div><strong>Comparación</strong><small>{selected.length} de 2 seleccionados</small></div></div>
            <div className="slots">{[0, 1].map((index) => {
              const car = comparison[index];
              return car ? <button className="slot filled" key={index} onClick={() => choose(car.id)} aria-label={"Quitar " + name(car)}>{name(car)}<Icon name="close" /></button>
                : <span className="slot" key={index}>Opción {index + 1}</span>;
            })}</div>
            <button className="primary" disabled={!right} onClick={() => compareDialog.current?.showModal()}>Comparar <Icon name="arrow" /></button>
          </div>
        </div>
      </main>

      <dialog ref={addDialog} aria-labelledby="register-title" onCancel={(event) => { if (saving) event.preventDefault(); }}>
        <div className="dialog-head"><div><p className="eyebrow">NUEVA FICHA</p><h2 id="register-title">Registrar auto</h2></div><button className="icon-button" aria-label="Cerrar registro" disabled={saving} onClick={() => addDialog.current?.close()}><Icon name="close" /></button></div>
        <form onSubmit={register}>
          <div className="form-grid">
            <label>Marca<input name="make" maxLength={40} required placeholder="Audi" autoFocus /></label>
            <label>Modelo<input name="model" maxLength={40} required placeholder="Q5" /></label>
            <label className="full">Versión<input name="trim" maxLength={80} required placeholder="45 TFSI quattro" /></label>
            <label>Año<input name="year" type="number" min={1900} max={2100} step={1} required placeholder="2021" /></label>
            <label>Precio (S/)<input name="price" type="number" min="0.01" max="9999999.99" step="0.01" required placeholder="129900" /></label>
            <label>Kilometraje (km)<input name="mileage" type="number" min={0} max={2999999} step={1} required placeholder="48200" /></label>
          </div>
          {formError && <p className="form-error" role="alert">{formError}</p>}
          <div className="dialog-foot"><button className="secondary" type="button" disabled={saving} onClick={() => addDialog.current?.close()}>Cancelar</button><button className="primary" disabled={saving}>{saving ? "Guardando…" : "Guardar auto"}</button></div>
        </form>
      </dialog>

      <dialog className="compare-dialog" ref={compareDialog} aria-labelledby="compare-title">
        <div className="dialog-head"><div><p className="eyebrow">LADO A LADO</p><h2 id="compare-title">Comparar autos</h2></div><button className="icon-button" aria-label="Cerrar comparación" onClick={() => compareDialog.current?.close()}><Icon name="close" /></button></div>
        {left && right && <>
          <table className="comparison">
            <thead><tr><th scope="col">Ficha</th><th scope="col">{name(left)}</th><th scope="col">{name(right)}</th></tr></thead>
            <tbody>
              <tr><th scope="row">Versión</th><td>{left.trim}</td><td>{right.trim}</td></tr>
              <tr><th scope="row">Año</th><td>{left.year}</td><td>{right.year}</td></tr>
              <tr><th scope="row">Precio</th><td data-lower={left.price_cents < right.price_cents}>{formatPrice(left.price_cents)}</td><td data-lower={right.price_cents < left.price_cents}>{formatPrice(right.price_cents)}</td></tr>
              <tr><th scope="row">Kilometraje</th><td data-lower={left.mileage < right.mileage}>{formatKm(left.mileage)}</td><td data-lower={right.mileage < left.mileage}>{formatKm(right.mileage)}</td></tr>
            </tbody>
          </table>
          <div className="differences">
            <span>Diferencia de precio<strong>{formatPrice(Math.abs(left.price_cents - right.price_cents))}</strong></span>
            <span>Diferencia de kilometraje<strong>{formatKm(Math.abs(left.mileage - right.mileage))}</strong></span>
          </div>
        </>}
      </dialog>
    </div>
  );
}
