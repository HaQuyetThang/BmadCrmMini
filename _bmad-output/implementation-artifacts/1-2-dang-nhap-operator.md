---
baseline_commit: 69dc07b435d4ee9f3797aa23e12564560bf76c66
---

# Story 1.2: Đăng nhập Operator

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As an **Operator**,
I want **đăng nhập bằng email/password trước khi vào CRM**,
so that **dữ liệu khách được bảo vệ trên máy local**.

## Acceptance Criteria

1. **Given** env có `DATABASE_URL`, `AUTH_SECRET`, `OPERATOR_EMAIL`, `OPERATOR_PASSWORD`  
   **When** chạy `prisma db seed`  
   **Then** một `User` duy nhất được tạo với password bcrypt hash  
   **And** không lưu plaintext password trong DB

2. **Given** user chưa đăng nhập  
   **When** truy cập bất kỳ route `(app)/*`  
   **Then** redirect tới `/login`  
   **And** `/login` hiển thị form email + password (shadcn Card)

3. **Given** credentials đúng  
   **When** submit login  
   **Then** session JWT được tạo và redirect tới `/` (Hôm nay placeholder)  
   **And** credentials sai hiển thị lỗi tiếng Việt user-friendly

4. **Given** mọi Server Action  
   **When** gọi action mà chưa auth  
   **Then** return `{ ok: false, error: "Chưa đăng nhập." }` per architecture

## Tasks / Subtasks

