---
stepsCompleted: [1, 2, 3, 4]
status: complete
completedAt: 2026-06-20
inputDocuments:
  - planning-artifacts/prds/prd-BmadCRMMini-2026-06-19/prd.md
  - planning-artifacts/prds/prd-BmadCRMMini-2026-06-19/addendum.md
  - planning-artifacts/architecture.md
  - planning-artifacts/ux-designs/ux-BmadCRMMini-2026-06-19/DESIGN.md
  - planning-artifacts/ux-designs/ux-BmadCRMMini-2026-06-19/EXPERIENCE.md
---

# BmadCRMMini - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for BmadCRMMini, decomposing the requirements from the PRD, UX Design if it exists, and Architecture requirements into implementable stories.

## Requirements Inventory

### Functional Requirements

FR-1: Operator thấy 3 KPI trên Surface Hôm nay: số Khách Active, doanh thu tuần/tháng, số Ticket đang mở. KPI Khách Active đếm Khách có pipeline status Active. KPI Ticket mở đếm Ticket chưa đóng. Click KPI Ticket mở điều hướng tới queue Ticket đã lọc mở.

FR-2: Operator thấy tối đa 3 alert strip above fold: lịch hẹn hôm nay, thanh toán chưa xong/quá hạn, Ticket Khẩn mở. Mỗi strip hiển thị count + label ngắn tiếng Việt. Click strip mở danh sách đã sort theo mức ưu tiên. Khi >3 loại cảnh báo, gom phần dư qua link "Xem tất cả (N)" — không stack >3 strip.

FR-3: Operator thấy 3 section list trên Surface Hôm nay: Việc hôm nay, Khách sắp gia hạn, Lead cần follow-up. Việc hôm nay gom actionable items (lịch hẹn, nhắc follow-up, stale nudge). Khách sắp gia hạn liệt kê Khách trong cửa sổ Sắp gia hạn (7–14 ngày); row danger khi ≤0 ngày. Lead cần follow-up liệt kê Lead stale hoặc không tương tác > ngưỡng follow-up (default 7 ngày). Row click mở Chi tiết khách hoặc Ticket tương ứng.

FR-4: Surface Hôm nay có skeleton khi load và empty copy calm khi không có dữ liệu. Skeleton: 3 KPI + 3 strip placeholder + 6 list row placeholder. Empty: "Chưa có việc hôm nay." — không animation celebration. KPI = 0 vẫn hiển thị số, không ẩn section.

FR-5: Operator mở Quick capture qua nút `+` global hoặc keyboard shortcut từ mọi surface. Sheet slide từ phải; tối đa 3 field: tên, nguồn (default Zalo), nội dung tin nhắn đầu. Esc đóng sheet không lưu. Lưu xong operator ở lại surface hiện tại.

FR-6: Operator lưu Lead với 3 field bắt buộc/tối thiểu và pipeline status Lead mới. Thời gian điền median ≤30 giây với 3 field (mục tiêu UX). Toast "Đã lưu" sau save thành công. Optional prompt promote sang Đang tư vấn sau lưu — không bắt buộc.

FR-7: Operator gán và cập nhật một trong 9 Pipeline status cho mỗi Khách. Status hợp lệ chỉ thuộc tập Glossary — không custom status MVP. UI hiển thị chip theo 3 visual group: Lead / Đang chốt / Khách — không rainbow 11 màu. Surface Lead & pipeline liệt kê theo status (list view, filter theo status).

FR-8: Hệ thống đánh dấu Khách có Stale status và hiển thị nudge cập nhật. Stale status khi status không đổi > N ngày (default 14, configurable). Inline banner trên Chi tiết khách: "Cập nhật trạng thái?" — dismissible. Lead stale xuất hiện badge warning trên list + có thể vào Lead cần follow-up.

FR-9: Operator tạo, xem, sửa, xóa (soft delete) Khách. Surface Khách hàng liệt kê Khách active/onboard/chăm sóc; filter theo Nhóm nghiệp vụ. Row click mở Chi tiết khách. Empty search: "Không thấy khách. Thử tên hoặc Zalo."

FR-10: Operator xem/sửa Hồ sơ 5 trường (loại dịch vụ, kênh liên hệ chính, ghi chú đặc biệt, ngày gia hạn tiếp theo, gói/giá/chu kỳ thanh toán) và License/key trên Chi tiết khách. License/key visible above fold trên Chi tiết khách. Field có thể để trống lúc tạo Lead; enrich khi promote pipeline. Nhóm nghiệp vụ bắt buộc trước khi coi hồ sơ "qualified" (có thể set sau lead capture).

