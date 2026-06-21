---

baseline_commit: 3260f08ce61649ae1965b285e8d70e735d7beb8d

---



# Story 1.5: Pipeline status và Lead & pipeline list



Status: done



<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->



## Story



As an **Operator**,

I want **cập nhật pipeline 9 status và xem list lead theo status**,

so that **tôi theo dõi tiến trình chốt deal** (FR-7).



## Acceptance Criteria



1. **Given** Prisma schema hiện tại (Story 1.3/1.4 — enum `PipelineStatus` chỉ có `LEAD_MOI`, `DANG_TU_VAN`)  

   **When** migrate cho story này  

   **Then** mở rộng enum `PipelineStatus` đủ **9 giá trị** khớp PRD Glossary:

   - `LEAD_MOI`, `DANG_TU_VAN`, `HEN_DEMO`, `BAO_GIA_DA_GUI`, `CHO_THANH_TOAN`, `DA_CHOT`, `DANG_ONBOARD`, `ACTIVE`, `CAN_CHAM_SOC`  

   **And** **không** thêm `Ticket`, `TimelineEntry`, `demoScheduledAt`, `paymentDueAt`, stale UI (Stories 1.6–1.8, 2.3)



2. **Given** operator đổi pipeline status trên **Chi tiết khách** hoặc **list row**  

   **When** submit status mới  

   **Then** Server Action `updatePipelineStatus` chỉ chấp nhận 9 enum hợp lệ (Zod `nativeEnum`)  

   **And** cập nhật `pipelineStatus` + reset `statusChangedAt = now()` trong cùng mutation  

   **And** filter `deletedAt: null`; toast **"Đã cập nhật trạng thái"**; `revalidatePath` `/`, `/customers`, `/pipeline`, `/customers/[id]`



3. **Given** UI pipeline chip — UX-DR7  

   **When** render bất kỳ status  

   **Then** shared component hiển thị **dot semantic + text label** (không chỉ màu)  

   **And** màu theo **3 visual group** từ `PIPELINE_STATUS_LABELS`:

   - **Lead** (neutral): `LEAD_MOI`, `DANG_TU_VAN`

   - **Đang chốt** (warning): `HEN_DEMO`, `BAO_GIA_DA_GUI`, `CHO_THANH_TOAN`

   - **Khách** (success): `DA_CHOT`, `DANG_ONBOARD`, `ACTIVE`, `CAN_CHAM_SOC`  

   **And** không rainbow per-status colors (NFR-3, UX-DR11)



4. **Given** surface **Lead & pipeline** (`/pipeline`)  

   **When** operator load trang  

   **Then** list view Khách **không soft-deleted**, paginate **25 rows/page** (NFR-8)  

   **And** filter theo **pipeline status** qua query param `?status=` (native enum value)  

   **And** sort mặc định `statusChangedAt desc` (lead mới cập nhật lên trước)



5. **Given** operator chọn filter status trên `/pipeline`  

   **When** submit filter  

   **Then** list chỉ hiển thị Khách khớp status; pagination vẫn 25 rows  

   **And** invalid query param bị bỏ qua per-field (pattern Story 1.4 `customerListQuerySchema.catch`) — không reset toàn bộ filter hợp lệ



6. **Given** pipeline list row — UX-DR6  

   **When** render mỗi row  

   **Then** tên **bold**, meta line **muted** (nguồn + ngày cập nhật status), chip **phải**  

   **And** row click mở **Chi tiết khách**; status có thể đổi inline qua `StatusSelect` (không nested modal)



7. **Given** **Chi tiết khách** `/customers/[id]`  

   **When** operator đổi status trong header/profile  

   **Then** `StatusSelect` hiển thị label tiếng Việt từ constant map  

   **And** chip header cập nhật sau save/revalidation



8. **Given** Quick capture promote flow (Story 1.3)  

   **When** operator promote sang **Đang tư vấn**  

   **Then** `promoteCustomerToConsulting` **vẫn hoạt động** — refactor nội bộ gọi shared helper/`updatePipelineStatus` nếu hợp lý, không break toast UX



