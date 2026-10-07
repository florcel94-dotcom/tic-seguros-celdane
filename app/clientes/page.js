import Link from "next/link";
import { q } from "@/lib/db";
import { fmt, slug } from "@/lib/util";
import Aviso from "../components/Aviso";
import BotonEliminar from "../components/BotonEliminar";
import { guardarCliente, eliminarCliente } from "./actions";

export const dynamic = "force-dynamic";

export default async function Clientes({ searchParams }) {
  const busqueda = (searchParams.q || "").trim();
  const like = `%${busqueda}%`;

  // READ (listado + búsqueda)
  const clientes = await q(
    `SELECT c.*, (SELECT COUNT(*) FROM poliza p WHERE p.id_cliente = c.id_cliente) AS polizas
     FROM cliente c
     WHERE c.nombre LIKE ? OR c.apellido LIKE ? OR c.dni LIKE ? OR c.email LIKE ?
     ORDER BY c.apellido, c.nombre`,
    [like, like, like, like]
  );

  // READ (un registro) para precargar el formulario de edición
  const editando = searchParams.editar
    ? (await q("SELECT * FROM cliente WHERE id_cliente = ?", [searchParams.editar]))[0]
    : null;

  // READ (detalle de un cliente + sus pólizas)
  const ver = searchParams.ver
    ? (await q("SELECT * FROM cliente WHERE id_cliente = ?", [searchParams.ver]))[0]
    : null;
  const polizasDelCliente = ver
    ? await q("SELECT numero_poliza, fecha_inicio, fecha_fin, estado FROM poliza WHERE id_cliente = ? ORDER BY fecha_inicio", [ver.id_cliente])
    : [];

  return (
    <>
      <h1>Clientes</h1>
      <Aviso sp={searchParams} />
      <div className="grid">
        <section className="panel">
          <h2>{editando ? "Editar cliente" : "Nuevo cliente"}</h2>
          <form action={guardarCliente} key={editando?.id_cliente ?? "nuevo"}>
            {editando && <input type="hidden" name="id_cliente" value={editando.id_cliente} />}
            <label htmlFor="nombre">Nombre</label>
            <input id="nombre" name="nombre" required defaultValue={editando?.nombre ?? ""} />
            <label htmlFor="apellido">Apellido</label>
            <input id="apellido" name="apellido" required defaultValue={editando?.apellido ?? ""} />
            <label htmlFor="dni">DNI</label>
            <input id="dni" name="dni" required inputMode="numeric" defaultValue={editando?.dni ?? ""} />
            <label htmlFor="email">Email</label>
            <input id="email" name="email" type="email" defaultValue={editando?.email ?? ""} />
            <label htmlFor="telefono">Teléfono</label>
            <input id="telefono" name="telefono" defaultValue={editando?.telefono ?? ""} />
            <div className="acciones">
              <button className="primario" type="submit">{editando ? "Guardar cambios" : "Guardar"}</button>
              {editando && <Link href="/clientes" className="cancelar">Cancelar</Link>}
            </div>
          </form>

          {ver && (
            <dl className="detalle" style={{ marginTop: "1.5rem", borderTop: "1px solid var(--linea)", paddingTop: "1rem" }}>
              <h2>{ver.apellido}, {ver.nombre}</h2>
              <dt>DNI</dt><dd>{ver.dni}</dd>
              <dt>Email</dt><dd>{ver.email || "—"}</dd>
              <dt>Teléfono</dt><dd>{ver.telefono || "—"}</dd>
              <dt>Pólizas</dt>
              <dd>
                {polizasDelCliente.length === 0 && "Sin pólizas"}
                {polizasDelCliente.map((p) => (
                  <div key={p.numero_poliza}>
                    {p.numero_poliza} · {fmt(p.fecha_inicio)} a {fmt(p.fecha_fin)}{" "}
                    <span className={`badge b-${slug(p.estado)}`}>{p.estado}</span>
                  </div>
                ))}
              </dd>
            </dl>
          )}
        </section>

        <section>
          <form className="buscar" action="/clientes">
            <input name="q" placeholder="Buscar por nombre, apellido, DNI o email" defaultValue={busqueda} aria-label="Buscar clientes" />
            <button type="submit">Buscar</button>
          </form>
          <div className="tabla-wrap">
            <table>
              <thead>
                <tr><th>Apellido y nombre</th><th>DNI</th><th>Email</th><th>Teléfono</th><th>Pólizas</th><th>Acciones</th></tr>
              </thead>
              <tbody>
                {clientes.length === 0 && (
                  <tr><td colSpan={6} className="vacio">No hay clientes{busqueda ? " que coincidan con la búsqueda" : ". Cargá el primero desde el formulario"}.</td></tr>
                )}
                {clientes.map((c) => (
                  <tr key={c.id_cliente}>
                    <td>{c.apellido}, {c.nombre}</td>
                    <td>{c.dni}</td>
                    <td>{c.email}</td>
                    <td>{c.telefono}</td>
                    <td>{c.polizas}</td>
                    <td className="acc">
                      <Link className="link" href={`/clientes?ver=${c.id_cliente}`}>Ver</Link>
                      <Link className="link" href={`/clientes?editar=${c.id_cliente}`}>Editar</Link>
                      <form action={eliminarCliente}>
                        <input type="hidden" name="id_cliente" value={c.id_cliente} />
                        <BotonEliminar mensaje={`¿Eliminar a ${c.nombre} ${c.apellido}?`} />
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
