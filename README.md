# SnipLink — Link Shortener

A minimal, fast full-stack link shortener with authentication, dashboard, and click analytics.

Shorten long URLs into shareable short links (`http://localhost:4000/:sc`), manage them from a Nuxt dashboard, and track clicks on every redirect.

## Features

- **Auth** – Register / login with email + password (bcrypt-hashed, JWT `access_token`)
- **Shorten URLs** – `POST /api/links` generates a collision-checked `base64url` short code
- **302 Redirects** – `GET /:sc` redirects to the original URL and increments `clicks`
- **Dashboard** – List, create, copy, delete links; stats cards (total links / total clicks)
- **Per-user isolation** – All link queries are scoped to `user_id`; delete uses ownership check
- **Validation** – Zod schemas on every body + param (`z.email()`, `z.url()`, id coercion)
- **Security** – Helmet headers, CORS allowlist, JWT auth middleware, 1 MB JSON limit

## Tech Stack

| Layer | Tech |
|---|---|
| Frontend (`/client`) | Nuxt 3.19, Vue 3.5, Nuxt UI 3.3, `$fetch`, TypeScript (strict) |
| Backend (`/server`) | Express 5, TypeScript, Prisma 7, Zod 4, `jsonwebtoken`, `bcryptjs`, `helmet`, `cors` |
| Database | PostgreSQL 17 (Docker Compose), Prisma migrations |
| Auth | JWT Bearer token, persisted in `localStorage` (`sniplink_token` / `sniplink_user`) |

## Monorepo Structure

```
link-shortener/
├── README.md              # this file
├── client/                # Nuxt 3 frontend (port 3001)
│   ├── pages/             # index.vue (dashboard), login.vue, register.vue
│   ├── components/        # CreateLinkForm, LinkList, StatsCards, AppHeader
│   ├── composables/       # useAuth, useApi ($fetch wrapper), useLinks
│   ├── middleware/        # auth.ts, guest.ts
│   ├── layouts/           # default.vue, auth.vue
│   ├── types/             # ApiUser, LinkItem
│   └── nuxt.config.ts     # apiBase / shortBase runtimeConfig
└── server/                # Express API (port 4000)
    ├── src/
    │   ├── app.ts         # helmet, cors, routes
    │   ├── server.ts      # listen(PORT)
    │   ├── config/env.ts  # PORT, JWT_SECRET, DATABASE_URL, CORS_ORIGINS
    │   ├── routes/        # auth.routes.ts, link.routes.ts
    │   ├── controllers/   # auth.controller.ts, link.controller.ts
    │   ├── services/      # auth.service.ts, link.service.ts
    │   ├── middlewares/   # auth.middleware.ts, validate.middleware.ts
    │   ├── validators/    # auth.validators.ts, link.validators.ts
    │   └── lib/prisma.ts
    ├── prisma/
    │   ├── schema.prisma  # User, Link models
    │   └── migrations/
    ├── docker-compose.yml # Postgres 17
    └── prisma7.config.ts
```

## Prerequisites

- Node.js 20+ and npm
- Docker + Docker Compose (for Postgres)
- Ports free: `4000` (API), `3001` (client), `5432` (Postgres)

## Quickstart

### 1. Start Postgres

```bash
cd server
docker compose up -d
```

This creates database `link_shortener` (`postgres/postgres`).

### 2. Configure the server

```bash
cd server
cp .env.example .env
```

Edit `server/.env`:

```env
PORT=4000
JWT_SECRET=your-long-random-secret
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/link_shortener
```

### 3. Migrate + run the API

```bash
cd server
npm install
npx prisma migrate dev
npm run dev
# App is Running on the port: 4000
```

Health check: `GET http://localhost:4000/api/health` → `{ "message": "ok" }`

### 4. Configure + run the client

```bash
cd client
cp .env.example .env
npm install
npm run dev
# Nuxt on http://localhost:3001
```

`client/.env`:

```env
NUXT_PUBLIC_API_BASE=http://localhost:4000
NUXT_PUBLIC_SHORT_BASE=http://localhost:4000
```

> `SHORT_BASE` is usually identical to `API_BASE` because redirects live at the server root (`GET /:sc`).

Open http://localhost:3001 → register → dashboard → shorten a URL.

## Environment Variables

**`server/.env`:**

| Var | Required | Default | Description |
|---|---|---|---|
| `PORT` | no | `4000` | Express listen port |
| `JWT_SECRET` | yes | – | Secret for signing `access_token` |
| `DATABASE_URL` | yes | – | Postgres connection string (Prisma) |
| `CORS_ORIGINS` | no (hardcoded `*` in `src/config/env.ts`) | `*` | `*` = allow all (dev); otherwise comma/allowlist check in `app.ts` |

**`client/.env`:**

