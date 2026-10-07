"use server";
import db, { q } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { txt, volver } from "@/lib/util";

export async function guardarCliente(fd) {
  const id = txt(fd, "id_cliente");
  const nombre = txt(fd, "nombre");
  const apellido = txt(fd, "apellido");
  const dni = txt(fd, "dni");
  const email = txt(fd, "email") || null;
  const telefono = txt(fd, "telefono") || null;

  if (!nombre || !apellido || !dni) volver("/clientes", "error", "Nombre, apellido y DNI son obligatorios.");
  if (!/^\d{7,8}$/.test(dni)) volver("/clientes", "error", "El DNI debe tener 7 u 8 números, sin puntos.");
  if (email && !/^\S+@\S+\.\S+$/.test(email)) volver("/clientes", "error", "El email no tiene un formato válido.");

  let error = null;
  try {
    if (id) {
      await db.execute({
        sql: "UPDATE cliente SET nombre=?, apellido=?, dni=?, email=?, telefono=? WHERE id_cliente=?",
        args: [nombre, apellido, dni, email, telefono, id],
      });
    } else {
      await db.execute({
        sql: "INSERT INTO cliente (nombre, apellido, dni, email, telefono) VALUES (?, ?, ?, ?, ?)",
        args: [nombre, apellido, dni, email, telefono],
      });
    }
  } catch (e) {
    if (String(e.message).includes("UNIQUE")) error = "Ya existe un cliente con ese DNI.";
    else throw e;
  }
  if (error) volver("/clientes", "error", error);

  revalidatePath("/clientes");
  volver("/clientes", "ok", id ? "Cliente actualizado." : "Cliente creado.");
}

export async function eliminarCliente(fd) {
  const id = txt(fd, "id_cliente");
  const [{ n }] = await q("SELECT COUNT(*) AS n FROM poliza WHERE id_cliente = ?", [id]);
  if (n > 0) volver("/clientes", "error", `No se puede eliminar: el cliente tiene ${n} póliza(s) asociada(s).`);

  await db.execute({ sql: "DELETE FROM cliente WHERE id_cliente = ?", args: [id] });
  revalidatePath("/clientes");
  volver("/clientes", "ok", "Cliente eliminado.");
}
