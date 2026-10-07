import Link from "next/link";
import { q } from "@/lib/db";
import { fmt, slug, ESTADOS_SINIESTRO, TIPOS_SINIESTRO } from "@/lib/util";
import Aviso from "../components/Aviso";
import BotonEliminar from "../components/BotonEliminar";
import { guardarSiniestro, eliminarSiniestro } from "./actions";

export const dynamic = "force-dynamic";

export default async function Siniestros({ searchParams }) {
  const busqueda = (searchParams.q || "").trim();
  const filtroEstado = searchParams.estado || "";
  const like = `%${busqueda}%`;

  // JOIN siniestro + póliza + cliente
  const siniestros = await q(
    `SELECT s.*, p.numero_poliza, c.nombre, c.apellido
     FROM siniestro s
     JOIN poliza p ON p.id_poliza = s.id_poliza
     JOIN cliente c ON c.id_cliente = p.id_cliente
     WHERE (p.numero_poliza LIKE ? OR c.apellido LIKE ? OR s.tipo LIKE ? OR s.descripcion LIKE ?)
       AND (? = '' OR s.estado = ?)
     ORDER BY s.fecha DESC, s.id_siniestro DESC`,
    [like, like, like, like, filtroEstado, filtroEstado]
  );

  // La póliza se elige de la base
  const polizas = await q(
    `SELECT p.id_poliza, p.numero_poliza, c.apellido, c.nombre
     FROM poliza p JOIN cliente c ON c.id_cliente = p.id_cliente
     ORDER BY p.numero_poliza`
  );

  const editando = searchParams.editar
    ? (await q("SELECT * FROM siniestro WHERE id_siniestro = ?", [searchParams.editar]))[0]
    : null;

  const tipos = editando && !TIPOS_SINIESTRO.includes(editando.tipo) ? [...TIPOS_SINIESTRO, editando.tipo] : TIPOS_SINIESTRO;
  const hoy = new Date().toISOString().slice(0, 10);

  return (
    <>
      <h1>Siniestros</h1>
      <Aviso sp={searchParams} />
      <div className="grid">
        <section className="panel">
          <h2>{editando ? "Editar siniestro" : "Registrar siniestro"}</h2>
          <form action={guardarSiniestro} key={editando?.id_siniestro ?? "nuevo"}>
            {editando && <input type="hidden" name="id_siniestro" value={editando.id_siniestro} />}
            <label htmlFor="id_poliza">Póliza</label>
            <select id="id_poliza" name="id_poliza" required defaultValue={editando?.id_poliza ?? ""}>
              <option value="" disabled>Elegí una póliza</option>
              {polizas.map((p) => (
                <option key={p.id_poliza} value={p.id_poliza}>{p.numero_poliza} — {p.apellido}, {p.nombre}</option>
              ))}
            </select>
            <label htmlFor="fecha">Fecha</label>
            <input id="fecha" name="fecha" type="date" required defaultValue={editando?.fecha ?? hoy} />
            <label htmlFor="tipo">Tipo</label>
            <select id="tipo" name="tipo" required defaultValue={editando?.tipo ?? ""}>
              <option value="" disabled>Elegí un tipo</option>
              {tipos.map((t) => <option key={t}>{t}</option>)}
            </select>
            <label htmlFor="descripcion">Descripción</label>
            <textarea id="descripcion" name="descripcion" defaultValue={editando?.descripcion ?? ""} />
            <label htmlFor="estado">Estado</label>
            <select id="estado" name="estado" defaultValue={editando?.estado ?? "Denunciado"}>
              {ESTADOS_SINIESTRO.map((e) => <option key={e}>{e}</option>)}
            </select>
            <div className="acciones">
              <button className="primario" type="submit">{editando ? "Guardar cambios" : "Guardar"}</button>
              {editando && <Link href="/siniestros" className="cancelar">Cancelar</Link>}
            </div>
          </form>
        </section>

        <section>
          <form className="buscar" action="/siniestros">
            <input name="q" placeholder="Buscar por póliza, apellido, tipo o descripción" defaultValue={busqueda} aria-label="Buscar siniestros" />
            <select name="estado" defaultValue={filtroEstado} aria-label="Filtrar por estado" style={{ width: "auto" }}>
              <option value="">Todos los estados</option>
              {ESTADOS_SINIESTRO.map((e) => <option key={e}>{e}</option>)}
            </select>
            <button type="submit">Buscar</button>
          </form>
          <div className="tabla-wrap">
            <table>
              <thead>
                <tr><th>Fecha</th><th>Póliza</th><th>Cliente</th><th>Tipo</th><th>Descripción</th><th>Estado</th><th>Acciones</th></tr>
              </thead>
              <tbody>
                {siniestros.length === 0 && (
                  <tr><td colSpan={7} className="vacio">No hay siniestros{busqueda || filtroEstado ? " con ese filtro" : " registrados"}.</td></tr>
                )}
                {siniestros.map((s) => (
                  <tr key={s.id_siniestro}>
                    <td>{fmt(s.fecha)}</td>
                    <td>{s.numero_poliza}</td>
                    <td>{s.apellido}, {s.nombre}</td>
                    <td>{s.tipo}</td>
                    <td>{s.descripcion}</td>
                    <td><span className={`badge b-${slug(s.estado)}`}>{s.estado}</span></td>
                    <td className="acc">
                      <Link className="link" href={`/siniestros?editar=${s.id_siniestro}`}>Editar</Link>
                      <form action={eliminarSiniestro}>
                        <input type="hidden" name="id_siniestro" value={s.id_siniestro} />
                        <BotonEliminar mensaje="¿Eliminar este siniestro?" />
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
