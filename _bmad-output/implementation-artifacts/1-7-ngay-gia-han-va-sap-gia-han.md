---

baseline_commit: 3260f08ce61649ae1965b285e8d70e735d7beb8d

---

# Story 1.7: Ngày gia hạn và Sắp gia hạn

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As an **Operator**,
I want **ghi ngày gia hạn và thấy khách sắp/quá hạn**,
so that **tôi không miss renewal** (FR-11).

## Acceptance Criteria

1. **Given** `AppSetting` key `renewalWindowDays` default `14` (seed Story 1.1)  
   **When** tính sắp gia hạn **computed on read** — so sánh `now()` với `renewalDate` (calendar days, local start-of-day — cùng convention `stale-status.ts`)  
   **Then** Khách **sắp gia hạn** khi có `renewalDate` và `0 < daysUntilRenewal ≤ renewalWindowDays`  
   **And** Khách **quá hạn** khi có `renewalDate` và `daysUntilRenewal ≤ 0`  
   **And** **không** thêm cột DB `isRenewalApproaching` / `isOverdue`; **không** cron/background job  
   **And** đọc ngưỡng qua `getSettings()` (fallback `14` nếu key thiếu/invalid — parser strict đã có từ Story 1.6 review)

2. **Given** Chi tiết khách có `renewalDate` trong cửa sổ sắp gia hạn hoặc quá hạn  
   **When** load `/customers/[id]`  
   **Then** hiển thị indicator factual cạnh field **Ngày gia hạn tiếp theo**: warning nếu sắp gia hạn, danger nếu quá hạn (UX-DR17, DESIGN.md §Vàng/Đỏ)  
   **And** copy tiếng Việt factual: **"Gia hạn sau N ngày"** / **"Quá hạn N ngày"** (N = số ngày thực tế; N=0 → **"Gia hạn hôm nay"** với danger)  
   **And** badge/label **luôn có text**, không chỉ màu (UX-DR11, NFR-3)

3. **Given** row trên `/customers` — khách có `renewalDate` sắp/quá hạn  
   **When** render `CustomerListRow`  
   **Then** hiển thị `RenewalStatusBadge` warning (`bg-status-warning-muted text-status-warning`) hoặc danger (`bg-status-danger-muted text-status-danger`)  
   **And** copy cùng rule AC #2; badge tách khỏi pipeline chip (pattern Story 1.6 stale badge)  
   **And** Khách **không** có `renewalDate` hoặc ngoài cửa sổ → **không** hiện renewal badge

4. **Given** operator sửa `renewalDate` hoặc `packagePrice` trên Chi tiết khách  
   **When** `updateCustomer` save thành công  
   **Then** tính toán sắp/quá hạn cập nhật on next load (`router.refresh()` / revalidation đã có)  
   **And** hiển thị `formatCurrency(vnd)` cho giá gói khi có giá trị — suffix `đ`, thousands `.` (architecture §Money display)

5. **Given** helper `get-renewals.ts` (architecture §FR-3)  
   **When** implement pure logic + query  
   **Then** export `getRenewalCustomers()` đọc customers active có `renewalDate` trong cửa sổ hoặc quá hạn, sort `renewalDate ASC`, paginate 25  
   **And** reuse `renewal-status.ts` pure functions — **không** build UI dashboard section **Khách sắp gia hạn** (Story 2.4)

6. **Given** mọi Server Action / page read mới  
   **When** gọi khi chưa auth  
   **Then** giữ pattern hiện tại — protected routes + action guard

7. **Given** phạm vi story  
   **When** implement  
   **Then** **không** build dashboard **Khách sắp gia hạn** / Surface Hôm nay (Stories 2.1–2.4)  
   **And** **không** UI Cài đặt chỉnh `renewalWindowDays` (Story 4.1) — chỉ đọc từ DB  
   **And** **không** thêm route `/renewals` riêng — list reuse `/customers` + helper cho Epic 2

## Tasks / Subtasks

