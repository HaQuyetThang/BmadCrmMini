---
title: "PRD: BmadCRMMini"
status: draft
created: 2026-06-19
updated: 2026-06-19
author: ANPHATPC
language: Vietnamese
sources:
  - planning-artifacts/briefs/brief-BmadCRMMini-2026-06-19/brief.md
  - planning-artifacts/briefs/brief-BmadCRMMini-2026-06-19/addendum.md
  - planning-artifacts/ux-designs/ux-BmadCRMMini-2026-06-19/EXPERIENCE.md
  - planning-artifacts/ux-designs/ux-BmadCRMMini-2026-06-19/DESIGN.md
  - brainstorming/brainstorming-session-2026-06-19-2238.md
---

# PRD: BmadCRMMini

## 0. Document Purpose

PRD này dành cho ANPHATPC (PM + implementer) và các workflow BMad downstream (architecture, epics, dev). Cấu trúc: Glossary làm vocabulary chuẩn; Features nhóm theo capability với FR đánh số toàn cục; giả định gắn `[ASSUMPTION]` và lập chỉ mục §9.

**Inputs đã có — PRD bổ sung yêu cầu hành vi, không duplicate UX:**

| Artifact | Path |
|----------|------|
| Product Brief | `planning-artifacts/briefs/brief-BmadCRMMini-2026-06-19/` |
| UX Experience | `planning-artifacts/ux-designs/ux-BmadCRMMini-2026-06-19/EXPERIENCE.md` |
| UX Visual | `planning-artifacts/ux-designs/ux-BmadCRMMini-2026-06-19/DESIGN.md` |
| Tech/how overflow | `planning-artifacts/prds/prd-BmadCRMMini-2026-06-19/addendum.md` |

## 1. Vision

BmadCRMMini là web app CRM cá nhân cho **tool provider làm việc một mình** — người cung cấp phần mềm/tool cho khách hàng nhỏ lẻ (kế toán, marketing, freelancer) trong bối cảnh khách chủ yếu liên hệ qua Zalo và ít am hiểu công nghệ.

Sản phẩm giải quyết việc quản lý khách bằng ghi chú rời rạc: quên follow-up lead, bỏ sót ngày gia hạn, mất context khi hỗ trợ. Trọng tâm là **vận hành hàng ngày trong ≤5 phút buổi sáng** — biết việc gì, khách nào, ai cần ping — rồi đóng app đi làm việc. Không phải CRM enterprise hay pipeline bán hàng quy mô lớn.

v1 phục vụ nhu cầu nội bộ ANPHATPC. Nếu chứng minh giá trị, có thể đóng gói bán/cho thuê cho tool provider khác cùng mô hình [ASSUMPTION: pricing model chưa chốt].

## 2. Target User

### 2.1 Jobs To Be Done

- **Functional:** Mỗi sáng nắm nhanh khách active, việc cần làm, lead cần follow-up, ai sắp gia hạn hoặc chưa thanh toán.
- **Functional:** Capture lead Zalo trong ~30 giây không mất context chat.
- **Functional:** Mở hồ sơ khách và thấy ngay license/key, ticket cũ, lịch sử tương tác trước khi trả lời Zalo.
- **Emotional:** Cảm giác kiểm soát — không sợ "quên khách" hay "CRM chết vì form dài".
- **Contextual:** Làm việc một mình, không cần phân quyền, approval flow, hay báo cáo cho sếp.

### 2.2 Non-Users (v1)

- Khách hàng cuối (kế toán, marketer) — **không** đăng nhập CRM.
- Team sales / multi-seat enterprise.
- Tool provider khác — chưa có multi-tenant MVP.

### 2.3 Key User Journeys

*Mirror Flow 1–3 trong `EXPERIENCE.md`.*

