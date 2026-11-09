const icons = {
  logo: <><path d="m3 14 3-6h12l3 6v5H3z"/><path d="M3 14h18M7 16h.01M17 16h.01M5 19v2m14-2v2"/></>,
  grid: <><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></>,
  heart: <path d="M20.8 8.6c0 4.3-8.8 9.8-8.8 9.8S3.2 12.9 3.2 8.6a4.5 4.5 0 0 1 8.8-1.3 4.5 4.5 0 0 1 8.8 1.3Z"/>,
  compare: <><path d="M12 3v18M5 5h2M5 19h2m10-14h2m-2 14h2M3 9v6m18-6v6"/></>,
  plus: <path d="M12 5v14M5 12h14"/>,
  search: <><circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 4 4"/></>,
  arrow: <path d="M4 12h15m-6-6 6 6-6 6"/>,
  close: <path d="m6 6 12 12M18 6 6 18"/>,
  check: <path d="m5 12 4 4L19 6"/>,
  gauge: <><path d="M4 17a8 8 0 1 1 16 0H4Z"/><path d="m12 14 3-4"/></>,
} as const;

export function Icon({ name }: { name: keyof typeof icons }) {
  return <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">{icons[name]}</svg>;
}

export function CarArt({ sample }: { sample: string | null }) {
  const paint = sample === "audi-q5" ? "#cbdccf"
    : sample === "bmw-x3" ? "#a4b9e1"
    : sample === "volvo-xc60" ? "#e4bd96"
    : sample === "mazda-cx5" ? "#deb4b4" : "#b8c9c4";
  return (
    <div className="car-art" style={{ backgroundColor: paint }}>
      <svg aria-hidden="true" viewBox="0 0 380 150">
        <path d="M0 38h380M0 76h380M0 114h380M38 0v150M76 0v150M114 0v150M152 0v150M190 0v150M228 0v150M266 0v150M304 0v150M342 0v150" stroke="#122824" opacity=".09"/>
        <circle cx="190" cy="75" r="59" fill="none" stroke="#122824" opacity=".15"/>
        <ellipse cx="190" cy="120" rx="139" ry="9" fill="#122824" opacity=".16"/>
        <path d="M60 99l5-20 35-9 40-27c9-6 19-9 30-9h49c17 0 30 5 43 15l34 25 20 9 6 25-18 8H74l-14-8z" fill="#253b39" stroke="#182b2a" strokeWidth="2"/>
        <path d="m106 72 38-25c8-5 16-7 26-7h49c15 0 27 4 39 13l25 20z" fill="#5f7778" stroke="#182b2a" strokeWidth="3"/>
        <path d="m146 49 28-6-4 28h-54zm40-6h31l12 28h-48zm43 1c12 1 22 7 30 13l17 14h-34z" fill="#9ab1af"/>
        <path d="M70 89c60-8 155-5 238-2M123 101h134M174 74l-4 28m68-28 6 28" fill="none" stroke="#718987" strokeWidth="1.6"/>
        <path d="m64 88 20-4-4 7-17 3zm236-2 15 3 2 6-19-3z" fill="#f6e5bd"/>
        <circle cx="104" cy="109" r="21" fill="#192828"/><circle cx="104" cy="109" r="12" fill="#a6b5af"/><circle cx="104" cy="109" r="5" fill="#50645e"/>
        <circle cx="279" cy="109" r="21" fill="#192828"/><circle cx="279" cy="109" r="12" fill="#a6b5af"/><circle cx="279" cy="109" r="5" fill="#50645e"/>
      </svg>
      <span>{sample ? "FICHA DEMO" : "FICHA MANUAL"}</span>
    </div>
  );
}