- [x] **Task 1: Pure renewal functions** (AC: #1, #5, #7)
  - [x] Add `src/lib/customers/renewal-status.ts`:
    - `getDaysUntilRenewal(renewalDate: Date, now?: Date): number` — positive=future, 0=today, negative=overdue
    - `getRenewalInfo(renewalDate: Date | null, renewalWindowDays: number, now?: Date): RenewalInfo | null`
    - Export type `RenewalInfo = { status: "approaching" | "overdue"; daysCount: number; label: string }`
    - Label helpers: approaching → `"Gia hạn sau N ngày"`; overdue past → `"Quá hạn N ngày"` (N=abs); today → `"Gia hạn hôm nay"`
  - [x] Mirror `startOfLocalDay` pattern từ `stale-status.ts` — **không** thêm date-fns

- [x] **Task 2: Dashboard read helper (logic only)** (AC: #5, #7)
  - [x] Add `src/lib/dashboard/get-renewals.ts` — `getRenewalCustomers({ page })` query Prisma + map `RenewalInfo`
  - [x] Filter: `renewalDate IS NOT NULL` AND (`daysUntil <= renewalWindowDays` OR overdue)
  - [x] Order `renewalDate ASC`; paginate `PAGE_SIZE`; dùng `activeCustomersWhere`

- [x] **Task 3: Renewal UI component** (AC: #2, #3)
  - [x] Add `src/components/customers/renewal-status-badge.tsx` — props `{ label, status: "approaching" | "overdue" }`; semantic warning/danger tokens

- [x] **Task 4: Wire Chi tiết khách** (AC: #2, #4)
  - [x] Update `src/app/(app)/customers/[id]/page.tsx` — fetch `getSettings()` + compute `renewalInfo` from `customer.renewalDate`
  - [x] Update `CustomerProfileForm` / `CustomerProfileData` — pass `renewalInfo`; show badge/label cạnh field ngày gia hạn
  - [x] Show formatted price: `formatCurrency(customer.packagePrice)` dưới input giá gói (read-only text, không thay input number)

- [x] **Task 5: Wire list rows** (AC: #3)
  - [x] Extend `listCustomers` select `renewalDate`
  - [x] Update `src/app/(app)/customers/page.tsx` — enrich rows với `renewalInfo` server-side (pattern Story 1.6 stale)
  - [x] Update `customer-list-row.tsx` — render `RenewalStatusBadge` khi có `renewalInfo`; preserve stale badge + pipeline chip layout

- [x] **Task 6: Verify** (AC: #1–#7)
  - [x] `npm run typecheck`, `npm run lint`, `npm run build`
  - [x] Manual: customer renewalDate +14 ngày → badge warning "Gia hạn sau 14 ngày"
  - [x] Manual: renewalDate -2 ngày → danger "Quá hạn 2 ngày"
  - [x] Manual: renewalDate +30 ngày → không badge
  - [x] Manual: sửa renewalDate → badge cập nhật sau save
  - [x] Manual: packagePrice 1500000 → hiển thị "1.500.000đ"
  - [x] Update story file + sprint status

## Dev Notes

### Prerequisite: Stories 1.4 + 1.6 must be present

- **Story 1.4:** `renewalDate`, `packagePrice`, `billingCycle` đã có trên profile form + `updateCustomer` Zod validation.
- **Story 1.6:** `getSettings()` với `renewalWindowDays`; strict `parsePositiveInt`; stale badge/list patterns trên `/customers`.
- **Không cần** Story 1.5 pipeline cho renewal logic — renewal áp dụng mọi customer có `renewalDate`, không filter theo pipeline group.

### Scope Boundaries

| In scope | Out of scope |
|---|---|
| Computed renewal detection (`renewalDate` vs `renewalWindowDays`) | Dashboard **Khách sắp gia hạn** section UI (Story 2.4) |
| `renewal-status.ts` pure helpers | Settings edit UI (Story 4.1) |
| `get-renewals.ts` read helper for Epic 2 reuse | KPI row / alert strips (Epic 2) |
| `RenewalStatusBadge` on `/customers` list + profile indicator | Dedicated `/renewals` route |
| `formatCurrency` display on profile | Timeline / ticket (Stories 1.8, 3.x) |
| Extend `listCustomers` + detail page wiring | Persisted `isRenewalApproaching` column |

### Key naming correction (epics vs codebase)

Epics/PRD ghi cửa sổ **"7–14 ngày"** — **codebase thực tế dùng một key `renewalWindowDays`** (seed `prisma/seed.ts` default `14`). Dev **PHẢI** dùng `renewalWindowDays` làm **upper bound** — không tạo key `renewalWindowMinDays`. Epics "7–14" là product guidance; MVP = lookahead tối đa 14 ngày lịch. Quá hạn (`≤0`) luôn surface với danger **ngoài** upper bound.

### Renewal day calculation (exact rule)

```typescript
// daysUntilRenewal = calendar days from startOfLocalDay(now) to startOfLocalDay(renewalDate)
// Positive = future, 0 = today, negative = past
//
// approaching: renewalDate set AND daysUntilRenewal > 0 AND daysUntilRenewal <= renewalWindowDays
// overdue:     renewalDate set AND daysUntilRenewal <= 0
// outside:     renewalDate null OR daysUntilRenewal > renewalWindowDays (and not overdue)
//
// Examples (renewalWindowDays=14):
//   renewal in 5 days  → approaching, label "Gia hạn sau 5 ngày"
//   renewal 2 days ago → overdue, label "Quá hạn 2 ngày"
//   renewal today      → overdue, label "Gia hạn hôm nay"
//   renewal in 20 days → null (no badge)
```

Dùng cùng `startOfLocalDay` như `stale-status.ts`. **Không** thêm dependency mới.

### Architecture Compliance

- **Computed on read** per architecture §Stale / follow-up logic — không persist renewal flag.
- **Component location:** `renewal-status-badge.tsx` trong `src/components/customers/` (FR-10..11 profile domain).
- **Dashboard helper:** `lib/dashboard/get-renewals.ts` per architecture tree — Story 1.7 tạo helper; Story 2.4 consume cho section UI.
- **Settings read:** `renewalWindowDays` qua `getSettings()` — đã có từ Story 1.6.
- **RSC default:** Tính renewal trên server (page/helper); badge component có thể server-only (không cần client state).
- **Semantic tokens:** Approaching = `bg-status-warning-muted text-status-warning`; Overdue = `bg-status-danger-muted text-status-danger` (DESIGN.md §Vàng/Đỏ).
- **Money:** `formatCurrency` từ `src/lib/format.ts` — suffix `đ`, `Intl.NumberFormat("vi-VN")` — **đã implement**, chỉ wire display.

### UX Requirements

| Ref | Requirement |
|-----|-------------|
| UX-DR11 | Badge luôn có text label |
| UX-DR17 | Overdue renewal — row/indicator danger semantic khi ≤0 ngày |
| UX-DR22 | Microcopy tiếng Việt, calm, factual — không "Warning!!!" |
| EXPERIENCE §Overdue renewal | Row danger `{colors.status-danger}` khi ≤0 ngày |
| EXPERIENCE §Copy | "Chị Lan — gia hạn sau 5 ngày" / "Quá hạn 2 ngày" — dashboard row copy Story 2.4 reuse `RenewalInfo.label` |

### Files to UPDATE (read before editing)

| File | Current state | Story changes | Preserve |
|------|---------------|---------------|----------|
| `src/lib/customers/list-customers.ts` | No `renewalDate` in select | Add field to select + optional `renewalInfo` on type | Pagination, filters, soft delete, stale fields |
| `src/app/(app)/customers/page.tsx` | Stale enrichment | Also compute `renewalInfo` per row | Query parse, `getSettings()` parallel fetch |
| `src/app/(app)/customers/[id]/page.tsx` | Stale banner props | Pass `renewalInfo` + formatted price context | notFound guard |
| `customer-list-row.tsx` | Stale + pipeline chip | Add renewal badge when `renewalInfo` | Link, layout UX-DR6 |
| `customer-profile-form.tsx` | renewalDate input exists | Indicator + `formatCurrency` helper text | Form save, delete, stale banner, StatusSelect |

### Files to CREATE

| File | Purpose |
|------|---------|
| `src/lib/customers/renewal-status.ts` | Pure renewal calculation + label |
| `src/lib/dashboard/get-renewals.ts` | Read helper for Story 2.4 dashboard section |
| `src/components/customers/renewal-status-badge.tsx` | UX-DR17 list/profile badge |

### Previous Story Intelligence (1.6)

- **`getSettings()` + strict parse:** Reuse as-is; `renewalWindowDays` already seeded.
- **List enrichment pattern:** Page RSC fetches settings once, maps rows server-side before passing to client rows — mirror for renewal.
- **Badge separation:** Renewal badge **tách** khỏi pipeline chip và stale badge — có thể hiện cả 3 nếu applicable.
- **Review patches to preserve:** Stale banner dismiss reset on status change; strict settings integer parsing.
- **1.6 explicitly deferred renewal:** Scope table marked renewal UI out of scope — implement now without regressing stale.

### Git Intelligence

- Last committed baseline: `3260f08` (Story 1.4). Stories 1.5–1.6 có thể **local uncommitted** — dev agent verify pipeline + stale files tồn tại.
- Established patterns: `activeCustomersWhere`, `ActionResult`, `revalidateCustomerSurfaces`, semantic CSS tokens, `formatCurrency`/`formatDate` in `lib/format.ts`.

### Testing Requirements

- Run: `npm run typecheck`, `npm run lint`, `npm run build`
- Manual checklist:
  - `renewalWindowDays=14` — renewal +13 days → approaching; +15 days → no badge
  - Overdue -1 day → danger "Quá hạn 1 ngày"
  - Today → danger "Gia hạn hôm nay"
  - No `renewalDate` → no badge anywhere
  - Edit renewalDate on profile → badge updates after save/refresh
  - `packagePrice` 2500000 → "2.500.000đ" below input
  - Stale badge still works on same row (no regression)

### References

- [Source: `_bmad-output/planning-artifacts/epics.md` — Story 1.7, FR-11]
- [Source: `_bmad-output/planning-artifacts/architecture.md` — §renewalDate, §renewalWindowDays, §get-renewals.ts, §formatCurrency]
- [Source: `_bmad-output/planning-artifacts/prds/prd-BmadCRMMini-2026-06-19/prd.md` — FR-11]
- [Source: `_bmad-output/planning-artifacts/ux-designs/ux-BmadCRMMini-2026-06-19/EXPERIENCE.md` — Overdue renewal, copy examples]
- [Source: `_bmad-output/planning-artifacts/ux-designs/ux-BmadCRMMini-2026-06-19/DESIGN.md` — status-warning/danger tokens]
- [Source: `_bmad-output/implementation-artifacts/1-6-stale-status-detection-va-nudge.md` — getSettings pattern, list enrichment, deferred renewal scope]
- [Source: `prisma/seed.ts` — `renewalWindowDays` key]
- [Source: `src/lib/format.ts` — `formatCurrency`, `formatDate`]
- [Source: `src/lib/customers/stale-status.ts` — calendar day diff pattern to mirror]

## Dev Agent Record

### Agent Model Used

Composer

### Debug Log References

- `npm run typecheck`, `npm run lint`, `npm run build` — pass.

### Completion Notes List

- Added `renewal-status.ts` with calendar-day diff, `RenewalInfo`, and Vietnamese labels.
- Added `get-renewals.ts` dashboard read helper for Story 2.4 reuse.
- Added `RenewalStatusBadge` with warning/danger semantic tokens.
- Wired renewal badge on `/customers` list rows and profile renewal field.
- Added `formatCurrency` preview below package price input on profile.

### File List

- `src/lib/customers/renewal-status.ts`
- `src/lib/dashboard/get-renewals.ts`
- `src/components/customers/renewal-status-badge.tsx`
- `src/lib/customers/list-customers.ts`
- `src/app/(app)/customers/page.tsx`
- `src/app/(app)/customers/[id]/page.tsx`
- `src/components/customers/customer-list-row.tsx`
- `src/components/customers/customer-profile-form.tsx`

## Change Log

- 2026-06-21: Story 1.7 context file created — ready-for-dev.
- 2026-06-21: Story 1.7 implementation complete — renewal detection, badges, formatCurrency; moved to review.

### Review Findings

- [x] [Review][Patch] `getRenewalDateUpperBound` dùng start-of-day — query Prisma `lte` có thể loại khách ở biên cửa sổ mà `/customers` vẫn hiện badge [`src/lib/customers/renewal-status.ts:55-63`, `src/lib/dashboard/get-renewals.ts:34-41`]
- [x] [Review][Patch] `flatMap` lọc lại bằng `getRenewalInfo` sau query — `total`/`pageCount` không khớp `customers.length` nếu có row bị loại (Story 2.4 pagination) [`src/lib/dashboard/get-renewals.ts:61-67`]
- [x] [Review][Defer] Preview `formatCurrency` dùng prop server, không cập nhật khi operator gõ giá mới trước save [`src/components/customers/customer-profile-form.tsx:211-214`] — deferred, AC đã đáp ứng hiển thị sau load/save
- [x] [Review][Defer] Không có unit test cho `renewal-status.ts` — deferred, AC chỉ yêu cầu manual + build/lint/typecheck
- [x] [Review][Defer] `getRenewalCustomers` chưa gọi `requireSession` trực tiếp [`src/lib/dashboard/get-renewals.ts:30`] — deferred, helper chưa wired; route dashboard sẽ protected qua middleware
