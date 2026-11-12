# TIC Seguros – Seguros de Accidentes Personales

Aplicación web para gestionar una cartera de seguros de accidentes personales. Permite administrar clientes, pólizas y siniestros, y visualizar los indicadores principales en un dashboard. Desarrollada de forma individual con Next.js 14 y una base de datos SQLite/libSQL (Turso), y publicada online con Vercel.

🔗 **Demo online:** https://tic-seguros-celdane.vercel.app/

![Dashboard](docs/dashboard.png)

## Qué hace

- **Dashboard:** muestra la cantidad de clientes, pólizas vigentes y siniestros abiertos y cerrados, junto con la distribución de pólizas por estado y de siniestros por tipo y por mes.
- **Clientes:** alta, búsqueda, consulta, edición y baja de clientes (nombre, DNI, email y teléfono), con la cantidad de pólizas de cada uno.
- **Pólizas:** registro de pólizas asociadas a un cliente, con fechas de inicio y vencimiento y estado (vigente, vencida o cancelada).
- **Siniestros:** registro de siniestros asociados a una póliza, con tipo (laboral, doméstico, de tránsito o deportivo), descripción y estado (denunciado, en evaluación o cerrado), con filtro por estado.

## Tecnologías

Next.js 14 (App Router) · JavaScript · SQL · SQLite/libSQL · Turso · Vercel

## Sobre los datos

Los datos cargados son de ejemplo y no corresponden a personas reales.

## Mi rol

Proyecto realizado de forma individual: diseño de la base de datos y sus relaciones (clientes, pólizas y siniestros), consultas SQL, desarrollo de la aplicación y publicación online.

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
