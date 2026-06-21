---

baseline_commit: 3260f08ce61649ae1965b285e8d70e735d7beb8d

---

# Story 1.6: Stale status detection và nudge

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As an **Operator**,
I want **thấy cảnh báo khi status khách không đổi quá lâu**,
so that **tôi không quên follow-up lead** (FR-8).

## Acceptance Criteria

1. **Given** `AppSetting` key `staleStatusDays` default `14` (seed Story 1.1)  
   **When** tính stale **computed on read** — so sánh `now()` với `statusChangedAt`  
   **Then** Khách **stale** khi số ngày lịch (calendar days) kể từ `statusChangedAt` **≥** `staleStatusDays`  
   **And** **không** thêm cột DB `isStale`; **không** cron/background job  
   **And** đọc ngưỡng qua helper `getSettings()` (fallback `14` nếu key thiếu/invalid)

2. **Given** Chi tiết khách **stale** (mọi pipeline status)  
   **When** load `/customers/[id]`  
   **Then** inline banner dismissible phía trên header: **"Cập nhật trạng thái?"** — calm tone, semantic warning (UX-DR22, EXPERIENCE §Stale nudge)  
   **And** dismiss lưu **per-customer trong `sessionStorage`** key `stale-banner-dismissed:{customerId}` — banner ẩn đến khi reload tab mới hoặc customer hết stale  
   **And** banner có nút dismiss accessible (aria-label "Đóng cảnh báo")