| Var | Default | Description |
|---|---|---|
| `NUXT_PUBLIC_API_BASE` | `http://localhost:4000` | Base URL for `$fetch` API client |
| `NUXT_PUBLIC_SHORT_BASE` | `http://localhost:4000` | Origin used to display/copy short links |

## API Reference

Base URL: `http://localhost:4000`. Authenticated routes require `Authorization: Bearer <access_token>`.

| Method | Endpoint | Auth | Body | Response |
|---|---|---|---|---|
| `GET` | `/api/health` | no | – | `200 { message: "ok" }` |
| `POST` | `/api/auth/register` | no | `{ email, password(min 8) }` | `201 { data: { user, access_token }, message }` |
| `POST` | `/api/auth/login` | no | `{ email, password }` | `200 { data: { user, access_token }, message }` |
| `GET` | `/api/links` | yes | – | `200 { data: { results: Link[] } }` (newest first) |
| `POST` | `/api/links` | yes | `{ original_url: "https://..." }` | `201 { data: Link }` |
| `DELETE` | `/api/links/:id` | yes | – | `200 { message: "Deleted", data: null }` |
| `GET` | `/:sc` | no | – | `302` redirect to `original_url` (increments `clicks`); `404` if unknown |

**`Link` shape:**

```json
{
  "id": 1,
  "user_id": 1,
  "original_url": "https://example.com/long/path",
  "short_code": "aB3dEfGh",
  "short_link": "http://localhost:4000/aB3dEfGh",
  "clicks": 0,
  "expires_at": null,
  "created_at": "2026-09-22T00:00:00.000Z",
  "updated_at": "2026-09-22T00:00:00.000Z"
}
```

### cURL examples

```bash
# Register
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"dev@example.com","password":"password123"}'

# Create a link
curl -X POST http://localhost:4000/api/links \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN>" \
  -d '{"original_url":"https://nuxt.com"}'

# Follow a short link (302)
curl -i http://localhost:4000/<short_code>
```

## Database Schema

```prisma
model User {
  id         Int      @id @default(autoincrement())
  email      String   @unique
  password   String   // bcrypt hash
  created_at DateTime @default(now())
  updated_at DateTime @updatedAt
  links      Link[]
}

model Link {
  id           Int       @id @default(autoincrement())
  user_id      Int
  original_url String
  short_code   String    @unique   // random 4-byte base64url
  short_link   String?   @unique   // ${origin}/${short_code}
  clicks       Int       @default(0)
  expires_at   DateTime?
  created_at   DateTime  @default(now())
  updated_at   DateTime  @updatedAt
  user         User      @relation(fields: [user_id], references: [id], onDelete: Cascade)
}
```

Useful Prisma commands (run in `server/`):

```bash
npx prisma migrate dev        # apply migrations in dev
npx prisma migrate deploy     # apply in prod
npx prisma studio             # visual DB browser
```

## Frontend Notes

- Routes: `/` (dashboard, `auth` middleware), `/login` + `/register` (`guest` middleware), layouts `default` / `auth`.
- `useAuth()` handles register/login/logout, stores token + user in `localStorage`, exposes `isLoggedIn`.
- `useApi()` creates a `$fetch` client with `baseURL = runtimeConfig.public.apiBase`, injects `Authorization` header, auto-logouts on `401`.
- `useLinks()` wraps `GET /api/links`, `POST /api/links`, `DELETE /api/links/:id` with `links` / `pending` / `error` state.
- Dev server is pinned to port `3001` in `nuxt.config.ts` to avoid colliding with other localhost projects.

## Scripts

```bash
# server/
npm run dev     # tsx watch src/server.ts
npm run build   # tsc
npm start       # node dist/server.js

# client/
npm run dev     # nuxt dev (:3001)
npm run build   # nuxt build
npm run preview # nuxt preview
```

## Production Build (outline)

```bash
# API
cd server && npm run build && npm start   # needs PORT, JWT_SECRET, DATABASE_URL + migrated DB

# Web
cd client && npm run build && npm run preview  # needs NUXT_PUBLIC_API_BASE pointing at public API
```

## Troubleshooting

- **Client can't reach API** – verify `NUXT_PUBLIC_API_BASE` matches server `PORT`; check `GET /api/health`.
- **CORS blocked** – `src/config/env.ts` currently hardcodes `CORS_ORIGINS = "*"` (dev-open). For prod, wire it to an env var and allowlist your frontend origin in `app.ts`.
- **401 invalid or expired token** – client auto-logs-out; log in again (JWT expired or `JWT_SECRET` rotated).
- **Prisma can't connect** – ensure Docker DB is up (`docker compose ps`), `DATABASE_URL` is correct, and migrations ran.
- **Wrong app served on localhost** – client is pinned to `:3001`; clear stale service workers if another project previously used the same port.
