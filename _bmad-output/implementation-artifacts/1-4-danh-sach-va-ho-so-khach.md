---
baseline_commit: d320616fe9c2bebad00b87d93b98aede758ef003
---

# Story 1.4: Danh sách và hồ sơ Khách

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As an **Operator**,
I want **xem danh sách khách và mở hồ sơ với 5 trường + license above fold**,
so that **tôi enrich dần hồ sơ sau khi capture lead** (FR-9, FR-10).

## Acceptance Criteria

1. **Given** Prisma schema hiện tại (Story 1.3 — `Customer` minimal)  
   **When** migrate cho story này  
   **Then** thêm enum `BusinessGroup` (`KE_TOAN`, `MARKETING`, `KHAC`) và các profile fields trên `Customer`: `businessGroup` (default `KHAC`), `serviceType`, `contactChannel`, `specialNotes`, `renewalDate`, `packagePrice` (`Decimal(12,2)`), `billingCycle`, `licenseKey`  
   **And** **không** thêm `Ticket`, `TimelineEntry`, `demoScheduledAt`, `paymentDueAt`, hay mở rộng full 9 `PipelineStatus` (thuộc Story 1.5)

2. **Given** surface **Khách hàng** (`/customers`)  
   **When** operator load trang  
   **Then** list hiển thị Khách **không soft-deleted** (`deletedAt IS NULL`), paginate **25 rows/page** (NFR-8)  
   **And** filter theo **Nhóm nghiệp vụ** (Kế toán / Marketing / Khác) qua query param `?group=`

3. **Given** operator nhập search trên list  
   **When** query khớp `name` hoặc `source` (case-insensitive, partial match)  
   **Then** list lọc theo kết quả; paginate vẫn 25 rows  
   **And** không có kết quả → empty copy **"Không thấy khách. Thử tên hoặc Zalo."** (UX-DR18, UX-DR22)

4. **Given** list row — UX-DR6  
   **When** render mỗi row  
   **Then** tên **bold**, meta line **muted** (vd. nguồn + ngày tạo), status badge **phải** với text label (UX-DR11)  
   **And** row click (hoặc Enter khi focus) mở **Chi tiết khách** `/customers/[id]`

5. **Given** **Chi tiết khách** `/customers/[id]`  
   **When** mở profile hợp lệ  
   **Then** header hiển thị tên + badge nhóm nghiệp vụ (neutral) + status chip — UX-DR8  
   **And** field **License/key** visible **above fold** (không scroll trên desktop ≥1024px)

6. **Given** form sửa hồ sơ trên Chi tiết khách  
   **When** operator cập nhật **Hồ sơ 5 trường** + license:
   - Loại dịch vụ (`serviceType`)
   - Kênh liên hệ chính (`contactChannel`)
   - Ghi chú đặc biệt (`specialNotes`)
   - Ngày gia hạn tiếp theo (`renewalDate`)
   - Gói/giá/chu kỳ (`packagePrice` + `billingCycle`: monthly | yearly | project)  
   **Then** Server Action `updateCustomer` validate Zod, lưu thành công, toast **"Đã lưu"**, `revalidatePath`  
   **And** mọi field profile **có thể trống** — enrich sau capture lead được

7. **Given** operator chọn **Nhóm nghiệp vụ** trên form  
   **When** save  
   **Then** `businessGroup` cập nhật (`KE_TOAN` | `MARKETING` | `KHAC`)  
   **And** badge header phản ánh ngay sau reload/revalidation

8. **Given** operator xóa khách trên Chi tiết khách  
   **When** confirm trong dialog  
   **Then** Server Action `softDeleteCustomer` set `deletedAt = now()` — **không hard delete**  
   **And** khách biến khỏi list; redirect về `/customers`; toast xác nhận ngắn

9. **Given** customer id không tồn tại hoặc đã soft-deleted  
   **When** truy cập `/customers/[id]`  
   **Then** gọi `notFound()` — không leak thông tin khách đã xóa