- **UJ-1. ANPHATPC buổi sáng thứ Hai — biết việc đầu tiên trong 10 giây**
  - **Persona + context:** Solo tool provider, ~vài chục khách, mở app trước khi nhắn Zalo.
  - **Entry state:** Đã đăng nhập [ASSUMPTION: single-user auth hoặc local-only MVP]; land surface **Hôm nay** (`/`).
  - **Path:** Glance 3 KPI → scan 3 alert strip → click cảnh báo thanh toán → lọc khách chờ TT → mở **Anh Minh** → đánh dấu đã nhắc → scroll **Lead cần follow-up** → chọn 1 lead gọi lại trưa.
  - **Climax:** Trong ≤5 phút biết việc ưu tiên và đã xử lý ít nhất một actionable item.
  - **Resolution:** Đóng app; CRM không giữ user trong app.
  - **Edge case:** Alert overload (>3) — strip gom count + link "Xem tất cả (N)" thay vì stack vô hạn.

- **UJ-2. Lead Zalo mới — lưu trong 30 giây không rời chat**
  - **Persona + context:** Đang Zalo desktop, tin nhắn lead mới vừa tới.
  - **Entry state:** Bất kỳ surface; trigger **Quick capture** (`+` global hoặc shortcut).
  - **Path:** Mở sheet 3 field → điền tên, nguồn Zalo, paste tin đầu → Lưu → toast xác nhận → optional promote sang **Đang tư vấn**.
  - **Climax:** Lead được lưu với status **Lead mới** (hoặc **Đang tư vấn**) trước khi trả lời Zalo.
  - **Resolution:** Sheet đóng; user quay Zalo.
  - **Edge case:** Paste tên tự điền [ASSUMPTION] — nếu fail, user gõ tay vẫn ≤3 field.

- **UJ-3. Hỗ trợ "không login được" — thấy key ngay**
  - **Persona + context:** Khách nhắn ticket khẩn; cần key/license trước khi trả lời.
  - **Entry state:** Từ alert ticket khẩn trên **Hôm nay**.
  - **Path:** Mở ticket → context **Chi tiết khách** hiện license above fold → copy key → log timeline "Hỗ trợ login" [ASSUMPTION: one-click log] → đóng ticket.
  - **Climax:** Ticket đóng; timeline có entry mới; user có key để nhắn Zalo.
  - **Resolution:** Ticket status success; quay workflow hỗ trợ khác.

## 3. Glossary

- **Operator** — ANPHATPC; người duy nhất dùng CRM v1.
- **Khách** — Thực thể CRM đại diện một người/doanh nghiệp nhỏ mà Operator cung cấp tool/dịch vụ. Có thể ở giai đoạn lead hoặc đã active.
- **Lead** — Khách ở pipeline phase **Lead** (status từ **Lead mới** đến trước **Đã chốt**).
- **Pipeline status** — Một trong 9 trạng thái vòng đời: **Lead mới**, **Đang tư vấn**, **Hẹn demo**, **Báo giá đã gửi**, **Chờ thanh toán**, **Đã chốt**, **Đang onboard**, **Active**, **Cần chăm sóc**.
- **Nhóm nghiệp vụ** — Phân loại khách: **Kế toán**, **Marketing**, **Khác** — ảnh hưởng catalog dịch vụ và gợi ý billing.
- **Hồ sơ 5 trường** — Bộ trường cốt lõi trên **Chi tiết khách**: loại dịch vụ, kênh liên hệ chính, ghi chú đặc biệt, ngày gia hạn tiếp theo, gói/giá/chu kỳ thanh toán.
- **License/key** — Thông tin đăng nhập tool gắn **Khách**; field bổ sung trên MVP.
- **Ticket** — Yêu cầu hỗ trợ gắn **Khách**; có ưu tiên thường hoặc **Khẩn**; trạng thái mở/đóng.
- **Timeline entry** — Bản ghi tương tác thủ công: Zalo, Call, Ticket, Note — sắp xếp mới nhất trước.
- **Surface Hôm nay** — Dashboard mặc định: KPI + cảnh báo + 3 danh sách ưu tiên.
- **Quick capture** — Sheet tạo lead 3 field toàn cục.
- **Stale status** — Pipeline status không đổi quá N ngày (mặc định 14, configurable).
- **Sắp gia hạn** — **Khách** có ngày gia hạn trong cửa sổ 7–14 ngày tới hoặc đã quá hạn.