FR-11: Operator ghi ngày gia hạn tiếp theo; hệ thống tính Sắp gia hạn. Khách trong cửa sổ 7–14 ngày xuất hiện trên list Khách sắp gia hạn. Quá hạn (≤0 ngày) hiển thị semantic danger.

FR-12: Operator tạo Ticket từ Chi tiết khách hoặc surface Ticket; đặt ưu tiên thường/Khẩn; đóng khi xong. Ticket Khẩn mở xuất hiện trong alert strip dashboard. Filter queue: mở/đóng, Khẩn/tất cả. Đóng ticket cập nhật KPI Ticket mở.

FR-13: Operator mở Ticket Khẩn từ alert strip với context Khách. Điều hướng mở ticket + Chi tiết khách sidebar/context cùng lúc.

FR-14: Operator thêm Timeline entry loại Zalo, Call, Ticket, hoặc Note. Newest first; icon neutral; urgency qua linked Ticket badge nếu có. One-click log "Hỗ trợ login" tạo entry Note/Ticket type.

FR-15: Operator đọc Timeline trên Chi tiết khách trước khi hỗ trợ. Timeline luôn visible trên profile — không tab ẩn.

FR-16: Operator đặt ngưỡng Stale status (default 14 ngày) và follow-up lead (default 7 ngày). Thay đổi ngưỡng áp dụng cho tính toán list/cảnh báo — recalc on next load.

### NonFunctional Requirements

NFR-1: Performance — Cold load Surface Hôm nay cảm giác <2s trên desktop dev; skeleton hiển thị ngay lập tức.

NFR-2: Performance — Above-the-fold KPI + cảnh báo trên viewport ≥1024px không cần scroll (layout B).

NFR-3: Accessibility — WCAG 2.2 AA floor: badge có text, KPI có aria-label, focus ring visible trên interactive rows và strip.

NFR-4: Security — Solo use; license/key risk thấp MVP; mask UI deferred.

NFR-5: Reliability — Dữ liệu CRM local/DB single-tenant; RTO không critical MVP.

NFR-6: UX guardrail — Không form >3 field lúc tạo Lead (Quick capture).

NFR-7: UX guardrail — Banned MVP interactions: drag kanban, infinite scroll, nested modal >1 level.

NFR-8: Pagination — 25 rows/list; không infinite scroll.

NFR-9: Platform — Web app responsive desktop-first; tablet/mobile đọc dashboard + mở hồ sơ; CRUD đầy đủ trên desktop.

NFR-10: Microcopy — Tiếng Việt, factual, calm — không marketing fluff xuyên suốt app.

### Additional Requirements

- **Starter template (Epic 1 Story 1):** `npx shadcn@latest init -t next --defaults -n bmad-crm-mini` + add shadcn components (button, card, sheet, badge, skeleton, sidebar, dialog, input, label, select, textarea, sonner) + Prisma + Auth.js v5 + bcryptjs init per architecture initialization commands.

- **Database:** PostgreSQL 14+ localhost; Prisma 7.8.x pinned; `DATABASE_URL` trỏ localhost:5432; `prisma migrate dev` local only.

- **API layer:** Next.js Server Actions exclusively — không REST/tRPC; không Route Handlers `/api/*` trừ Auth.js `[...nextauth]`.

- **Validation:** Zod at Server Action boundary; client Zod + server re-parse; return `ActionResult<T>` shape `{ ok: true, data } | { ok: false, error }`.

- **Auth MVP:** Auth.js v5 Credentials provider; single User seed từ env (`OPERATOR_EMAIL`, `OPERATOR_PASSWORD`, `AUTH_SECRET`); middleware bảo vệ app routes; `/login` page; `requireSession()` guard đầu mọi action.

- **Domain model:** Customer-centric + Ticket + TimelineEntry + AppSetting + User; Prisma enum PipelineStatus 9 values; `statusChangedAt` track stale; soft delete `deletedAt` trên Customer.

- **Revenue KPI formula (architecture decision):** Sum `packagePrice` của Customer Active (MVP đơn giản).

- **Dashboard aggregation:** Server-side Prisma queries in `src/lib/dashboard/`; read-only, không `"use server"`.

- **Seed data:** AppSetting defaults (stale 14d, follow-up 7d, renewal window 7–14d) + single User từ env via `prisma db seed`.

