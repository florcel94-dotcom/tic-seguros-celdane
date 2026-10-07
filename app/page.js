import { q } from "@/lib/db";
import { ESTADOS_POLIZA } from "@/lib/util";
import { BarrasH, ColumnasV } from "./components/Graficos";

export const dynamic = "force-dynamic";

const MESES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
const etiquetaMes = (ym) => `${MESES[Number(ym.slice(5, 7)) - 1]} ${ym.slice(2, 4)}`;

// Completa con 0 los meses sin siniestros, para que el eje de tiempo no tenga huecos.
function completarMeses(filas) {
  if (filas.length === 0) return [];
  const porMes = new Map(filas.map((f) => [f.mes, Number(f.n)]));
  let [a, m] = filas[0].mes.split("-").map(Number);
  const [aFin, mFin] = filas[filas.length - 1].mes.split("-").map(Number);
  const salida = [];
  while (a < aFin || (a === aFin && m <= mFin)) {
    const ym = `${a}-${String(m).padStart(2, "0")}`;
    salida.push({ etiqueta: etiquetaMes(ym), valor: porMes.get(ym) ?? 0 });
    m++;
    if (m > 12) { m = 1; a++; }
  }
  return salida;
}

export default async function Inicio() {
  // ---------- 17. Indicadores: todo sale de la base ----------
  const [clientes] = await q("SELECT COUNT(*) AS n FROM cliente");
  const [polizas] = await q("SELECT COUNT(*) AS n FROM poliza WHERE estado = 'Vigente'");
  const [abiertos] = await q("SELECT COUNT(*) AS n FROM siniestro WHERE estado <> 'Cerrado'");
  const [cerrados] = await q("SELECT COUNT(*) AS n FROM siniestro WHERE estado = 'Cerrado'");

  const kpis = [
    ["Clientes", clientes.n],
    ["Pólizas vigentes", polizas.n],
    ["Siniestros abiertos", abiertos.n],
    ["Siniestros cerrados", cerrados.n],
  ];

  // ---------- 18. Gráficos: cada uno es una consulta SQL con GROUP BY ----------
  const filasEstado = await q("SELECT estado, COUNT(*) AS n FROM poliza GROUP BY estado");
  const filasTipo = await q("SELECT tipo, COUNT(*) AS n FROM siniestro GROUP BY tipo ORDER BY n DESC, tipo");
  const filasMes = await q("SELECT strftime('%Y-%m', fecha) AS mes, COUNT(*) AS n FROM siniestro GROUP BY mes ORDER BY mes");

  // Se muestran todos los estados posibles (aunque tengan 0) y cualquier otro que exista en la base.
  const estados = [...ESTADOS_POLIZA, ...filasEstado.map((f) => f.estado).filter((e) => !ESTADOS_POLIZA.includes(e))];
  const polizasPorEstado = estados.map((e) => ({
    etiqueta: e,
    valor: Number(filasEstado.find((f) => f.estado === e)?.n ?? 0),
  }));
  const siniestrosPorTipo = filasTipo.map((f) => ({ etiqueta: f.tipo, valor: Number(f.n) }));
  const siniestrosPorMes = completarMeses(filasMes);

  return (
    <>
      <h1>Dashboard</h1>
      <div className="kpis">
        {kpis.map(([t, n]) => (
          <div className="kpi" key={t}>
            <div className="n">{n}</div>
            <div className="t">{t}</div>
          </div>
        ))}
      </div>

      <div className="graficos">
        <BarrasH titulo="Pólizas por estado" datos={polizasPorEstado} />
        <BarrasH titulo="Siniestros por tipo" datos={siniestrosPorTipo} />
        <ColumnasV titulo="Siniestros por mes" datos={siniestrosPorMes} />
      </div>
    </>
  );
}