## 4. Features

### 4.1 Surface Hôm nay (Dashboard buổi sáng)

**Description:** Surface mặc định khi mở app. Trên một màn hình (above the fold ưu tiên KPI + cảnh báo), Operator glance số liệu vận hành và drill-down vào danh sách actionable. Realizes UJ-1.

**Functional Requirements:**

#### FR-1: Hiển thị 3 KPI

Operator thấy 3 KPI trên **Surface Hôm nay**: số **Khách** **Active**, doanh thu tuần/tháng [ASSUMPTION: xem addendum — công thức], số **Ticket** đang mở. Realizes UJ-1.

**Consequences (testable):**
- KPI **Khách Active** đếm **Khách** có pipeline status **Active**.
- KPI **Ticket mở** đếm **Ticket** chưa đóng.
- Click KPI **Ticket mở** điều hướng tới queue **Ticket** đã lọc mở.

#### FR-2: Hiển thị 3 cảnh báo ưu tiên

Operator thấy tối đa 3 alert strip above fold: lịch hẹn hôm nay, thanh toán chưa xong/quá hạn, **Ticket** **Khẩn** mở. Realizes UJ-1.

**Consequences (testable):**
- Mỗi strip hiển thị count + label ngắn tiếng Việt (tone calm, không marketing).
- Click strip mở danh sách đã sort theo mức ưu tiên tương ứng.
- Khi >3 loại cảnh báo, gom phần dư qua link "Xem tất cả (N)" — không stack >3 strip.

#### FR-3: Ba danh sách ưu tiên

Operator thấy 3 section list: **Việc hôm nay**, **Khách sắp gia hạn**, **Lead cần follow-up**. Realizes UJ-1.

**Consequences (testable):**
- **Việc hôm nay** gom actionable items (lịch hẹn, nhắc follow-up, stale nudge) [ASSUMPTION: composition chi tiết do architecture].
- **Khách sắp gia hạn** liệt kê **Khách** trong cửa sổ **Sắp gia hạn**; row danger khi ≤0 ngày.
- **Lead cần follow-up** liệt kê **Lead** stale hoặc không tương tác > ngưỡng follow-up [ASSUMPTION: default 7 ngày].
- Row click mở **Chi tiết khách** hoặc **Ticket** tương ứng.

#### FR-4: Cold load và empty states

**Surface Hôm nay** có skeleton khi load và empty copy calm khi không có dữ liệu. Realizes UJ-1.

**Consequences (testable):**
- Skeleton: 3 KPI + 3 strip placeholder + 6 list row placeholder.
- Empty: "Chưa có việc hôm nay." — không animation celebration.
- KPI = 0 vẫn hiển thị số, không ẩn section.

**Feature-specific NFRs:**
- Above-the-fold KPI + cảnh báo trên viewport ≥1024px không cần scroll [ASSUMPTION: layout B từ UX].

---

### 4.2 Quick capture (Lead 30 giây)

**Description:** Capture **Lead** tối thiểu từ bất kỳ surface, không bắt form dài. Realizes UJ-2.

**Functional Requirements:**

#### FR-5: Mở Quick capture toàn cục

Operator mở **Quick capture** qua nút `+` global hoặc keyboard shortcut từ mọi surface. Realizes UJ-2.

**Consequences (testable):**
- Sheet slide từ phải; tối đa 3 field: tên, nguồn (default Zalo), nội dung tin nhắn đầu.
- Esc đóng sheet không lưu.
- Lưu xong operator ở lại surface hiện tại.

#### FR-6: Lưu lead tối thiểu

Operator lưu **Lead** với 3 field bắt buộc/tối thiểu và pipeline status **Lead mới**. Realizes UJ-2.

