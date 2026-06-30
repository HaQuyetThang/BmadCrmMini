---
baseline_commit: 909a45976c5f8458546fda254a04cde2803631a2
---

# Story 3.1: Ticket CRUD và queue

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As an **Operator**,
I want **tạo và quản lý ticket hỗ trợ gắn khách**,
so that **tôi theo dõi yêu cầu hỗ trợ có hệ thống** (FR-12).

## Acceptance Criteria

1. **Given** Prisma migrate  
   **When** thêm model `Ticket` (customerId, title, priority NORMAL/KHAN, closedAt, timestamps)  
   **Then** relation Customer 1:N Ticket  
   **And** Server Actions trong `src/actions/tickets.ts` với auth guard + Zod

2. **Given** Chi tiết khách  
   **When** operator tạo ticket với title + priority (Thường/Khẩn)  
   **Then** ticket lưu với `closedAt = null`  
   **And** badge "Khẩn" có text label — UX-DR11

3. **Given** surface **Ticket** (`/tickets`)  
   **When** load queue  
   **Then** filter: mở/đóng, Khẩn/tất cả; paginate 25 rows  
   **And** list row pattern UX-DR6

4. **Given** operator đóng ticket  
   **When** mark closed  
   **Then** set `closedAt = now()`; ticket biến khỏi filter "mở"  
   **And** KPI Ticket mở trên Hôm nay giảm (Story 2.2)

## Tasks / Subtasks

