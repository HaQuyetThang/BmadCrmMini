---
baseline_commit: NO_VCS
---

# Story 1.1: Khởi tạo dự án và design system

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As an **Operator**,
I want **ứng dụng CRM chạy local với giao diện Notion-like nhất quán**,
so that **mọi màn hình sau này dùng chung design tokens và layout shell**.

## Acceptance Criteria

1. **Given** máy dev có Node.js 20+ và PostgreSQL 14+ local  
   **When** chạy scaffold theo architecture (`shadcn init -t next`, Prisma init, shadcn components)  
   **Then** project build được với TypeScript, Tailwind CSS v4, shadcn/ui  
   **And** design tokens từ DESIGN.md mapped vào CSS/Tailwind (UX-DR1, UX-DR2, UX-DR3, UX-DR23)

2. **Given** app shell `(app)` layout  
   **When** truy cập route placeholder (vd. `/`)  
   **Then** sidebar ~240px desktop với nav items: Hôm nay, Khách hàng, Lead & pipeline, Ticket, Cài đặt (footer) — UX-DR12  
   **And** max content width `max-w-5xl`, spacing tokens đúng DESIGN.md

3. **Given** Prisma init  
   **When** chạy `prisma migrate dev` lần đầu  
   **Then** chỉ tạo bảng `AppSetting` + seed defaults (`staleStatusDays=14`, `followUpDays=7`, `renewalWindowDays=14`)  
   **And** `src/lib/db.ts` singleton sẵn sàng — mọi import Prisma chỉ qua `@/lib/db`

## Tasks / Subtasks