**Consequences (testable):**
- Thời gian điền median ≤30 giây với 3 field [mục tiêu UX, không hard timeout].
- Toast "Đã lưu" sau save thành công.
- Optional prompt promote sang **Đang tư vấn** sau lưu — không bắt buộc.

**Out of Scope:**
- Auto-sync Zalo API v1.

---

### 4.3 Pipeline và trạng thái

**Description:** **Khách**/**Lead** di chuyển qua 9 **Pipeline status** phản ánh workflow bán tool VN. List view MVP. Realizes UJ-1, UJ-2.

**Functional Requirements:**

#### FR-7: Pipeline status đầy đủ

Operator gán và cập nhật một trong 9 **Pipeline status** cho mỗi **Khách**. Realizes UJ-2.

**Consequences (testable):**
- Status hợp lệ chỉ thuộc tập §3 Glossary — không custom status MVP.
- UI hiển thị chip theo 3 visual group: Lead / Đang chốt / Khách — không rainbow 11 màu.
- Surface **Lead & pipeline** liệt kê theo status [ASSUMPTION: list view, filter theo status].

#### FR-8: Cảnh báo stale status

Hệ thống đánh dấu **Khách** có **Stale status** và hiển thị nudge cập nhật. Realizes UJ-1.

**Consequences (testable):**
- **Stale status** khi status không đổi > N ngày (default 14, configurable §4.7).
- Inline banner trên **Chi tiết khách**: "Cập nhật trạng thái?" — dismissible.
- **Lead** stale xuất hiện badge warning trên list + có thể vào **Lead cần follow-up**.

---

### 4.4 Hồ sơ Khách

**Description:** CRUD **Khách**, **Hồ sơ 5 trường**, **License/key**, phân **Nhóm nghiệp vụ**. Enrich dần — không bắt điền hết lúc tạo. Realizes UJ-1, UJ-3.

**Functional Requirements:**

#### FR-9: CRUD Khách

Operator tạo, xem, sửa, xóa (hoặc archive) [ASSUMPTION: soft delete] **Khách**. Realizes UJ-1.

**Consequences (testable):**
- Surface **Khách hàng** liệt kê **Khách** active/onboard/chăm sóc; filter theo **Nhóm nghiệp vụ**.
- Row click mở **Chi tiết khách**.
- Empty search: "Không thấy khách. Thử tên hoặc Zalo."

#### FR-10: Hồ sơ 5 trường + License

Operator xem/sửa **Hồ sơ 5 trường** và **License/key** trên **Chi tiết khách**. Realizes UJ-3.

**Consequences (testable):**
- **License/key** visible above fold trên **Chi tiết khách**.
- Field có thể để trống lúc tạo **Lead**; enrich khi promote pipeline.
- **Nhóm nghiệp vụ** bắt buộc trước khi coi hồ sơ "qualified" [ASSUMPTION: có thể set sau lead capture].

#### FR-11: Ngày gia hạn

Operator ghi **ngày gia hạn tiếp theo**; hệ thống tính **Sắp gia hạn**. Realizes UJ-1.

**Consequences (testable):**
- **Khách** trong cửa sổ 7–14 ngày xuất hiện trên list **Khách sắp gia hạn**.
- Quá hạn (≤0 ngày) hiển thị semantic danger.

---

### 4.5 Ticket hỗ trợ

**Description:** Queue hỗ trợ gắn **Khách**; ưu tiên **Khẩn** surfaced trên dashboard. Realizes UJ-1, UJ-3.

**Functional Requirements:**

#### FR-12: Tạo và quản lý Ticket

Operator tạo **Ticket** từ **Chi tiết khách** hoặc surface **Ticket**; đặt ưu tiên thường/**Khẩn**; đóng khi xong. Realizes UJ-3.

**Consequences (testable):**
- **Ticket** **Khẩn** mở xuất hiện trong alert strip dashboard.
- Filter queue: mở/đóng, **Khẩn**/tất cả.
- Đóng ticket cập nhật KPI **Ticket mở**.

