---
baseline_commit: 94fdd199ff17ef56a9d9d4484a33946883ce80d7
---

# Story 2.3: Alert strips ưu tiên

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As an **Operator**,
I want **thấy tối đa 3 cảnh báo above fold và drill-down vào list**,
so that **tôi xử lý việc khẩn trước** (FR-2).

## Acceptance Criteria

1. **Given** `src/lib/dashboard/get-alerts.ts` aggregation  
   **When** load Hôm nay  
   **Then** hiển thị tối đa 3 alert strip above fold — UX-DR5: lịch hẹn hôm nay, thanh toán quá hạn, Ticket Khẩn mở  
   **And** mỗi strip: count + label ngắn tiếng Việt calm (`DASHBOARD_ALERT_LABELS`)

2. **Given** >3 loại cảnh báo có count > 0 — UX-DR15  
   **When** render  
   **Then** hiển thị top 3 theo priority + link **"Xem tất cả (N)"** — không stack >3 strip  
   **And** MVP có 3 loại cố định → overflow link ẩn khi ≤3 loại active; vẫn implement data shape + render path

3. **Given** click alert strip có count > 0  
   **When** operator click  
   **Then** điều hướng list đã sort theo ưu tiên tương ứng  
   **And** focus ring visible trên strip interactive (NFR-3, UX-DR5)

4. **Given** Ticket Khẩn chưa có (trước Epic 3)  
   **When** render alerts  
   **Then** `urgentTicketCount = 0` hardcoded  
   **And** **ẩn** strip Ticket Khẩn khi count = 0 (không render placeholder disabled)

5. **Given** lịch hẹn / thanh toán  
   **When** tính từ `demoScheduledAt` / `paymentDueAt` trên Customer  
   **Then** lịch hẹn: `demoScheduledAt` trong ngày hôm nay (local)  
   **And** thanh toán quá hạn: `pipelineStatus = CHO_THANH_TOAN` + `paymentDueAt <= endOfToday`

6. **Given** phạm vi story 2.3  
   **When** implement  
   **Then** **không** wire 3 list sections (Story 2.4)  
   **And** **không** thêm Ticket model / migration Ticket (Epic 3)

## Tasks / Subtasks

