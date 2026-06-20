---
name: BmadCRMMini
status: final
sources:
  - {planning_artifacts}/briefs/brief-BmadCRMMini-2026-06-19/brief.md
  - {planning_artifacts}/briefs/brief-BmadCRMMini-2026-06-19/addendum.md
  - {planning_artifacts}/brainstorming/brainstorming-session-2026-06-19-2238.md
updated: 2026-06-19
---

# BmadCRMMini — Experience Spine

> Web app responsive. [ASSUMPTION] shadcn/ui + Tailwind. Visual identity: `DESIGN.md`. Solo operator (ANPHATPC) — không multi-user MVP.

## Foundation

- **Form-factor:** Web app desktop-first; tablet/mobile đọc dashboard và mở hồ sơ khách. [ASSUMPTION] CRUD đầy đủ trên desktop.
- **UI system:** shadcn/ui — behavioral delta documented here; visual tokens in `DESIGN.md`.
- **Session goal:** ≤5 phút buổi sáng trên surface **Hôm nay**.

## Information Architecture

| Surface | Nav | Purpose |
|---------|-----|---------|
| **Hôm nay** | Sidebar default / `/` | KPI + cảnh báo + 3 danh sách — climax buổi sáng |
| **Khách hàng** | Sidebar | Danh sách active/onboard/chăm sóc; filter theo nhóm nghiệp vụ |
| **Chi tiết khách** | Row click | 5 trường + license + timeline + ticket |
| **Lead & pipeline** | Sidebar | Kanban hoặc list theo status [ASSUMPTION: list MVP, board v1.1] |
| **Ticket** | Sidebar / từ khách | Queue hỗ trợ; filter khẩn/mở |
| **Tạo lead nhanh** | `+` global / shortcut | Sheet 3 field — lead 30 giây |
| **Cài đặt** | Sidebar footer | Ngưỡng stale/follow-up, nhóm dịch vụ [ASSUMPTION] |

**Surface closure:** Mọi nhu cầu brief (follow-up, gia hạn, ticket, license) đều reachable từ Hôm nay hoặc 1 click.

## Voice and Tone

Microcopy tiếng Việt, ngắn, không marketing fluff — giống Notion: factual, calm.

| Do | Don't |
|----|-------|
| "3 lead cần follow-up" | "Bạn có leads tuyệt vời đang chờ!" |
| "Chị Lan — gia hạn sau 5 ngày" | "Warning: renewal approaching!!!" |
| "Lưu" / "Đánh dấu đã TT" | "Xác nhận giao dịch thành công ✓" |
| Empty: "Chưa có việc hôm nay." | "Hãy thêm task để bắt đầu ngày mới" |

## Component Patterns

| Pattern | Behavior |
|---------|----------|
| KPI row | 3 card; click KPI → filtered list (vd: ticket mở → Ticket queue) |
| Alert strip | Max 3 visible above fold; click → sorted list with context |
| Priority list | Section `display-sm` header; rows `{components.list-row}`; badge semantic |
| Status chip | Maps 11 pipeline statuses → 3 visual groups: **Lead** (neutral), **Đang chốt** (warning), **Khách** (success); sub-status text label |
| Quick capture sheet | Opens over any surface; 3 fields; save stays on current surface; optional "mở chi tiết" |
| Timeline | Newest first; types: Zalo, Call, Ticket, Note — icon neutral, urgency via linked ticket badge |
| Stale nudge | Inline banner on profile when status unchanged > N days: "Cập nhật trạng thái?" — dismissible |

## State Patterns

| State | Surface | Treatment |
|-------|---------|-----------|
| Cold load | Hôm nay | Skeleton: 3 KPI + 3 strip + 6 list rows |
| All clear | Hôm nay | KPI hiển thị 0 ticket mở; lists empty copy calm; không celebration animation |
| Alert overload | Hôm nay | Strip show count; "Xem tất cả (12)" link — không stack 12 strip |
| Stale lead | Lead list | Row badge `{colors.status-warning}` + "14 ngày không đổi" |
| Overdue renewal | Sắp gia hạn | Row `{colors.status-danger}` khi ≤0 ngày |
| Empty search | Khách | "Không thấy khách. Thử tên hoặc Zalo." |

## Interaction Primitives

- **Click-first** (solo operator, không cần vim shortcuts MVP)
- **Global `+`** — Tạo lead nhanh
- **Row click** — drill-down; checkbox secondary for bulk [ASSUMPTION: no bulk MVP]
- **Esc** — đóng sheet/dialog
- **Banned MVP:** drag kanban, infinite scroll lists (pagination 25), nested modal >1 level

## Accessibility Floor

- WCAG 2.2 AA — semantic colors paired with text/icon, không chỉ màu
- Status badge luôn có text ("Khẩn", "Sắp hết hạn")
- Focus ring visible trên interactive rows và strip
- KPI numbers `aria-label` đầy đủ ("Khách active: 24")

## Responsive & Platform

| Breakpoint | Hôm nay layout |
|------------|----------------|
| ≥1024px | Sidebar + 3 KPI horizontal; alerts horizontal; lists stacked |
| 768–1023px | KPI 3 cột thu nhỏ; alerts stack 2+1 |
| <768px | KPI scroll horizontal; alerts stack; sidebar → sheet |

## Key Flows

### Flow 1 — ANPHATPC buổi sáng thứ Hai (climax: biết việc đầu tiên trong 10 giây)

1. Mở app → land **Hôm nay** (không splash)
2. **Glance** 3 KPI — active, DT tuần, ticket mở
3. **Scan** 3 alert strip — thấy "2 thanh toán quá hạn" đỏ → click
4. List lọc khách chờ TT → chọn **Anh Minh** → copy số Zalo, đánh dấu "đã nhắc"
5. Quay Hôm nay → scroll **Lead cần follow-up** → chốt 1 lead gọi lại trưa
6. **Đóng app** — tổng <5 phút

### Flow 2 — Lead Zalo mới (climax: lưu trong 30 giây không rời chat)

1. Đang Zalo desktop — nhận tin mới
2. `+` hoặc shortcut → **Quick capture sheet**
3. Điền tên (auto từ paste [ASSUMPTION]), nguồn Zalo, paste tin đầu
4. Lưu → toast "Đã lưu — Đang tư vấn?" optional promote status
5. Đóng sheet → quay Zalo trả lời

### Flow 3 — Hỗ trợ "không login được" (climax: thấy key ngay)

1. Từ Hôm nay alert ticket khẩn → mở ticket
2. Sidebar context **Chi tiết khách** — license field above fold
3. Copy key → timeline auto-log "Hỗ trợ login" [ASSUMPTION: one-click log]
4. Đóng ticket → status success chip

## Inspiration & Anti-patterns

**Inspired by:** Notion — sidebar, list density, calm empty states, section headers.

**Anti-patterns (tránh):**

- Salesforce-style pipeline rainbow
- HubSpot dashboard chart-first
- Form 15 field khi tạo lead
- Gamification streaks

## Open Questions

- List vs kanban cho pipeline MVP [ASSUMPTION: list]
- Ngưỡng ngày stale (14/30) — Settings default 14
- Mobile: có quick capture không [ASSUMPTION: có]
