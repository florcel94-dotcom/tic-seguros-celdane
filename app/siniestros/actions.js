"use server";
import db, { q } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { txt, esFecha, volver, ESTADOS_SINIESTRO } from "@/lib/util";

export async function guardarSiniestro(fd) {
  const id = txt(fd, "id_siniestro");
  const idPoliza = txt(fd, "id_poliza");
  const fecha = txt(fd, "fecha");
  const tipo = txt(fd, "tipo");
  const descripcion = txt(fd, "descripcion") || null;
  const estado = txt(fd, "estado");

  if (!idPoliza || !fecha || !tipo || !estado) volver("/siniestros", "error", "Póliza, fecha, tipo y estado son obligatorios.");
  if (!esFecha(fecha)) volver("/siniestros", "error", "La fecha no es válida.");
  if (!ESTADOS_SINIESTRO.includes(estado)) volver("/siniestros", "error", "Estado inválido.");
  const pol = await q("SELECT 1 FROM poliza WHERE id_poliza = ?", [idPoliza]);
  if (pol.length === 0) volver("/siniestros", "error", "La póliza seleccionada no existe.");

  if (id) {
    await db.execute({
      sql: "UPDATE siniestro SET id_poliza=?, fecha=?, tipo=?, descripcion=?, estado=? WHERE id_siniestro=?",
      args: [idPoliza, fecha, tipo, descripcion, estado, id],
    });
  } else {
    await db.execute({
      sql: "INSERT INTO siniestro (id_poliza, fecha, tipo, descripcion, estado) VALUES (?, ?, ?, ?, ?)",
      args: [idPoliza, fecha, tipo, descripcion, estado],
    });
  }
  revalidatePath("/siniestros");
  revalidatePath("/");
  volver("/siniestros", "ok", id ? "Siniestro actualizado." : "Siniestro registrado.");
}

export async function eliminarSiniestro(fd) {
  const id = txt(fd, "id_siniestro");
  await db.execute({ sql: "DELETE FROM siniestro WHERE id_siniestro = ?", args: [id] });
  revalidatePath("/siniestros");
  revalidatePath("/");
  volver("/siniestros", "ok", "Siniestro eliminado.");
}