3. **Given** **Lead stale** trên list — UX-DR16 (`pipelineStatus` thuộc visual group **lead**: `LEAD_MOI`, `DANG_TU_VAN`)  
   **When** render row trên `/customers` hoặc `/pipeline`  
   **Then** badge warning (`bg-status-warning-muted text-status-warning`) + text **"N ngày không đổi"** (N = số ngày thực tế)  
   **And** badge **luôn có text label**, không chỉ màu (UX-DR11, NFR-3)  
   **And** Khách **closing/customer** group stale **không** hiện list badge (chỉ banner detail — AC #2)

4. **Given** operator cập nhật pipeline status (detail `StatusSelect` hoặc pipeline row inline)  
   **When** `updatePipelineStatus` save thành công  
   **Then** `statusChangedAt` reset = `now()` (đã có trong `applyPipelineStatusUpdate`)  
   **And** stale flag clear on next render; banner biến mất; list badge biến mất sau revalidation

5. **Given** helper list hiện tại (`listCustomers`, `listPipelineCustomers`)  
   **When** mở rộng cho stale UI  
   **Then** select thêm `statusChangedAt` nếu cần; tính `isStale` + `staleDaysCount` ở server trước khi pass props xuống Client Component  
   **And** serialize `statusChangedAt` ISO string qua boundary nếu row là client child

6. **Given** mọi Server Action / page read mới  
   **When** gọi khi chưa auth  
   **Then** giữ pattern hiện tại — protected routes + action guard

7. **Given** phạm vi story  
   **When** implement  
   **Then** **không** build dashboard **Lead cần follow-up** / **Việc hôm nay** stale sections (Stories 2.3–2.4)  
   **And** **không** UI Cài đặt chỉnh ngưỡng (Story 4.1) — chỉ đọc `staleStatusDays` từ DB  
   **And** **không** dùng `lastInteractionAt` (field chưa tồn tại; follow-up ≠ stale)

## Tasks / Subtasks

- [x] **Task 1: Settings helper + stale pure functions** (AC: #1, #7)
  - [x] Add `src/lib/settings/get-settings.ts` — `getSettings()` đọc 3 keys seed; parse int; fallback defaults (`staleStatusDays: 14`, `followUpDays: 7`, `renewalWindowDays: 14`)
  - [x] Add `src/lib/customers/stale-status.ts`:
    - `getDaysSinceStatusChange(statusChangedAt: Date, now?: Date): number`
    - `isStaleStatus(statusChangedAt: Date, staleStatusDays: number, now?: Date): boolean`
    - `isLeadPhaseStatus(status: PipelineStatus): boolean` — dùng `PIPELINE_STATUS_LABELS[status].group === "lead"`
  - [x] Export type `StaleInfo = { isStale: boolean; daysCount: number }` helper `getStaleInfo(...)`

- [x] **Task 2: Stale UI components** (AC: #2, #3)
  - [x] Add `src/components/pipeline/stale-status-badge.tsx` — warning badge "N ngày không đổi"
  - [x] Add `src/components/pipeline/stale-banner.tsx` — client; props `{ customerId, daysCount }`; sessionStorage dismiss; copy "Cập nhật trạng thái?"

- [x] **Task 3: Wire Chi tiết khách** (AC: #2, #4)
  - [x] Update `src/app/(app)/customers/[id]/page.tsx` — fetch `getSettings()` + pass `statusChangedAt` + stale props
  - [x] Update `CustomerProfileForm` / data type — render `StaleBanner` above `CustomerProfileHeader` when stale && not dismissed client-side
  - [x] Verify `StatusSelect` success clears stale via `router.refresh()` / local state (pattern Story 1.5 review)

- [x] **Task 4: Wire list rows** (AC: #3, #5)
  - [x] Extend `listCustomers` select `statusChangedAt`; map stale info server-side in page hoặc helper
  - [x] Extend `listPipelineCustomers` — compute `staleInfo` per row in page RSC
  - [x] Update `customer-list-row.tsx` — show `StaleStatusBadge` when lead + stale (alongside or below chip)
  - [x] Update `pipeline-list-row.tsx` — same pattern; preserve full-row link + StatusSelect stopPropagation

- [x] **Task 5: Pipeline constants (optional DRY)** (AC: #3)
  - [x] Add `LEAD_PIPELINE_STATUSES` constant array in `pipeline.ts` nếu cần filter — derive từ `PIPELINE_STATUS_LABELS`, không hardcode string

- [x] **Task 6: Verify** (AC: #1–#7)
  - [x] `npm run typecheck`, `npm run lint`, `npm run build`
  - [x] Manual: tạo/sửa customer với `statusChangedAt` cũ (Prisma Studio) → banner + badge xuất hiện
  - [x] Manual: dismiss banner → ẩn; reload tab → banner lại nếu vẫn stale
  - [x] Manual: đổi status → banner/badge biến mất
  - [x] Manual: closing status stale → chỉ banner detail, không list badge
  - [x] Update story file + sprint status

### Review Findings

- [x] [Review][Patch] Dismiss state của stale banner không reset khi customer hết stale [src/components/pipeline/stale-banner.tsx:42]
- [x] [Review][Patch] Parser settings chấp nhận chuỗi không phải số nguyên thuần, có thể làm sai ngưỡng stale [src/lib/settings/get-settings.ts:21]

## Dev Notes

### Prerequisite: Story 1.5 must be present

Story 1.5 (`updatePipelineStatus`, full 9 enum, `statusChangedAt` reset on change, `/pipeline` list) **bắt buộc** trước khi dev story này. Hiện tại code 1.5 có thể **chưa commit** (local changes trên `3260f08`) — dev agent phải verify các file pipeline tồn tại trước khi implement stale.

### Scope Boundaries

| In scope | Out of scope |
|---|---|
| Computed stale detection (`statusChangedAt` vs `staleStatusDays`) | Dashboard lists / KPI (Epic 2) |
| `getSettings()` read helper (minimal — 3 keys) | Settings edit UI (Story 4.1) |
| Inline banner on Chi tiết khách | Timeline auto-log on status change (Story 1.8) |
| Lead stale badge on `/customers` + `/pipeline` rows | `lastInteractionAt` follow-up logic |
| `StaleStatusBadge` + `StaleBanner` components | Renewal / Sắp gia hạn UI (Story 1.7) |
| sessionStorage dismiss per customer | Persistent dismiss across sessions |

### Key naming correction (epics vs codebase)

Epics ghi `staleDays` — **codebase thực tế dùng `staleStatusDays`** (seed `prisma/seed.ts`, architecture §Seed defaults). Dev **PHẢI** dùng `staleStatusDays` — không tạo key mới.

### Stale day calculation (exact rule)

```typescript
// Calendar days elapsed since statusChangedAt (start of day UTC or local — match formatDate convention)
// Stale when daysCount >= staleStatusDays
// Example: staleStatusDays=14, statusChangedAt 15 calendar days ago → isStale=true, badge "15 ngày không đổi"
```

Dùng `date-fns` **chỉ nếu đã có trong project** — nếu chưa, implement bằng `Math.floor((now - statusChangedAt) / 86400000)` hoặc native `Temporal`/Date UTC midnight. **Không** thêm dependency mới chỉ cho diff ngày.

### Architecture Compliance

- **Computed on read** per architecture §Stale / follow-up logic — không persist stale flag.
- **Component location:** `stale-banner.tsx` trong `src/components/pipeline/` per architecture project tree (FR-8).
- **Settings read:** `AppSetting` qua `getSettings()` per architecture §Data boundaries — Story 1.6 là consumer đầu tiên (Story 1.1 đã defer helper).
- **Lead stale for dashboard later:** Architecture §Việc hôm nay — "Lead stale (pipeline phase Lead + stale status)" — Story 1.6 tạo pure functions để Story 2.4 reuse `isStaleStatus` + `isLeadPhaseStatus`.
- **Mutation side effect:** `applyPipelineStatusUpdate` đã set `statusChangedAt: new Date()` — **không sửa** trừ khi bug; stale clear là hệ quả tự nhiên.
- **RSC default:** Tính stale trên server (page/helper); chỉ `StaleBanner` (dismiss) là client.
- **Semantic tokens:** Warning badge dùng `bg-status-warning-muted text-status-warning` — khớp DESIGN.md §Vàng cho stale.

### UX Requirements

| Ref | Requirement |
|-----|-------------|
| UX-DR11 | Badge luôn có text label |
| UX-DR16 | Lead list row: warning badge + "N ngày không đổi" |
| UX-DR22 | Microcopy tiếng Việt, calm, factual |
| EXPERIENCE §Stale nudge | Banner "Cập nhật trạng thái?" dismissible on profile |
| EXPERIENCE §State Stale lead | `{colors.status-warning}` + "14 ngày không đổi" example |

Banner copy **chính xác**: `"Cập nhật trạng thái?"` — không thêm CTA dài, không modal.

### Files to UPDATE (read before editing)

| File | Current state | Story changes | Preserve |
|------|---------------|---------------|----------|
| `src/lib/customers/list-customers.ts` | No `statusChangedAt` in select | Add field to select + type | Pagination, filters, soft delete |
| `src/lib/customers/list-pipeline-customers.ts` | Has `statusChangedAt` | Page computes stale; optional enrich return type | Sort, filter, pagination 25 |
| `src/app/(app)/customers/page.tsx` | RSC list | Fetch settings once; pass stale props to rows | Query parse, filters |
| `src/app/(app)/pipeline/page.tsx` | RSC pipeline list | Same stale enrichment | Status filter |
| `src/app/(app)/customers/[id]/page.tsx` | Profile without stale | Pass `statusChangedAt`, settings threshold | notFound guard |
| `customer-list-row.tsx` | Name + chip only | Add stale badge for lead+stale | Link, layout UX-DR6 |
| `pipeline-list-row.tsx` | Chip + StatusSelect | Add stale badge for lead+stale | Full-row link, stopPropagation |
| `customer-profile-form.tsx` | Header + form | Render StaleBanner when stale | Form save, delete dialog |

### Files to CREATE

| File | Purpose |
|------|---------|
| `src/lib/settings/get-settings.ts` | Read AppSetting with typed defaults |
| `src/lib/customers/stale-status.ts` | Pure stale calculation + lead phase check |
| `src/components/pipeline/stale-status-badge.tsx` | UX-DR16 row badge |
| `src/components/pipeline/stale-banner.tsx` | FR-8 profile banner |

### Previous Story Intelligence (1.5)

- **`statusChangedAt` prerequisite:** Story 1.5 explicitly sets `statusChangedAt = now()` on every pipeline change — stale detection depends on this.
- **Review patches to preserve:** StatusSelect optimistic UI; profile status change without losing unsaved form (`refreshOnSuccess={false}` + local state); pipeline row full click via overlay Link.
- **List patterns:** Pagination clamp, per-field query catch, `orderBy` secondary `id` for stable sort.
- **Component reuse:** `PipelineStatusChip` for status; stale badge is **separate** warning badge — không merge vào chip.
- **1.5 explicitly deferred stale:** Scope table marked "Stale detection/banner (Story 1.6)" out of scope — implement now without regressing pipeline list/status change.

### Git Intelligence

- Baseline commit: `3260f08` — Story 1.4 last committed; Story 1.5 implementation exists as **local uncommitted changes**.
- Established patterns: `activeCustomersWhere`, `ActionResult`, `revalidateCustomerSurfaces`, semantic CSS tokens in `globals.css`.

### Testing Requirements

- Run: `npm run typecheck`, `npm run lint`, `npm run build`
- Manual checklist:
  - Seed/default `staleStatusDays=14` — customer unchanged 13 days → not stale; 14+ days → stale
  - Lead stale → badge on `/customers` and `/pipeline`
  - Customer group (`ACTIVE`) stale 20 days → banner on detail only, no list badge
  - Dismiss banner → hidden until new session tab
  - Change status via StatusSelect → stale clears immediately after refresh
  - Soft-deleted customer → not in lists (unchanged)

### References

- [Source: `_bmad-output/planning-artifacts/epics.md` — Story 1.6, UX-DR16]
- [Source: `_bmad-output/planning-artifacts/architecture.md` — §Stale/follow-up computed on read, §getSettings(), §stale-banner.tsx, §Seed staleStatusDays]
- [Source: `_bmad-output/planning-artifacts/prds/prd-BmadCRMMini-2026-06-19/prd.md` — FR-8]
- [Source: `_bmad-output/planning-artifacts/ux-designs/ux-BmadCRMMini-2026-06-19/EXPERIENCE.md` — Stale nudge, State Stale lead]
- [Source: `_bmad-output/planning-artifacts/ux-designs/ux-BmadCRMMini-2026-06-19/DESIGN.md` — status-warning colors]
- [Source: `_bmad-output/implementation-artifacts/1-5-pipeline-status-va-lead-pipeline-list.md` — statusChangedAt side effect, deferred stale scope]
- [Source: `prisma/seed.ts` — `staleStatusDays` key]
- [Source: `src/actions/customers.ts` — `applyPipelineStatusUpdate`]

## Dev Agent Record

### Agent Model Used

Composer

### Debug Log References

- `npm run typecheck`, `npm run lint`, `npm run build` — pass after `StaleBanner` refactored to `useSyncExternalStore` (eslint react-hooks/set-state-in-effect).

### Completion Notes List

- Added `getSettings()` reading `staleStatusDays` / `followUpDays` / `renewalWindowDays` with seed fallbacks.
- Added pure stale helpers (`getStaleInfo`, `getLeadStaleDaysCount`, `isLeadPhaseStatus`) using local calendar-day diff.
- Added `StaleStatusBadge` (warning semantic) and `StaleBanner` (sessionStorage dismiss via `useSyncExternalStore`).
- Wired stale badge on lead rows in `/customers` and `/pipeline`; banner on customer detail for any stale status.
- Profile status change clears banner via local state without router.refresh (preserves Story 1.5 form UX).
- Added `LEAD_PIPELINE_STATUSES` derived from `PIPELINE_STATUS_LABELS`.

### File List

- `src/lib/settings/get-settings.ts`
- `src/lib/customers/stale-status.ts`
- `src/lib/customers/list-customers.ts`
- `src/lib/customers/list-pipeline-customers.ts`
- `src/lib/constants/pipeline.ts`
- `src/components/pipeline/stale-status-badge.tsx`
- `src/components/pipeline/stale-banner.tsx`
- `src/components/customers/customer-list-row.tsx`
- `src/components/customers/customer-profile-form.tsx`
- `src/components/pipeline/pipeline-list-row.tsx`
- `src/app/(app)/customers/page.tsx`
- `src/app/(app)/customers/[id]/page.tsx`
- `src/app/(app)/pipeline/page.tsx`

## Change Log

- 2026-06-21: Story 1.6 context file created — ready-for-dev.
- 2026-06-21: Code review — fixed stale banner dismiss reset on status change; strict settings integer parsing.
