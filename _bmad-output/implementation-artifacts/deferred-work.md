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
