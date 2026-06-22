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

Cập nhật `.env`:

- `DATABASE_URL` — khớp `docker-compose.yml`
- `AUTH_SECRET` — `openssl rand -base64 32`
- `OPERATOR_EMAIL`, `OPERATOR_PASSWORD` — dùng để seed operator (bcrypt hash trong DB)
- `OPERATOR_NAME` — tùy chọn

4. Migrate + seed:

```bash
npx prisma migrate dev
npx prisma db seed
```

5. Chạy dev server:

```bash
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000) — redirect `/login` nếu chưa đăng nhập. Dùng credentials từ `OPERATOR_*` trong `.env`.

## Scripts

| Lệnh | Mục đích |
|------|----------|
| `npm run dev` | Dev server |
| `npm run build` | Production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript check |
| `npm run test:e2e` | Playwright E2E (Epic 1 flows; cần Docker + migrate + seed) |
| `npm run test:e2e:ui` | Playwright UI mode |
| `npm run test:e2e:install` | Cài/tải lại browser Chromium cho Playwright |

**Lỗi Playwright UI** (`file data stream has unexpected number of bytes`, `zip file is truncated`):

1. Đóng Playwright UI và cửa sổ Chrome test (nếu có)
2. Trong terminal project:

```powershell
Remove-Item -Recurse -Force test-results, playwright-report -ErrorAction SilentlyContinue
npm run test:e2e:install
npm run test:e2e:ui
```

## Cấu trúc

- `src/app/(app)/` — CRM shell (sidebar + routes, protected)
- `src/app/login/` — trang đăng nhập
- `src/auth.ts` — Auth.js config
- `src/middleware.ts` — bảo vệ routes CRM
- `src/lib/auth-guard.ts` — `requireSession()` cho Server Actions
- `src/components/ui/` — shadcn primitives
- `src/lib/db.ts` — Prisma singleton
- `prisma/` — schema + migrations
- `_bmad-output/` — planning artifacts (BMad)
