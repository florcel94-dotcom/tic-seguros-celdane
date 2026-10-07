"use server";
import db, { q } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { txt, esFecha, volver, ESTADOS_POLIZA } from "@/lib/util";

export async function guardarPoliza(fd) {
  const id = txt(fd, "id_poliza");
  const numero = txt(fd, "numero_poliza");
  const idCliente = txt(fd, "id_cliente");
  const inicio = txt(fd, "fecha_inicio");
  const fin = txt(fd, "fecha_fin");
  const estado = txt(fd, "estado");

  if (!numero || !idCliente || !inicio || !fin || !estado) volver("/polizas", "error", "Completá todos los campos.");
  if (!esFecha(inicio) || !esFecha(fin)) volver("/polizas", "error", "Las fechas no son válidas.");
  if (fin < inicio) volver("/polizas", "error", "El vencimiento no puede ser anterior al inicio.");
  if (!ESTADOS_POLIZA.includes(estado)) volver("/polizas", "error", "Estado inválido.");
  const cli = await q("SELECT 1 FROM cliente WHERE id_cliente = ?", [idCliente]);
  if (cli.length === 0) volver("/polizas", "error", "El cliente seleccionado no existe.");

  let error = null;
  try {
    if (id) {
      await db.execute({
        sql: "UPDATE poliza SET numero_poliza=?, id_cliente=?, fecha_inicio=?, fecha_fin=?, estado=? WHERE id_poliza=?",
        args: [numero, idCliente, inicio, fin, estado, id],
      });
    } else {
      await db.execute({
        sql: "INSERT INTO poliza (numero_poliza, id_cliente, fecha_inicio, fecha_fin, estado) VALUES (?, ?, ?, ?, ?)",
        args: [numero, idCliente, inicio, fin, estado],
      });
    }
  } catch (e) {
    if (String(e.message).includes("UNIQUE")) error = "Ya existe una póliza con ese número.";
    else throw e;
  }
  if (error) volver("/polizas", "error", error);

  revalidatePath("/polizas");
  volver("/polizas", "ok", id ? "Póliza actualizada." : "Póliza creada.");
}

export async function eliminarPoliza(fd) {
  const id = txt(fd, "id_poliza");
  const [{ s }] = await q("SELECT COUNT(*) AS s FROM siniestro WHERE id_poliza = ?", [id]);
  const [{ p }] = await q("SELECT COUNT(*) AS p FROM pago WHERE id_poliza = ?", [id]);
  if (s > 0 || p > 0) {
    volver("/polizas", "error", `No se puede eliminar: tiene ${s} siniestro(s) y ${p} pago(s). Para darla de baja, editá su estado a "Cancelada".`);
  }
  // Se borran primero las coberturas asignadas (tabla puente) y después la póliza.
  await db.batch(
    [
      { sql: "DELETE FROM poliza_cobertura WHERE id_poliza = ?", args: [id] },
      { sql: "DELETE FROM poliza WHERE id_poliza = ?", args: [id] },
    ],
    "write"
  );
  revalidatePath("/polizas");
  volver("/polizas", "ok", "Póliza eliminada.");
}