9. **Given** pipeline list hoặc filter không có kết quả  

   **When** render empty state  

   **Then** copy factual tiếng Việt: **"Không có lead ở trạng thái này."** (hoặc tương đương calm) — UX-DR22



10. **Given** mọi Server Action mới  

    **When** gọi khi chưa auth  

    **Then** return `{ ok: false, error: "Chưa đăng nhập." }` per architecture



## Tasks / Subtasks



- [x] **Task 1: Prisma migration — full 9 PipelineStatus** (AC: #1)

  - [x] Extend `enum PipelineStatus` trong `prisma/schema.prisma` (thêm 7 values)

  - [x] Migration name gợi ý: `expand_pipeline_status_enum`

  - [x] `npx prisma generate` + `npx prisma migrate dev`



- [x] **Task 2: Pipeline constants + shared chip** (AC: #3)

  - [x] Extend `src/lib/constants/pipeline.ts` — full `PIPELINE_STATUS_LABELS` (9 entries) + `PIPELINE_STATUS_OPTIONS` cho select

  - [x] Add `src/components/pipeline/pipeline-status-chip.tsx` — dot + text, dùng `PIPELINE_GROUP_CLASS`

  - [x] Refactor `customer-list-row.tsx` + `customer-profile-header.tsx` dùng `PipelineStatusChip` (DRY)



- [x] **Task 3: Validations + Server Action** (AC: #2, #8, #10)

  - [x] Add `updatePipelineStatusSchema` trong `src/lib/validations/customer.ts` (hoặc `pipeline.ts` nếu tách)

  - [x] Add `updatePipelineStatus(customerId, pipelineStatus)` trong `src/actions/customers.ts`

  - [x] Pattern: `updateMany` + `deletedAt: null` guard; set `statusChangedAt: new Date()`

  - [x] Refactor `promoteCustomerToConsulting` — delegate shared logic, giữ API hiện tại cho Quick capture



- [x] **Task 4: Status select component** (AC: #2, #6, #7)

  - [x] Add `src/components/pipeline/status-select.tsx` — client component; `useTransition` + action; grouped options (Lead / Đang chốt / Khách) hoặc flat list với chip preview

  - [x] Wire vào `customer-profile-header.tsx` (thay badge tĩnh bằng select hoặc select cạnh chip)

  - [x] Optional inline trên pipeline list row nếu UX gọn — tối thiểu trên detail page



- [x] **Task 5: Pipeline list page** (AC: #4, #5, #6, #9)

  - [x] Add `src/lib/customers/list-pipeline-customers.ts` — mirror `listCustomers` pattern; filter `status`; clamp pagination

  - [x] Add `pipelineListQuerySchema` — `page`, `status` với per-field catch

  - [x] Replace `src/app/(app)/pipeline/page.tsx` — RSC fetch + compose

  - [x] Add `src/app/(app)/pipeline/loading.tsx` — skeleton rows

  - [x] Add `src/components/pipeline/pipeline-list.tsx` — status filter + pagination

  - [x] Add `src/components/pipeline/pipeline-list-row.tsx` — reuse row pattern từ customers



- [x] **Task 6: Verify** (AC: #1–#10)

  - [x] `npm run typecheck`, `npm run lint`, `npm run build`

  - [x] Manual: đổi status trên detail; filter `/pipeline?status=`; pagination; Quick capture promote vẫn OK

  - [x] Update story file + sprint status



### Review Findings

- [x] [Review][Patch] Đổi pipeline status trong header làm mất dữ liệu form chưa lưu [`src/components/pipeline/status-select.tsx:50`]
- [x] [Review][Patch] Row trong Lead & pipeline chưa click được toàn bộ vùng row như AC yêu cầu [`src/components/pipeline/pipeline-list-row.tsx:15`]
- [x] [Review][Patch] Pagination `/pipeline` có thể lặp/mất bản ghi khi `statusChangedAt` trùng nhau vì thiếu sort phụ ổn định [`src/lib/customers/list-pipeline-customers.ts:41`]
- [x] [Review][Patch] `StatusSelect` không có optimistic state nên dễ hiển thị giá trị cũ ngắn hạn sau khi đổi status, gây click lặp [`src/components/pipeline/status-select.tsx:57`]

## Dev Notes



### Scope Boundaries



| In scope | Out of scope |

|---|---|

| Full 9 `PipelineStatus` enum + migration | Stale detection/banner (Story 1.6) |

| `/pipeline` list + status filter | Kanban drag (NFR-7 banned) |

| `updatePipelineStatus` action | Valid transition rules / state machine enforcement |

| Shared `PipelineStatusChip` + `StatusSelect` | Timeline auto-log on status change (Story 1.8) |

| Refactor chip ở customer list/detail | `demoScheduledAt`, `paymentDueAt` fields |

| `promoteCustomerToConsulting` preserved | Dashboard KPI/filter by Active (Epic 2) |

| Pagination 25, query params | Infinite scroll |



### Architecture Compliance



- **Single source of truth:** `src/lib/constants/pipeline.ts` — mọi label/group phải qua `PIPELINE_STATUS_LABELS`; không hardcode `"Đang tư vấn"` trong JSX.

- **Action naming:** `updatePipelineStatus` per architecture § Naming Patterns.

- **Mutation pattern:** `requireSession()` → Zod re-parse → `db.customer.updateMany({ where: { id, deletedAt: null } })` → `revalidatePath` (/, /customers, /pipeline, /customers/[id]).

- **Status side effect:** Luôn set `statusChangedAt = now()` khi `pipelineStatus` đổi — prerequisite cho Story 1.6 stale.

- **Component split:** `src/components/pipeline/` — `pipeline-list.tsx`, `status-select.tsx` per architecture project tree.

- **RSC default:** Page fetch trong RSC; chỉ `StatusSelect` và submit handlers là client.



### Pipeline Status Map (Dev MUST use exactly)



| Enum | Label (VI) | Visual group |

|------|------------|--------------|

| `LEAD_MOI` | Lead mới | lead |

| `DANG_TU_VAN` | Đang tư vấn | lead |

| `HEN_DEMO` | Hẹn demo | closing |

| `BAO_GIA_DA_GUI` | Báo giá đã gửi | closing |

| `CHO_THANH_TOAN` | Chờ thanh toán | closing |

| `DA_CHOT` | Đã chốt | customer |

| `DANG_ONBOARD` | Đang onboard | customer |

| `ACTIVE` | Active | customer |

| `CAN_CHAM_SOC` | Cần chăm sóc | customer |



> Label **Active** giữ nguyên tiếng Anh theo PRD Glossary.



### UX-DR7 Chip Implementation Hint



```tsx

// pipeline-status-chip.tsx — dot + label trong Badge

<span className={cn("inline-block size-1.5 rounded-full", dotClass)} aria-hidden />

{meta.label}

```



Dot class map theo group: `lead` → muted foreground; `closing` → status-warning; `customer` → status-success.



### Files to UPDATE (read before editing)



| File | Current state | Story changes | Preserve |

|------|---------------|---------------|----------|

| `prisma/schema.prisma` | 2 pipeline enum values | Add 7 enum members | Customer model fields |

| `src/lib/constants/pipeline.ts` | 2 labels, groups | Full 9 + options array | `PIPELINE_GROUP_CLASS` keys |

| `src/actions/customers.ts` | create, promote, update, softDelete | Add `updatePipelineStatus`; refactor promote | All existing actions + revalidate paths |

| `src/lib/validations/customer.ts` | create/update/list schemas | Add status schemas | Existing schemas |

| `customer-list-row.tsx` | Inline Badge | Use `PipelineStatusChip` | Link + row layout |

| `customer-profile-header.tsx` | Static status Badge | Chip + `StatusSelect` | License above fold |

| `src/app/(app)/pipeline/page.tsx` | Placeholder h1 | Full RSC page | Route path |



### Previous Story Intelligence (1.4)



- **Pagination clamp:** `listCustomers` dùng `Math.min(page, pageCount)` — áp dụng tương tự cho pipeline list.

- **Query parse:** Dùng per-field `.catch()` — invalid `status` không được làm mất `page` hợp lệ.

- **Soft delete guard:** Mọi update dùng `updateMany` + `deletedAt: null`.

- **Prisma enum import:** Dùng `PipelineStatus.X` từ `@/generated/prisma/client`, không string literal.

- **Review lessons:** Serialize dates/Decimal trước Client Component boundary nếu pipeline row pass thêm fields.



### Git Intelligence



- Baseline: `3260f08` — Story 1.4 committed (`feat(customers): add customer list and profile`).

- Established patterns: `list-customers.ts` helper, form GET filters, `CustomerListRow` UX-DR6, `PIPELINE_GROUP_CLASS` semantic tokens.



### Testing Requirements



- Run: `npm run typecheck`, `npm run lint`, `npm run build`

- Manual checklist:

  - Tạo lead → hiện `/pipeline` với status Lead mới

  - Đổi status trên detail → chip + list reflect

  - Filter từng status; empty state copy

  - Promote từ Quick capture toast vẫn set Đang tư vấn + `statusChangedAt`

  - Page vượt range không hiện "Trang 999 / N"



### References



- [Source: `_bmad-output/planning-artifacts/epics.md` — Story 1.5]

- [Source: `_bmad-output/planning-artifacts/architecture.md` — PipelineStatus enum, `updatePipelineStatus`, project structure § pipeline/]

- [Source: `_bmad-output/planning-artifacts/prds/prd-BmadCRMMini-2026-06-19/prd.md` — FR-7, Glossary 9 statuses]

- [Source: `_bmad-output/planning-artifacts/ux-designs/ux-BmadCRMMini-2026-06-19/DESIGN.md` — Pipeline chip]

- [Source: `_bmad-output/planning-artifacts/ux-designs/ux-BmadCRMMini-2026-06-19/EXPERIENCE.md` — list MVP, no kanban]

- [Source: `_bmad-output/implementation-artifacts/1-4-danh-sach-va-ho-so-khach.md` — list/pagination patterns]



## Dev Agent Record



### Agent Model Used



Composer



### Debug Log References



- `npx prisma generate` pass.

- `npx prisma migrate deploy` applied `20260621000000_expand_pipeline_status_enum` successfully.

- `npm run typecheck`, `npm run lint`, `npm run build` pass.



### Completion Notes List



- Expanded `PipelineStatus` enum to 9 values via Prisma migration.

- Added `updatePipelineStatus` with shared `applyPipelineStatusUpdate` helper; refactored `promoteCustomerToConsulting` to delegate.

- Implemented `PipelineStatusChip` (dot + label, 3 visual groups) and `StatusSelect` with grouped optgroups.

- Built `/pipeline` list with status filter, pagination 25, `statusChangedAt desc` sort, and inline status change on rows.

- Wired status change on customer profile header; refactored customer list row to use shared chip.
- Code review patches: profile status change without router.refresh (local state), full-row click on pipeline list, stable secondary sort by id, optimistic StatusSelect UI.

### File List



- `prisma/schema.prisma`

- `prisma/migrations/20260621000000_expand_pipeline_status_enum/migration.sql`

- `src/lib/constants/pipeline.ts`

- `src/lib/validations/customer.ts`

- `src/actions/customers.ts`

- `src/lib/customers/list-pipeline-customers.ts`

- `src/components/pipeline/pipeline-status-chip.tsx`

- `src/components/pipeline/status-select.tsx`

- `src/components/pipeline/pipeline-list.tsx`

- `src/components/pipeline/pipeline-list-row.tsx`

- `src/components/customers/customer-list-row.tsx`

- `src/components/customers/customer-profile-header.tsx`
- `src/components/customers/customer-profile-form.tsx`

- `src/app/(app)/pipeline/page.tsx`

- `src/app/(app)/pipeline/loading.tsx`



## Change Log



- 2026-06-21: Story 1.5 context file created — ready-for-dev.

- 2026-06-21: Story 1.5 implementation complete — pipeline 9 status, list, status change UI; moved to review.
- 2026-06-21: Code review patches applied; story moved to done.