- **Implementation sequence (architecture):** (1) Scaffold Next.js + shadcn + Prisma, (2) Postgres + migrate + seed, (3) Auth.js setup, (4) Prisma models + db singleton, (5) Server Actions CRUD Customer (Quick capture first), (6) Dashboard Hôm nay, (7) remaining surfaces.

- **State management:** RSC default; client state chỉ cho Sheet/Dialog/forms; mutations via `useTransition` + Server Actions; `revalidatePath` sau writes.

- **Error handling:** Map Prisma errors sang message tiếng Việt user-friendly; log raw server-side.

- **Money display:** `Decimal` Prisma; UI `formatCurrency(vnd)` — suffix `đ`, thousands `.`

- **Infrastructure MVP:** Localhost only — `npm run dev` → http://localhost:3000; cloud deploy/CI/CD/Docker production out of scope.

- **Testing:** Vitest/Playwright chưa scaffold — thêm ở story sau [ASSUMPTION].

- **Project structure:** `src/app/(app)/` routes, `src/actions/*.ts`, `src/lib/db.ts` singleton, `src/lib/auth-guard.ts`, `src/components/ui/` shadcn.

- **Pipeline presentation:** List view MVP; status chip group 3 phase: Lead (neutral) / Đang chốt (warning) / Khách (success).

- **Resolved open questions (architecture):** 9 pipeline statuses (not 11); auth = Credentials login required; soft delete; revenue = sum Active packagePrice.

### UX Design Requirements

