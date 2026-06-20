---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8]
inputDocuments:
  - planning-artifacts/prds/prd-BmadCRMMini-2026-06-19/prd.md
  - planning-artifacts/prds/prd-BmadCRMMini-2026-06-19/addendum.md
  - planning-artifacts/ux-designs/ux-BmadCRMMini-2026-06-19/EXPERIENCE.md
  - planning-artifacts/ux-designs/ux-BmadCRMMini-2026-06-19/DESIGN.md
  - planning-artifacts/briefs/brief-BmadCRMMini-2026-06-19/brief.md
  - planning-artifacts/briefs/brief-BmadCRMMini-2026-06-19/addendum.md
  - brainstorming/brainstorming-session-2026-06-19-2238.md
workflowType: architecture
project_name: BmadCRMMini
user_name: ANPHATPC
date: 2026-06-19
lastStep: 8
status: complete
completedAt: 2026-06-19
---

# Architecture Decision Document

_Tài liệu này được xây dựng cộng tác qua từng bước discovery. Các section được append khi chúng ta thống nhất từng quyết định kiến trúc._

## Project Context Analysis

### Requirements Overview

**Functional Requirements:**

16 FR trong 7 nhóm — tất cả map vào một bounded context "CRM Operator":

| Nhóm | FRs | Ý nghĩa kiến trúc |
|------|-----|-------------------|
| Surface Hôm nay | FR-1..4 | Aggregation queries (KPI, alerts, 3 lists); above-the-fold layout |
| Quick capture | FR-5..6 | Global modal/sheet; minimal validation; fast write path |
| Pipeline | FR-7..8 | Status enum (9 values); stale detection job hoặc computed on read |
| Hồ sơ Khách | FR-9..11 | CRUD + 5 core fields + license; renewal date logic |
| Ticket | FR-12..13 | 1:N Khách→Ticket; priority flag; queue filters |
| Timeline | FR-14..15 | 1:N Khách→TimelineEntry; manual log types |
| Cài đặt | FR-16 | Key-value thresholds (stale days, follow-up days) |

**Non-Functional Requirements:**

- Performance: cold load Hôm nay <2s perceived; skeleton immediate (PRD + UX)
- Accessibility: WCAG 2.2 AA — semantic badges, aria-label KPI, focus rings
- Security: solo use; license/key low risk MVP; no multi-tenant isolation
- Reliability: single-tenant; no critical RTO
- UX constraints: no infinite scroll (paginate 25); no drag kanban; max 1 nested modal

**Scale & Complexity:**

- Primary domain: Full-stack web application
- Complexity level: Low–Medium
- Estimated architectural components: ~8–10 (web UI, API/routes, domain services, DB, auth, dashboard aggregator, status engine, settings)

### Technical Constraints & Dependencies

- Greenfield — no legacy codebase
- UX mandates shadcn/ui + Tailwind + Inter [ASSUMPTION from addendum]
- **Database: PostgreSQL** — chạy **localhost** trong giai đoạn MVP; chưa triển khai cloud
- **Deployment: local-first** — dev trên máy operator; Vercel/hosting cloud **out of scope** cho đến khi MVP ổn định
- Vietnamese microcopy throughout
- MVP timeline ~2 tuần solo dev — favor convention-over-configuration stack
- PRD open questions (pipeline 9 vs 11 status, revenue formula, auth model) block some implementation details but not architecture skeleton

### Cross-Cutting Concerns Identified

1. **Pipeline status machine** — valid transitions, stale detection, visual grouping (Lead/Đang chốt/Khách)
2. **Dashboard aggregation** — KPI + alerts + lists share date/threshold logic
3. **Threshold configuration** — stale (14d), follow-up (7d), renewal window (7–14d) from Settings
4. **Solo auth** — simplest path that doesn't block future multi-tenant
5. **Data model extensibility** — enrich-on-promote pattern for Khách fields

## Technical Preferences (Operator-confirmed)

| Preference | Quyết định | Ghi chú |
|------------|------------|---------|
| Database | **PostgreSQL** | Local instance; không SQLite |
| Môi trường chạy | **Localhost** | App + DB trên máy dev |
| Cloud / hosting | **Deferred** | Không Vercel, không managed DB cloud ở giai đoạn này |
| ORM | **Prisma** | `provider = postgresql` |

## Starter Template Evaluation

### Primary Technology Domain

Full-stack web — Next.js App Router + PostgreSQL + Server Actions cho CRUD CRM solo operator.

### Starter Options Considered

| Option | Đánh giá |
|--------|----------|
| **shadcn init -t next** (selected) | Khớp UX (shadcn + Tailwind); scaffold Next.js App Router một lệnh |
| create-next-app + shadcn init | Tương đương, thêm một bước |
| create-t3-app | tRPC/auth nặng hơn cần thiết cho MVP CRUD |

### Selected Starter: shadcn init (Next.js template)

**Rationale:**

