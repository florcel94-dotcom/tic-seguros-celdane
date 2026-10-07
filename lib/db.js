import { createClient } from "@libsql/client";

// Local: archivo seguros.db. Publicado: Turso (variables de entorno).
const db = createClient({
  url: process.env.TURSO_DATABASE_URL || "file:seguros.db",
  authToken: process.env.TURSO_AUTH_TOKEN,
});

export default db;

// SELECT rápido: devuelve un array de filas (objetos).
export async function q(sql, args = []) {
  const res = await db.execute({ sql, args });
  return res.rows;
}