#### FR-13: Ticket từ cảnh báo

Operator mở **Ticket** **Khẩn** từ alert strip với context **Khách**. Realizes UJ-3.

**Consequences (testable):**
- Điều hướng mở ticket + **Chi tiết khách** sidebar/context cùng lúc.

---

### 4.6 Timeline tương tác

**Description:** Log thủ công lịch sử Zalo/call/ticket/note trên **Chi tiết khách**. Realizes UJ-3.

**Functional Requirements:**

#### FR-14: Ghi Timeline entry thủ công

Operator thêm **Timeline entry** loại Zalo, Call, Ticket, hoặc Note. Realizes UJ-3.

**Consequences (testable):**
- Newest first; icon neutral; urgency qua linked **Ticket** badge nếu có.
- One-click log "Hỗ trợ login" [ASSUMPTION] tạo entry Note/Ticket type.

#### FR-15: Timeline đọc context

Operator đọc **Timeline** trên **Chi tiết khách** trước khi hỗ trợ. Realizes UJ-3.

**Consequences (testable):**
- Timeline luôn visible trên profile — không tab ẩn.

---

### 4.7 Cài đặt vận hành

**Description:** Ngưỡng stale, follow-up, nhóm dịch vụ — tối thiểu cho solo operator. [ASSUMPTION: surface Cài đặt sidebar footer]

**Functional Requirements:**

#### FR-16: Cấu hình ngưỡng

Operator đặt ngưỡng **Stale status** (default 14 ngày) và follow-up lead [ASSUMPTION: default 7 ngày].

**Consequences (testable):**
- Thay đổi ngưỡng áp dụng cho tính toán list/cảnh báo — không retroactive hidden [ASSUMPTION: recalc on next load].

---

## 5. Non-Goals (Explicit)

- Multi-user, phân quyền, audit enterprise.
- Tích hợp Zalo/email tự động v1.
- Kanban drag-and-drop pipeline MVP.
- Billing SaaS, multi-tenant, bán cho provider khác v1.
- Dashboard chart-first (donut/bar analytics).
- Dự án con marketing, milestone invoice, time log v1.
- Gamification, streaks, celebration empty states.

## 6. MVP Scope

### 6.1 In Scope

- **Surface Hôm nay:** FR-1..FR-4
- **Quick capture:** FR-5..FR-6
- **Pipeline 9 status + stale:** FR-7..FR-8
- **CRUD Khách, hồ sơ, gia hạn:** FR-9..FR-11
- **Ticket:** FR-12..FR-13
- **Timeline thủ công:** FR-14..FR-15
- **Cài đặt ngưỡng:** FR-16
- Web app responsive desktop-first; mobile đọc dashboard + mở hồ sơ [ASSUMPTION]
- Solo operator only

**Timeline target:** ~2 tuần, 1 người dev [từ brief — không phải cam kết PRD cứng].

### 6.2 Out of Scope for MVP

| Item | Lý do |
|------|-------|
| Kanban board | v1.1 — list đủ MVP |
| Countdown progress bar gói | v1.1 |
| Ping 30 ngày im lặng tự động | v1.1 |
| Thanh toán chi tiết (đã TT/chưa TT field riêng) | v1.1 — cảnh báo strip đủ MVP |
| Dự án con, Zalo sync, tier gói | v2+ |
| Multi-tenant / pricing SaaS | Sau validate nội bộ |

## 7. Success Metrics

**Primary**

- **SM-1:** Thời gian phiên **Surface Hôm nay** ≤ **5 phút** mỗi sáng (self-report sau 2 tuần dùng). Validates FR-1, FR-2, FR-3.
- **SM-2:** **Không miss** ngày gia hạn — 0 **Khách Active** quá hạn không được xử lý trong 7 ngày liên tiếp. Validates FR-11, FR-3.
- **SM-3:** **Lead cần follow-up** luôn actionable — không có **Lead** stale > ngưỡng mà không xuất hiện trên dashboard > 24h. Validates FR-3, FR-8.

