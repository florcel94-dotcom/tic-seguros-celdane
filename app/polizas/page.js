import Link from "next/link";
import { q } from "@/lib/db";
import { fmt, slug, ESTADOS_POLIZA } from "@/lib/util";
import Aviso from "../components/Aviso";
import BotonEliminar from "../components/BotonEliminar";
import { guardarPoliza, eliminarPoliza } from "./actions";

export const dynamic = "force-dynamic";

export default async function Polizas({ searchParams }) {
  const busqueda = (searchParams.q || "").trim();
  const like = `%${busqueda}%`;

  // JOIN poliza + cliente: se muestra el nombre, no el ID
  const polizas = await q(
    `SELECT p.*, c.nombre, c.apellido
     FROM poliza p JOIN cliente c ON c.id_cliente = p.id_cliente
     WHERE p.numero_poliza LIKE ? OR c.apellido LIKE ? OR c.nombre LIKE ?
     ORDER BY p.numero_poliza`,
    [like, like, like]
  );

  // El cliente se elige desde la base (no es texto libre)
  const clientes = await q("SELECT id_cliente, nombre, apellido, dni FROM cliente ORDER BY apellido, nombre");

  const editando = searchParams.editar
    ? (await q("SELECT * FROM poliza WHERE id_poliza = ?", [searchParams.editar]))[0]
    : null;

  // Número sugerido para pólizas nuevas: AP-0011, AP-0012...
  const [{ m }] = await q("SELECT COALESCE(MAX(id_poliza), 0) AS m FROM poliza");
  const sugerido = `AP-${String(Number(m) + 1).padStart(4, "0")}`;
  const hoy = new Date().toISOString().slice(0, 10);

  return (
    <>
      <h1>Pólizas</h1>
      <Aviso sp={searchParams} />
      <div className="grid">
        <section className="panel">
          <h2>{editando ? "Editar póliza" : "Nueva póliza"}</h2>
          <form action={guardarPoliza} key={editando?.id_poliza ?? "nueva"}>
            {editando && <input type="hidden" name="id_poliza" value={editando.id_poliza} />}
            <label htmlFor="numero_poliza">Número de póliza</label>
            <input id="numero_poliza" name="numero_poliza" required defaultValue={editando?.numero_poliza ?? sugerido} />
            <label htmlFor="id_cliente">Cliente</label>
            <select id="id_cliente" name="id_cliente" required defaultValue={editando?.id_cliente ?? ""}>
              <option value="" disabled>Elegí un cliente</option>
              {clientes.map((c) => (
                <option key={c.id_cliente} value={c.id_cliente}>{c.apellido}, {c.nombre} (DNI {c.dni})</option>
              ))}
            </select>
            <div className="fila">
              <div>
                <label htmlFor="fecha_inicio">Inicio</label>
                <input id="fecha_inicio" name="fecha_inicio" type="date" required defaultValue={editando?.fecha_inicio ?? hoy} />
              </div>
              <div>
                <label htmlFor="fecha_fin">Vencimiento</label>
                <input id="fecha_fin" name="fecha_fin" type="date" required defaultValue={editando?.fecha_fin ?? ""} />
              </div>
            </div>
            <label htmlFor="estado">Estado</label>
            <select id="estado" name="estado" defaultValue={editando?.estado ?? "Vigente"}>
              {ESTADOS_POLIZA.map((e) => <option key={e}>{e}</option>)}
            </select>
            <div className="acciones">
              <button className="primario" type="submit">{editando ? "Guardar cambios" : "Guardar"}</button>
              {editando && <Link href="/polizas" className="cancelar">Cancelar</Link>}
            </div>
          </form>
        </section>

        <section>
          <form className="buscar" action="/polizas">
            <input name="q" placeholder="Buscar por número o cliente" defaultValue={busqueda} aria-label="Buscar pólizas" />
            <button type="submit">Buscar</button>
          </form>
          <div className="tabla-wrap">
            <table>
              <thead>
                <tr><th>Número</th><th>Cliente</th><th>Inicio</th><th>Vencimiento</th><th>Estado</th><th>Acciones</th></tr>
              </thead>
              <tbody>
                {polizas.length === 0 && (
                  <tr><td colSpan={6} className="vacio">No hay pólizas{busqueda ? " que coincidan con la búsqueda" : ". Creá la primera desde el formulario"}.</td></tr>
                )}
                {polizas.map((p) => (
                  <tr key={p.id_poliza}>
                    <td>{p.numero_poliza}</td>
                    <td>{p.apellido}, {p.nombre}</td>
                    <td>{fmt(p.fecha_inicio)}</td>
                    <td>{fmt(p.fecha_fin)}</td>
                    <td><span className={`badge b-${slug(p.estado)}`}>{p.estado}</span></td>
                    <td className="acc">
                      <Link className="link" href={`/polizas?editar=${p.id_poliza}`}>Editar</Link>
                      <form action={eliminarPoliza}>
                        <input type="hidden" name="id_poliza" value={p.id_poliza} />
                        <BotonEliminar mensaje={`¿Eliminar la póliza ${p.numero_poliza}?`} />
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </>
  );
}
