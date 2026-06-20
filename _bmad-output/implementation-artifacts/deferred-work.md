# Deferred Work

Backlog các finding từ code review — không chặn story hiện tại.

## Deferred from: code review of 1-2-dang-nhap-operator (2026-06-20)

- **Danh sách protected routes hardcoded** [`src/auth.config.ts:3-12`] — Route mới ngoài `PROTECTED_PREFIXES` sẽ không bị middleware chặn cho đến khi cập nhật thủ công; chấp nhận MVP story 1.2.

- **Không có automated tests cho auth flow** — Story AC không yêu cầu test; smoke manual đủ cho MVP.

## Deferred from: code review of 1-3-quick-capture-lead-30-giay (2026-06-20)

- **Promote toast có thể click nhiều lần** [`src/components/layout/quick-capture-sheet.tsx:81-93`] — Idempotent về data nhưng gây duplicate toast và request thừa; cải thiện UX sau.

- **Duplicate default logic `source = "Zalo"`** [`src/actions/customers.ts:24`, `src/lib/validations/customer.ts:14`] — Lành tính; refactor khi cần.
