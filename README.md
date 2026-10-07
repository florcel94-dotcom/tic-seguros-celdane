# TIC Seguros – Seguros de Accidentes Personales

App Next.js 14 (App Router) + SQLite/libSQL.

## Correr en tu PC
```
npm install
npm run dev
```
Abrir http://localhost:3000. Sin variables de entorno usa el archivo `seguros.db` de la raíz.

## Publicar (Vercel + Turso)
1. Crear la base en Turso y subir los datos:
   `turso db create seguros --from-file seguros.db`
2. Obtener URL y token: `turso db show seguros --url` y `turso db tokens create seguros`
3. En Vercel > Settings > Environment Variables cargar `TURSO_DATABASE_URL` y `TURSO_AUTH_TOKEN`.
4. Subir el repo a GitHub, importarlo en Vercel y hacer Deploy.

## Estructura
- `lib/db.js`         conexión (local o Turso)
- `app/*/page.js`     pantallas (SELECT)
- `app/*/actions.js`  operaciones de escritura (INSERT / UPDATE / DELETE)
