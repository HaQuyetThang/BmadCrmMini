# Deferred Work

Backlog các finding từ code review — không chặn story hiện tại.

## Deferred from: code review of 1-2-dang-nhap-operator (2026-06-20)

- **Danh sách protected routes hardcoded** [`src/auth.config.ts:3-12`] — Route mới ngoài `PROTECTED_PREFIXES` sẽ không bị middleware chặn cho đến khi cập nhật thủ công; chấp nhận MVP story 1.2.

- **Không có automated tests cho auth flow** — Story AC không yêu cầu test; smoke manual đủ cho MVP.

## Deferred from: code review of 1-3-quick-capture-lead-30-giay (2026-06-20)

- **Promote toast có thể click nhiều lần** [`src/components/layout/quick-capture-sheet.tsx:81-93`] — Idempotent về data nhưng gây duplicate toast và request thừa; cải thiện UX sau.

- **Duplicate default logic `source = "Zalo"`** [`src/actions/customers.ts:24`, `src/lib/validations/customer.ts:14`] — Lành tính; refactor khi cần.

## Deferred from: code review of 1-7-ngay-gia-han-va-sap-gia-han (2026-06-21)

- **Preview `formatCurrency` static khi edit** [`src/components/customers/customer-profile-form.tsx:211-214`] — AC đáp ứng hiển thị sau load/save; live preview khi gõ có thể thêm sau.

- **Không có unit test cho `renewal-status.ts`** — AC không yêu cầu; pure functions dễ test khi cần regression suite.

- **`getRenewalCustomers` chưa gọi `requireSession` trực tiếp** [`src/lib/dashboard/get-renewals.ts:30`] — Helper chưa wired UI; Story 2.4 sẽ gọi từ route protected qua middleware.

## Deferred from: code review of 1-8-timeline-tuong-tac-tren-chi-tiet-khach (2026-06-21)

- **`getTimelineEntries` là query DB riêng** — Đã parallelize qua `Promise.all`; gộp vào `getCustomerById` khi cần tối ưu query count.

- **Không có unit test cho `logTimelineEntry` / validation** — AC chỉ yêu cầu manual + build/lint/typecheck; thêm khi có regression suite.

## Deferred from: code review of 2-1-layout-hom-nay-skeleton-va-empty-states (2026-06-22)

- **Tablet KPI chưa "thu nhỏ" typography 768–1023px** [`src/components/dashboard/kpi-card.tsx`] — Layout grid đúng; responsive text/padding có thể thêm khi visual QA tablet.

- **KPI horizontal scroll không keyboard-accessible** [`src/components/dashboard/kpi-row.tsx:26`] — Thiếu scroll affordance cho clipped cards trên mobile; a11y enhancement.

- **Skeleton `animate-pulse` không respect `prefers-reduced-motion`** [`src/components/ui/skeleton.tsx:7`] — Shared component; fix toàn app khi có motion policy.

- **Responsive layout classes trùng lặp 3 files** — Extract shared layout primitive khi refactor dashboard.

- **Above-fold NFR-2 chưa test viewport ngắn** — Manual 1280×800 đủ cho story 2.1; Playwright viewport test khi cần regression.

- **E2E không assert skeleton visibility** — Phụ thuộc quyết định static-page loading behavior; thêm sau khi resolve loading boundary architecture.

## Deferred from: code review of 2-2-kpi-row-tren-hom-nay (2026-06-22)

- **E2E regex `[1-9]` fragile khi active count ≥ 10** [`tests/e2e/epic-2/kpi-row.spec.ts:29`] — Đổi `\d+` khi refactor test suite.

- **`get-kpis.ts` và `kpi-row.spec.ts` chưa git-track** — Cần `git add` trước commit story 2.2.

## Deferred from: code review of 2-3-alert-strips-uu-tien (2026-06-23)

- **`getDashboardAlerts` không gọi `requireSession` trực tiếp** [`src/lib/dashboard/get-alerts.ts:41`] — Page `/` protected qua middleware; pattern giống `getRenewalCustomers` story 1.7.

- **Không có index DB cho `demoScheduledAt` / `paymentDueAt`** [`prisma/schema.prisma:46-47`] — Count query ổn MVP; thêm index khi dataset lớn.

- **E2E chỉ assert drill-down URL, không verify sort order** [`tests/e2e/epic-2/alert-strips.spec.ts:65-70`] — AC#3 partial coverage; đủ cho MVP, bổ sung khi regression suite mở rộng.

- **`optionalDateField` parse UTC từ `type="date"`** [`src/lib/validations/customer.ts:47`] — Pattern `renewalDate` có sẵn; áp dụng cho 2 field mới; fix timezone toàn app khi cần.

- **`viewAllHref: "/customers"` generic khi overflow** [`src/lib/dashboard/get-alerts.ts:87`] — Dead path MVP (chỉ 3 loại alert); refine khi thêm loại alert mới.

- **File untracked + mixed 2-2/2-3 trong working tree** — `migration.sql`, `get-alerts.ts`, `alert-strips.spec.ts` cần `git add`; tách commit 2.2 và 2.3 trước push.

## Deferred from: code review of 2-4-ba-danh-sach-uu-tien-va-drill-down (2026-06-23)

- **Unbounded `findMany` + merge in-memory trước slice 25** [`src/lib/dashboard/get-today-tasks.ts:98-175`] — MVP scale pattern giống alert strips 2.3; tối ưu khi dataset lớn.

- **View-more renewals/pipeline không filter subset** [`src/components/dashboard/today-dashboard.tsx:56-81`] — MVP documented Task 3; refine khi có customer/pipeline filters.

- **`getRenewalInfo(...)!` non-null assertion** [`src/lib/dashboard/get-renewals.ts:63`] — Pre-existing story 1.7; thêm guard khi refactor renewals.

- **Focus ring NFR-3 không có E2E** [`src/components/dashboard/dashboard-priority-row.tsx:38`] — UI đã có `focus-visible:ring-3`; thêm a11y test khi regression suite mở rộng.

## Deferred from: code review of 3-1-ticket-crud-va-queue (2026-06-24)

- **`urgentTicketCount` hardcoded 0 trong alert strip** [`src/lib/dashboard/get-alerts.ts:47`] — Out of scope Story 3.2; wire trong story 3-2.

- **Không E2E pagination 25 rows** [`tests/e2e/epic-3/ticket-crud.spec.ts`] — Code dùng `PAGE_SIZE=25` đúng AC3; thêm test khi mở rộng regression suite.

- **Timeline auto-log khi đóng ticket** [`src/actions/tickets.ts:93`] — Story 3.2 scope; `logTimelineEntry` chưa gọi từ `closeTicket`.

- **Không confirmation dialog trước đóng ticket** [`src/components/tickets/ticket-list-row.tsx:24`] — UX enhancement ngoài AC; một click đóng ngay.

- **Double-submit form tạo ticket** [`src/components/customers/create-ticket-form.tsx:24`] — Pattern giống quick-capture deferred story 1.3.

## Deferred from: code review of 3-2-ticket-khan-tu-dashboard-alert (2026-06-24)

- **KPI Ticket mở không assert trong E2E 3.2** [`tests/e2e/epic-3/urgent-ticket-alert.spec.ts`] — AC#1 verify 3.1; đã cover trong ticket-crud.spec.ts.

- **Hai query riêng cho urgent count + first ID** [`src/lib/dashboard/get-alerts.ts:46`] — Optimization; gộp khi refactor dashboard alerts.

- **`closeTicket` vs `completeTicketSupport` side effects khác nhau** [`src/actions/tickets.ts:69`] — By design: queue close vs complete-support flow.
