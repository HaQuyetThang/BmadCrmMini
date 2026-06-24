---
baseline_commit: 6dac7a9edef29d9ce9ca7281ac37608034d3736f
---

# Story 2.4: Ba danh sách ưu tiên và drill-down

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As an **Operator**,
I want **3 list sections actionable trên Hôm nay**,
so that **tôi chốt việc ưu tiên trong ≤5 phút** (FR-3, UJ-1).

## Acceptance Criteria

1. **Given** section **Việc hôm nay**  
   **When** load Hôm nay  
   **Then** gom actionable union (epics AC, resolve OQ-5): lịch hẹn hôm nay + stale nudge + follow-up nhắc  
   **And** **không** gồm thanh toán quá hạn (đã ở alert strip 2.3) hay Ticket Khẩn (Epic 3)  
   **And** header `text-display-sm` per UX-DR2 / `DashboardListSection`  
   **And** max **25** rows visible; link **"Xem thêm"** khi `total > 25`

2. **Given** section **Khách sắp gia hạn**  
   **When** load  
   **Then** liệt kê Khách có `renewalDate` trong cửa sổ sắp gia hạn hoặc quá hạn — reuse `getRenewalCustomers()` / `getRenewalInfo()` (Story 1.7)  
   **And** row danger (`RenewalStatusBadge` status `overdue`) khi `daysUntilRenewal ≤ 0` — UX-DR17  
   **And** sort `renewalDate asc`; max 25 visible + **"Xem thêm"** khi `total > 25`

3. **Given** section **Lead cần follow-up**  
   **When** load  
   **Then** liệt kê **Lead phase** (`isLeadPhaseStatus`) thỏa **một trong hai**:  
   - stale: `getDaysSinceStatusChange(statusChangedAt) >= staleStatusDays`  
   - no interaction: `getDaysSince(lastInteractionAt ?? statusChangedAt) >= followUpDays`  
   **And** row badge warning `StaleStatusBadge` **"N ngày không đổi"** khi stale — UX-DR16  
   **And** max 25 visible + **"Xem thêm"** khi `total > 25`

4. **Given** click bất kỳ row trong 3 sections  
   **When** operator click  
   **Then** navigate `/customers/[id]` — UX-DR21  
   **And** `Link` row có focus ring visible (NFR-3); **không** infinite scroll (NFR-7, pagination 25)

5. **Given** section không có item  
   **When** render  
   **Then** giữ empty copy calm `DASHBOARD_EMPTY_COPY` — **"Chưa có việc hôm nay."** (Story 2.1, UX-DR14)  
   **And** **không** ẩn section header

6. **Given** phạm vi story 2.4  
   **When** implement  
   **Then** wire 3 list sections trong `TodayDashboard` + fetch từ `page.tsx`  
   **And** **không** thêm Ticket model / Epic 3 logic  
   **And** **không** UI Cài đặt (Story 4.1) — chỉ đọc `getSettings()`

## Tasks / Subtasks

