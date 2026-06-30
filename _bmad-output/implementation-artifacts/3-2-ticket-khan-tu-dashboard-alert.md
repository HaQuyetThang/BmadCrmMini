---
baseline_commit: 909a45976c5f8458546fda254a04cde2803631a2
---

# Story 3.2: Ticket khẩn từ dashboard alert

Status: done

## Story

As an **Operator**,
I want **mở ticket khẩn từ cảnh báo dashboard với context khách**,
so that **tôi thấy license/key ngay khi hỗ trợ login** (FR-13, UJ-3).

## Acceptance Criteria

1. **Given** Ticket Khẩn mở tồn tại  
   **When** load Surface Hôm nay  
   **Then** alert strip ticket khẩn hiển thị count > 0 — wire FR-2 đầy đủ  
   **And** KPI Ticket mở đếm chính xác (done 3.1 — verify)

2. **Given** operator click alert strip ticket khẩn  
   **When** điều hướng  
   **Then** mở ticket detail + **Chi tiết khách** context cùng lúc (split view)  
   **And** license/key above fold trên context khách — UX-DR8

3. **Given** operator xử lý xong  
   **When** đóng ticket + one-click log "Hỗ trợ login"  
   **Then** timeline entry mới trên profile khách  
   **And** ticket status success chip (UX-DR11 success variant)

## Tasks / Subtasks

- [x] **Task 1: Wire urgent alert** (AC: #1)
  - [x] `countOpenUrgentTickets()` + dynamic href `/tickets/[id]` first urgent
  - [x] Update `get-alerts.ts` replace hardcoded 0

- [x] **Task 2: Ticket detail split view** (AC: #2)
  - [x] `get-ticket-by-id.ts` + `/tickets/[id]/page.tsx`
  - [x] `TicketDetailPanel` + `TicketCustomerContext` (license above fold)

- [x] **Task 3: Complete support flow** (AC: #3)
  - [x] `completeTicketSupport` action — close + `logTimelineEntry` preset
  - [x] `TicketClosedBadge` success + detail panel CTA

- [x] **Task 4: Verify** (AC: #1–#3)
  - [x] `typecheck`, `build`
  - [x] E2E `tests/e2e/epic-3/urgent-ticket-alert.spec.ts`

### Review Findings

- [x] [Review][Decision] `completeTicketSupport` hiển thị cho mọi ticket đang mở — Resolved: guard chỉ KHAN (UI + server action)

- [x] [Review][Patch] Trang detail có hai `<h1>` — `ticket.title` đổi thành h2 [`src/components/tickets/ticket-detail-panel.tsx:49`]

- [x] [Review][Patch] `TicketDetailPanel` state `isClosed` không sync khi đổi route — thêm `useEffect` sync theo `ticket.id`/`closedAt` [`src/components/tickets/ticket-detail-panel.tsx:21`]

- [x] [Review][Patch] `TicketListRow` bỏ qua `ticket.closedAt` từ server — init `isClosed` từ `ticket.closedAt` [`src/components/tickets/ticket-list-row.tsx:22`]

- [x] [Review][Patch] E2E regex urgent count chỉ match 1 chữ số — đổi sang `\d+` [`tests/e2e/epic-3/urgent-ticket-alert.spec.ts:30`]

- [x] [Review][Patch] E2E test isolation giữa 2 test trong describe — `cleanupE2eCustomers` trong `beforeEach` [`tests/e2e/epic-3/urgent-ticket-alert.spec.ts:11`]

- [x] [Review][Patch] Fallback urgent href thiếu `status=open` — cập nhật `DASHBOARD_ALERT_HREFS.urgentTickets` [`src/lib/constants/dashboard.ts:16`]

- [x] [Review][Patch] `completeTicketSupport` race double-submit — `updateMany` với `closedAt: null` guard trong transaction [`src/actions/tickets.ts:155`]

- [x] [Review][Patch] Customer visibility rule không nhất quán — dùng `activeCustomersWhere` trong `completeTicketSupport` [`src/actions/tickets.ts:136`]

- [x] [Review][Patch] Nhãn context khách không khớp AC#2 — đổi thành "Chi tiết khách" [`src/components/tickets/ticket-customer-context.tsx:18`]

- [x] [Review][Defer] KPI Ticket mở không assert trong E2E 3.2 — AC#1 yêu cầu verify 3.1; đã cover trong `ticket-crud.spec.ts`, không lặp trong `urgent-ticket-alert.spec.ts` [`tests/e2e/epic-3/urgent-ticket-alert.spec.ts`] — deferred, covered by 3.1

- [x] [Review][Defer] Hai query riêng cho urgent count + first ID — `countOpenUrgentTickets` và `getFirstOpenUrgentTicketId` chạy song song; có thể gộp một round-trip [`src/lib/dashboard/get-alerts.ts:46`] — deferred, optimization

- [x] [Review][Defer] `closeTicket` vs `completeTicketSupport` side effects khác nhau — Đóng từ queue không log timeline; đóng từ detail panel có log — by design phân tách luồng [`src/actions/tickets.ts:69`] — deferred, intentional

## Dev Notes

- Reuse `LOGIN_SUPPORT_PRESET`, `logTimelineEntry` pattern from story 1.8
- Alert href: first open KHAN ticket by `createdAt asc` (oldest urgent first)
- Queue row link → `/tickets/[id]` for consistency
- KPI already real from 3.1 — no change unless regression

## Dev Agent Record

### Agent Model Used

Composer

### Completion Notes List

- `get-alerts.ts` wire `countOpenUrgentTickets` + href `/tickets/{firstUrgentId}`.
- `/tickets/[id]` split view: `TicketDetailPanel` + `TicketCustomerContext` (license/key above fold).
- `completeTicketSupport` — transaction đóng ticket + timeline NOTE "Hỗ trợ login".
- `TicketClosedBadge` success chip sau hoàn thành.
- Queue row drill-down → `/tickets/[id]`.
- `typecheck` + `build` pass; E2E epic-3 urgent-ticket-alert added.

### File List

- `src/lib/tickets/list-tickets.ts` (modified)
- `src/lib/tickets/get-ticket-by-id.ts` (new)
- `src/lib/dashboard/get-alerts.ts` (modified)
- `src/lib/validations/ticket.ts` (modified)
- `src/lib/revalidate-ticket-surfaces.ts` (modified)
- `src/actions/tickets.ts` (modified)
- `src/components/tickets/ticket-detail-panel.tsx` (new)
- `src/components/tickets/ticket-customer-context.tsx` (new)
- `src/components/tickets/ticket-status-badge.tsx` (new)
- `src/components/tickets/ticket-list-row.tsx` (modified)
- `src/app/(app)/tickets/[id]/page.tsx` (new)
- `tests/helpers/db.ts` (modified)
- `tests/e2e/epic-3/urgent-ticket-alert.spec.ts` (new)
- `_bmad-output/implementation-artifacts/sprint-status.yaml` (modified)

## Change Log

- 2026-06-24: Story 3.2 created.
- 2026-06-24: Story 3.2 implemented — urgent alert wire, split detail view, complete support flow.
- 2026-06-24: Code review patches applied — KHAN guard, a11y, E2E isolation, transaction race fix.
