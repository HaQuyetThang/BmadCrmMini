---

baseline_commit: 84232ed

---

# Story 1.8: Timeline tương tác trên Chi tiết khách

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As an **Operator**,
I want **đọc và ghi timeline Zalo/Call/Ticket/Note trên hồ sơ khách**,
so that **tôi có context trước khi trả lời Zalo** (FR-14, FR-15, UJ-3).

## Acceptance Criteria

1. **Given** Prisma migrate cho story này  
   **When** thêm enum `TimelineType` (`ZALO`, `CALL`, `TICKET`, `NOTE`) và model `TimelineEntry` (`customerId`, `type`, `content`, `createdAt`)  
   **Then** relation 1:N `Customer` → `TimelineEntry`  
   **And** thêm `Customer.lastInteractionAt DateTime?` (nullable) — architecture field cho Story 2.4 follow-up  
   **And** **không** tạo model `Ticket` / **không** FK `ticketId` trên `TimelineEntry` (Epic 3)

2. **Given** Chi tiết khách `/customers/[id]`  
   **When** load profile  
   **Then** section **Timeline** always visible dưới card Hồ sơ — **không** tab ẩn (FR-15)  
   **And** entries **newest first** — UX-DR9  
   **And** empty state copy calm: **"Chưa có tương tác nào."** (không celebration animation)

3. **Given** mỗi timeline entry  
   **When** render  
   **Then** layout UX-DR9 / DESIGN.md: **dot trái** + **timestamp label** + **nội dung body-sm**  
   **And** icon/type label neutral (muted) — **không** semantic danger/warning trên timeline item  
   **And** type label tiếng Việt qua constant map: Zalo / Gọi / Ticket / Ghi chú

4. **Given** operator thêm entry thủ công  
   **When** chọn loại Zalo / Call / Ticket / Note và nhập nội dung → submit  
   **Then** Server Action `createTimelineEntry` lưu entry; `router.refresh()` / revalidation cập nhật list  
   **And** Zod validate server-side (content required, max length); `requireSession()` guard  
   **And** toast ngắn **"Đã ghi timeline"** khi thành công

5. **Given** mọi lần tạo timeline entry (manual hoặc one-click)  
   **When** insert thành công  
   **Then** cập nhật `Customer.lastInteractionAt = now()` **trong cùng transaction** với insert entry  
   **And** `revalidatePath` cho `/`, `/customers`, `/customers/[id]`, `/pipeline` (reuse `revalidateCustomerSurfaces` pattern)

6. **Given** one-click **"Hỗ trợ login"** trên profile header (cạnh license — UJ-3)  
   **When** operator click  
   **Then** tạo entry type `NOTE` với content preset **"Hỗ trợ login"** qua shared helper — không duplicate insert logic  
   **And** toast **"Đã ghi timeline"**; list refresh  
   **And** disable button + spinner khi pending (`useTransition`)

7. **Given** phạm vi story  
   **When** implement  
   **Then** **không** build Ticket CRUD / queue (Story 3.1)  
   **And** **không** linked ticket badge trên timeline item (Epic 3)  
   **And** **không** auto-log khi đóng ticket (Story 3.x — helper `logTimelineEntry` sẵn sàng cho reuse)  
   **And** **không** pagination timeline trên profile MVP — load toàn bộ entries (volume thấp solo operator)

8. **Given** mọi Server Action mới  
   **When** gọi khi chưa auth  
   **Then** giữ pattern hiện tại — `requireSession()` + protected routes middleware

## Tasks / Subtasks

