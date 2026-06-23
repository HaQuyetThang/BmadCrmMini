---
baseline_commit: 19768584604cc61139c7ee53f6c50869f54d7e49
---

# Story 2.2: KPI row trên Hôm nay

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As an **Operator**,
I want **glance 3 KPI vận hành trên Hôm nay**,
so that **tôi biết tình hình active/doanh thu/ticket trong 10 giây** (FR-1).

## Acceptance Criteria

1. **Given** `src/lib/dashboard/get-kpis.ts` aggregation query  
   **When** load Hôm nay  
   **Then** hiển thị 3 KPI cards — UX-DR4: Khách Active, Doanh thu tuần/tháng, Ticket mở  
   **And** KPI numbers có `aria-label` đầy đủ — UX-DR20, NFR-3

2. **Given** KPI **Khách Active**  
   **When** tính toán  
   **Then** đếm Customer `pipelineStatus = ACTIVE` và `deletedAt: null` (reuse `activeCustomersWhere`)

3. **Given** KPI **Doanh thu**  
   **When** tính toán  
   **Then** sum `packagePrice` của Customer Active (architecture formula)  
   **And** hiển thị `formatCurrency(vnd)` suffix `đ`

4. **Given** KPI **Ticket mở** — chưa có Ticket model (trước Epic 3)  
   **When** render  
   **Then** hiển thị `0`  
   **And** click điều hướng tới `/tickets?status=open` (placeholder)

5. **Given** phạm vi story 2.2  
   **When** implement  
   **Then** **không** wire alert strips / list sections (Stories 2.3–2.4)  
   **And** **không** thêm Ticket model / migration

## Tasks / Subtasks

- [x] **Task 1: Aggregation query** (AC: #2, #3, #4, #5)
  - [x] Add `src/lib/dashboard/get-kpis.ts` — `getDashboardKpis()` parallel `count` + `aggregate._sum.packagePrice`
  - [x] `openTicketCount: 0` hardcoded until Epic 3
  - [x] Export `DashboardKpis` type

- [x] **Task 2: Wire KPI components** (AC: #1, #3, #4)
  - [x] Update `KpiRow` — accept `kpis: DashboardKpis` prop; format revenue via `formatCurrency`
  - [x] Update `KpiCard` — optional `href` for clickable Ticket KPI (Link + focus ring)
  - [x] aria-labels: `Khách active: N`, `Doanh thu tuần tháng: Xđ`, `Ticket mở: N`
  - [x] Update `TodayDashboard` + `page.tsx` — async fetch `getDashboardKpis()`, pass props
  - [x] `export const dynamic = "force-dynamic"` — fresh KPI on each request

- [x] **Task 3: Verify** (AC: #1–#5)
  - [x] `npm run typecheck`, `npm run build`
  - [x] E2E `tests/e2e/epic-2/kpi-row.spec.ts` — seed ACTIVE + packagePrice, assert KPI updates + ticket link
  - [x] Update `today-layout.spec.ts` — ticket KPI role `link` (post-2.2)
  - [x] Extend `tests/helpers/db.ts` — `packagePrice` on `seedCustomer`

## Dev Notes

### Prerequisite: Story 2.1

- `KpiRow`, `KpiCard`, `TodayDashboard` shell exist — story này wire data thật
- Layout B, skeleton, empty list sections unchanged

### Scope Boundaries

| In scope | Out of scope |
|----------|--------------|
| `get-kpis.ts` + wire KpiRow | `get-alerts.ts` (2.3) |
| Ticket KPI link placeholder | Ticket count thật (Epic 3) |
| `formatCurrency` display | Alert / list data (2.4) |

### References

- [Source: epics.md Story 2.2]
- [Source: architecture.md §Revenue KPI — sum packagePrice Active]
- [Source: src/lib/format.ts — formatCurrency]
- [Source: src/lib/db-helpers.ts — activeCustomersWhere]

## Dev Agent Record

### Agent Model Used

Composer

### Completion Notes List

- Added `getDashboardKpis()` with parallel Prisma count + aggregate for ACTIVE customers.
- Revenue displays via `formatCurrency`; ticket KPI shows 0 with Link to `/tickets?status=open`.
- Page fetches KPIs server-side with `force-dynamic` for fresh data.
- E2E epic-2: 5/5 pass (kpi-row + today-layout).

### File List

- `src/lib/dashboard/get-kpis.ts` (new)
- `src/components/dashboard/kpi-card.tsx` (modified)
- `src/components/dashboard/kpi-row.tsx` (modified)
- `src/components/dashboard/today-dashboard.tsx` (modified)
- `src/app/(app)/page.tsx` (modified)
- `tests/e2e/epic-2/kpi-row.spec.ts` (new)
- `tests/e2e/epic-2/today-layout.spec.ts` (modified)
- `tests/helpers/db.ts` (modified)

## Change Log

- 2026-06-21: Story 2.2 — KPI aggregation + wire Hôm nay dashboard row.
- 2026-06-22: Code review passed — 0 patch, 2 defer, 3 dismissed.

### Review Findings

- [x] [Review][Defer] E2E regex `[1-9]` fragile khi active count ≥ 10 [tests/e2e/epic-2/kpi-row.spec.ts:29] — deferred, nên đổi `\d+` khi refactor test
- [x] [Review][Defer] `get-kpis.ts` và `kpi-row.spec.ts` chưa git-track — deferred, cần `git add` trước commit