UX-DR1: Implement design token system từ DESIGN.md — neutrals (background #FBFBFA, foreground #37352F, muted, border, card), primary #2383E2, semantic trio success/warning/danger với muted background pairs, mapped vào Tailwind/CSS variables.

UX-DR2: Typography hierarchy Inter — display (28px/600), display-sm (20px/600), body (14px), body-sm (13px), label (12px/500); KPI numbers dùng display-sm hoặc tabular nums.

UX-DR3: Layout spacing tokens — page 24px, section 20px, card-padding 16px, row-gap 8px; max content width max-w-5xl (~1024px); sidebar cố định trái ~240px desktop, icon-only khi thu gọn.

UX-DR4: Component KPI card — 3 cột equal; label + số display-sm; border 1px, không sparkline MVP; không shadow nặng.

UX-DR5: Component Alert strip — compact clickable; icon + count + label ngắn; border-left 3px semantic; variants danger/warning; max 3 visible above fold.

UX-DR6: Component List row — tên bold, meta line muted, status badge phải; border 1px, padding 12px 16px, radius md.

UX-DR7: Component Pipeline chip — dot màu semantic + text status; group theo 3 phase (Lead neutral / Đang chốt warning / Khách success); không rainbow per-status colors.

UX-DR8: Component Customer profile header — tên + nhóm nghiệp vụ badge neutral + status chip; license/key field above fold.

UX-DR9: Component Timeline item — dot trái + timestamp label + nội dung body-sm; newest first; icon neutral.

UX-DR10: Component Quick capture sheet — slide từ phải; max 3 fields; primary CTA "Lưu" (hoặc "Lưu & trả lời Zalo"); shadow-md overlay; Esc đóng.

UX-DR11: Component Status badges — success/warning/danger/neutral variants với muted background; luôn có text label ("Khẩn", "Sắp hết hạn"), không chỉ màu.

UX-DR12: Component Sidebar nav — Notion-like; active state muted background; surfaces: Hôm nay, Khách hàng, Lead & pipeline, Ticket, Cài đặt footer.

UX-DR13: State pattern Cold load — skeleton 3 KPI + 3 strip + 6 list rows trên Hôm nay.

UX-DR14: State pattern All clear — KPI hiển thị 0; lists empty copy calm ("Chưa có việc hôm nay."); không celebration animation.

UX-DR15: State pattern Alert overload — strip show count + link "Xem tất cả (N)"; không stack >3 strip.

UX-DR16: State pattern Stale lead — row badge warning + text "N ngày không đổi".

UX-DR17: State pattern Overdue renewal — row danger semantic khi ≤0 ngày.

UX-DR18: State pattern Empty search — "Không thấy khách. Thử tên hoặc Zalo."

UX-DR19: Responsive breakpoints — ≥1024px: sidebar + 3 KPI horizontal + alerts horizontal; 768–1023px: KPI thu nhỏ, alerts stack 2+1; <768px: KPI scroll horizontal, alerts stack, sidebar → sheet.

UX-DR20: Accessibility — WCAG 2.2 AA: semantic colors paired with text/icon; KPI aria-label đầy đủ ("Khách active: 24"); focus ring visible.

UX-DR21: Interaction — click-first; global `+` Quick capture; row click drill-down; Esc đóng sheet/dialog; banned drag kanban, infinite scroll, nested modal >1.

UX-DR22: Voice/tone microcopy — factual calm Vietnamese per EXPERIENCE.md voice table; không marketing fluff, không celebration empty states.

UX-DR23: Visual rules — chrome achromatic; màu chỉ cho trạng thái/cảnh báo; không gradient, không illustration trang trí MVP; không donut/bar charts dashboard MVP.

### FR Coverage Map

FR-1: Epic 2 — 3 KPI dashboard (Khách Active, doanh thu, Ticket mở)
FR-2: Epic 2 — 3 alert strip ưu tiên above fold (ticket alert đầy đủ sau Epic 3)
FR-3: Epic 2 — 3 danh sách ưu tiên (Việc hôm nay, Sắp gia hạn, Lead follow-up)
FR-4: Epic 2 — Skeleton loading + empty states calm
FR-5: Epic 1 — Quick capture mở toàn cục (`+` / shortcut)
FR-6: Epic 1 — Lưu lead 3 field, status Lead mới
FR-7: Epic 1 — Pipeline 9 status, list view, chip 3 phase
FR-8: Epic 1 — Stale status detection + nudge banner
FR-9: Epic 1 — CRUD Khách (soft delete), list + filter nhóm nghiệp vụ
FR-10: Epic 1 — Hồ sơ 5 trường + License/key above fold
FR-11: Epic 1 — Ngày gia hạn + tính Sắp gia hạn
FR-12: Epic 3 — Ticket CRUD, queue, filter, ưu tiên Khẩn
FR-13: Epic 3 — Mở Ticket Khẩn từ alert với context Khách
FR-14: Epic 1 — Ghi Timeline entry thủ công (Zalo/Call/Ticket/Note)
FR-15: Epic 1 — Đọc Timeline trên Chi tiết khách (always visible)
FR-16: Epic 4 — Cấu hình ngưỡng stale + follow-up

## Epic List

### Epic 1: Nắm bắt & quản lý Lead/Khách

Operator đăng nhập CRM, capture lead Zalo trong ~30 giây, theo dõi pipeline 9 status, duy trì hồ sơ khách (5 trường + license + gia hạn), và đọc/ghi timeline trước khi hỗ trợ.

**FRs covered:** FR-5, FR-6, FR-7, FR-8, FR-9, FR-10, FR-11, FR-14, FR-15

### Epic 2: Buổi sáng trên Surface Hôm nay

Operator mở app buổi sáng và trong ≤5 phút biết KPI vận hành, 3 cảnh báo ưu tiên, và 3 danh sách việc cần làm — rồi drill-down vào hành động ngay.

**FRs covered:** FR-1, FR-2, FR-3, FR-4

### Epic 3: Hỗ trợ khách qua Ticket

Operator tạo/quản lý ticket hỗ trợ, ưu tiên ticket khẩn, mở từ cảnh báo dashboard với context khách — hoàn thiện flow hỗ trợ UJ-3.

**FRs covered:** FR-12, FR-13

### Epic 4: Cấu hình ngưỡng vận hành

Operator tuỳ chỉnh ngưỡng stale status và follow-up lead; thay đổi áp dụng cho dashboard lists khi reload.

**FRs covered:** FR-16

---

## Epic 1: Nắm bắt & quản lý Lead/Khách

Operator đăng nhập CRM, capture lead Zalo trong ~30 giây, theo dõi pipeline 9 status, duy trì hồ sơ khách (5 trường + license + gia hạn), và đọc/ghi timeline trước khi hỗ trợ.

### Story 1.1: Khởi tạo dự án và design system

As an **Operator**,
I want **ứng dụng CRM chạy local với giao diện Notion-like nhất quán**,
So that **mọi màn hình sau này dùng chung design tokens và layout shell**.

**Acceptance Criteria:**

**Given** máy dev có Node.js và PostgreSQL local
**When** chạy lệnh scaffold theo architecture (`shadcn init -t next`, Prisma init, shadcn components)
**Then** project `bmad-crm-mini` build được với TypeScript, Tailwind, shadcn/ui
**And** design tokens từ DESIGN.md mapped vào CSS/Tailwind (UX-DR1, UX-DR2, UX-DR3, UX-DR23)

**Given** app shell `(app)` layout
**When** truy cập route placeholder
**Then** sidebar ~240px desktop với nav items (Hôm nay, Khách hàng, Lead & pipeline, Ticket, Cài đặt footer) — UX-DR12
**And** max content width `max-w-5xl`, spacing tokens đúng DESIGN.md

**Given** Prisma init
**When** chạy `prisma migrate dev` lần đầu
**Then** chỉ tạo bảng `AppSetting` + seed defaults (stale 14d, follow-up 7d, renewal window 7–14d)
**And** `src/lib/db.ts` singleton sẵn sàng

---

### Story 1.2: Đăng nhập Operator

As an **Operator**,
I want **đăng nhập bằng email/password trước khi vào CRM**,
So that **dữ liệu khách được bảo vệ trên máy local**.

**Acceptance Criteria:**

**Given** env có `DATABASE_URL`, `AUTH_SECRET`, `OPERATOR_EMAIL`, `OPERATOR_PASSWORD`
**When** chạy `prisma db seed`
**Then** một `User` duy nhất được tạo với password bcrypt hash
**And** không lưu plaintext password trong DB

**Given** user chưa đăng nhập
**When** truy cập bất kỳ route `(app)/*`
**Then** redirect tới `/login`
**And** `/login` hiển thị form email + password (shadcn Card)

**Given** credentials đúng
**When** submit login
**Then** session JWT được tạo và redirect tới `/` (Hôm nay placeholder)
**And** credentials sai hiển thị lỗi tiếng Việt user-friendly

**Given** mọi Server Action
**When** gọi action mà chưa auth
**Then** return `{ ok: false, error: "Chưa đăng nhập." }` per architecture

---

### Story 1.3: Quick capture lead 30 giây

As an **Operator**,
I want **capture lead Zalo từ bất kỳ màn hình bằng sheet 3 field**,
So that **tôi lưu lead trong ~30 giây không rời Zalo** (UJ-2, FR-5, FR-6).

**Acceptance Criteria:**

**Given** Prisma schema
**When** migrate cho story này
**Then** chỉ thêm model `Customer` với fields tối thiểu: `name`, `source` (default "Zalo"), `firstMessage`, `pipelineStatus` (default LEAD_MOI), `statusChangedAt`, `deletedAt`, timestamps
**And** không tạo Ticket/TimelineEntry models ở story này

**Given** operator đã đăng nhập trên bất kỳ surface
**When** click nút `+` global hoặc keyboard shortcut
**Then** sheet slide từ phải với 3 field: tên, nguồn (default Zalo), nội dung tin nhắn đầu — UX-DR10, NFR-6
**And** Esc đóng sheet không lưu

**Given** sheet mở với tên đã điền
**When** click "Lưu"
**Then** Server Action `createCustomer` validate Zod, lưu status **Lead mới**, toast "Đã lưu"
**And** operator ở lại surface hiện tại; sheet đóng

**Given** save thành công
**When** toast hiển thị
**Then** optional prompt "Promote sang Đang tư vấn?" — không bắt buộc
**And** promote cập nhật `pipelineStatus` + `statusChangedAt`

---

### Story 1.4: Danh sách và hồ sơ Khách

As an **Operator**,
I want **xem danh sách khách và mở hồ sơ với 5 trường + license above fold**,
So that **tôi enrich dần hồ sơ sau khi capture lead** (FR-9, FR-10).

**Acceptance Criteria:**

**Given** surface **Khách hàng** (`/customers`)
**When** load trang
**Then** list hiển thị Khách không soft-deleted, paginate 25 rows (NFR-8)
**And** filter theo Nhóm nghiệp vụ (Kế toán / Marketing / Khác)

**Given** list row — UX-DR6
**When** render
**Then** tên bold, meta muted, status badge phải với text label (UX-DR11)
**And** row click mở **Chi tiết khách**

**Given** **Chi tiết khách**
**When** mở profile
**Then** header hiển thị tên + nhóm nghiệp vụ badge + status chip — UX-DR8
**And** **License/key** visible above fold

**Given** form sửa hồ sơ
**When** operator cập nhật Hồ sơ 5 trường (loại dịch vụ, kênh liên hệ, ghi chú đặc biệt, ngày gia hạn, gói/giá/chu kỳ) + license
**Then** Server Action validate Zod, lưu thành công, `revalidatePath`
**And** field có thể trống lúc tạo lead; enrich sau được

**Given** operator xóa khách
**When** confirm soft delete
**Then** set `deletedAt`; khách biến khỏi list
**And** không hard delete

**Given** search không có kết quả
**When** hiển thị empty state
**Then** copy "Không thấy khách. Thử tên hoặc Zalo." — UX-DR18, UX-DR22

---

### Story 1.5: Pipeline status và Lead & pipeline list

As an **Operator**,
I want **cập nhật pipeline 9 status và xem list lead theo status**,
So that **tôi theo dõi tiến trình chốt deal** (FR-7).

**Acceptance Criteria:**

**Given** Chi tiết khách hoặc list row
**When** operator đổi pipeline status
**Then** chỉ 9 status hợp lệ từ enum Prisma được chấp nhận
**And** `statusChangedAt` reset về now()

**Given** UI status chip — UX-DR7
**When** render bất kỳ status
**Then** hiển thị dot + text; group màu 3 phase: Lead (neutral) / Đang chốt (warning) / Khách (success)
**And** không rainbow 11 màu per-status

**Given** surface **Lead & pipeline** (`/pipeline`)
**When** load
**Then** list view theo status với filter theo status [ASSUMPTION list MVP]
**And** paginate 25 rows; không kanban drag (NFR-7)

**Given** status update thành công
**When** quay lại list
**Then** chip và filter phản ánh status mới
**And** microcopy tiếng Việt factual (UX-DR22)

---

### Story 1.6: Stale status detection và nudge

As an **Operator**,
I want **thấy cảnh báo khi status khách không đổi quá lâu**,
So that **tôi không quên follow-up lead** (FR-8).

**Acceptance Criteria:**

**Given** AppSetting `staleDays` default 14
**When** `statusChangedAt` > staleDays ngày trước
**Then** Khách được đánh dấu stale

**Given** Chi tiết khách stale
**When** load profile
**Then** inline banner dismissible: "Cập nhật trạng thái?"
**And** dismiss lưu per-session hoặc per-customer [ASSUMPTION dismiss session]

**Given** Lead stale trên list — UX-DR16
**When** render row
**Then** badge warning + text "N ngày không đổi"
**And** badge có text label, không chỉ màu (UX-DR11, NFR-3)

**Given** operator cập nhật status
**When** save thành công
**Then** stale flag clear; `statusChangedAt` reset
**And** banner biến mất

---

### Story 1.7: Ngày gia hạn và Sắp gia hạn

As an **Operator**,
I want **ghi ngày gia hạn và thấy khách sắp/quá hạn**,
So that **tôi không miss renewal** (FR-11).

**Acceptance Criteria:**

**Given** Khách có `renewalDate`
**When** ngày gia hạn trong cửa sổ 7–14 ngày tới (AppSetting)
**Then** Khách được tính **Sắp gia hạn**

**Given** list row sắp gia hạn — UX-DR17
**When** còn ≤0 ngày
**Then** row hiển thị semantic danger (badge/text đỏ)
**And** copy factual vd. "Chị Lan — gia hạn sau 5 ngày" hoặc "Quá hạn 2 ngày"

**Given** operator sửa `renewalDate` trên Chi tiết khách
**When** save
**Then** tính toán Sắp gia hạn cập nhật on next load
**And** `formatCurrency` cho gói/giá nếu có (architecture money display)

---

### Story 1.8: Timeline tương tác trên Chi tiết khách

As an **Operator**,
I want **đọc và ghi timeline Zalo/Call/Ticket/Note trên hồ sơ khách**,
So that **tôi có context trước khi trả lời Zalo** (FR-14, FR-15, UJ-3).

**Acceptance Criteria:**

**Given** Prisma migrate cho story này
**When** thêm model `TimelineEntry` (customerId, type enum ZALO/CALL/TICKET/NOTE, content, createdAt)
**Then** relation 1:N Customer → TimelineEntry
**And** không phụ thuộc Ticket model (Ticket type entry không link ticket ở MVP story này)

**Given** Chi tiết khách
**When** load profile
**Then** Timeline section always visible — không tab ẩn
**And** entries newest first — UX-DR9

**Given** operator click thêm entry
**When** chọn loại Zalo / Call / Ticket / Note và nhập nội dung
**Then** Server Action lưu entry; list refresh
**And** icon neutral; urgency chỉ qua badge nếu linked ticket sau Epic 3

**Given** one-click "Hỗ trợ login" [ASSUMPTION]
**When** click trên profile
**Then** tạo Timeline entry type NOTE với nội dung preset "Hỗ trợ login"
**And** toast xác nhận ngắn

---

## Epic 2: Buổi sáng trên Surface Hôm nay

Operator mở app buổi sáng và trong ≤5 phút biết KPI vận hành, 3 cảnh báo ưu tiên, và 3 danh sách việc cần làm — rồi drill-down vào hành động ngay.

### Story 2.1: Layout Hôm nay, skeleton và empty states

As an **Operator**,
I want **mở app land Hôm nay với loading skeleton và empty copy calm**,
So that **tôi không thấy màn hình trống confusing lúc 7h sáng** (FR-4, UJ-1).

**Acceptance Criteria:**

**Given** operator đăng nhập
**When** truy cập `/`
**Then** land **Surface Hôm nay** — không splash screen
**And** layout B: KPI row → alert row → 3 list sections (UX-DR3, NFR-2)

**Given** page đang load — UX-DR13
**When** data chưa sẵn sàng
**Then** skeleton: 3 KPI card + 3 alert strip placeholder + 6 list row placeholder
**And** skeleton hiển thị ngay (NFR-1)

**Given** không có dữ liệu actionable — UX-DR14
**When** render lists
**Then** empty copy "Chưa có việc hôm nay." — không celebration animation
**And** KPI = 0 vẫn hiển thị số, không ẩn section

**Given** viewport ≥1024px
**When** render dashboard
**Then** KPI + 3 alert strip above fold không cần scroll
**And** responsive breakpoints theo UX-DR19

---

### Story 2.2: KPI row trên Hôm nay

As an **Operator**,
I want **glance 3 KPI vận hành trên Hôm nay**,
So that **tôi biết tình hình active/doanh thu/ticket trong 10 giây** (FR-1).

**Acceptance Criteria:**

**Given** `src/lib/dashboard/` aggregation queries
**When** load Hôm nay
**Then** hiển thị 3 KPI cards — UX-DR4: Khách Active, Doanh thu tuần/tháng, Ticket mở
**And** KPI numbers có `aria-label` đầy đủ — UX-DR20, NFR-3

**Given** KPI **Khách Active**
**When** tính toán
**Then** đếm Customer `pipelineStatus = ACTIVE` và không soft-deleted

**Given** KPI **Doanh thu**
**When** tính toán
**Then** sum `packagePrice` của Customer Active (architecture formula)
**And** hiển thị `formatCurrency(vnd)` suffix `đ`

**Given** KPI **Ticket mở**
**When** chưa có Ticket model (trước Epic 3)
**Then** hiển thị 0
**And** click vẫn điều hướng tới `/tickets?status=open` (placeholder ok)

**Given** click KPI Ticket mở (sau Epic 3)
**When** có ticket mở
**Then** điều hướng queue Ticket filtered mở

---

### Story 2.3: Alert strips ưu tiên

As an **Operator**,
I want **thấy tối đa 3 cảnh báo above fold và drill-down vào list**,
So that **tôi xử lý việc khẩn trước** (FR-2).

**Acceptance Criteria:**

**Given** dashboard load
**When** có cảnh báo
**Then** tối đa 3 alert strip above fold: lịch hẹn hôm nay, thanh toán quá hạn, Ticket Khẩn mở — UX-DR5
**And** mỗi strip: count + label ngắn tiếng Việt calm

**Given** >3 loại cảnh báo — UX-DR15
**When** render
**Then** hiển thị top 3 + link "Xem tất cả (N)" — không stack >3 strip

**Given** click alert strip
**When** operator click
**Then** mở danh sách đã sort theo mức ưu tiên tương ứng
**And** focus ring visible trên strip (NFR-3)

**Given** Ticket Khẩn chưa có (trước Epic 3)
**When** render alerts
**Then** strip ticket khẩn count = 0 hoặc ẩn khi 0
**And** Epic 3 story 3.2 sẽ wire alert ticket khẩn thật

**Given** lịch hẹn / thanh toán
**When** tính từ `demoScheduledAt` / `paymentDueAt` trên Customer
**Then** đúng khách trong cửa sổ "hôm nay" / quá hạn

---

### Story 2.4: Ba danh sách ưu tiên và drill-down

As an **Operator**,
I want **3 list sections actionable trên Hôm nay**,
So that **tôi chốt việc ưu tiên trong ≤5 phút** (FR-3, UJ-1).

**Acceptance Criteria:**

**Given** section **Việc hôm nay**
**When** load
**Then** gom actionable: lịch hẹn hôm nay + stale nudge + follow-up nhắc [ASSUMPTION union rules]
**And** header `display-sm` per UX-DR2

**Given** section **Khách sắp gia hạn**
**When** load
**Then** liệt kê Khách trong cửa sổ 7–14 ngày; row danger khi ≤0 ngày — UX-DR17
**And** paginate max 25 visible + link xem thêm nếu cần

**Given** section **Lead cần follow-up**
**When** load
**Then** liệt kê Lead stale hoặc `lastInteractionAt` > follow-up threshold (default 7d AppSetting)
**And** row badge warning "N ngày không đổi" nếu stale — UX-DR16

**Given** click bất kỳ row
**When** operator click
**Then** mở **Chi tiết khách** tương ứng
**And** row click drill-down — UX-DR21; không infinite scroll (NFR-7)

---

## Epic 3: Hỗ trợ khách qua Ticket

Operator tạo/quản lý ticket hỗ trợ, ưu tiên ticket khẩn, mở từ cảnh báo dashboard với context khách — hoàn thiện flow hỗ trợ UJ-3.

### Story 3.1: Ticket CRUD và queue

As an **Operator**,
I want **tạo và quản lý ticket hỗ trợ gắn khách**,
So that **tôi theo dõi yêu cầu hỗ trợ có hệ thống** (FR-12).

**Acceptance Criteria:**

**Given** Prisma migrate
**When** thêm model `Ticket` (customerId, title, priority NORMAL/KHAN, closedAt, timestamps)
**Then** relation Customer 1:N Ticket
**And** Server Actions trong `src/actions/tickets.ts` với auth guard + Zod

**Given** Chi tiết khách
**When** operator tạo ticket với title + priority (Thường/Khẩn)
**Then** ticket lưu với `closedAt = null`
**And** badge "Khẩn" có text label — UX-DR11

**Given** surface **Ticket** (`/tickets`)
**When** load queue
**Then** filter: mở/đóng, Khẩn/tất cả; paginate 25 rows
**And** list row pattern UX-DR6

**Given** operator đóng ticket
**When** mark closed
**Then** set `closedAt = now()`; ticket biến khỏi filter "mở"
**And** KPI Ticket mở trên Hôm nay giảm (Story 2.2)

---

### Story 3.2: Ticket khẩn từ dashboard alert

As an **Operator**,
I want **mở ticket khẩn từ cảnh báo dashboard với context khách**,
So that **tôi thấy license/key ngay khi hỗ trợ login** (FR-13, UJ-3).

**Acceptance Criteria:**

**Given** Ticket Khẩn mở tồn tại
**When** load Surface Hôm nay
**Then** alert strip ticket khẩn hiển thị count > 0 — wire FR-2 đầy đủ
**And** KPI Ticket mở đếm chính xác

**Given** operator click alert strip ticket khẩn
**When** điều hướng
**Then** mở ticket detail + **Chi tiết khách** context cùng lúc (split view hoặc sidebar context)
**And** license/key above fold trên context khách — UX-DR8

**Given** operator xử lý xong
**When** đóng ticket + one-click log "Hỗ trợ login"
**Then** timeline entry mới trên profile khách
**And** ticket status success chip (UX-DR11 success variant)

---

## Epic 4: Cấu hình ngưỡng vận hành

Operator tuỳ chỉnh ngưỡng stale status và follow-up lead; thay đổi áp dụng cho dashboard lists khi reload.

### Story 4.1: Surface Cài đặt ngưỡng stale và follow-up

As an **Operator**,
I want **tuỳ chỉnh ngưỡng stale status và follow-up lead**,
So that **cảnh báo và list phù hợp workflow của tôi** (FR-16).

**Acceptance Criteria:**

**Given** surface **Cài đặt** (`/settings`) — sidebar footer nav
**When** operator mở trang
**Then** form hiển thị ngưỡng Stale status (default 14 ngày) và Follow-up lead (default 7 ngày)
**And** microcopy tiếng Việt factual — UX-DR22

**Given** operator thay đổi ngưỡng
**When** save qua Server Action
**Then** cập nhật `AppSetting` records
**And** toast xác nhận ngắn

**Given** ngưỡng mới đã lưu
**When** reload Hôm nay hoặc Lead & pipeline
**Then** stale detection (Story 1.6) và Lead cần follow-up (Story 2.4) dùng ngưỡng mới
**And** không retroactive hidden — recalc on next load per PRD

**Given** invalid input (vd. staleDays = 0 hoặc >365)
**When** submit
**Then** validation Zod error tiếng Việt
**And** không lưu giá trị invalid
