---

baseline_commit: 84232ed

---



# Story 2.1: Layout Hôm nay, skeleton và empty states



Status: done



<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->



## Story



As an **Operator**,

I want **mở app land Hôm nay với loading skeleton và empty copy calm**,

so that **tôi không thấy màn hình trống confusing lúc 7h sáng** (FR-4, UJ-1).



## Acceptance Criteria



1. **Given** operator đăng nhập  

   **When** truy cập `/`  

   **Then** land **Surface Hôm nay** — không splash screen  

   **And** layout B: KPI row → alert row → 3 list sections (UX-DR3, NFR-2)  

   **And** page title **"Hôm nay"** giữ `text-display` typography (thay placeholder text Epic 1)



2. **Given** page đang load — UX-DR13  

   **When** data chưa sẵn sàng  

   **Then** `src/app/(app)/loading.tsx` hiển thị skeleton: **3 KPI card** + **3 alert strip placeholder** + **6 list row placeholder** (2 per section)  

   **And** skeleton hiển thị ngay khi navigate tới `/` (NFR-1)  

   **And** reuse shared component `DashboardSkeleton` — **không** duplicate markup giữa `loading.tsx` và page



3. **Given** không có dữ liệu actionable — UX-DR14  

   **When** render 3 list sections (Việc hôm nay, Khách sắp gia hạn, Lead cần follow-up)  

   **Then** mỗi section empty copy calm: **"Chưa có việc hôm nay."** — không celebration animation  

   **And** KPI cards hiển thị số **0** (placeholder static); **không** ẩn KPI/alert/list sections khi count = 0



4. **Given** viewport ≥1024px  

   **When** render dashboard  

   **Then** KPI row (3 card ngang) + 3 alert strip **above fold** không cần scroll (NFR-2)  

   **And** responsive breakpoints theo UX-DR19:

   - **≥1024px:** KPI 3 cột + alerts ngang

   - **768–1023px:** KPI thu nhỏ, alerts stack 2+1

   - **<768px:** KPI scroll ngang, alerts stack dọc (sidebar đã là sheet — Story 1.1)



5. **Given** phạm vi story 2.1  

   **When** implement  

   **Then** **không** wire Prisma aggregation thật cho KPI / alerts / lists (Stories 2.2–2.4)  

   **And** **không** gọi `getRenewalCustomers()` / `getSettings()` trên page — helper `src/lib/dashboard/get-renewals.ts` đã có cho Story 2.4  

   **And** alert strips + KPI cards là **static shell** (count `0`, label đúng copy) — clickable nhưng `href="#"` hoặc disabled cho tới Story 2.3  

   **And** **không** thêm model Prisma / migration



6. **Given** regression Epic 1  

   **When** deploy layout mới  

   **Then** sidebar nav, Quick capture `+`, auth redirect `/` → Hôm nay, customers/pipeline pages **không** bị ảnh hưởng  

   **And** `customers/loading.tsx` + `pipeline/loading.tsx` vẫn hoạt động khi navigate sang các route đó



## Tasks / Subtasks