- [x] **Task 1: Prisma User model + seed operator** (AC: #1)
  - [x] Thêm model `User` vào `prisma/schema.prisma` per architecture (`id`, `email` unique, `passwordHash`, `name?`, timestamps)
  - [x] Migration `add_user`
  - [x] Cập nhật `prisma/seed.ts`: upsert single operator từ `OPERATOR_EMAIL`, `OPERATOR_PASSWORD`, `OPERATOR_NAME` — bcrypt hash, không plaintext
  - [x] Cập nhật `.env.example` với `AUTH_SECRET`, `OPERATOR_EMAIL`, `OPERATOR_PASSWORD`, `OPERATOR_NAME`

- [x] **Task 2: Auth.js v5 Credentials + API route** (AC: #2, #3)
  - [x] Cài `next-auth@beta`, `bcryptjs`, `@types/bcryptjs`
  - [x] Tạo `src/auth.ts` — Credentials provider, JWT session, authorize via Prisma + bcrypt
  - [x] Tạo `src/app/api/auth/[...nextauth]/route.ts` — export handlers
  - [x] Error message tiếng Việt: "Email hoặc mật khẩu không đúng."

- [x] **Task 3: Middleware + login page** (AC: #2, #3)
  - [x] Tạo `src/middleware.ts` — protect `(app)` routes (`/`, `/customers`, `/pipeline`, `/tickets`, `/settings`); allow `/login`, `/api/auth/*`
  - [x] Tạo `src/app/login/page.tsx` — public, centered shadcn Card form email/password
  - [x] Login success → redirect `/`; logged-in user vào `/login` → redirect `/`

- [x] **Task 4: Auth guard pattern + logout** (AC: #4)
  - [x] Tạo `src/lib/action-result.ts` — `ActionResult<T>` type
  - [x] Tạo `src/lib/auth-guard.ts` — `requireSession()` returns `ActionResult` error `"Chưa đăng nhập."`
  - [x] Tạo `src/actions/session.ts` — smoke protected action dùng `requireSession()` (pattern reference)
  - [x] Thêm nút **Đăng xuất** sidebar footer — `signOut()` → `/login`

- [x] **Task 5: Smoke verify** (AC: #1–#4)
  - [x] `npx prisma migrate dev` + `npx prisma db seed` pass
  - [x] `npm run build`, `npm run lint`, `npm run typecheck` pass
  - [x] Manual: unauthenticated `/` → `/login`; login OK → `/`; logout → `/login`
  - [x] Cập nhật README auth env setup

### Review Findings

- [x] [Review][Patch] `callbackUrl` bị bỏ qua sau đăng nhập thành công [`src/actions/auth.ts:19`] — Fixed: hidden field + `getSafeCallbackUrl()` validate path nội bộ.

- [x] [Review][Patch] Email không được normalize trước khi lookup [`src/auth.ts:17-24`, `prisma/seed.ts:20-31`] — Fixed: `normalizeEmail()` trong authorize, loginAction, seed.

- [x] [Review][Defer] Danh sách protected routes hardcoded [`src/auth.config.ts:3-12`] — deferred, pre-existing — Route mới ngoài list sẽ không bị middleware chặn cho đến khi cập nhật thủ công; chấp nhận MVP story 1.2, cần nhớ khi thêm route.

- [x] [Review][Defer] Không có automated tests cho auth flow — deferred, pre-existing — Story AC không yêu cầu test; pattern smoke manual đủ cho MVP.

## Dev Notes

### Epic Context

Story 1.2 thêm **auth layer** lên nền Story 1.1. Không thêm Customer/Quick capture — Story 1.3+.

### Critical Scope Boundaries

| In scope (1.2) | Out of scope (defer) |
|----------------|----------------------|
| User model + seed | Customer, Ticket, Timeline models |
| Auth.js Credentials + JWT | OAuth, multi-user RBAC |
| middleware + `/login` | Quick capture `+` button (1.3) |
| requireSession pattern | Business Server Actions (1.3+) |
| Logout sidebar footer | Profile edit |

### Files to UPDATE (read before edit)

| File | Current state | This story changes |
|------|---------------|-------------------|
| `prisma/schema.prisma` | Chỉ `AppSetting` | Thêm `User` model |
| `prisma/seed.ts` | AppSetting upsert only | Thêm operator User upsert |
| `.env.example` | `DATABASE_URL` only | Thêm auth env keys |
| `src/components/layout/app-sidebar.tsx` | Nav only | Footer logout button |
| `README.md` | Postgres setup | Auth env + seed instructions |

### Auth.js v5 File Layout (architecture)

```
src/auth.config.ts          # Edge-safe config + authorized callback
src/auth.ts                   # Credentials + Prisma authorize
src/middleware.ts
src/app/login/page.tsx
src/app/api/auth/[...nextauth]/route.ts
src/lib/auth-guard.ts
src/lib/action-result.ts
src/actions/session.ts
```

### User Schema

```prisma
model User {
  id           String   @id @default(cuid())
  email        String   @unique
  passwordHash String
  name         String?
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}
```

### requireSession Pattern

```typescript
const authResult = await requireSession();
if (!authResult.ok) return authResult;
// authResult.data has userId, email, name
```

### Previous Story Intelligence (1.1)

- Prisma 7 + `@prisma/adapter-pg` + `pg` Pool — dùng `@/lib/db` singleton, KHÔNG `new PrismaClient()` elsewhere
- Prisma client output: `src/generated/prisma`
- shadcn Sidebar dùng `render` prop cho Link nav
- Seed/migrate chạy qua `prisma.config.ts` + `tsx prisma/seed.ts`

### Anti-Patterns (DO NOT)

- ❌ Lưu plaintext password trong DB
- ❌ REST API routes ngoài `[...nextauth]`
- ❌ Throw từ requireSession — return ActionResult error
- ❌ Customer/User enums trong story này

### References

- [Source: `_bmad-output/planning-artifacts/epics.md` — Story 1.2]
- [Source: `_bmad-output/planning-artifacts/architecture.md` — § Authentication & Security, § Format Patterns]
- [Source: `_bmad-output/implementation-artifacts/1-1-khoi-tao-du-an-va-design-system.md` — Dev Agent Record]

## Dev Agent Record

### Agent Model Used

Auto (Cursor Agent)

### Debug Log References

- Tách `auth.config.ts` (edge-safe) khỏi `auth.ts` (Prisma authorize) — tránh Prisma trong middleware Edge Runtime
- Auth.js v5 beta.31 + Next.js 16 — `authorized` callback trong `authConfig` cho middleware

### Completion Notes List

- User model + migration `20260620130000_add_user` + seed operator bcrypt
- Auth.js Credentials JWT session, login form shadcn Card, logout sidebar
- `requireSession()` + `pingProtectedAction` pattern cho AC #4
- `npm run build`, `lint`, `typecheck` pass; migrate + seed verified

### File List

- `.env.example`
- `README.md`
- `package.json`
- `package-lock.json`
- `prisma/schema.prisma`
- `prisma/seed.ts`
- `prisma/migrations/20260620130000_add_user/migration.sql`
- `src/auth.config.ts`
- `src/auth.ts`
- `src/middleware.ts`
- `src/types/next-auth.d.ts`
- `src/app/api/auth/[...nextauth]/route.ts`
- `src/app/login/page.tsx`
- `src/app/login/login-form.tsx`
- `src/actions/auth.ts`
- `src/actions/session.ts`
- `src/lib/action-result.ts`
- `src/lib/auth-guard.ts`
- `src/lib/safe-redirect.ts`
- `src/components/layout/app-sidebar.tsx`

## Change Log

- 2026-06-20: Story 1.2 implemented — Auth.js login, User seed, middleware, requireSession pattern
- 2026-06-20: Code review patches — callbackUrl safe redirect, email normalize