- [x] **Task 1: Data helpers** (AC: #1–#3, #6)
  - [x] Add `src/lib/dashboard/get-today-tasks.ts` — `getTodayTasks({ limit?: 25 })`
    - Union 3 sources (dedupe by `customerId`, merge metadata):
      1. Appointments today — reuse `appointmentsTodayWhere()` from `date-range.ts`
      2. Stale nudge — `activeCustomersWhere` + `isStaleStatus(statusChangedAt, staleStatusDays)`
      3. Follow-up nhắc — `getDaysSince(interactionAt) >= followUpDays` where `interactionAt = lastInteractionAt ?? statusChangedAt`
    - Priority sort suggestion: overdue renewal-like urgency N/A → stale (desc days) → follow-up (desc days) → appointments (`demoScheduledAt asc`)
    - Export `TodayTaskItem = { id, name, source, kind, badgeLabel?, href }`
  - [x] Add `src/lib/dashboard/get-follow-up-leads.ts` — `getFollowUpLeads({ limit?: 25 })`
    - Where: lead phase + (stale OR no-interaction per AC #3)
    - Map `staleDaysCount` via `getLeadStaleDaysCount` when stale
    - Sort: stale first (desc days), then interaction gap desc
  - [x] Reuse existing `getRenewalCustomers({ page: 1 })` — **không** rewrite query logic từ Story 1.7

- [x] **Task 2: Row + section UI** (AC: #1–#5)
  - [x] Add `src/components/dashboard/dashboard-priority-row.tsx` — clickable `Link` row
    - Reuse layout tokens từ `customer-list-row.tsx` (border card, hover, focus ring)
    - Props: `name`, `subtitle`, `href`, optional `RenewalStatusBadge` / `StaleStatusBadge` / task kind label
    - `aria-label` descriptive: `"{name}: {badge or kind}"`
  - [x] Extend `DashboardListSection` — optional `viewMoreHref?: string`, `viewMoreLabel?: string` (default **"Xem thêm"**)
    - Show link below rows when `total > visibleCount`
  - [x] **Không** tạo `priority-list-section.tsx` riêng nếu `DashboardListSection` đủ — tránh duplicate (2.1 pattern)

- [x] **Task 3: Wire dashboard** (AC: #1–#6)
  - [x] Update `src/app/(app)/page.tsx` — extend `Promise.all`:
    ```ts
    const [kpis, alerts, todayTasks, renewals, followUpLeads] = await Promise.all([
      getDashboardKpis(),
      getDashboardAlerts(),
      getTodayTasks(),
      getRenewalCustomers({ page: 1 }),
      getFollowUpLeads(),
    ]);
    ```
  - [x] Update `TodayDashboard` props — pass 3 list payloads; map rows per section
  - [x] View-more hrefs (MVP):
    - Việc hôm nay → `/customers?filter=demo-today` (partial; document limitation) **hoặc** `/customers` nếu union không có filter đơn
    - Sắp gia hạn → `/customers` (renewal badge visible on list — Story 1.7)
    - Lead follow-up → `/pipeline` (lead rows + stale badge — Story 1.6)

- [x] **Task 4: Verify** (AC: #1–#6)
  - [x] `npm run typecheck`, `npm run build`
  - [x] E2E `tests/e2e/epic-2/priority-lists.spec.ts` — seed:
    - Customer demo today → visible in Việc hôm nay
    - Customer renewal approaching/overdue → renewal section + danger badge when ≤0
    - Lead stale + lead no-interaction → follow-up section
    - Click row → `/customers/[id]`
  - [x] Update `today-layout.spec.ts` — empty state vẫn 3 sections; regression KPI/alerts

## Dev Notes

### Prerequisite: Stories 2.1–2.3 + Epic 1 helpers

| Already exists | Use for |
|----------------|---------|
| `DashboardListSection` + `DASHBOARD_SECTION_TITLES` | 3 section shells + empty copy |
| `get-renewals.ts` + `renewal-status.ts` + `RenewalStatusBadge` | Section Khách sắp gia hạn |
| `date-range.ts` (`appointmentsTodayWhere`) | Việc hôm nay appointments |
| `stale-status.ts` (`getStaleInfo`, `getLeadStaleDaysCount`, `isLeadPhaseStatus`) | Stale + follow-up |
| `get-settings.ts` (`staleStatusDays`, `followUpDays`, `renewalWindowDays`) | Thresholds |
| `customer-list-row.tsx` | Row layout/focus pattern — **reuse styles**, don't import directly if props differ |
| `log-timeline-entry.ts` sets `lastInteractionAt` | Follow-up accuracy (Story 1.8) |

### Current State (READ BEFORE EDIT)

**`today-dashboard.tsx`** — 3 `DashboardListSection` **không có children** (empty):

```tsx
<DashboardListSection title={DASHBOARD_SECTION_TITLES.todayTasks} />
<DashboardListSection title={DASHBOARD_SECTION_TITLES.renewals} />
<DashboardListSection title={DASHBOARD_SECTION_TITLES.followUpLeads} />
```

**`page.tsx`** — parallel fetch KPI + alerts only; cần thêm 3 list helpers.

**`get-renewals.ts`** — đã implement đầy đủ query + pagination `PAGE_SIZE=25`; dashboard chỉ cần `page: 1`.

**Chưa có:** `get-today-tasks.ts`, `get-follow-up-leads.ts`, dashboard row component.

### Việc hôm nay — Union Rules (resolve OQ-5)

| Source | Include? | Query hint |
|--------|----------|------------|
| Lịch hẹn hôm nay | ✅ | `appointmentsTodayWhere()` |
| Stale nudge | ✅ | `isStaleStatus(statusChangedAt, staleStatusDays)` on active customers |
| Follow-up nhắc | ✅ | `daysSince(lastInteractionAt ?? statusChangedAt) >= followUpDays` |
| Thanh toán quá hạn | ❌ | Alert strip 2.3 + `/customers?filter=payment-overdue` |
| Ticket Khẩn | ❌ | Epic 3 |

**Dedup:** Cùng `customerId` xuất hiện nhiều lý do → **1 row**, ưu tiên badge cao nhất (stale > follow-up > appointment).

### Lead cần follow-up — Logic

```ts
// Lead phase only
const isLead = isLeadPhaseStatus(pipelineStatus);
const stale = isStaleStatus(statusChangedAt, staleStatusDays);
const interactionAt = lastInteractionAt ?? statusChangedAt;
const daysSinceInteraction = getDaysSinceStatusChange(interactionAt); // reuse helper
const needsFollowUp = daysSinceInteraction >= followUpDays;
// Include if isLead && (stale || needsFollowUp)
```

**Epic wording** `lastInteractionAt > follow-up threshold` = không tương tác **≥** `followUpDays` (calendar days, local).

### Renewal window

- Story 1.7: approaching when `0 < daysUntil ≤ renewalWindowDays`; overdue when `≤ 0`
- Epic mentions "7–14 ngày" — **đọc `renewalWindowDays` từ settings** (default 14), không hardcode 7
- Row danger: `renewalInfo.status === "overdue"` (includes `daysUntil === 0` → "Gia hạn hôm nay")

### Scope Boundaries

| In scope | Out of scope |
|----------|--------------|
| 3 dashboard list sections wired | Ticket rows / `/tickets` drill-down |
| `get-today-tasks.ts`, `get-follow-up-leads.ts` | Settings UI (4.1) |
| Dashboard row + view-more links | New customer list filters (unless trivial) |
| E2E priority lists | KPI / alert changes (2.2, 2.3 done) |

### Component Design (UX-DR2, DR16, DR17, DR21)

- Section header: `text-display-sm` — already in `DashboardListSection`
- Row: full-width `Link`, `rounded-md border`, hover muted, `focus-visible:ring-3`
- Badges: reuse `RenewalStatusBadge`, `StaleStatusBadge` — text labels, không chỉ màu (NFR-3)
- View more: `text-body-sm text-muted-foreground underline-offset-4` — mirror `alert-strip-row` overflow link style

### Architecture Compliance

- **Pages compose only** — `page.tsx` fetch all, pass props; không Prisma trong components
- **`lib/dashboard/*`** — read-only; không `"use server"`
- **Pagination** — `PAGE_SIZE` (25) from `lib/constants/pagination.ts`; không infinite scroll
- **Reuse** `activeCustomersWhere` / `deletedAt: null` on every customer query

### File Structure (expected changes)

| File | Action |
|------|--------|
| `src/lib/dashboard/get-today-tasks.ts` | NEW |
| `src/lib/dashboard/get-follow-up-leads.ts` | NEW |
| `src/lib/dashboard/get-renewals.ts` | READ only (maybe export limit helper) |
| `src/components/dashboard/dashboard-priority-row.tsx` | NEW |
| `src/components/dashboard/dashboard-list-section.tsx` | UPDATE — view more link |
| `src/components/dashboard/today-dashboard.tsx` | UPDATE — wire 3 sections |
| `src/app/(app)/page.tsx` | UPDATE — parallel fetch 5 queries |
| `tests/e2e/epic-2/priority-lists.spec.ts` | NEW |
| `tests/e2e/epic-2/today-layout.spec.ts` | UPDATE — regression |

### Testing Requirements

- Mirror `alert-strips.spec.ts`: login → `seedCustomer` / adjust dates → reload `/` → assert section headings + row visible
- Assert renewal danger badge text matches `/Quá hạn|Gia hạn hôm nay/` when overdue
- Assert stale badge `N ngày không đổi` on follow-up section
- Click row → `toHaveURL(/\/customers\/.+/)`
- Empty DB: 3 sections still show empty copy (today-layout regression)

### Previous Story Intelligence (2.3)

- Server fetch: `Promise.all` + `force-dynamic` + prop drilling qua `TodayDashboard`
- Reuse `date-range.ts` — **same date logic** as alerts (don't duplicate)
- E2E: `uniqueName` prefix `E2E `, `\d+` regex for counts, `cleanupE2eCustomers` in `afterAll`
- Code review defer: `requireSession` optional in dashboard helpers (middleware protects)
- Story 2.3 **explicitly deferred** list sections — this story owns them

### Git Intelligence

Recent commits: `feat(dashboard): ... Story 2.x` per story. Baseline `6dac7a9` — Story 2.3 alert strips merged. Uncommitted artifacts may exist; branch from latest HEAD.

### References

- [Source: epics.md Story 2.4]
- [Source: architecture.md §Việc hôm nay L319–325, §FR-3 mapping L856, §data flow L882–883]
- [Source: prd.md FR-3, OQ-5 composition]
- [Source: ux DESIGN.md §display-sm, status-warning/danger tokens]
- [Source: implementation-artifacts/1-7-ngay-gia-han-va-sap-gia-han.md — get-renewals helper]
- [Source: implementation-artifacts/2-3-alert-strips-uu-tien.md — date-range, scope boundary]
- [Source: implementation-artifacts/1-8-timeline-tuong-tac-tren-chi-tiet-khach.md — lastInteractionAt]

## Dev Agent Record

### Agent Model Used

Composer

### Completion Notes List

- `get-today-tasks.ts` union lịch hẹn + stale + follow-up; dedupe theo priority stale > follow-up > appointment.
- `get-follow-up-leads.ts` lead phase stale hoặc no-interaction; sort stale desc.
- `DashboardPriorityRow` + `DashboardListSection` view-more; wire 3 sections trong `TodayDashboard`.
- `page.tsx` parallel fetch 5 dashboard queries.
- E2E epic-2: 10/10 pass (3 tests mới priority-lists).

### File List

- `src/lib/dashboard/get-today-tasks.ts` (new)
- `src/lib/dashboard/get-follow-up-leads.ts` (new)
- `src/components/dashboard/dashboard-priority-row.tsx` (new)
- `src/components/dashboard/dashboard-list-section.tsx` (modified)
- `src/components/dashboard/today-dashboard.tsx` (modified)
- `src/app/(app)/page.tsx` (modified)
- `tests/e2e/epic-2/priority-lists.spec.ts` (new)
- `tests/helpers/db.ts` (modified)
- `src/lib/customers/stale-status.ts` (modified — `getInclusiveDayCutoff`)

## Change Log

- 2026-06-23: Story 2.4 created — 3 priority list sections, data helpers, drill-down rows, E2E plan.
- 2026-06-23: Story 2.4 implemented — wired 3 dashboard lists with drill-down and E2E coverage.
- 2026-06-23: Code review patches — `getInclusiveDayCutoff` fix prefetch boundary; E2E no-interaction, drill-down 3 sections, Xem thêm overflow.

### Review Findings

- [x] [Review][Patch] Prefetch cutoff `lte` midnight gây false negative stale/follow-up [src/lib/dashboard/get-today-tasks.ts:56-60,107,115-116] [src/lib/dashboard/get-follow-up-leads.ts:31-35,49-52]
- [x] [Review][Patch] E2E thiếu lead no-interaction (chỉ `lastInteractionAt`) [tests/e2e/epic-2/priority-lists.spec.ts]
- [x] [Review][Patch] E2E thiếu assert "Xem thêm" khi `total > 25` [tests/e2e/epic-2/priority-lists.spec.ts]
- [x] [Review][Patch] E2E drill-down chỉ cover Việc hôm nay, không renewals/follow-up [tests/e2e/epic-2/priority-lists.spec.ts:75-86]
- [x] [Review][Defer] Unbounded `findMany` + merge in-memory trước slice 25 [src/lib/dashboard/get-today-tasks.ts:98-175] — deferred, MVP scale pattern giống 2.3
- [x] [Review][Defer] View-more renewals/pipeline không filter subset [src/components/dashboard/today-dashboard.tsx:56-81] — deferred, MVP documented Task 3
- [x] [Review][Defer] `getRenewalInfo(...)!` non-null assertion [src/lib/dashboard/get-renewals.ts:63] — deferred, pre-existing story 1.7
- [x] [Review][Defer] Focus ring NFR-3 không có E2E [src/components/dashboard/dashboard-priority-row.tsx:38] — deferred, manual/a11y suite sau