- [x] **Task 1: Schema + profile fields** (AC: #5, #6)
  - [x] Migration Prisma: thêm `demoScheduledAt DateTime?`, `paymentDueAt DateTime?` trên `Customer` (architecture.md L252–253)
  - [x] Extend `updateCustomerSchema` + `updateCustomer` action — date inputs giống pattern `renewalDate`
  - [x] Extend `CustomerProfileData` + `customer-profile-form.tsx` — 2 field date optional: "Lịch hẹn demo", "Hạn thanh toán"
  - [x] Extend `getCustomerById` / page mapper trả fields mới
  - [x] Extend `tests/helpers/db.ts` `seedCustomer` — `demoScheduledAt?`, `paymentDueAt?`

- [x] **Task 2: Alert aggregation** (AC: #1, #4, #5)
  - [x] Add `src/lib/dashboard/get-alerts.ts` — `getDashboardAlerts()` parallel `count` queries
  - [x] Helper `getTodayRange()` local (start 00:00:00, end 23:59:59.999) — inline hoặc `lib/dashboard/date-range.ts`
  - [x] Appointments: `demoScheduledAt` trong `[start, end]` + `deletedAt: null`
  - [x] Overdue payments: `pipelineStatus: CHO_THANH_TOAN` + `paymentDueAt: { lte: end }` + `deletedAt: null`
  - [x] `urgentTicketCount: 0` hardcoded until Epic 3
  - [x] Export types: `DashboardAlert`, `DashboardAlerts` (`visible`, `overflowTotal`, `viewAllHref?`)

- [x] **Task 3: Drill-down lists** (AC: #3)
  - [x] Extend `customerListQuerySchema` — `filter?: "demo-today" | "payment-overdue"`
  - [x] Extend `listCustomers` where/orderBy khi có filter:
    - `demo-today`: same date logic as alerts; `orderBy: { demoScheduledAt: "asc" }`
    - `payment-overdue`: same as alerts; `orderBy: { paymentDueAt: "asc" }`
  - [x] Wire `customers/page.tsx` parse `filter` param
  - [x] Href map (architecture L883):
    - appointments → `/customers?filter=demo-today`
    - overdue → `/customers?filter=payment-overdue`
    - urgent (placeholder) → `/tickets?urgent=1`

- [x] **Task 4: Wire UI components** (AC: #1–#4)
  - [x] Update `AlertStrip` — props `href?`, `variant?: "warning" | "danger" | "neutral"`; `Link` khi `href` + count > 0; semantic `border-l` + muted bg per DESIGN.md
  - [x] Update `AlertStripRow` — accept `alerts: DashboardAlerts`; map labels từ constants; ẩn urgent khi 0; ẩn strip khác khi count = 0
  - [x] Optional overflow link "Xem tất cả (N)" khi `overflowTotal > 0`
  - [x] Update `TodayDashboard` + `page.tsx` — `Promise.all([getDashboardKpis(), getDashboardAlerts()])`, pass `alerts` prop
  - [x] Giữ `export const dynamic = "force-dynamic"` trên page

- [x] **Task 5: Verify** (AC: #1–#6)
  - [x] `npm run typecheck`, `npm run build`
  - [x] E2E `tests/e2e/epic-2/alert-strips.spec.ts` — seed demo today + overdue payment; assert counts + click drill-down URLs
  - [x] Update `today-layout.spec.ts` nếu cần — region "Cảnh báo ưu tiên" vẫn visible; không assert 3 strip khi all zero

## Dev Notes

### Prerequisite: Stories 2.1 + 2.2

- `AlertStrip`, `AlertStripRow` shell tồn tại — count `0`, `disabled`, neutral border
- `TodayDashboard` đã nhận `kpis` từ `page.tsx` — mirror pattern cho `alerts`
- `get-kpis.ts` pattern: parallel Prisma, export type, `activeCustomersWhere` reuse
- `DASHBOARD_ALERT_LABELS` đã có trong `src/lib/constants/dashboard.ts`

### Current State (READ BEFORE EDIT)

**`alert-strip.tsx`** — `button` disabled, `aria-disabled="true"`, neutral `border-l-muted-foreground/40`:

```tsx
export function AlertStrip({ count, label, className }: AlertStripProps) {
  return (
    <button type="button" disabled aria-disabled="true" ...>
```

**`alert-strip-row.tsx`** — static `ALERT_ITEMS`, always `count={0}`, no props.

**`prisma/schema.prisma`** — **chưa có** `demoScheduledAt` / `paymentDueAt` (deferred từ Story 1.4/1.5). Architecture đã định nghĩa — story này **phải** migration.

**`customers/page.tsx`** — chỉ parse `page`, `group`, `q` — chưa có `filter` drill-down.

### Alert Query Rules (architecture.md L321–325)

| Kind | Prisma where | Sort (drill-down) | Variant |
|------|--------------|-------------------|---------|
| Lịch hẹn hôm nay | `demoScheduledAt` in today range | `demoScheduledAt asc` | warning |
| Thanh toán quá hạn | `CHO_THANH_TOAN` + `paymentDueAt lte endOfToday` | `paymentDueAt asc` | danger |
| Ticket Khẩn | hardcode `0` (Epic 3) | `/tickets?urgent=1` placeholder | danger |

**Priority order** (top 3): danger overdue → danger urgent → warning appointments (điều chỉnh nếu product khác — document trong code constant).

### Scope Boundaries

| In scope | Out of scope |
|----------|--------------|
| `get-alerts.ts` + wire AlertStripRow | `get-today-tasks.ts` (2.4) |
| Migration `demoScheduledAt` / `paymentDueAt` | Ticket model / urgent count thật (Epic 3) |
| Profile form 2 date fields | List row components (2.4) |
| Customer `filter` drill-down | `/tickets` filter logic thật (Epic 3) |
| E2E alert strips | KPI changes (2.2 done) |

### Component Design (UX-DR5, DESIGN.md)

- Strip clickable: `border-l-[3px]` semantic
  - warning: `border-l-status-warning bg-status-warning-muted`
  - danger: `border-l-status-danger bg-status-danger-muted`
- Count `text-display-sm tabular-nums`; label `text-body-sm text-muted-foreground`
- `aria-label`: `"{label}: {count}"` — giữ pattern 2.1
- Strip count = 0 → **không render** (trừ overflow link)

### Architecture Compliance

- **Pages compose only** — `page.tsx` fetch, pass props; không Prisma trong components
- **`lib/dashboard/*`** — read-only; không `"use server"`
- **Mutations** — profile update qua `actions/customers.ts` + `revalidateCustomerSurfaces()` (đã revalidate `/`)
- **Reuse** `activeCustomersWhere` / `deletedAt: null` trên mọi customer query

### File Structure (expected changes)

| File | Action |
|------|--------|
| `prisma/schema.prisma` | UPDATE — 2 DateTime fields |
| `prisma/migrations/*` | NEW |
| `src/lib/dashboard/get-alerts.ts` | NEW |
| `src/lib/dashboard/date-range.ts` | NEW (optional) |
| `src/lib/validations/customer.ts` | UPDATE — filter + update fields |
| `src/lib/customers/list-customers.ts` | UPDATE — filter where/orderBy |
| `src/actions/customers.ts` | UPDATE — persist new dates |
| `src/app/(app)/customers/page.tsx` | UPDATE — parse filter |
| `src/app/(app)/customers/[id]/page.tsx` | UPDATE — map new fields |
| `src/components/customers/customer-profile-form.tsx` | UPDATE — 2 date inputs |
| `src/components/dashboard/alert-strip.tsx` | UPDATE — Link, variant |
| `src/components/dashboard/alert-strip-row.tsx` | UPDATE — props, overflow |
| `src/components/dashboard/today-dashboard.tsx` | UPDATE — pass alerts |
| `src/app/(app)/page.tsx` | UPDATE — parallel fetch |
| `tests/e2e/epic-2/alert-strips.spec.ts` | NEW |
| `tests/helpers/db.ts` | UPDATE — seed fields |

### Testing Requirements

- Mirror `kpi-row.spec.ts`: login → seed via `tests/helpers/db.ts` → reload `/` → assert aria-label counts
- Click strip → `toHaveURL` với filter query
- Không assert urgent strip visible khi count 0
- `npm run typecheck` + `npm run build` bắt buộc trước review

### Previous Story Intelligence (2.2)

- Server fetch pattern: async `page.tsx` + `force-dynamic` + prop drilling qua `TodayDashboard`
- `KpiCard` dùng `Link` + `href?` + focus ring — **reuse pattern** cho `AlertStrip`
- E2E seed qua `seedCustomer` + `uniqueName` prefix `E2E `
- Code review defer: dùng `\d+` trong regex count assertions, không `[1-9]`
- Story 2.2 **không** đụng alerts — regression risk thấp nếu chỉ thêm props

### Git Intelligence

Recent pattern: feature commits per story (`feat(dashboard): ... Story 2.x`). Baseline `94fdd19` — Epic 1.8 timeline merged; dashboard shell at 2.1.

### References

- [Source: epics.md Story 2.3]
- [Source: architecture.md §Customer fields L252–253, §Việc hôm nay L319–325, §FR-2 mapping L855, §data flow L882–883]
- [Source: ux DESIGN.md alert-strip-danger/warning tokens]
- [Source: src/components/dashboard/alert-strip.tsx — shell to wire]
- [Source: src/lib/dashboard/get-kpis.ts — parallel query pattern]
- [Source: implementation-artifacts/2-1-layout-hom-nay-skeleton-va-empty-states.md — deferred alerts scope]

## Dev Agent Record

### Agent Model Used

Composer

### Completion Notes List

- Migration thêm `demoScheduledAt` / `paymentDueAt`; profile form + `updateCustomer` persist 2 date fields.
- `get-alerts.ts` + `date-range.ts` — parallel count, priority sort, overflow shape cho UX-DR15.
- Customer list `filter=demo-today|payment-overdue` với orderBy ưu tiên.
- `AlertStrip` clickable Link + semantic variants; ẩn strip count=0; region `min-h-10` khi empty.
- E2E epic-2: 7/7 pass (alert-strips + regression 2.1/2.2).

### File List

- `prisma/schema.prisma` (modified)
- `prisma/migrations/20260622120000_add_customer_alert_dates/migration.sql` (new)
- `src/lib/dashboard/date-range.ts` (new)
- `src/lib/dashboard/get-alerts.ts` (new)
- `src/lib/constants/dashboard.ts` (modified)
- `src/lib/validations/customer.ts` (modified)
- `src/lib/customers/list-customers.ts` (modified)
- `src/actions/customers.ts` (modified)
- `src/app/(app)/page.tsx` (modified)
- `src/app/(app)/customers/page.tsx` (modified)
- `src/app/(app)/customers/[id]/page.tsx` (modified)
- `src/components/customers/customer-profile-form.tsx` (modified)
- `src/components/customers/customer-list.tsx` (modified)
- `src/components/dashboard/alert-strip.tsx` (modified)
- `src/components/dashboard/alert-strip-row.tsx` (modified)
- `src/components/dashboard/today-dashboard.tsx` (modified)
- `tests/e2e/epic-2/alert-strips.spec.ts` (new)
- `tests/e2e/epic-2/today-layout.spec.ts` (modified)
- `tests/helpers/db.ts` (modified)

## Change Log

- 2026-06-22: Story 2.3 created — alert aggregation, schema fields, drill-down filters, wire strips.
- 2026-06-22: Story 2.3 implemented — alert strips wired with drill-down and E2E coverage.
- 2026-06-23: Code review passed — no patch/decision items; defer findings logged.

### Review Findings

- [x] [Review][Defer] `getDashboardAlerts` không gọi `requireSession` trực tiếp [`src/lib/dashboard/get-alerts.ts:41`] — deferred, page protected qua middleware; pattern giống 1.7.
- [x] [Review][Defer] Không có index DB cho `demoScheduledAt` / `paymentDueAt` [`prisma/schema.prisma:46-47`] — deferred, tối ưu khi dataset lớn.
- [x] [Review][Defer] E2E chỉ assert drill-down URL, không verify sort order trên list [`tests/e2e/epic-2/alert-strips.spec.ts:65-70`] — deferred, AC#3 partial coverage đủ MVP.
- [x] [Review][Defer] `optionalDateField` parse UTC từ `type="date"` — timezone edge [`src/lib/validations/customer.ts:47`] — deferred, pattern renewalDate có sẵn.
- [x] [Review][Defer] `viewAllHref: "/customers"` generic khi overflow [`src/lib/dashboard/get-alerts.ts:87`] — deferred, dead path MVP (≤3 loại alert).
- [x] [Review][Defer] File untracked + mixed 2-2/2-3 trong working tree — deferred, cần `git add` và tách commit trước push.
