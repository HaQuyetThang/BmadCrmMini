---
name: BmadCRMMini
status: final
description: CRM cá nhân cho solo tool provider. Web app tối giản kiểu Notion — nhiều khoảng trắng, typography sạch; màu chỉ xuất hiện ở trạng thái và cảnh báo.
updated: 2026-06-19
colors:
  # Neutrals — Notion-adjacent warm gray canvas
  background: '#FBFBFA'
  foreground: '#37352F'
  muted: '#F7F6F3'
  muted-foreground: '#787774'
  border: '#E9E9E7'
  card: '#FFFFFF'
  card-foreground: '#37352F'
  primary: '#2383E2'
  primary-foreground: '#FFFFFF'
  # Semantic status — user-requested R/Y/G; only for badges, dots, alert strips
  status-success: '#0F7B6C'
  status-success-muted: '#EDF3F0'
  status-warning: '#D9730D'
  status-warning-muted: '#FAF3DD'
  status-danger: '#E03E3E'
  status-danger-muted: '#FDEBEC'
  status-neutral: '#9B9A97'
  status-neutral-muted: '#F1F1EF'
typography:
  # [ASSUMPTION] Inter — close to Notion; system fallback ok
  body:
    fontFamily: 'Inter, system-ui, -apple-system, sans-serif'
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
  body-sm:
    fontFamily: 'Inter, system-ui, -apple-system, sans-serif'
    fontSize: 13px
    fontWeight: '400'
    lineHeight: '1.45'
  label:
    fontFamily: 'Inter, system-ui, sans-serif'
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1.4'
    letterSpacing: 0.02em
  display:
    fontFamily: 'Inter, system-ui, sans-serif'
    fontSize: 28px
    fontWeight: '600'
    lineHeight: '1.25'
    letterSpacing: -0.02em
  display-sm:
    fontFamily: 'Inter, system-ui, sans-serif'
    fontSize: 20px
    fontWeight: '600'
    lineHeight: '1.3'
rounded:
  sm: 4px
  md: 6px
  lg: 8px
spacing:
  page: 24px
  section: 20px
  card-padding: 16px
  row-gap: 8px
components:
  kpi-card:
    background: '{colors.card}'
    foreground: '{colors.card-foreground}'
    border: '1px solid {colors.border}'
    radius: '{rounded.lg}'
    padding: '{spacing.card-padding}'
  alert-strip-danger:
    background: '{colors.status-danger-muted}'
    foreground: '{colors.status-danger}'
    border-left: '3px solid {colors.status-danger}'
    radius: '{rounded.md}'
  alert-strip-warning:
    background: '{colors.status-warning-muted}'
    foreground: '{colors.status-warning}'
    border-left: '3px solid {colors.status-warning}'
    radius: '{rounded.md}'
  status-badge-success:
    background: '{colors.status-success-muted}'
    foreground: '{colors.status-success}'
    radius: '{rounded.sm}'
  status-badge-warning:
    background: '{colors.status-warning-muted}'
    foreground: '{colors.status-warning}'
    radius: '{rounded.sm}'
  status-badge-danger:
    background: '{colors.status-danger-muted}'
    foreground: '{colors.status-danger}'
    radius: '{rounded.sm}'
  list-row:
    background: '{colors.card}'
    border: '1px solid {colors.border}'
    radius: '{rounded.md}'
    padding: '12px 16px'
  sidebar-nav-active:
    background: '{colors.muted}'
    foreground: '{colors.foreground}'
    radius: '{rounded.md}'
---

## Brand & Style

BmadCRMMini là **bàn làm việc buổi sáng** cho một tool provider — không phải dashboard enterprise đầy biểu đồ. Thẩm mỹ tham chiếu **Notion**: nền ấm nhạt, chữ đậm vừa phải, viền mảnh, nhiều không gian thở. Cảm giác **gọn gàng và chuyên nghiệp** — đáng tin khi mở lúc 7h sáng trước khi nhắn Zalo khách.

**Quy tắc màu:** Chrome (sidebar, nền, border) gần như achromatic. **Màu chỉ xuất hiện khi có ý nghĩa trạng thái** — đỏ/vàng/xanh cho cảnh báo, pipeline, badge. Không gradient, không illustration trang trí MVP.

## Colors

- **Canvas** `{colors.background}` — nền trang, giống Notion page.
- **Primary** `{colors.primary}` — hành động chính (Tạo lead, Lưu, Mở Zalo). Dùng tiết chế.
- **Semantic trio** (user-requested):
  - **Xanh** `{colors.status-success}` — Active, đã thanh toán, ticket đóng.
  - **Vàng** `{colors.status-warning}` — Sắp gia hạn, stale status, cần follow-up.
  - **Đỏ** `{colors.status-danger}` — Ticket khẩn, quá hạn TT, quá hạn gia hạn.
- Mỗi semantic có cặp **muted background** cho badge và alert strip — không fill toàn màn hình đỏ.

## Typography

Hierarchy đơn giản — một family (Inter), phân cấp bằng size/weight:

- **display** — tiêu đề trang "Hôm nay"
- **display-sm** — tên section (Việc hôm nay, Khách sắp gia hạn)
- **body** — nội dung list, mô tả
- **label** — KPI label, cột bảng, badge text

Số KPI dùng `display-sm` hoặc tabular nums — đọc nhanh một glance.

## Layout & Spacing

- **Above the fold (layout B):** Hàng KPI (3 card ngang) → hàng cảnh báo (3 strip compact) → scroll nhẹ xuống 3 danh sách.
- **Max content width:** `max-w-5xl` (~1024px) cho vùng chính — đủ rộng cho 3 KPI, không loang full ultra-wide.
- **Section gap:** `{spacing.section}` giữa KPI block, alert block, list block.
- **Sidebar cố định** trái (Notion-like) ~240px desktop; icon-only khi thu gọn.

## Elevation & Depth

Phẳng, viền mảnh thay vì shadow nặng. Card KPI: border 1px, không shadow hoặc shadow-xs. Sheet/Dialog (tạo lead nhanh): shadow-md duy nhất cho overlay layer.

## Shapes

Bo góc nhẹ `{rounded.md}`–`{rounded.lg}`. Badge pill nhỏ `{rounded.sm}`. Alert strip: border-left 3px màu semantic — nhận diện nhanh không cần icon lớn.

## Components

| Component | Visual |
|-----------|--------|
| KPI card | 3 cột equal; label `label`, số `display-sm`; không sparkline MVP |
| Alert strip | Compact, clickable; icon + count + label ngắn |
| List row | Tên khách/lead bold; meta line muted; status badge phải |
| Pipeline chip | Dot màu semantic + text status; không rainbow 11 màu — group theo phase |
| Customer profile header | Tên + nhóm (kế toán/marketing) badge neutral + status chip |
| Timeline item | Dot trái + timestamp label + nội dung body-sm |
| Quick capture sheet | Slide từ phải; 3 field tối đa; primary CTA "Lưu & trả lời Zalo" [ASSUMPTION label] |

## Do's and Don'ts

**Do**

- Giữ above-the-fold cho KPI + cảnh báo trên màn "Hôm nay"
- Dùng màu semantic nhất quán xuyên suốt app
- Ưu tiên scanability: số → cảnh báo → list
- Empty state một câu + một CTA (Notion tone)

**Don't**

- Biểu đồ donut/bar trên dashboard MVP
- Màu brand trang trí trên chrome
- Form dài modal — vi phạm "lead 30 giây"
- Ẩn cảnh báo đỏ dưới fold
