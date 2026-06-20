# BmadCRMMini

CRM cá nhân cho solo tool provider — Next.js App Router, shadcn/ui, Prisma, PostgreSQL local.

## Yêu cầu

- Node.js 20+
- Docker Desktop (PostgreSQL chạy qua Docker Compose)

## Thiết lập nhanh

1. Cài dependencies:

```bash
npm install
npx prisma generate
```

2. Start PostgreSQL (Docker):

```bash
docker compose up -d
```

3. Copy env (nếu chưa có):

```bash
copy .env.example .env
```

`DATABASE_URL` mặc định khớp với `docker-compose.yml`.

4. Migrate + seed:

```bash
npx prisma migrate dev --name init_app_setting
npx prisma db seed
```

5. Chạy dev server:

```bash
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000) — sidebar CRM shell với placeholder surfaces.

## Scripts

| Lệnh | Mục đích |
|------|----------|
| `npm run dev` | Dev server |
| `npm run build` | Production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript check |

## Cấu trúc

- `src/app/(app)/` — CRM shell (sidebar + routes)
- `src/components/ui/` — shadcn primitives
- `src/lib/db.ts` — Prisma singleton
- `prisma/` — schema + migrations
- `_bmad-output/` — planning artifacts (BMad)
