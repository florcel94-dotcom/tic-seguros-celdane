import { redirect } from "next/navigation";

export const ESTADOS_POLIZA = ["Vigente", "Vencida", "Cancelada"];
export const ESTADOS_SINIESTRO = ["Denunciado", "En evaluación", "Cerrado"];
export const TIPOS_SINIESTRO = [
  "Accidente laboral",
  "Accidente doméstico",
  "Accidente de tránsito",
  "Accidente deportivo",
];

export const txt = (fd, k) => String(fd.get(k) ?? "").trim();
export const esFecha = (s) => /^\d{4}-\d{2}-\d{2}$/.test(s);
export const fmt = (d) => (d ? String(d).split("-").reverse().join("/") : "");
export const slug = (s) => String(s).normalize("NFD").replace(/[^\w]/g, "").toLowerCase();

// Redirige a la pantalla con un mensaje (ok o error). Se llama FUERA de try/catch.
export function volver(ruta, tipo, mensaje) {
  redirect(`${ruta}?${tipo}=${encodeURIComponent(mensaje)}`);
}
