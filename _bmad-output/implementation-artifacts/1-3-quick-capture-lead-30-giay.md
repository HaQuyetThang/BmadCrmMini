# Story 1.3: Quick capture lead 30 giây

Status: done

## Story

As an **Operator**,
I want **capture lead Zalo từ bất kỳ màn hình bằng sheet 3 field**,
so that **tôi lưu lead trong ~30 giây không rời Zalo** (UJ-2, FR-5, FR-6).

## Acceptance Criteria

1. **Given** Prisma schema  
   **When** migrate cho story này  
   **Then** chỉ thêm model `Customer` với fields tối thiểu: `name`, `source` (default "Zalo"), `firstMessage`, `pipelineStatus` (default `LEAD_MOI`), `statusChangedAt`, `deletedAt`, timestamps  
   **And** không tạo Ticket/TimelineEntry models ở story này

2. **Given** operator đã đăng nhập trên bất kỳ surface  
   **When** click nút `+` global hoặc keyboard shortcut  
   **Then** sheet slide từ phải với 3 field: tên, nguồn (default Zalo), nội dung tin nhắn đầu — UX-DR10, NFR-6  
   **And** Esc đóng sheet không lưu

3. **Given** sheet mở với tên đã điền  
   **When** click "Lưu"  
   **Then** Server Action `createCustomer` validate Zod, lưu status **Lead mới**, toast "Đã lưu"  
   **And** operator ở lại surface hiện tại; sheet đóng

4. **Given** save thành công  
   **When** toast hiển thị  
   **Then** optional prompt "Promote sang Đang tư vấn?" — không bắt buộc  
   **And** promote cập nhật `pipelineStatus` + `statusChangedAt`

## Tasks / Subtasks

- [x] **Task 1: Prisma Customer foundation** (AC: #1)
  - [x] Add `PipelineStatus` enum with `LEAD_MOI` and `DANG_TU_VAN`
  - [x] Add minimal `Customer` model only; do not add Ticket/TimelineEntry
  - [x] Add migration `add_customer_quick_capture`

- [x] **Task 2: Server Action validation** (AC: #3, #4)
  - [x] Add `src/lib/validations/customer.ts` Zod schema
  - [x] Add `src/actions/customers.ts` with `createCustomer`
  - [x] Auth guard via `requireSession()`
  - [x] Validate and return `ActionResult` with Vietnamese errors

- [x] **Task 3: Global quick capture UI** (AC: #2, #3, #4)
  - [x] Add `src/components/layout/quick-capture-sheet.tsx`
  - [x] Show global `+` trigger from `(app)/layout.tsx`
  - [x] Add keyboard shortcut for opening the sheet
  - [x] Close sheet on successful save; show toast "Đã lưu"
  - [x] Add optional "Promote sang Đang tư vấn?" prompt in success toast

- [x] **Task 4: Verify** (AC: #1–#4)
  - [x] Run Prisma generate/migrate
  - [x] Run `npm run typecheck`, `npm run lint`, `npm run build`
  - [x] Update story file and sprint status to `review`

### Review Findings

- [x] [Review][Patch] `promoteCustomerToConsulting` không filter `deletedAt IS NULL` [`src/actions/customers.ts:66`] — Fixed: dùng `updateMany` với `where: { id, deletedAt: null }`.

- [x] [Review][Patch] String literal `"DANG_TU_VAN"` thay vì Prisma enum import [`src/actions/customers.ts:69`] — Fixed: dùng `PipelineStatus.DANG_TU_VAN`.

- [x] [Review][Patch] Keyboard shortcut `Ctrl+K` kích hoạt dù sheet đang mở [`src/components/layout/quick-capture-sheet.tsx:40-45`] — Fixed: thêm guard `!open`.

- [x] [Review][Patch] `autoFocus` không tác dụng sau lần mở thứ 2 [`src/components/layout/quick-capture-sheet.tsx:128`] — Fixed: `ref` + `useEffect` focus khi `open=true`.

- [x] [Review][Decision] Shortcut `Ctrl+K` có thể conflict browser — Resolved: giữ nguyên `Ctrl+K`, `preventDefault()` đủ cho MVP web app.

- [x] [Review][Defer] Promote toast có thể click nhiều lần [`src/components/layout/quick-capture-sheet.tsx:81-93`] — deferred, pre-existing — Idempotent về data; ghi nhận cho cải thiện UX sau.

- [x] [Review][Defer] Duplicate default logic `source = "Zalo"` [`src/actions/customers.ts:24`, `src/lib/validations/customer.ts:14`] — deferred, pre-existing — Lành tính; refactor khi cần.

## Dev Notes

### Scope Boundaries

| In scope | Out of scope |
|---|---|
| Minimal `Customer` model | Ticket/TimelineEntry models |
| Quick capture 3 fields | Full customer profile fields |
| `createCustomer` Server Action | Customer list/detail screens |
| Optional promote toast action | Full pipeline UI |

### Architecture Notes

- Server Actions must validate auth and authorization inside the action.
- Use `ActionResult<T>` shape from `src/lib/action-result.ts`.
- Use `requireSession()` and return `{ ok: false, error: "Chưa đăng nhập." }` when unauthenticated.
- No REST/tRPC routes; Server Actions only.
- Quick capture is a client island; pages remain thin RSC.

### References

- `_bmad-output/planning-artifacts/epics.md` — Story 1.3
- `_bmad-output/planning-artifacts/architecture.md` — Data Architecture, API & Communication Patterns, Frontend Architecture
- `node_modules/next/dist/docs/01-app/02-guides/forms.md` — Server Actions forms guidance

## Dev Agent Record

### Agent Model Used

GPT-5.5

### Debug Log References

- `npx prisma generate` pass.
- Initial `npx prisma migrate deploy` was blocked while Docker/PostgreSQL was unavailable.
- After Docker was started, `npx prisma migrate deploy` applied `20260620151400_add_customer_quick_capture` successfully.
- `npx prisma db seed` pass.
- `npx prisma validate` pass.
- `npx prisma migrate diff --from-empty --to-schema prisma/schema.prisma --script` confirms generated SQL matches `Customer` + `PipelineStatus`.
- `npm run typecheck`, `npm run lint`, `npm run build` pass.

### Completion Notes List

- Implemented minimal `Customer` model with `PipelineStatus` and migration; no Ticket/TimelineEntry models added.
- Implemented `createCustomer` Server Action with auth guard, Zod validation, Vietnamese `ActionResult` errors and route revalidation.
- Implemented global quick capture sheet with 3 fields, floating `+`, `Ctrl+K` shortcut, success toast "Đã lưu", and optional promote action.
- Story is ready for code review.

### File List

- `package.json`
- `package-lock.json`
- `prisma/schema.prisma`
- `prisma/migrations/20260620151400_add_customer_quick_capture/migration.sql`
- `src/actions/customers.ts`
- `src/app/(app)/layout.tsx`
- `src/app/layout.tsx`
- `src/components/layout/quick-capture-sheet.tsx`
- `src/lib/validations/customer.ts`

## Change Log

- 2026-06-20: Story 1.3 implementation added; DB migration verified and story moved to review.