1. UX đã chốt shadcn/ui — starter align trực tiếp
2. CRM CRUD + dashboard → Next.js Server Actions + Prisma đủ; không cần tRPC
3. **PostgreSQL localhost** — schema production-like ngay từ đầu, tránh migrate SQLite→Postgres sau
4. **Local-first** — không phụ thuộc dịch vụ cloud trong MVP

**Initialization Command** *(story implement đầu tiên)*:

```bash
npx shadcn@latest init -t next --defaults -n bmad-crm-mini
cd bmad-crm-mini
npx shadcn@latest add button card sheet badge skeleton sidebar dialog input label select textarea sonner
npm install prisma @prisma/client next-auth@beta bcryptjs
npm install -D @types/bcryptjs
npx prisma init --datasource-provider postgresql
```

**PostgreSQL local setup** *(trước `prisma migrate`)*:

```bash
# Tạo database (psql hoặc pgAdmin) — ví dụ:
# CREATE DATABASE bmadcrmmini;

# .env
DATABASE_URL="postgresql://postgres:<password>@localhost:5432/bmadcrmmini?schema=public"
```

**Chạy dev local:**

```bash
npm run dev
# → http://localhost:3000
```

**Architectural Decisions Provided by Starter:**

| Layer | Quyết định |
|-------|------------|
| Language | TypeScript |
| Framework | Next.js App Router (Server Components + Server Actions) |
| UI | shadcn/ui + Tailwind CSS + Radix primitives |
| Database | PostgreSQL via Prisma ORM |
| Runtime env | Node.js local; `next dev` + Postgres local |
| Build | Turbopack (Next.js default dev) |
| Lint | ESLint (Next.js preset) |
| Structure | `src/app/` routes, `src/components/ui/` shadcn |
| Testing | Chưa scaffold — thêm Vitest/Playwright ở story sau [ASSUMPTION] |

**Explicitly out of scope (MVP phase):**

- Vercel / Railway / Fly.io deployment
- Managed PostgreSQL (Neon, Supabase, RDS)
- CI/CD pipeline
- Docker production images *(Docker Compose cho Postgres local là tùy chọn, không bắt buộc)*

**Note:** Project initialization bằng các lệnh trên là implementation story đầu tiên.

## Core Architectural Decisions

### Decision Priority Analysis

**Critical Decisions (Block Implementation):**

| # | Decision | Choice |
|---|----------|--------|
| 1 | Data store | PostgreSQL localhost + Prisma 7.x |
| 2 | Domain model | Customer-centric (Khách) + Ticket + TimelineEntry + AppSetting |
| 3 | API layer | Next.js Server Actions (no REST/tRPC) |
| 4 | Validation | Zod at Server Action boundary |
| 5 | Dashboard aggregation | Server-side Prisma queries in `src/lib/dashboard/` |
| 6 | Auth MVP | **Auth.js v5** — Credentials, single User, middleware bảo vệ app |

**Important Decisions (Shape Architecture):**

| # | Decision | Choice |
|---|----------|--------|
| 7 | State management | RSC default + client state chỉ cho Sheet/Dialog/forms |
| 8 | Soft delete | `deletedAt` nullable trên Customer |
| 9 | Pipeline status | Prisma enum 9 values; `statusChangedAt` track stale |
| 10 | Revenue KPI | Sum `packagePrice` của Customer `Active` (MVP đơn giản) |

**Deferred Decisions (Post-MVP):**

| Decision | Lý do defer |
|----------|-------------|
| OAuth (Google/GitHub) | Solo operator — Credentials đủ MVP |
| Multi-user / RBAC | Single User row MVP |
| Redis / query cache | Data volume nhỏ (~vài chục khách) |
| Cloud deploy + managed Postgres | Operator-confirmed out of scope |
| CI/CD | Local dev only |
| REST/OpenAPI public API | Không có consumer ngoài app |
| Rate limiting | Single user local |

### Data Architecture

**Database:** PostgreSQL 14+ trên localhost (pgAdmin/psql/Docker tùy operator).

**ORM:** Prisma **7.8.x** — pin `prisma` và `@prisma/client` cùng version.

**Migration:** `prisma migrate dev` local; không remote migrate pipeline MVP.

**Modeling approach:** Relational normalized; một bounded context CRM.

**Prisma schema (MVP entities):**

