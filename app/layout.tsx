import type { Metadata } from "next";
import "./styles.css";

export const metadata: Metadata = {
  title: "Autoficha · Comparador de autos usados",
  description: "Registra, guarda y compara tus opciones de autos usados.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <html lang="es-PE"><body>{children}</body></html>;
}