- [x] **Task 1: Shared dashboard skeleton** (AC: #2)

  - [x] Add `src/components/dashboard/dashboard-skeleton.tsx`:

    - 3 KPI card skeletons (`Skeleton` shadcn, border card shape)

    - 3 alert strip skeletons (compact, border-left semantic placeholder muted)

    - 6 list row skeletons trong 3 section groups (2 rows each)

    - Spacing: `gap-section` giữa blocks; `gap-row-gap` trong lists

  - [x] Match UX-DR13 counts chính xác — không thiếu/thừa placeholder



- [x] **Task 2: Route loading boundary** (AC: #2, #6)

  - [x] Add `src/app/(app)/loading.tsx` — render `<DashboardSkeleton />` + optional heading skeleton

  - [x] Verify navigate `/` → skeleton flash; navigate `/customers` → `customers/loading.tsx` (không regression)



- [x] **Task 3: Dashboard layout components (shell)** (AC: #1, #3, #4, #5)

  - [x] Add `src/lib/constants/dashboard.ts` — labels tiếng Việt:

    - KPI: `Khách Active`, `Doanh thu tuần/tháng`, `Ticket mở`

    - Alerts: `Lịch hẹn hôm nay`, `Thanh toán quá hạn`, `Ticket Khẩn mở`

    - Sections: `Việc hôm nay`, `Khách sắp gia hạn`, `Lead cần follow-up`

    - Empty copy: `Chưa có việc hôm nay.`

  - [x] Add `src/components/dashboard/kpi-card.tsx` — Card flat border, label `text-label`, value `text-display-sm tabular-nums`, `aria-label` prop (prep Story 2.2 / UX-DR20)

  - [x] Add `src/components/dashboard/kpi-row.tsx` — grid responsive 3 cols / scroll mobile

  - [x] Add `src/components/dashboard/alert-strip.tsx` — compact strip, border-l-3 semantic-muted, count + label; `aria-label` + focus ring

  - [x] Add `src/components/dashboard/alert-strip-row.tsx` — flex/grid responsive per UX-DR19

  - [x] Add `src/components/dashboard/dashboard-list-section.tsx` — header `text-display-sm` + empty state hoặc children slot (rows sau 2.4)

  - [x] Add `src/components/dashboard/today-dashboard.tsx` — compose KPI → alerts → 3 sections với static `0` / empty lists



- [x] **Task 4: Wire Hôm nay page** (AC: #1, #3)

  - [x] Replace `src/app/(app)/page.tsx` placeholder — render `<TodayDashboard />` (server component wrapper hoặc inline compose)

  - [x] Page structure:

    ```tsx

    <section className="flex flex-col gap-section">

      <h1 className="text-display text-foreground">Hôm nay</h1>

      <TodayDashboard />

    </section>

    ```

  - [x] **Không** `async` data fetch — static props only trong story này



- [x] **Task 5: Responsive + above-fold polish** (AC: #4)

  - [x] KPI row: `grid grid-cols-3` lg+; `flex overflow-x-auto` <md với min-width cards

  - [x] Alert row: `grid-cols-3` lg; `grid-cols-2` md (third wraps); `flex-col` sm

  - [x] Test viewport 1280×800: KPI + alerts visible without scroll

  - [x] Card KPI: `border border-border bg-card`, không shadow nặng (DESIGN.md §Elevation)



- [x] **Task 6: Verify** (AC: #1–#6)

  - [x] `npm run typecheck`, `npm run lint`, `npm run build`

  - [x] Manual: login → `/` shows layout B với KPI=0, 3 alert strips count 0, 3 sections empty copy

  - [x] Manual: hard refresh `/` → skeleton flashes then content

  - [x] Manual: resize 375px / 768px / 1280px — layout không vỡ

  - [x] Manual: customers + pipeline + quick capture vẫn OK

  - [x] Optional: extend `tests/e2e/epic-1/app-shell.spec.ts` hoặc add `tests/e2e/epic-2/today-layout.spec.ts` — assert heading + empty copy visible

  - [x] Update story file + sprint status khi done

### Review Findings

- [x] [Review][Decision] `(app)/loading.tsx` hiển thị DashboardSkeleton trên mọi route con không có `loading.tsx` riêng — Đã chọn (C): Thêm `loading.tsx` per-route (`settings`, `tickets`, `customers/[id]`).

- [x] [Review][Decision] Skeleton có thể không hiện khi client-side navigate tới `/` — Đã chọn (A): Chấp nhận limitation (chỉ hard refresh).

- [x] [Review][Patch] Empty array `children` không render empty copy [`src/components/dashboard/dashboard-list-section.tsx:15`] — `isEmpty = !children` coi `[]` là truthy; Story 2.4 wire `.map()` sẽ render `<div>` trống thay vì calm copy.

- [x] [Review][Patch] Loading state thiếu `<h1>` landmark [`src/app/(app)/loading.tsx:7`] — Chỉ có `<Skeleton>` cho heading; loaded page có `<h1>Hôm nay</h1>`. Screen reader mất page context trong lúc load.

- [x] [Review][Patch] KPI `aria-label` không khớp visible label [`src/components/dashboard/kpi-row.tsx:9-19`] — Hiển thị "Khách Active" nhưng announce "Khách active: 0"; "Doanh thu tuần/tháng" vs "Doanh thu tuần tháng: 0". Nên derive từ `DASHBOARD_KPI_LABELS`.

- [x] [Review][Patch] E2E thiếu pipeline loading regression [`tests/e2e/epic-2/today-layout.spec.ts`] — AC #6 yêu cầu `pipeline/loading.tsx` vẫn hoạt động; test chỉ cover `/customers`.

- [x] [Review][Defer] Tablet KPI chưa "thu nhỏ" typography 768–1023px [`src/components/dashboard/kpi-card.tsx`] — deferred, pre-existing polish; layout grid 3 cột đúng breakpoint nhưng chưa responsive text/padding.

- [x] [Review][Defer] KPI horizontal scroll không keyboard-accessible [`src/components/dashboard/kpi-row.tsx:26`] — deferred, a11y enhancement ngoài MVP story 2.1.

- [x] [Review][Defer] Skeleton `animate-pulse` không respect `prefers-reduced-motion` [`src/components/ui/skeleton.tsx:7`] — deferred, shared shadcn component; ảnh hưởng toàn app.

- [x] [Review][Defer] Responsive layout classes trùng lặp 3 files [`kpi-row.tsx`, `alert-strip-row.tsx`, `dashboard-skeleton.tsx`] — deferred, maintainability; extract primitive khi refactor.

- [x] [Review][Defer] Above-fold NFR-2 chưa test viewport ngắn (1024×600) — deferred, manual 1280×800 đã verify.

- [x] [Review][Defer] E2E không assert skeleton visibility — deferred, phụ thuộc quyết định static-page loading behavior ở finding Decision #2.



## Dev Notes



### Epic Context



Epic 2 — **Buổi sáng trên Surface Hôm nay**: Operator glance KPI, 3 cảnh báo, 3 danh sách ưu tiên trong ≤5 phút. Story 2.1 là **layout shell + loading/empty UX** — Stories 2.2 (KPI data), 2.3 (alerts), 2.4 (lists) wire data vào components tạo ở đây.



| Story | Phạm vi |

|-------|---------|

| **2.1 (này)** | Layout B, skeleton, empty states, static 0 |

| 2.2 | `get-kpis.ts` + wire KPI row |

| 2.3 | `get-alerts.ts` + clickable strips + drill-down |

| 2.4 | 3 list queries + row components + drill-down `/customers/[id]` |



### Prerequisite: Epic 1 complete



- App shell `(app)/layout.tsx` — `max-w-5xl`, sidebar, Quick capture

- Design tokens `globals.css` — spacing, semantic colors, typography utilities

- Auth redirect login → `/`

- `getRenewalCustomers()` in `src/lib/dashboard/get-renewals.ts` — **do not import** in 2.1

- `revalidateCustomerSurfaces()` already revalidates `/` — mutations Epic 1 sẵn sàng cho dashboard sau



### Current State (READ BEFORE EDIT)



**`src/app/(app)/page.tsx`** — placeholder only:

```tsx

<h1>Hôm nay</h1>

<p>Surface dashboard sẽ được triển khai ở Epic 2.</p>

```



**No `(app)/loading.tsx`** — customers/pipeline có pattern riêng dùng `Skeleton` + `gap-section` + 6 rows — mirror cho dashboard nhưng đúng UX-DR13 counts (3+3+6).



**No `src/components/dashboard/`** yet — architecture expects:

```

components/dashboard/

  kpi-row.tsx

  alert-strip-row.tsx

  dashboard-list-section.tsx  (or list-section.tsx)

```



### Layout B Structure (UX-DR3, DESIGN.md)



```

┌─────────────────────────────────────────────┐

│ Hôm nay (display)                           │

├─────────────────────────────────────────────┤

│ [KPI Active] [KPI Doanh thu] [KPI Ticket]   │  ← above fold ≥1024px

├─────────────────────────────────────────────┤

│ [Alert 1] [Alert 2] [Alert 3]               │

├─────────────────────────────────────────────┤

│ Việc hôm nay (display-sm)                   │

│   "Chưa có việc hôm nay."                   │

├─────────────────────────────────────────────┤

│ Khách sắp gia hạn                           │

│   "Chưa có việc hôm nay."                   │

├─────────────────────────────────────────────┤

│ Lead cần follow-up                          │

│   "Chưa có việc hôm nay."                   │

└─────────────────────────────────────────────┘

```



### Component Design Guardrails



**KPI card (DESIGN.md):**

- 3 equal columns; label `text-label` (hoặc `text-body-sm text-muted-foreground`)

- Value `text-display-sm tabular-nums`

- Không sparkline/chart MVP (UX-DR23)

- `aria-label` ví dụ: `"Khách active: 0"` — Story 2.2 sẽ truyền value thật



**Alert strip (DESIGN.md):**

- Compact, clickable appearance (disabled/`#` trong 2.1)

- `border-l-[3px]` + semantic muted bg khi có data — 2.1 dùng neutral `border-border bg-muted/30`

- Count + label ngắn tiếng Việt

- Focus ring visible (`focus-visible:ring-3 focus-visible:ring-ring/50`)



**List section empty (UX-DR14):**

- Copy factual calm — **không** emoji, confetti, animation

- KPI = 0 vẫn render card với số `0` — không `hidden` hay `null`



### Scope Boundaries (CRITICAL)



| In scope (2.1) | Out of scope (defer) |

|----------------|----------------------|

| Layout shell + skeleton + empty UI | `lib/dashboard/get-kpis.ts` (2.2) |

| Static KPI value `0` | `lib/dashboard/get-alerts.ts` (2.3) |

| Alert strip shell count `0` | List rows + queries (2.4) |

| `DashboardSkeleton` + `loading.tsx` | Ticket model / alert ticket khẩn thật (Epic 3) |

| Constants labels VN | `demoScheduledAt` / `paymentDueAt` fields (chưa có schema — 2.3) |

| Responsive layout UX-DR19 | Click drill-down navigation (2.3–2.4) |

| aria-label scaffolding | E2E full dashboard data tests |



### Architecture Compliance



- **Pages compose only** — `page.tsx` imports dashboard components; **no** Prisma in components

- **`lib/dashboard/*`** — read-only aggregations; Story 2.1 **không** thêm query files (trừ constants)

- **Server Components default** — dashboard shell không cần `"use client"` unless interactive strip click later

- **No REST `/api`** — pattern giữ Server Actions cho mutations (không có mutation trong 2.1)

- **Microcopy tiếng Việt** — EXPERIENCE.md calm tone



### File Structure (expected after implementation)



```

src/

  app/(app)/

    loading.tsx              # NEW — DashboardSkeleton

    page.tsx                 # UPDATE — TodayDashboard

  components/dashboard/

    dashboard-skeleton.tsx   # NEW

    today-dashboard.tsx      # NEW

    kpi-card.tsx             # NEW

    kpi-row.tsx              # NEW

    alert-strip.tsx          # NEW

    alert-strip-row.tsx      # NEW

    dashboard-list-section.tsx # NEW

  lib/constants/

    dashboard.ts             # NEW — labels

```



### Testing Notes



- Follow Epic 1 pattern: `npm run typecheck`, `lint`, `build` mandatory

- Playwright: minimal smoke — heading "Hôm nay" + empty copy (existing `app-shell.spec.ts` already checks heading)

- **Không** require full dashboard data E2E until 2.4



### Previous Epic Intelligence (Epic 1 → 2.1)



- **Loading pattern:** `customers/loading.tsx` — `Skeleton` + `gap-section` + 6 rows; adapt counts for dashboard

- **List row pattern:** `CustomerListRow` — border card, hover muted, focus ring — reuse visual language for future dashboard rows (2.4), không copy component

- **Badge/chip:** renewal + stale badges exist — dashboard list rows sẽ reuse in 2.4

- **Git baseline:** `84232ed` — Story 1.7 renewal; Epic 1 stories 1-8 done per sprint-status



### References



- [Source: _bmad-output/planning-artifacts/epics.md#Story 2.1]

- [Source: _bmad-output/planning-artifacts/architecture.md §Dashboard aggregation, §Loading patterns, §File structure]

- [Source: _bmad-output/planning-artifacts/ux-designs/ux-BmadCRMMini-2026-06-19/DESIGN.md §Layout B, §Components KPI/Alert]

- [Source: _bmad-output/planning-artifacts/prds/prd-BmadCRMMini-2026-06-19/prd.md §FR-4, §Surface Hôm nay]

- [Source: src/app/(app)/customers/loading.tsx — skeleton pattern]

- [Source: src/lib/dashboard/get-renewals.ts — exists for 2.4, do not wire]



## Dev Agent Record



### Agent Model Used



Composer



### Debug Log References



### Completion Notes List



- Implemented Layout B dashboard shell at `/` with static KPI=0, alert strips disabled count=0, and 3 empty list sections.

- Added shared `DashboardSkeleton` (3+3+6 placeholders) wired via `(app)/loading.tsx`.

- Responsive grid/flex per UX-DR19; aria-labels on KPI groups and alert buttons for accessibility prep.

- No Prisma queries or `getRenewalCustomers()` — scope limited to UI shell per AC #5.

- `npm run typecheck`, `lint`, `build` pass; E2E `tests/e2e/epic-2/today-layout.spec.ts` 2/2 pass.



### File List



- `src/lib/constants/dashboard.ts` (new)

- `src/components/dashboard/dashboard-skeleton.tsx` (new)

- `src/components/dashboard/kpi-card.tsx` (new)

- `src/components/dashboard/kpi-row.tsx` (new)

- `src/components/dashboard/alert-strip.tsx` (new)

- `src/components/dashboard/alert-strip-row.tsx` (new)

- `src/components/dashboard/dashboard-list-section.tsx` (new)

- `src/components/dashboard/today-dashboard.tsx` (new)

- `src/app/(app)/loading.tsx` (new)

- `src/app/(app)/page.tsx` (modified)

- `tests/e2e/epic-2/today-layout.spec.ts` (new)



## Change Log



- 2026-06-21: Story 2.1 — Hôm nay layout shell, skeleton loading, empty states, E2E smoke tests.