```prisma
enum PipelineStatus {
  LEAD_MOI
  DANG_TU_VAN
  HEN_DEMO
  BAO_GIA_DA_GUI
  CHO_THANH_TOAN
  DA_CHOT
  DANG_ONBOARD
  ACTIVE
  CAN_CHAM_SOC
}

enum BusinessGroup {
  KE_TOAN
  MARKETING
  KHAC
}

enum TicketPriority {
  NORMAL
  KHAN
}

enum TimelineType {
  ZALO
  CALL
  TICKET
  NOTE
}

model Customer {
  id              String         @id @default(cuid())
  name            String
  source          String         @default("Zalo")
  firstMessage    String?
  pipelineStatus  PipelineStatus @default(LEAD_MOI)
  businessGroup   BusinessGroup  @default(KHAC)
  serviceType     String?
  contactChannel  String?
  specialNotes    String?
  renewalDate     DateTime?
  packagePrice    Decimal?       @db.Decimal(12, 2)
  billingCycle    String?        // "monthly" | "yearly" | "project"
  licenseKey      String?
  statusChangedAt DateTime       @default(now())
  lastInteractionAt DateTime?
  demoScheduledAt DateTime?      // alert: lịch hẹn hôm nay
  paymentDueAt    DateTime?      // alert: thanh toán quá hạn
  deletedAt       DateTime?
  createdAt       DateTime       @default(now())
  updatedAt       DateTime       @updatedAt
  tickets         Ticket[]
  timeline        TimelineEntry[]
}

model Ticket {
  id         String         @id @default(cuid())
  customerId String
  customer   Customer       @relation(fields: [customerId], references: [id])
  title      String
  priority   TicketPriority @default(NORMAL)
  closedAt   DateTime?
  createdAt  DateTime       @default(now())
  updatedAt  DateTime       @updatedAt
}

model TimelineEntry {
  id         String       @id @default(cuid())
  customerId String
  customer   Customer     @relation(fields: [customerId], references: [id])
  type       TimelineType
  content    String
  createdAt  DateTime     @default(now())
}

model AppSetting {
  key       String @id
  value     String
  updatedAt DateTime @updatedAt
}

model User {
  id           String   @id @default(cuid())
  email        String   @unique
  passwordHash String
  name         String?
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}
```

**Seed defaults (`AppSetting`):**

| key | value |
|-----|-------|
| `staleStatusDays` | `14` |
| `followUpDays` | `7` |
| `renewalWindowDays` | `14` |

**Seed operator (`User`):** Một user duy nhất từ env lúc `prisma db seed`:

| env | purpose |
|-----|---------|
| `OPERATOR_EMAIL` | email đăng nhập |
| `OPERATOR_PASSWORD` | plaintext seed-only — hash bcrypt vào DB, không lưu plaintext |
| `OPERATOR_NAME` | optional display name |

**Validation strategy:** Zod schemas mirror Prisma enums; Server Actions validate input trước khi gọi Prisma.

**Caching:** Không cache layer riêng MVP. Sau mutation gọi `revalidatePath()` cho routes dashboard/customer.

**Stale / follow-up logic:** Computed on read — so sánh `now()` với `statusChangedAt`, `lastInteractionAt`, `renewalDate` và ngưỡng từ `AppSetting`.

**Việc hôm nay composition (resolve OQ-5):**

Union query gồm:
1. Customer có `demoScheduledAt` = hôm nay
2. Customer `CHO_THANH_TOAN` + `paymentDueAt` ≤ hôm nay
3. Lead stale (pipeline phase Lead + stale status)
4. Ticket `KHAN` mở (cũng surface qua alert strip)

### Authentication & Security

**Auth MVP:** **Auth.js v5** (`next-auth@beta`) — **Credentials provider**, single `User` trong PostgreSQL.

**Operator-confirmed:** Login bắt buộc ngay từ MVP (resolve PRD OQ-3).

**Flow:**

1. Truy cập route protected → `middleware.ts` redirect `/login` nếu chưa có session
2. `/login` — form email + password (shadcn Card); submit → Credentials authorize
3. Success → redirect `/` (Hôm nay); session JWT
4. Logout — nút sidebar footer → `signOut()` → `/login`

**Implementation files:**

```
src/
  auth.ts                 # Auth.js config (Credentials + Prisma authorize)
  middleware.ts           # Protect (app) routes
  app/
    login/page.tsx        # Public login page
    api/auth/[...nextauth]/route.ts
    (app)/                # Protected route group
      layout.tsx          # Sidebar + session check
      page.tsx            # Hôm nay
      ...
```

**Credentials authorize:**

- Lookup `User` by email
- `bcrypt.compare(password, user.passwordHash)`
- Fail → message tiếng Việt: "Email hoặc mật khẩu không đúng."

**Session strategy:** JWT (đủ single-user MVP; không cần Session table).

**Server Actions:** Gọi `auth()` đầu mỗi action — unauthenticated → `{ ok: false, error: "Chưa đăng nhập." }`.

**Authorization:** Single operator — mọi authenticated user có full access. Không RBAC MVP.

**Sensitive data:** `licenseKey` plain text DB OK MVP; mask UI optional v1.1.

**Env secrets (`.env`, gitignored):**

| Variable | Purpose |
|----------|---------|
| `DATABASE_URL` | PostgreSQL local |
| `AUTH_SECRET` | JWT signing — `openssl rand -base64 32` |
| `OPERATOR_EMAIL` | Seed + login email |
| `OPERATOR_PASSWORD` | Chỉ dùng lúc seed/hash |
| `OPERATOR_NAME` | Optional |

**`.env.example`:** Liệt kê keys trên, không giá trị thật.