- [x] **Task 1: Schema + migration** (AC: #1)
  - [x] Add `TicketPriority` enum + `Ticket` model per architecture.md
  - [x] Migration + `prisma generate`

- [x] **Task 2: Actions + validation** (AC: #1, #4)
  - [x] `src/lib/validations/ticket.ts` — create + list query schemas
  - [x] `src/actions/tickets.ts` — `createTicket`, `closeTicket` + `requireSession`
  - [x] `revalidateTicketSurfaces()` — `/`, `/tickets`, customer detail

- [x] **Task 3: Queue surface** (AC: #3, #4)
  - [x] `src/lib/tickets/list-tickets.ts` — filters status/urgent, PAGE_SIZE 25, sort KHAN first
  - [x] `TicketPriorityBadge`, `TicketListRow`, `TicketQueue` components
  - [x] Wire `src/app/(app)/tickets/page.tsx` (replace placeholder)

- [x] **Task 4: Create from customer detail** (AC: #2)
  - [x] `CreateTicketForm` on customer profile — title + priority Thường/Khẩn

- [x] **Task 5: KPI wire** (AC: #4)
  - [x] `get-kpis.ts` — real `openTicketCount` (replace hardcoded 0)

- [x] **Task 6: Verify** (AC: #1–#4)
  - [x] `npm run typecheck`, `npm run build`
  - [x] E2E `tests/e2e/epic-3/ticket-crud.spec.ts`

### Review Findings

- [x] [Review][Patch] `closeTicket` thiếu Zod schema — AC1 và architecture yêu cầu Zod tại Server Action boundary; `createTicket` dùng `createTicketSchema` nhưng `closeTicket` chỉ `ticketId.trim()` [`src/actions/tickets.ts:75`]

- [x] [Review][Patch] E2E KPI assertion yếu — test chỉ so `kpiTextAfter !== kpiTextBefore`, không xác nhận count giảm đúng 1; có thể pass khi KPI drift từ test khác [`tests/e2e/epic-3/ticket-crud.spec.ts:54`]

- [x] [Review][Patch] Nút Đóng vẫn click được sau close thành công — trong cửa sổ `router.refresh()` user có thể bấm lại và nhận toast lỗi misleading [`src/components/tickets/ticket-list-row.tsx:33`]

- [x] [Review][Defer] `urgentTicketCount` hardcoded 0 trong alert strip — out of scope Story 3.2 [`src/lib/dashboard/get-alerts.ts:47`] — deferred, pre-existing

- [x] [Review][Defer] Không E2E pagination 25 rows — `list-tickets.ts` dùng `PAGE_SIZE=25` đúng AC3; thiếu test seed >25 và navigate trang 2 [`tests/e2e/epic-3/ticket-crud.spec.ts`] — deferred, MVP test gap

- [x] [Review][Defer] Timeline auto-log khi đóng ticket — `TICKET` type có sẵn nhưng `closeTicket` không gọi `logTimelineEntry`; Story 3.2 [`src/actions/tickets.ts:93`] — deferred, out of scope

- [x] [Review][Defer] Không confirmation dialog trước đóng ticket — một click là đóng ngay; UX enhancement ngoài AC [`src/components/tickets/ticket-list-row.tsx:24`] — deferred

- [x] [Review][Defer] Double-submit form tạo ticket — `isPending` chưa chặn resubmit đồng bộ; pattern giống quick-capture story 1.3 [`src/components/customers/create-ticket-form.tsx:24`] — deferred, pre-existing pattern

## Dev Notes

### Scope boundaries (Story 3.1 only)

| In scope | Out of scope (Story 3.2) |
|----------|--------------------------|
| Ticket model + CRUD actions | Alert strip urgent count wire |
| `/tickets` queue + filters | Ticket detail split view + customer context |
| Create from customer detail | Timeline auto-log on close |
| KPI open ticket count | `urgent=1` drill-down UX polish |

### Architecture compliance

- Model per `architecture.md` L224-270: `TicketPriority { NORMAL, KHAN }`, `Ticket` fields
- Actions: `"use server"`, `requireSession`, `ActionResult`, Zod `safeParse`
- Pages compose only — `page.tsx` fetches `listTickets`, passes props
- `lib/tickets/*` read-only queries; no `"use server"`
- Pagination: `PAGE_SIZE` (25) from `lib/constants/pagination.ts`
- List row UX-DR6: match `customer-list-row.tsx` / `pipeline-list-row.tsx` tokens
- Badge UX-DR11: text label "Khẩn" / "Thường" — reuse `Badge` + status tokens

### References

- [Source: epics.md Story 3.1]
- [Source: architecture.md §Ticket model L224-270]

## Dev Agent Record

### Agent Model Used

Composer

### Completion Notes List

- Prisma `Ticket` + `TicketPriority`; migration `20260623120000_add_ticket`.
- `createTicket` / `closeTicket` actions + Zod validation; revalidate `/`, `/tickets`, customer detail.
- `/tickets` queue: filter mở/đóng + Khẩn (`urgent=1`), paginate 25, row UX-DR6, đóng inline.
- `CreateTicketForm` trên chi tiết khách; badge "Khẩn" text label.
- `get-kpis.ts` đếm ticket mở thật qua `countOpenTickets()`.
- `typecheck` + `build` pass; E2E epic-3 added (chạy `npx playwright install` nếu browser chưa có).

### File List

- `prisma/schema.prisma` (modified)
- `prisma/migrations/20260623120000_add_ticket/migration.sql` (new)
- `src/lib/constants/ticket.ts` (new)
- `src/lib/validations/ticket.ts` (new)
- `src/lib/tickets/list-tickets.ts` (new)
- `src/lib/revalidate-ticket-surfaces.ts` (new)
- `src/actions/tickets.ts` (new)
- `src/components/tickets/ticket-priority-badge.tsx` (new)
- `src/components/tickets/ticket-list-row.tsx` (new)
- `src/components/tickets/ticket-queue.tsx` (new)
- `src/components/customers/create-ticket-form.tsx` (new)
- `src/components/customers/customer-profile-form.tsx` (modified)
- `src/app/(app)/tickets/page.tsx` (modified)
- `src/lib/dashboard/get-kpis.ts` (modified)
- `tests/e2e/epic-3/ticket-crud.spec.ts` (new)
- `_bmad-output/implementation-artifacts/sprint-status.yaml` (modified)

## Change Log

- 2026-06-23: Story 3.1 created — Ticket CRUD, queue, KPI wire plan.
- 2026-06-23: Story 3.1 implemented — Ticket model, queue surface, create from customer, KPI count.
- 2026-06-24: Code review patches — closeTicket Zod schema, E2E KPI strict assert, hide close button after success.