- [x] **Task 1: Prisma schema + migration** (AC: #1)
  - [x] Add `TimelineType` enum + `TimelineEntry` model per architecture.md
  - [x] Add `Customer.lastInteractionAt DateTime?` + `timeline TimelineEntry[]` relation
  - [x] Create migration; run `prisma generate`
  - [x] Verify **không** thêm `Ticket` model

- [x] **Task 2: Shared timeline helper + read query** (AC: #5, #6, #7)
  - [x] Add `src/lib/timeline/log-timeline-entry.ts`:
    - `logTimelineEntry({ customerId, type, content })` — transaction: insert entry + set `lastInteractionAt`
    - Verify customer exists + `deletedAt: null` before insert
  - [x] Add `src/lib/timeline/get-timeline-entries.ts` — `getTimelineEntries(customerId)` order `createdAt desc`
  - [x] Add `src/lib/constants/timeline.ts` — `TIMELINE_TYPE_LABELS` map enum → label VN

- [x] **Task 3: Validation + Server Actions** (AC: #4, #5, #6, #8)
  - [x] Add `src/lib/validations/timeline.ts` — `createTimelineEntrySchema` (type enum, content trim 1..2000)
  - [x] Add `src/actions/timeline.ts`:
    - `createTimelineEntry(customerId, formData)` — auth + Zod + `logTimelineEntry`
    - `logLoginSupport(customerId)` — preset NOTE "Hỗ trợ login"
  - [x] Reuse / extend `revalidateCustomerSurfaces` from `actions/customers.ts` (export hoặc shared util — tránh duplicate revalidate lists)

- [x] **Task 4: Timeline UI components** (AC: #2, #3, #4)
  - [x] Add `src/components/timeline/timeline-item.tsx` — dot + timestamp + type label + content (UX-DR9)
  - [x] Add `src/components/timeline/timeline-section.tsx` (client):
    - List entries (props from server)
    - Inline add form: select type + textarea content + submit
    - Empty state copy
    - `useTransition` + toast pattern (mirror `customer-profile-form.tsx`)
  - [x] Add `formatDateTime` to `src/lib/format.ts` if chưa có — `dd/MM/yyyy HH:mm` local cho timestamp label

- [x] **Task 5: Wire Chi tiết khách** (AC: #2, #6)
  - [x] Update `src/app/(app)/customers/[id]/page.tsx` — parallel fetch `getTimelineEntries(id)`
  - [x] Update `CustomerProfileForm` — render `TimelineSection` **below** Hồ sơ card (always visible)
  - [x] Update `CustomerProfileHeader` — add one-click **"Hỗ trợ login"** button; gọi `logLoginSupport`

- [x] **Task 6: Verify** (AC: #1–#8)
  - [x] `npm run typecheck`, `npm run lint`, `npm run build`
  - [x] Manual: profile không có entry → empty state
  - [x] Manual: thêm entry Zalo → newest first, timestamp + content hiển thị
  - [x] Manual: one-click "Hỗ trợ login" → NOTE preset, toast, refresh
  - [x] Manual: DB `lastInteractionAt` cập nhật sau mỗi entry
  - [x] Manual: renewal badge + stale banner + pipeline vẫn hoạt động (no regression Story 1.6–1.7)
  - [x] Update story file + sprint status

## Dev Notes

### Prerequisite: Stories 1.4 + 1.7 must be present

- **Story 1.4:** Profile form, `updateCustomer`, license field, `CustomerProfileHeader` with read-only license above fold.
- **Story 1.7:** Renewal badges, `getSettings()`, list enrichment — **preserve** when adding Timeline section below profile card.
- **Story 1.6:** Stale banner + `getSettings()` — timeline section **không** ảnh hưởng stale logic.

### Scope Boundaries

| In scope | Out of scope |
|---|---|
| `TimelineEntry` model + migration | `Ticket` model (Story 3.1) |
| `lastInteractionAt` update on entry create | Follow-up list UI (Story 2.4) |
| Read/write timeline on `/customers/[id]` | Dashboard timeline widgets |
| `logTimelineEntry` shared helper | Auto-log on ticket close (Story 3.x) |
| One-click "Hỗ trợ login" | Linked ticket badge on items (Epic 3) |
| `TIMELINE_TYPE_LABELS` constants | REST `/api/timeline` routes |
| `formatDateTime` for labels | Timeline pagination on profile |

### `lastInteractionAt` — why this story (readiness fix)

Implementation readiness report flagged gap: Story 2.4 **Lead cần follow-up** dùng `lastInteractionAt` vs `followUpDays`. Nếu Story 1.8 không set field khi ghi timeline → follow-up list sai. **Dev PHẢI** update trong transaction mỗi khi tạo entry.

Architecture §Stale/follow-up: computed on read so sánh `lastInteractionAt` với ngưỡng `followUpDays` từ `getSettings()`.

### Timeline entry creation (exact rule)

```typescript
// logTimelineEntry — single code path for manual + one-click + (future) ticket close
await db.$transaction([
  db.timelineEntry.create({ data: { customerId, type, content } }),
  db.customer.updateMany({
    where: { id: customerId, deletedAt: null },
    data: { lastInteractionAt: new Date() },
  }),
]);
// Throw / return error if updateMany count === 0 (customer not found / soft-deleted)
```

One-click preset: `{ type: "NOTE", content: "Hỗ trợ login" }`.

Manual form: operator chọn type + nhập content tự do.

### Architecture Compliance

- **Server Actions only:** `src/actions/timeline.ts` — không Route Handlers REST.
- **Auth:** `requireSession()` đầu mọi action.
- **Validation:** Zod server re-parse; client có thể HTML5 `required` cho UX instant.
- **Component location:** `src/components/timeline/` per architecture tree — **không** đặt business logic trong `ui/`.
- **Helper location:** `src/lib/timeline/` — tách read (`get-timeline-entries`) và write (`log-timeline-entry`).
- **Enum in DB:** Lưu `TimelineType` code (`ZALO`, `CALL`, …) — label VN chỉ ở UI constants (anti-pattern: label VN trong DB).
- **RSC default:** Page fetch entries server-side; `TimelineSection` client cho form/events.
- **Revalidation:** Sau mutation gọi paths dashboard + customer surfaces.

### UX Requirements

| Ref | Requirement |
|-----|-------------|
| UX-DR9 | Dot trái + timestamp label + body-sm content; newest first |
| DESIGN.md §Timeline item | Dot trái + timestamp + nội dung body-sm |
| EXPERIENCE §Timeline | Types Zalo, Call, Ticket, Note — icon neutral |
| EXPERIENCE §UJ-3 | Copy key → one-click log "Hỗ trợ login" |
| UX-DR22 | Microcopy tiếng Việt, calm, factual |
| FR-15 | Always visible — không tab ẩn |

**Layout placement:** Timeline section = `Card` riêng **dưới** card "Hồ sơ khách" trong `CustomerProfileForm` stack (`gap-section`). Header license + one-click **trên** cả hai cards (UJ-3 above fold).

**Type select labels (UI):**

| Enum | Label |
|------|-------|
| ZALO | Zalo |
| CALL | Gọi |
| TICKET | Ticket |
| NOTE | Ghi chú |

### Files to UPDATE (read before editing)

| File | Current state | Story changes | Preserve |
|------|---------------|---------------|----------|
| `prisma/schema.prisma` | Customer only, no Timeline | Add enum + model + `lastInteractionAt` | Existing Customer fields, enums |
| `src/app/(app)/customers/[id]/page.tsx` | Settings + renewal + stale | Fetch timeline entries; pass to form | `notFound` guard, parallel fetch pattern |
| `customer-profile-form.tsx` | Profile card + renewal/stale | Add `TimelineSection` below profile card | Save/delete flows, renewal badge, stale banner |
| `customer-profile-header.tsx` | License read-only + status | Add "Hỗ trợ login" one-click CTA | StatusSelect, pipeline chip, license display |
| `src/lib/format.ts` | `formatDate`, `formatCurrency` | Add `formatDateTime` if needed | Existing formatters |

### Files to CREATE

| File | Purpose |
|------|---------|
| `prisma/migrations/*_add_timeline_entry/` | DB migration |
| `src/lib/constants/timeline.ts` | Type labels VN |
| `src/lib/validations/timeline.ts` | Zod schemas |
| `src/lib/timeline/log-timeline-entry.ts` | Shared write helper |
| `src/lib/timeline/get-timeline-entries.ts` | Read query |
| `src/actions/timeline.ts` | Server Actions |
| `src/components/timeline/timeline-item.tsx` | Single entry row UX-DR9 |
| `src/components/timeline/timeline-section.tsx` | List + add form + empty state |

### Previous Story Intelligence (1.7)

- **Review patches to preserve:** `getRenewalDateUpperBound` end-of-day; list/detail renewal enrichment pattern.
- **Parallel fetch on detail page:** `Promise.all([getSettings(), getCustomerById(id)])` — extend with `getTimelineEntries(id)`.
- **`revalidateCustomerSurfaces`:** Already in `actions/customers.ts` — timeline actions should trigger same paths.
- **Toast + `router.refresh()`:** Established client mutation pattern after save.
- **1.7 explicitly deferred timeline:** Scope table marked timeline out — implement now without regressing renewal/stale.

### Git Intelligence

- Last committed baseline: `84232ed` (Story 1.7).
- Stories 1.5–1.6 may be in same commit chain or local — verify pipeline + stale files exist before dev.
- Established patterns: `activeCustomersWhere`, `ActionResult`, `requireSession`, semantic CSS tokens, `formatCurrency`/`formatDate`.

### Testing Requirements

- Run: `npm run typecheck`, `npm run lint`, `npm run build`
- Manual checklist:
  - Empty timeline → "Chưa có tương tác nào."
  - Add ZALO entry → appears top; timestamp formatted
  - Add second entry → newest first order
  - One-click "Hỗ trợ login" → NOTE preset without opening form
  - `lastInteractionAt` in DB updates (check via Prisma Studio or SQL)
  - Unauthenticated action → "Chưa đăng nhập."
  - Renewal badge + stale banner still work on same profile page
  - Soft-deleted customer → action returns not found

### References

- [Source: `_bmad-output/planning-artifacts/epics.md` — Story 1.8, FR-14, FR-15]
- [Source: `_bmad-output/planning-artifacts/architecture.md` — §TimelineEntry, §logTimelineEntry, §lastInteractionAt, project tree]
- [Source: `_bmad-output/planning-artifacts/prds/prd-BmadCRMMini-2026-06-19/prd.md` — §4.6 Timeline]
- [Source: `_bmad-output/planning-artifacts/ux-designs/ux-BmadCRMMini-2026-06-19/DESIGN.md` — Timeline item]
- [Source: `_bmad-output/planning-artifacts/ux-designs/ux-BmadCRMMini-2026-06-19/EXPERIENCE.md` — UJ-3 one-click log]
- [Source: `_bmad-output/planning-artifacts/implementation-readiness-report-2026-06-20.md` — lastInteractionAt gap]
- [Source: `_bmad-output/implementation-artifacts/1-7-ngay-gia-han-va-sap-gia-han.md` — detail page patterns, review patches]
- [Source: `src/actions/customers.ts` — revalidateCustomerSurfaces, ActionResult pattern]
- [Source: `src/components/customers/customer-profile-form.tsx` — client form + toast pattern]

## Dev Agent Record

### Agent Model Used

Composer

### Debug Log References

- `npm run typecheck`, `npm run lint`, `npm run build` — pass.

### Completion Notes List

- Added `TimelineType` enum, `TimelineEntry` model, `Customer.lastInteractionAt` + migration.
- Implemented `logTimelineEntry` transaction helper and `getTimelineEntries` read query.
- Added `createTimelineEntry` / `logLoginSupport` Server Actions with auth + Zod.
- Extracted `revalidateCustomerSurfaces` to shared util for customers + timeline actions.
- Built `TimelineSection`, `TimelineItem`, `LoginSupportButton` UI wired on customer profile.
- Added `formatDateTime` for timeline timestamp labels.

### File List

- `prisma/schema.prisma`
- `prisma/migrations/20260621120000_add_timeline_entry/migration.sql`
- `src/lib/constants/timeline.ts`
- `src/lib/validations/timeline.ts`
- `src/lib/timeline/log-timeline-entry.ts`
- `src/lib/timeline/get-timeline-entries.ts`
- `src/lib/revalidate-customer-surfaces.ts`
- `src/actions/timeline.ts`
- `src/actions/customers.ts`
- `src/lib/format.ts`
- `src/components/timeline/timeline-item.tsx`
- `src/components/timeline/timeline-section.tsx`
- `src/components/timeline/login-support-button.tsx`
- `src/components/customers/customer-profile-form.tsx`
- `src/components/customers/customer-profile-header.tsx`
- `src/app/(app)/customers/[id]/page.tsx`

## Change Log

- 2026-06-21: Story 1.8 context file created — ready-for-dev.
- 2026-06-21: Story 1.8 implementation complete — timeline CRUD on profile, one-click login support; moved to review.
- 2026-06-21: Code review — 3 patch findings fixed; story moved to done.

### Review Findings

- [x] [Review][Patch] `logTimelineEntry` không kiểm tra `updateMany.count === 0` trong transaction — vi phạm Dev Notes + pattern `applyPipelineStatusUpdate`; race TOCTOU nếu khách bị soft-delete giữa pre-check và transaction vẫn tạo entry nhưng không cập nhật `lastInteractionAt` [`src/lib/timeline/log-timeline-entry.ts:28-38`]
- [x] [Review][Patch] Form timeline không reset sau submit thành công — textarea giữ nội dung cũ sau `router.refresh()` [`src/components/timeline/timeline-section.tsx:35-49`]
- [x] [Review][Patch] Textarea thiếu `maxLength={2000}` — client không phản hồi giới hạn Zod server-side sớm [`src/components/timeline/timeline-section.tsx:84-92`]
- [x] [Review][Defer] `getTimelineEntries` là query DB riêng thay vì include trong `getCustomerById` — deferred, đã parallelize qua `Promise.all`, không regression MVP
- [x] [Review][Defer] Không có unit test cho `logTimelineEntry` / validation — deferred, AC chỉ yêu cầu manual + build/lint/typecheck