**Future path:** Thêm OAuth provider hoặc multi-user khi bán SaaS — schema `User` sẵn sàng mở rộng.

### API & Communication Patterns

**Pattern:** Next.js **Server Actions** exclusively — không REST routes, không tRPC.

**Organization:**

```
src/
  auth.ts
  middleware.ts
  actions/
    customers.ts
    tickets.ts
    timeline.ts
    dashboard.ts
    settings.ts
  lib/
    db.ts              # Prisma singleton
    dashboard/         # aggregation queries
    validations/       # Zod schemas
```

**Auth guard in actions:** `const session = await auth(); if (!session?.user) return { ok: false, error: "..." };`

**Action result shape (consistent):**

```typescript
type ActionResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string; fieldErrors?: Record<string, string[]> };
```

**Error handling:** Catch Prisma errors → map sang message tiếng Việt user-friendly; log raw error server-side `console.error`.

**Pagination:** Cursor hoặc offset; page size **25** (PRD/UX).

**No rate limiting** MVP.

### Frontend Architecture

**Rendering:** React Server Components cho pages/lists/KPI; Client Components cho Quick capture Sheet, interactive rows, toast.

**Routing (App Router):**

| Route | Surface | Auth |
|-------|---------|------|
| `/login` | Đăng nhập | Public |
| `/` | Hôm nay | Protected |
| `/customers` | Khách hàng | Protected |
| `/customers/[id]` | Chi tiết khách | Protected |
| `/pipeline` | Lead & pipeline | Protected |
| `/tickets` | Ticket queue | Protected |
| `/settings` | Cài đặt | Protected |

**Layout:** `(app)/layout.tsx` — sidebar shadcn + global `+` Quick capture + logout.

**State:** Không Redux/Zustand MVP. `useState`/`useTransition` trong client islands; server data qua RSC props.

**Forms:** React Hook Form + Zod resolver cho Quick capture và profile edit.

**Performance:** Skeleton loading.tsx per route; không infinite scroll.

**i18n:** Hardcode tiếng Việt strings trong components MVP (không i18n framework).

### Infrastructure & Deployment

**Hosting MVP:** **Localhost only** — `npm run dev` + PostgreSQL local.

**Environment files:**

| File | Purpose |
|------|---------|
| `.env` | `DATABASE_URL`, `AUTH_SECRET`, `OPERATOR_*` |
| `.env.example` | Template committed — no secrets |

**CI/CD:** Deferred.

**Monitoring/logging:** `console.error` MVP; structured logging deferred.

**Scaling:** N/A — single user, ~50 customers.

**Docker:** Optional `docker-compose.yml` cho Postgres local only — không bắt buộc.

### Decision Impact Analysis

**Implementation sequence:**

1. Scaffold Next.js + shadcn + Prisma init
2. PostgreSQL local + `migrate dev` + seed AppSetting + **seed User**
3. **Auth.js setup** — auth.ts, middleware, `/login`, API route
4. Prisma models + db singleton
5. Server Actions CRUD Customer (Quick capture first — UJ-2)
6. Dashboard aggregation queries (UJ-1)
7. Ticket + Timeline (UJ-3)
8. Settings page (thresholds)
9. Polish: skeleton, empty states, pagination

**Cross-component dependencies:**

- Dashboard phụ thuộc Customer + Ticket + AppSetting queries
- Stale/follow-up lists phụ thuộc `statusChangedAt`, `lastInteractionAt`, AppSetting
- Timeline auto-log on ticket close → shared action helper
- Pipeline chip UI maps `PipelineStatus` enum → 3 visual groups (lib constant)

## Implementation Patterns & Consistency Rules

### Pattern Categories Defined

**Critical conflict points identified:** 12 vùng agent có thể chọn khác nhau nếu không ghi rõ — naming DB/code, action shape, auth guard, dates, pipeline labels, folder layout, client/server split, loading/error/toast, pagination, revalidation, Prisma access, microcopy.

### Naming Patterns

**Database (Prisma):**

| Rule | Example |
|------|---------|
| Model PascalCase, singular | `Customer`, `Ticket`, `TimelineEntry`, `User` |
| Field camelCase | `pipelineStatus`, `statusChangedAt`, `passwordHash` |
| Enum PascalCase name, SCREAMING_SNAKE members | `PipelineStatus.LEAD_MOI` |
| Relation field camelCase singular/plural | `customer`, `tickets`, `timeline` |
| Không prefix `tbl_` | ❌ `tbl_customer` |

**Code (TypeScript/React):**

| Artifact | Convention | Example |
|----------|--------------|---------|
| React component file | kebab-case.tsx, export PascalCase | `customer-list-row.tsx` → `CustomerListRow` |
| Server Action file | kebab-case.ts, export camelCase verbs | `actions/customers.ts` → `createCustomer` |
| Zod schema | `{entity}Schema` / `{action}Schema` | `createCustomerSchema` |
| Type | PascalCase | `ActionResult`, `DashboardData` |
| Constant maps | SCREAMING_SNAKE object | `PIPELINE_STATUS_LABELS` |
| Hook | `use` prefix camelCase | `useQuickCapture` |
| Private helper | camelCase | `computeStaleDays` |

