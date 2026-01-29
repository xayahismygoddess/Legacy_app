# Task Manager Legacy — Next.js + Prisma

Sistema de gestión de tareas con frontend responsive, estética **liminal**, backend en Next.js API Routes y base de datos SQLite (Prisma).

## Características

- **Frontend**: Next.js 14 (App Router), React, Tailwind CSS, diseño liminal (tonos neutros, paneles translúcidos, tipografía mono).
- **Responsive**: Layout adaptado a móvil, tablet y desktop (tabs desplazables, tablas en cards en móvil).
- **Backend**: API Routes en Next.js (auth, tareas, proyectos, comentarios, historial, notificaciones, búsqueda, reportes, export CSV).
- **Base de datos**: SQLite con Prisma (users, projects, tasks, comments, history, notifications).

## Funcionalidades

1. **Autenticación**: Login con JWT en cookie (admin/admin, user1/user1, user2/user2).
2. **CRUD de tareas**: Crear, editar, eliminar; estado, prioridad, proyecto, asignado, vencimiento, horas.
3. **CRUD de proyectos**: Gestión de proyectos.
4. **Comentarios**: Comentarios por tarea.
5. **Historial**: Auditoría de cambios por tarea o global.
6. **Notificaciones**: Por usuario, marcar como leídas.
7. **Búsqueda**: Filtros por texto, estado, prioridad, proyecto.
8. **Reportes**: Tareas, proyectos, usuarios; exportar a CSV.

## Requisitos

- Node.js 18+
- npm (o pnpm/yarn)

## Instalación

```bash
npm install
npx prisma generate
npx prisma db push
npx tsx prisma/seed.ts
```

## Desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000). Inicia sesión con **admin** / **admin**.

## Build y producción

```bash
npm run build
npm start
```

El script `build` ejecuta `prisma generate` antes de `next build` (y `postinstall` también). Las API routes usan `dynamic = "force-dynamic"` para evitar errores tipo "Failed to collect page data" en Vercel.

### Deploy en Vercel

1. Conecta el repo y despliega. El build debería pasar.
2. **Importante:** SQLite (`file:./dev.db`) **no funciona** en Vercel (sistema de archivos de solo lectura). En producción las APIs que usan la DB fallarán.
3. Para producción en Vercel, usa **PostgreSQL**:
   - Crea una base en [Neon](https://neon.tech) o [Vercel Postgres](https://vercel.com/storage/postgres).
   - En `prisma/schema.prisma` cambia `provider` a `"postgresql"` y `url` a `env("DATABASE_URL")`.
   - Añade `DATABASE_URL` en las variables de entorno del proyecto en Vercel.
   - Ejecuta `npx prisma db push` y `npx tsx prisma/seed.ts` una vez contra esa DB (con `DATABASE_URL` en `.env` local).

## Estructura

```
├── app/
│   ├── api/           # API Routes (auth, tasks, projects, comments, …)
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── LoginForm.tsx
│   ├── Dashboard.tsx
│   └── tabs/          # Tasks, Projects, Comments, History, etc.
├── lib/
│   ├── prisma.ts
│   └── auth.ts
├── prisma/
│   ├── schema.prisma
│   ├── seed.ts
│   └── dev.db         # SQLite (generado)
└── package.json
```

## Notas

- Si `npm install` falla con **`only-if-cached`** (npm no puede descargar paquetes), ejecuta:
  ```bash
  npm config delete prefer-offline
  npm config set fetch-retries 5
  npm config set fetch-retry-mintimeout 20000
  ```
  y vuelve a ejecutar `npm install`.
- La base de datos por defecto es `prisma/dev.db`. Para PostgreSQL u otro motor, cambia `datasource` en `prisma/schema.prisma` y ajusta `DATABASE_URL`.