- [x] **Task 1: Scaffold Next.js + shadcn trong repo root** (AC: #1)
  - [x] Chạy `npx shadcn@latest init -t next --defaults` **trong repo root** `BmadCRMMini/` (KHÔNG tạo subfolder `bmad-crm-mini/` — planning artifacts nằm ở `_bmad-output/`)
  - [x] Thêm shadcn components: `button`, `card`, `sheet`, `badge`, `skeleton`, `sidebar`, `dialog`, `input`, `label`, `select`, `textarea`, `sonner`
  - [x] Cài Prisma: `npm install prisma@7.8.0 @prisma/client@7.8.0` — pin cùng version per architecture
  - [x] Chạy `npx prisma init --datasource-provider postgresql`
  - [x] Tạo `.env.example` với `DATABASE_URL` template; document Postgres setup trong README
  - [x] Verify `npm run build` pass

- [x] **Task 2: Design tokens + typography** (AC: #1, #2)
  - [x] Map DESIGN.md colors vào `src/app/globals.css` CSS variables (shadcn `:root` + `.dark` nếu có)
  - [x] Neutrals: `#FBFBFA`, `#37352F`, `#F7F6F3`, `#787774`, `#E9E9E7`, `#FFFFFF`
  - [x] Primary: `#2383E2`; semantic: success `#0F7B6C`, warning `#D9730D`, danger `#E03E3E` + muted pairs
  - [x] Typography Inter via `next/font/google` trong root `layout.tsx`
  - [x] Tailwind extend: spacing tokens (`page: 24px`, `section: 20px`, `card-padding: 16px`, `row-gap: 8px`), rounded (`sm: 4px`, `md: 6px`, `lg: 8px`)
  - [x] Utility classes hoặc CSS vars cho `text-display`, `text-display-sm`, `text-label`, `text-body-sm` per UX-DR2
  - [x] UX-DR23: chrome achromatic; không gradient/illustration MVP

- [x] **Task 3: App shell + sidebar nav** (AC: #2)
  - [x] Tạo `src/app/(app)/layout.tsx` — sidebar shadcn ~240px desktop, main content `max-w-5xl mx-auto` với padding `page` token
  - [x] Tạo `src/components/layout/app-sidebar.tsx` — nav links với active state muted background (UX-DR12)
  - [x] Nav routes (placeholder pages OK — chỉ heading): `/` Hôm nay, `/customers`, `/pipeline`, `/tickets`, `/settings` (footer)
  - [x] Placeholder `src/app/(app)/page.tsx` — tiêu đề "Hôm nay" dùng `display` typography
  - [x] KHÔNG thêm Quick capture `+`, logout, auth middleware — thuộc Story 1.2+

- [x] **Task 4: Prisma AppSetting only + db singleton** (AC: #3)
  - [x] `prisma/schema.prisma`: chỉ model `AppSetting { key String @id; value String; updatedAt DateTime @updatedAt }`
  - [x] `prisma/seed.ts`: upsert 3 keys — `staleStatusDays=14`, `followUpDays=7`, `renewalWindowDays=14`
  - [x] `package.json` → `"prisma": { "seed": "tsx prisma/seed.ts" }` + devDep `tsx`
  - [x] `src/lib/db.ts`: Prisma singleton pattern (globalForPrisma) — export `db`
  - [x] Chạy `npx prisma migrate dev --name init_app_setting` + `npx prisma db seed`
  - [x] KHÔNG tạo model `User`, `Customer`, `Ticket`, enums — Story 1.2+

- [x] **Task 5: Smoke verify** (AC: #1–#3)
  - [x] `npm run dev` → `http://localhost:3000` hiển thị shell + sidebar
  - [x] `npm run build` pass
  - [x] Document setup steps trong README.md ngắn gọn (Postgres create DB, copy `.env.example`)

## Dev Notes

### Epic Context

Epic 1 — **Nắm bắt & quản lý Lead/Khách**: Operator đăng nhập, capture lead Zalo ~30s, pipeline 9 status, hồ sơ khách, timeline. Story 1.1 là **nền tảng kỹ thuật** — mọi story sau phụ thuộc design tokens, app shell, Prisma singleton.

Stories tiếp theo trong epic (KHÔNG implement trong 1.1):
- 1.2 Auth.js + User model + middleware
- 1.3 Quick capture sheet
- 1.4–1.8 Customer CRUD, pipeline, stale, renewal, timeline

### Critical Scope Boundaries

| In scope (1.1) | Out of scope (defer) |
|----------------|----------------------|
| Next.js + shadcn scaffold | Auth.js, middleware, `/login` (Story 1.2) |
| Design tokens globals.css | Customer/Ticket/User Prisma models |
| App shell + sidebar nav placeholders | Quick capture `+` button |
| AppSetting migration + seed | Server Actions, dashboard KPI |
| `src/lib/db.ts` singleton | Vitest/Playwright tests |
| `.env.example` DATABASE_URL only | AUTH_SECRET, OPERATOR_* env (Story 1.2) |

### Repo Layout Decision

**Scaffold vào repo root `BmadCRMMini/`**, không subfolder. Architecture handoff § Implementation Handoff ghi `init -n .` khi folder đã tồn tại. Giữ `_bmad-output/` và `_bmad/` nguyên vẹn — thêm `.gitignore` entries cho `.env`, `node_modules`, `.next`.

### Design Token Mapping (globals.css)

Map DESIGN.md → shadcn CSS variables:

```css
:root {
  --background: #FBFBFA;
  --foreground: #37352F;
  --muted: #F7F6F3;
  --muted-foreground: #787774;
  --border: #E9E9E7;
  --card: #FFFFFF;
  --card-foreground: #37352F;
  --primary: #2383E2;
  --primary-foreground: #FFFFFF;
  /* Semantic — dùng cho badge/alert sau này */
  --status-success: #0F7B6C;
  --status-success-muted: #EDF3F0;
  --status-warning: #D9730D;
  --status-warning-muted: #FAF3DD;
  --status-danger: #E03E3E;
  --status-danger-muted: #FDEBEC;
}
```

Spacing trong Tailwind theme extend hoặc `@theme` (Tailwind v4):

- `--spacing-page: 24px`
- `--spacing-section: 20px`

Main content wrapper: `className="mx-auto max-w-5xl px-6 py-6"` (page padding ~24px).

### Sidebar Structure (UX-DR12)

```
┌─────────────────┬──────────────────────────────┐
│ BmadCRMMini     │  [max-w-5xl content area]    │
│ ─────────────── │                              │
│ Hôm nay    ●    │  Placeholder page            │
│ Khách hàng      │                              │
│ Lead & pipeline │                              │
│ Ticket          │                              │
│                 │                              │
│ ─────────────── │                              │
│ Cài đặt (footer)│                              │
└─────────────────┴──────────────────────────────┘
     ~240px
```

Dùng shadcn `Sidebar` component hoặc custom flex layout — active link: `bg-muted rounded-md`.

Nav hrefs (App Router):
- `/` → `(app)/page.tsx`
- `/customers` → `(app)/customers/page.tsx` (placeholder)
- `/pipeline` → `(app)/pipeline/page.tsx` (placeholder)
- `/tickets` → `(app)/tickets/page.tsx` (placeholder)
- `/settings` → `(app)/settings/page.tsx` (placeholder footer)

Placeholder pages: chỉ cần `<h1>` với tên surface — không business logic.

### Prisma — Story 1.1 Schema Only

```prisma
model AppSetting {
  key       String   @id
  value     String
  updatedAt DateTime @updatedAt
}
```

**Seed (`prisma/seed.ts`):**

| key | value | Ghi chú |
|-----|-------|---------|
| `staleStatusDays` | `14` | PRD default |
| `followUpDays` | `7` | PRD default |
| `renewalWindowDays` | `14` | Cửa sổ nhắc gia hạn 7–14 ngày — dùng max window |

Helper `getSettings()` — **KHÔNG cần** trong Story 1.1; tạo ở Story 4.1 hoặc khi dashboard cần đọc settings.

### db.ts Singleton (BẮT BUỘC)

```typescript
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const db = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}
```

**Rule:** Không `new PrismaClient()` ở file khác — architecture pattern #661.

### Initialization Commands (reference)

```bash
# Postgres trước
# CREATE DATABASE bmadcrmmini;

npx shadcn@latest init -t next --defaults
npx shadcn@latest add button card sheet badge skeleton sidebar dialog input label select textarea sonner
npm install prisma@7.8.0 @prisma/client@7.8.0
npm install -D tsx
npx prisma init --datasource-provider postgresql

# .env
DATABASE_URL="postgresql://postgres:<password>@localhost:5432/bmadcrmmini?schema=public"

npx prisma migrate dev --name init_app_setting
npx prisma db seed
npm run dev
```

### Architecture Compliance

- **Stack:** Next.js App Router, TypeScript, shadcn/ui, Tailwind, Prisma 7.8.x, PostgreSQL localhost [Source: architecture.md § Starter]
- **Structure:** `src/app/`, `src/components/ui/` (shadcn only), `src/components/layout/`, `src/lib/db.ts` [Source: architecture.md § Project Structure]
- **Naming:** Component files kebab-case, export PascalCase [Source: architecture.md § Naming Patterns]
- **No REST/tRPC:** Không tạo API routes ngoài auth (auth = Story 1.2) [Source: architecture.md § API boundaries]
- **i18n:** Hardcode tiếng Việt trong UI strings MVP [Source: architecture.md § Frontend]

### Library & Version Requirements

| Package | Version | Notes |
|---------|---------|-------|
| `prisma` | 7.8.x | Pin exact với `@prisma/client` |
| `@prisma/client` | 7.8.x | |
| shadcn/ui | latest stable via CLI | Next.js template |
| `next/font/google` | Inter | UX typography |
| `tsx` | devDep | Prisma seed runner |

**KHÔNG cài** `next-auth`, `bcryptjs` trong Story 1.1 — Story 1.2.

### File Structure Requirements (NEW files this story)

```
BmadCRMMini/
├── .env.example
├── README.md                    # UPDATE or CREATE — setup instructions
├── package.json                 # NEW from scaffold
├── components.json
├── prisma/
│   ├── schema.prisma            # AppSetting only
│   ├── seed.ts
│   └── migrations/
├── src/
│   ├── app/
│   │   ├── globals.css          # DESIGN.md tokens
│   │   ├── layout.tsx           # Root + Inter font
│   │   └── (app)/
│   │       ├── layout.tsx       # Sidebar shell
│   │       ├── page.tsx         # Hôm nay placeholder
│   │       ├── customers/page.tsx
│   │       ├── pipeline/page.tsx
│   │       ├── tickets/page.tsx
│   │       └── settings/page.tsx
│   ├── components/
│   │   ├── ui/                  # shadcn — DO NOT add business logic
│   │   └── layout/
│   │       └── app-sidebar.tsx
│   └── lib/
│       └── db.ts
```

Planning artifacts `_bmad-output/` — **KHÔNG di chuyển hay xóa**.

### Testing Requirements

Testing framework **chưa scaffold** per architecture [ASSUMPTION]. Story 1.1 verification:
- Manual: `npm run dev`, visual sidebar + tokens
- `npm run build` must pass
- `npx prisma migrate dev` + `db seed` on clean DB

Không yêu cầu unit/E2E tests trong story này.

### Latest Tech Notes (2026)

- **shadcn init -t next**: Scaffold Next.js 15+ App Router + Tailwind v4 — follow CLI output structure
- **Prisma 7.x**: Datasource URL trong `prisma.config.ts` hoặc `schema.prisma` per CLI init output — follow generated structure, không hardcode path cũ nếu CLI khác
- **Sidebar component**: shadcn Sidebar dùng `SidebarProvider` — wrap `(app)/layout.tsx` đúng theo shadcn docs sau `add sidebar`

### Project Context Reference

Không có `project-context.md` — greenfield project. Single source of truth: `architecture.md` + `DESIGN.md`.

### Anti-Patterns (DO NOT)

- ❌ Scaffold vào subfolder `bmad-crm-mini/` — conflict với repo layout
- ❌ Thêm full Prisma schema (Customer, User, enums) — Story 1.2+
- ❌ Implement auth/middleware — Story 1.2
- ❌ Hardcode colors trong components thay vì CSS variables
- ❌ Edit logic trong `components/ui/` shadcn files
- ❌ `new PrismaClient()` outside `lib/db.ts`

### References

- [Source: `_bmad-output/planning-artifacts/epics.md` — Story 1.1]
- [Source: `_bmad-output/planning-artifacts/architecture.md` — § Starter, § Data Architecture AppSetting, § Project Structure, § Implementation sequence step 1]
- [Source: `_bmad-output/planning-artifacts/ux-designs/ux-BmadCRMMini-2026-06-19/DESIGN.md` — colors, typography, layout]
- [Source: `_bmad-output/planning-artifacts/epics.md` — UX-DR1, UX-DR2, UX-DR3, UX-DR12, UX-DR23]
- [Source: `_bmad-output/planning-artifacts/prds/prd-BmadCRMMini-2026-06-19/addendum.md` — stack defaults]

## Dev Agent Record

### Agent Model Used

Auto (Cursor Agent)

### Debug Log References

- Prisma 7 yêu cầu `@prisma/adapter-pg` + `pg` driver — cập nhật `db.ts` và `seed.ts`
- shadcn v4 Sidebar dùng `render` prop thay `asChild` cho Link nav
- Migration SQL tạo tại `prisma/migrations/20260620120000_init_app_setting/` — chạy `npx prisma migrate dev` khi Postgres local sẵn sàng

### Completion Notes List

- Scaffold Next.js 16 + shadcn/ui 4 trong repo root (`src/` layout)
- Design tokens DESIGN.md → `globals.css` + typography utilities
- CRM shell: sidebar 240px, 5 placeholder routes, `max-w-5xl` content
- Prisma AppSetting schema + seed + migration file + `src/lib/db.ts` singleton
- `npm run build`, `npm run lint`, `npm run dev` (GET / 200) verified
- **Operator action:** Start PostgreSQL, then `npx prisma migrate dev` + `npx prisma db seed`

### File List

- `.env.example`
- `.gitignore`
- `README.md`
- `components.json`
- `eslint.config.mjs`
- `next.config.ts`
- `package.json`
- `package-lock.json`
- `postcss.config.mjs`
- `prisma.config.ts`
- `prisma/schema.prisma`
- `prisma/seed.ts`
- `prisma/migrations/migration_lock.toml`
- `prisma/migrations/20260620120000_init_app_setting/migration.sql`
- `src/app/globals.css`
- `src/app/layout.tsx`
- `src/app/(app)/layout.tsx`
- `src/app/(app)/page.tsx`
- `src/app/(app)/customers/page.tsx`
- `src/app/(app)/pipeline/page.tsx`
- `src/app/(app)/tickets/page.tsx`
- `src/app/(app)/settings/page.tsx`
- `src/components/layout/app-sidebar.tsx`
- `src/components/ui/*` (shadcn components)
- `src/components/theme-provider.tsx`
- `src/hooks/use-mobile.ts`
- `src/lib/db.ts`
- `src/lib/utils.ts`
- `tsconfig.json`

## Change Log

- 2026-06-20: Story 1.1 implemented — Next.js scaffold, design system, app shell, Prisma AppSetting foundation
- 2026-06-20: Story 1.1 marked done (code review skipped)