**Secondary**

- **SM-4:** Dùng CRM ≥5 ngày/tuần thay vì chỉ ghi Zalo (self-report 30 ngày). Validates toàn bộ MVP.

**Counter-metrics (do not optimize)**

- **SM-C1:** Thời gian trong app/session length — **không** tối ưu dài; mục tiêu là thoát nhanh. Counterbalances SM-4.

## 8. Open Questions

1. **OQ-1:** UX/brainstorming nói "11 status" nhưng addendum liệt kê 9 — có thêm 2 status ẩn (vd. Lost/Archived) hay đếm nhầm?
2. **OQ-2:** Công thức KPI doanh thu tuần/tháng — tổng gói Active vs nhập tay?
3. **OQ-3:** Auth MVP: login đơn giản vs local-only single machine?
4. **OQ-4:** Soft delete vs hard delete **Khách**?
5. **OQ-5:** Composition chính xác của **Việc hôm nay** — union rules giữa lịch hẹn, stale, follow-up?

## 9. Assumptions Index

- §1 Vision — pricing model chưa chốt khi bán provider khác.
- §2.3 UJ-1 — single-user auth hoặc local-only MVP.
- §2.3 UJ-2 — paste auto-fill tên từ clipboard.
- §2.3 UJ-3 — one-click timeline log "Hỗ trợ login".
- §4.1 FR-1 — công thức doanh thu (addendum).
- §4.1 FR-3 — Việc hôm nay composition; follow-up default 7 ngày.
- §4.1 FR-4 — layout B above-the-fold ≥1024px.
- §4.3 FR-7 — list view pipeline MVP.
- §4.4 FR-9 — soft delete Khách.
- §4.4 FR-10 — nhóm nghiệp vụ có thể set sau lead capture.
- §4.7 FR-16 — recalc ngưỡng on next load.
- §6.1 — mobile read-only-ish; CRUD full desktop.
- §6.1 — timeline ~2 tuần 1 dev từ brief.

---

## Adapt-In: Information Architecture

Mirror `EXPERIENCE.md` — mọi nhu cầu brief reachable từ **Hôm nay** hoặc 1 click:

| Surface | Route | FR liên quan |
|---------|-------|--------------|
| Hôm nay | `/` | FR-1..4 |
| Khách hàng | sidebar | FR-9 |
| Chi tiết khách | row click | FR-10, FR-14, FR-15 |
| Lead & pipeline | sidebar | FR-7 |
| Ticket | sidebar | FR-12 |
| Quick capture | `+` global | FR-5, FR-6 |
| Cài đặt | sidebar footer | FR-16 |

## Adapt-In: Platform

- Web app responsive, desktop-first CRUD; tablet/mobile đọc **Hôm nay** + mở hồ sơ.
- Không native app v1.

## Adapt-In: Aesthetic and Tone

- Tham chiếu `DESIGN.md` + Voice table `EXPERIENCE.md`.
- Microcopy tiếng Việt, factual, calm — không marketing fluff.
- Màu semantic chỉ cho trạng thái/cảnh báo.

## Adapt-In: Cross-Cutting NFRs

- **Performance:** Cold load **Hôm nay** cảm giác <2s trên desktop dev [ASSUMPTION] — skeleton immediate.
- **Accessibility:** WCAG 2.2 AA floor — badge có text, KPI có `aria-label`, focus ring visible.
- **Security:** Solo use — license/key risk thấp; mask UI deferred [từ brief risk #4].
- **Reliability:** Dữ liệu CRM local/DB single-tenant — RTO không critical MVP.

## Adapt-In: Constraints and Guardrails

- **Form phobia guardrail:** Không form >3 field lúc tạo **Lead** (FR-5, FR-6).
- **Banned MVP interactions:** drag kanban, infinite scroll, nested modal >1 level [UX].
- **Pagination:** 25 rows/list [addendum].