**Routes:** lowercase, kebab nếu nhiều từ — `/customers/[id]`, không `/Customers`.

**Domain terms in code:** Dùng English identifiers map sang PRD Glossary — `Customer` = Khách, `PipelineStatus` = pipeline status PRD. UI label tiếng Việt qua constant map, không hardcode enum string tiếng Việt trong DB.

### Structure Patterns

**Feature-oriented under `src/`:**

```
src/
  app/
    login/page.tsx
    api/auth/[...nextauth]/route.ts
    (app)/
      layout.tsx
      page.tsx                    # Hôm nay
      loading.tsx
      customers/
      pipeline/
      tickets/
      settings/
  actions/                        # Server Actions only — "use server" per file
  components/
    ui/                           # shadcn — DO NOT edit logic here
    layout/                       # app-sidebar, quick-capture-sheet
    customers/                    # feature components
    dashboard/
    pipeline/
    tickets/
  lib/
    db.ts                         # Prisma singleton — ONLY db import path
    auth-guard.ts                 # requireSession() helper
    dashboard/                    # query functions, no "use server"
    validations/
    constants/                    # pipeline, labels, pagination
    format.ts                     # date/currency display
  auth.ts
  middleware.ts
```

**Rules:**

- **Pages** (`app/`) — thin: fetch data, compose components; minimal logic
- **Actions** — mutations + auth guard; gọi `lib/` queries/helpers
- **lib/dashboard/** — read-only Prisma aggregations; không `"use server"`
- **components/ui/** — shadcn only; business UI ở `components/{feature}/`
- **Tests** (khi thêm): co-located `*.test.ts` cạnh file hoặc `__tests__/` cùng folder — chọn co-located, không folder `tests/` riêng root

### Format Patterns

**Server Action result — bắt buộc:**

```typescript
type ActionResult<T = void> =
  | { ok: true; data: T }
  | { ok: false; error: string; fieldErrors?: Record<string, string[]> };
```

- Success không wrap thêm `{ data: { data } }`
- Validation fail → `fieldErrors` keyed by form field name (camelCase)
- User-facing `error` **luôn tiếng Việt**; log kỹ thuật `console.error` English/raw OK

**Dates:**

| Layer | Format |
|-------|--------|
| PostgreSQL / Prisma | `DateTime` UTC |
| JSON/action payload | ISO 8601 string |
| UI display | `formatDate(d)` → `dd/MM/yyyy` via `lib/format.ts` |
| Relative ("14 ngày không đổi") | computed helper, không lưu DB |

**Money:** `Decimal` Prisma; UI `formatCurrency(vnd)` — suffix `đ`, thousands `.`

**Pagination params:** `page` (1-based), `pageSize` fixed 25 — không nhận pageSize từ client MVP.

**Pipeline status UI:** Map enum → `{ label: "Lead mới", group: "lead" | "closing" | "customer" }` trong `lib/constants/pipeline.ts` — single source of truth.

### Communication Patterns

**Server Actions (thay REST):**

- Naming: `{verb}{Entity}` — `createCustomer`, `updatePipelineStatus`, `closeTicket`
- Mỗi file action group theo entity: `customers.ts`, `tickets.ts`
- **Không** tạo Route Handlers `/api/*` trừ Auth.js `[...nextauth]`

**Auth in actions — bắt buộc pattern:**

```typescript
"use server";
import { requireSession } from "@/lib/auth-guard";

export async function createCustomer(input: CreateCustomerInput): Promise<ActionResult<{ id: string }>> {
  const session = await requireSession(); // throws redirect hoặc return error — pick ONE: return { ok: false, error: "Chưa đăng nhập." }
  // ...
}
```

**Chọn một:** `requireSession()` return `ActionResult` error (preferred — không throw qua action boundary).

**Cache revalidation — sau mọi mutation:**

```typescript
import { revalidatePath } from "next/cache";
revalidatePath("/");
revalidatePath("/customers");
// + path cụ thể nếu biết customerId
```

**Client ↔ Server:** Props từ RSC xuống Client Components; mutations qua `useTransition` + action call; **không** fetch `/api` tự chế.

**Toast:** `sonner` — success ngắn: `"Đã lưu"`, `"Đã đóng ticket"`; error từ `result.error`.

### Process Patterns

**Loading:**

- Route-level: `loading.tsx` skeleton (KPI + strip + rows per UX)
- Action pending: `useTransition` → disable button + spinner on CTA
- Không global loading bar MVP

**Error handling:**

| Layer | Pattern |
|-------|---------|
| Action | try/catch → `{ ok: false, error: "Không lưu được. Thử lại." }` |
| Prisma P2002 | `"Email đã tồn tại."` (User) |
| Not found | `{ ok: false, error: "Không tìm thấy khách." }` |
| Page | `notFound()` khi customer id invalid |
| Login | `"Email hoặc mật khẩu không đúng."` |

**Validation flow:** Client Zod (UX instant) → Server Action Zod **re-parse** (never trust client) → Prisma.

**Soft delete:** `deletedAt` set; mọi query list **filter `deletedAt: null`** — helper `activeCustomersWhere` trong `lib/db-helpers.ts`.

**Status change side effects:** Khi `pipelineStatus` đổi → set `statusChangedAt = now()` trong cùng transaction.

**Timeline auto-log:** Helper `logTimelineEntry(customerId, type, content)` — gọi từ ticket close / one-click support; không duplicate insert logic.

**Quick capture:** Sheet component client; submit → `createCustomer` action; stay on page; toast + optional dialog promote status.

### Enforcement Guidelines

**All AI agents MUST:**

1. Import Prisma chỉ từ `@/lib/db` — không `new PrismaClient()` rải rác
2. Return `ActionResult` từ mọi Server Action public
3. Gọi auth guard đầu mọi action/mutation
4. Dùng `PIPELINE_STATUS_*` constants — không magic string status
5. Filter `deletedAt: null` trên customer queries
6. `revalidatePath` sau mutation ảnh hưởng dashboard/lists
7. UI microcopy tiếng Việt, calm tone (EXPERIENCE.md)
8. Page size 25 — không infinite scroll
9. `"use client"` chỉ khi cần hooks/events — default Server Component

**Anti-patterns (tránh):**

- ❌ REST routes `/api/customers` song song Server Actions
- ❌ `fetch` nội bộ từ client tới API tự tạo
- ❌ Enum label tiếng Việt lưu DB thay vì enum code
- ❌ Business logic trong `components/ui/`
- ❌ Bỏ qua server-side Zod vì đã validate client
- ❌ Drag-and-drop kanban, nested modal >1 level

### Pattern Examples

**Good — create lead (UJ-2):**

```typescript
// actions/customers.ts
export async function createCustomer(raw: unknown): Promise<ActionResult<{ id: string }>> {
  const auth = await requireSession();
  if (!auth.ok) return auth;

  const parsed = createCustomerSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, error: "Kiểm tra lại thông tin.", fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const customer = await db.customer.create({ data: { ...parsed.data, pipelineStatus: "LEAD_MOI" } });
  revalidatePath("/");
  revalidatePath("/pipeline");
  return { ok: true, data: { id: customer.id } };
}
```

**Good — pipeline badge:**

```typescript
const meta = PIPELINE_STATUS_LABELS[customer.pipelineStatus];
<Badge variant={meta.group}>{meta.label}</Badge>
```

**Bad:**

```typescript
await fetch("/api/customers", { method: "POST", body: JSON.stringify(data) });
<Badge>Đang tư vấn</Badge> // hardcoded, không qua constant
```

## Project Structure & Boundaries

### Complete Project Directory Structure

Repo root `BmadCRMMini/` (code app; planning artifacts giữ ở `_bmad-output/`).

```
BmadCRMMini/
├── .env                          # DATABASE_URL, AUTH_SECRET, OPERATOR_*
├── .env.example
├── .gitignore
├── README.md
├── package.json
├── next.config.ts
├── tsconfig.json
├── components.json               # shadcn config
├── postcss.config.mjs
├── prisma/
│   ├── schema.prisma             # Customer, Ticket, TimelineEntry, AppSetting, User
│   ├── seed.ts                   # User + AppSetting defaults
│   └── migrations/
├── public/
│   └── (empty MVP)
└── src/
    ├── auth.ts                   # Auth.js config
    ├── middleware.ts             # Protect (app) routes
    ├── app/
    │   ├── globals.css           # shadcn tokens + DESIGN.md CSS vars
    │   ├── layout.tsx            # Root html/body, font Inter
    │   ├── login/
    │   │   └── page.tsx          # Login form (public)
    │   ├── api/
    │   │   └── auth/
    │   │       └── [...nextauth]/
    │   │           └── route.ts
    │   └── (app)/                # Protected CRM shell
    │       ├── layout.tsx        # Sidebar, QuickCapture, logout
    │       ├── loading.tsx       # Global skeleton fallback
    │       ├── page.tsx          # Hôm nay (FR-1..4)
    │       ├── loading.tsx       # Dashboard skeleton
    │       ├── customers/
    │       │   ├── page.tsx      # FR-9 list + filter
    │       │   ├── loading.tsx
    │       │   └── [id]/
    │       │       └── page.tsx  # FR-10, FR-14, FR-15 detail
    │       ├── pipeline/
    │       │   ├── page.tsx      # FR-7 list by status
    │       │   └── loading.tsx
    │       ├── tickets/
    │       │   ├── page.tsx      # FR-12 queue
    │       │   └── loading.tsx
    │       └── settings/
    │           └── page.tsx      # FR-16 thresholds
    ├── actions/
    │   ├── customers.ts          # FR-5..11
    │   ├── tickets.ts            # FR-12..13
    │   ├── timeline.ts           # FR-14..15
    │   ├── dashboard.ts          # FR-1..3 reads (optional split)
    │   └── settings.ts           # FR-16
    ├── components/
    │   ├── ui/                   # shadcn (button, card, sheet, badge, …)
    │   ├── layout/
    │   │   ├── app-sidebar.tsx
    │   │   ├── quick-capture-sheet.tsx   # FR-5..6
    │   │   └── user-menu.tsx             # logout
    │   ├── dashboard/
    │   │   ├── kpi-row.tsx               # FR-1
    │   │   ├── alert-strip-row.tsx       # FR-2
    │   │   ├── priority-list-section.tsx # FR-3
    │   │   └── today-page.tsx
    │   ├── customers/
    │   │   ├── customer-list.tsx
    │   │   ├── customer-list-row.tsx
    │   │   ├── customer-profile-form.tsx # FR-10..11
    │   │   └── license-field.tsx         # FR-10, UJ-3
    │   ├── pipeline/
    │   │   ├── pipeline-list.tsx         # FR-7
    │   │   ├── status-select.tsx
    │   │   └── stale-banner.tsx          # FR-8
    │   ├── tickets/
    │   │   ├── ticket-queue.tsx          # FR-12
    │   │   └── ticket-detail-panel.tsx   # FR-13
    │   └── timeline/
    │       └── timeline-list.tsx         # FR-14..15
    └── lib/
        ├── db.ts
        ├── auth-guard.ts
        ├── db-helpers.ts                 # activeCustomersWhere, soft delete
        ├── format.ts                     # formatDate, formatCurrency
        ├── constants/
        │   ├── pipeline.ts               # PIPELINE_STATUS_LABELS, groups
        │   └── pagination.ts             # PAGE_SIZE = 25
        ├── dashboard/
        │   ├── get-kpis.ts               # FR-1
        │   ├── get-alerts.ts             # FR-2
        │   ├── get-today-tasks.ts        # FR-3 Việc hôm nay
        │   ├── get-renewals.ts           # FR-3 Sắp gia hạn
        │   └── get-follow-up-leads.ts    # FR-3 Lead follow-up
        └── validations/
            ├── customer.ts
            ├── ticket.ts
            ├── timeline.ts
            └── settings.ts
```

### Architectural Boundaries

**API boundaries:**

| Boundary | Allowed | Forbidden |
|----------|---------|-----------|
| Auth | `app/api/auth/[...nextauth]/route.ts` | Mọi `/api/crm/*` REST |
| Mutations | `src/actions/*.ts` Server Actions | Route Handlers CRUD |
| Reads (pages) | `lib/dashboard/*`, page RSC direct call | Client fetch tới API tự tạo |

**Component boundaries:**

- **Pages** — compose only; gọi `lib/dashboard` + pass props
- **Feature components** — presentational + local UI state
- **Quick capture / forms** — client; gọi actions
- **ui/** — shadcn primitives; zero business rules

**Service boundaries:**

- `lib/dashboard/*` — read-only Prisma; không import `"use server"`
- `actions/*` — write + auth + validation + revalidatePath
- `lib/auth-guard.ts` — session check; actions/pages dùng chung

**Data boundaries:**

- Chỉ `lib/db.ts` touch Prisma client
- Transactions cho status change + timeline log cùng lúc
- `AppSetting` — single row per key; đọc qua helper `getSettings()`

### Requirements to Structure Mapping

| FR | Primary location |
|----|------------------|
| FR-1 KPI | `lib/dashboard/get-kpis.ts` + `components/dashboard/kpi-row.tsx` |
| FR-2 Alerts | `lib/dashboard/get-alerts.ts` + `alert-strip-row.tsx` |
| FR-3 Lists | `get-today-tasks.ts`, `get-renewals.ts`, `get-follow-up-leads.ts` |
| FR-4 Skeleton/empty | `(app)/loading.tsx`, `priority-list-section.tsx` |
| FR-5..6 Quick capture | `quick-capture-sheet.tsx` + `actions/customers.ts` |
| FR-7 Pipeline | `pipeline/page.tsx` + `pipeline-list.tsx` |
| FR-8 Stale | `stale-banner.tsx` + logic in dashboard/helpers |
| FR-9 CRUD list | `customers/page.tsx` + `actions/customers.ts` |
| FR-10..11 Profile | `customers/[id]/page.tsx` + `customer-profile-form.tsx` |
| FR-12..13 Tickets | `tickets/*` + `actions/tickets.ts` |
| FR-14..15 Timeline | `timeline-list.tsx` + `actions/timeline.ts` |
| FR-16 Settings | `settings/page.tsx` + `actions/settings.ts` |
| Auth (operator) | `auth.ts`, `middleware.ts`, `login/page.tsx`, `User` seed |

### Integration Points

**Internal communication:**

```
Page (RSC) → lib/dashboard/* → Prisma
Client form → actions/* → Prisma → revalidatePath → RSC refresh
middleware → auth session → (app) routes
```

**External integrations:** None MVP (Zalo manual log only).

**Data flow (UJ-1 buổi sáng):**

1. `(app)/page.tsx` parallel fetch KPI + alerts + 3 lists
2. Click alert → navigate `/customers?filter=payment` hoặc `/tickets?urgent=1`
3. Mutation (đánh dấu đã nhắc) → action → revalidatePath `/`

### File Organization Patterns

- Config root: `next.config.ts`, `components.json`, `prisma/schema.prisma`
- Secrets: `.env` only; `.env.example` committed
- Planning docs: `_bmad-output/` — **không** mix vào `src/`

### Development Workflow Integration

**Local dev:**

```bash
# Terminal 1: PostgreSQL local (service hoặc Docker)
# Terminal 2:
npm run dev          # http://localhost:3000
npx prisma studio    # optional DB GUI
```

**Build:** `npm run build` — verify trước khi coi MVP done; deploy deferred.

## Architecture Validation Results

### Coherence Validation ✅

**Decision compatibility:** Next.js App Router + Server Actions + Prisma PostgreSQL + Auth.js Credentials — stack phổ biến, không xung đột. shadcn/ui align Tailwind trong starter. JWT session + Server Actions `auth()` nhất quán.

**Pattern consistency:** Naming (kebab files, PascalCase components), `ActionResult`, `requireSession()` align với Step 4 decisions. Route group `(app)` khớp middleware auth.

**Structure alignment:** Mọi FR map tới file cụ thể; read/write tách `lib/dashboard` vs `actions`.

### Requirements Coverage Validation ✅

**Functional requirements:** FR-1..FR-16 đều có file target trong mapping table. Auth/login (operator request) covered bởi auth stack.

**Non-functional requirements:**

| NFR | Architectural support |
|-----|----------------------|
| Performance <2s perceived | RSC + skeleton loading.tsx |
| WCAG 2.2 AA | shadcn/Radix; badge text via constants |
| Solo security | Auth.js + localhost |
| Pagination 25 | `constants/pagination.ts` |
| Vietnamese microcopy | Enforcement in patterns |

### Implementation Readiness Validation ✅

**Decision completeness:** Stack, schema, auth, env vars documented. Prisma 7.8.x noted.

**Structure completeness:** Full tree với file names — agents có thể scaffold từng story.

**Pattern completeness:** MUST rules + Good/Bad examples present.

### Gap Analysis Results

**Important (non-blocking):**

| Gap | Mitigation |
|-----|------------|
| PRD status `draft` | Finalize PRD song song; FR stable enough |
| OQ-1: 9 vs 11 pipeline status | Schema dùng 9 enum PRD; thêm sau nếu cần |
| OQ-2 revenue formula | MVP sum Active `packagePrice` — documented |
| Automated tests | Deferred; co-located pattern ready |
| `docker-compose.yml` Postgres | Optional; operator cài PG native OK |

**Critical gaps:** None — ready for implementation.

### Validation Issues Addressed

- Auth changed from none → Credentials (operator request) — reflected in structure + validation.
- Cloud deploy explicitly out of scope — no gap.

### Architecture Completeness Checklist

**Requirements Analysis**

- [x] Project context thoroughly analyzed
- [x] Scale and complexity assessed
- [x] Technical constraints identified
- [x] Cross-cutting concerns mapped

**Architectural Decisions**

- [x] Critical decisions documented with versions
- [x] Technology stack fully specified
- [x] Integration patterns defined
- [x] Performance considerations addressed

**Implementation Patterns**

- [x] Naming conventions established
- [x] Structure patterns defined
- [x] Communication patterns specified
- [x] Process patterns documented

**Project Structure**

- [x] Complete directory structure defined
- [x] Component boundaries established
- [x] Integration points mapped
- [x] Requirements to structure mapping complete

### Architecture Readiness Assessment

**Overall Status:** **READY FOR IMPLEMENTATION**

**Confidence Level:** High — greenfield solo CRM, stack conventional, FR fully mapped.

**Key strengths:**

- UX/PRD/architecture aligned (Hôm nay-first, quick capture, 9 status)
- Local Postgres + auth — production-like without cloud complexity
- Patterns + structure cụ thể cho AI dev stories

**Areas for future enhancement:**

- OAuth, multi-tenant, Zalo sync, Kanban v1.1
- Vitest/Playwright, CI, cloud deploy
- License key masking UI

### Implementation Handoff

**AI agent guidelines:**

- Follow `architecture.md` as single source of truth
- Respect `ActionResult`, auth guard, `PIPELINE_STATUS_LABELS`
- Implement theo implementation sequence Step 4

**First implementation priority:**

```bash
npx shadcn@latest init -t next --defaults -n .
# hoặc init trong repo root BmadCRMMini nếu đã có folder
cd BmadCRMMini
npm install prisma @prisma/client next-auth@beta bcryptjs
npx prisma init --datasource-provider postgresql
# setup .env → migrate → seed → auth → Hôm nay dashboard
```