10. **Given** mọi Server Action mới trong story này  
    **When** gọi khi chưa auth  
    **Then** return `{ ok: false, error: "Chưa đăng nhập." }` per architecture

## Tasks / Subtasks

- [x] **Task 1: Prisma migration — profile fields** (AC: #1)
  - [x] Add `BusinessGroup` enum + profile columns trên `Customer`
  - [x] Migration name gợi ý: `add_customer_profile_fields`
  - [x] `npx prisma generate` + `npx prisma migrate dev`

- [x] **Task 2: Shared lib helpers** (AC: #2, #5, #6)
  - [x] `src/lib/constants/pagination.ts` — `PAGE_SIZE = 25`
  - [x] `src/lib/constants/pipeline.ts` — `PIPELINE_STATUS_LABELS` cho 2 status hiện có (`LEAD_MOI`, `DANG_TU_VAN`); Story 1.5 mở rộng full 9
  - [x] `src/lib/constants/business-group.ts` — labels tiếng Việt: Kế toán / Marketing / Khác
  - [x] `src/lib/db-helpers.ts` — `activeCustomersWhere = { deletedAt: null }`
  - [x] `src/lib/format.ts` — `formatDate(d)` → `dd/MM/yyyy`; `formatCurrency(vnd)` suffix `đ`

- [x] **Task 3: Validations + Server Actions** (AC: #6, #7, #8, #10)
  - [x] Extend `src/lib/validations/customer.ts` — `updateCustomerSchema`, `customerListQuerySchema`
  - [x] Extend `src/actions/customers.ts`:
    - `listCustomers({ page, group, q })` — read-only query helper hoặc inline trong page RSC
    - `updateCustomer(customerId, formData)` — auth + Zod + revalidate
    - `softDeleteCustomer(customerId)` — auth + `updateMany` với `deletedAt: null` guard (pattern Story 1.3 promote)
  - [x] **Preserve** `createCustomer` + `promoteCustomerToConsulting` — không break Quick capture

- [x] **Task 4: Customer list page** (AC: #2, #3, #4)
  - [x] Replace placeholder `src/app/(app)/customers/page.tsx` — RSC fetch + compose
  - [x] Add `src/app/(app)/customers/loading.tsx` — skeleton list rows
  - [x] `src/components/customers/customer-list.tsx` — filter select + search input + pagination
  - [x] `src/components/customers/customer-list-row.tsx` — UX-DR6 row pattern, link to detail

- [x] **Task 5: Customer detail page** (AC: #5, #6, #7, #8, #9)
  - [x] `src/app/(app)/customers/[id]/page.tsx` — RSC fetch customer; `notFound()` if missing/deleted
  - [x] `src/components/customers/customer-profile-header.tsx` — UX-DR8
  - [x] `src/components/customers/customer-profile-form.tsx` — client form; `useTransition` + action
  - [x] Delete confirm via existing `Dialog` component — không nested modal >1 (NFR-7)

- [x] **Task 6: Verify** (AC: #1–#10)
  - [x] `npm run typecheck`, `npm run lint`, `npm run build`
  - [x] Manual: list filter/search/pagination; edit profile; soft delete; Quick capture vẫn hoạt động
  - [x] Update story file + sprint status

### Review Findings

- [x] [Review][Patch] Prisma Decimal được truyền thẳng vào Client Component, có thể làm hỏng trang chi tiết khi `packagePrice` khác null [`src/app/(app)/customers/[id]/page.tsx`]
- [x] [Review][Patch] `renewalDate` invalid bị chuyển thành `null` thay vì báo lỗi field, có thể xóa dữ liệu ngày gia hạn ngoài ý muốn [`src/lib/validations/customer.ts`]
- [x] [Review][Patch] `packagePrice` thiếu guard theo giới hạn `Decimal(12,2)`, có thể fail DB bằng lỗi chung thay vì field error [`src/lib/validations/customer.ts`]
- [x] [Review][Patch] Normalize `packagePrice` xóa dấu `.` nên giá trị decimal kiểu `1000.50` có thể thành `100050` [`src/lib/validations/customer.ts`]
- [x] [Review][Patch] Query param invalid làm rơi toàn bộ filter hợp lệ vì parse cả object fail rồi fallback `{ page: 1 }` [`src/app/(app)/customers/page.tsx`]
- [x] [Review][Patch] Page vượt range có thể render list rỗng dù còn khách và hiển thị `Trang 999 / N` [`src/lib/customers/list-customers.ts`]

## Dev Notes

### Scope Boundaries

| In scope | Out of scope |
|---|---|
| `/customers` list + `/customers/[id]` detail | `/pipeline` list (Story 1.5) |
| Profile 5 fields + license + businessGroup | Full 9 pipeline status enum/UI (Story 1.5) |
| Soft delete | Hard delete / restore |
| Search name + source | Full-text search phức tạp |
| Pagination 25 | Infinite scroll (NFR-7 banned) |
| Status chip display (2 status hiện có) | Status change UI (Story 1.5) |
| `formatDate` / `formatCurrency` helpers | Stale badge, renewal danger row (Stories 1.6, 1.7) |
| Migration profile fields | `demoScheduledAt`, `paymentDueAt`, Timeline (Stories 2.3, 1.8) |

### References

- [Source: `_bmad-output/planning-artifacts/epics.md` — Story 1.4]
- [Source: `_bmad-output/planning-artifacts/architecture.md` — Data Architecture, Format Patterns, Project Structure]
- [Source: `_bmad-output/implementation-artifacts/1-3-quick-capture-lead-30-giay.md` — patterns + review fixes]

## Dev Agent Record

### Agent Model Used

GPT-5.5

### Debug Log References

- `npx prisma generate` pass.
- `npx prisma migrate deploy` applied `20260620231500_add_customer_profile_fields` successfully.
- `npm run typecheck`, `npm run lint`, `npm run build` pass.
- Review patch pass: `npx prisma generate`, `npm run typecheck`, `npm run lint`, `npm run build` pass.

### Completion Notes List

- Added `BusinessGroup` enum and profile fields migration on `Customer`.
- Implemented customer list at `/customers` with group filter, name/source search, pagination 25, and empty states.
- Implemented customer detail at `/customers/[id]` with profile header (license above fold), editable profile form, and soft delete dialog.
- Added `updateCustomer` and `softDeleteCustomer` Server Actions with auth guard, Zod validation, and route revalidation.
- Preserved Quick capture (`createCustomer`, `promoteCustomerToConsulting`) without regression.
- Resolved code review findings: serialized customer detail DTO before Client Component boundary, tightened date/price validation, preserved valid filters on bad query params, and clamped out-of-range pagination.

### File List

- `prisma/schema.prisma`
- `prisma/migrations/20260620231500_add_customer_profile_fields/migration.sql`
- `src/actions/customers.ts`
- `src/app/(app)/customers/page.tsx`
- `src/app/(app)/customers/loading.tsx`
- `src/app/(app)/customers/[id]/page.tsx`
- `src/components/customers/customer-list.tsx`
- `src/components/customers/customer-list-row.tsx`
- `src/components/customers/customer-profile-header.tsx`
- `src/components/customers/customer-profile-form.tsx`
- `src/lib/constants/pagination.ts`
- `src/lib/constants/pipeline.ts`
- `src/lib/constants/business-group.ts`
- `src/lib/customers/list-customers.ts`
- `src/lib/db-helpers.ts`
- `src/lib/format.ts`
- `src/lib/validations/customer.ts`

## Change Log

- 2026-06-20: Story 1.4 context file created — ready-for-dev.
- 2026-06-20: Story 1.4 implementation complete — customer list, profile, soft delete; moved to review.
- 2026-06-20: Code review patches resolved; story moved to done.
