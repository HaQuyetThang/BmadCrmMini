# Addendum — PRD BmadCRMMini

Nội dung kỹ thuật và quyết định thiết kế không thuộc FR chính. Tham chiếu từ `prd.md`.

## Stack & UI (từ UX + Architecture)

- **UI kit:** shadcn/ui + Tailwind CSS
- **Framework:** Next.js App Router + Server Actions
- **ORM:** Prisma
- **Database:** PostgreSQL — **localhost** trong MVP (`DATABASE_URL` trỏ `localhost:5432`)
- **Auth:** Auth.js v5 Credentials — login MVP bắt buộc; single `User` seed từ env
- **Runtime:** Local dev only — `npm run dev` → `http://localhost:3000`; **chưa deploy cloud** (Vercel/hosting deferred)
- **Typography:** Inter, fallback system-ui
- **Visual tokens:** `{planning_artifacts}/ux-designs/ux-BmadCRMMini-2026-06-19/DESIGN.md`
- **Experience spine:** `{planning_artifacts}/ux-designs/ux-BmadCRMMini-2026-06-19/EXPERIENCE.md`
- **Architecture ref:** `{planning_artifacts}/architecture.md`

## Prisma schema summary

Chi tiết đầy đủ trong `architecture.md` § Core Architectural Decisions. Entities: `Customer`, `Ticket`, `TimelineEntry`, `AppSetting`, `User`. Enum `PipelineStatus` 9 values khớp PRD Glossary.

## Pipeline MVP presentation

- **List view** cho Lead & pipeline MVP; Kanban board deferred v1.1 [ASSUMPTION từ UX Open Questions]
- Status chip group 3 phase: Lead (neutral) / Đang chốt (warning) / Khách (success)

## Doanh thu KPI

- [ASSUMPTION] Doanh thu tuần/tháng = tổng `gói/giá` của khách **Active** có chu kỳ overlap kỳ báo cáo, hoặc nhập tay field doanh thu tuần nếu chưa có billing engine — architecture quyết định công thức cụ thể.

## Cài đặt mặc định

| Setting | Default | Ghi chú |
|---------|---------|---------|
| Stale status ngưỡng | 14 ngày | UX Open Question — configurable trong Cài đặt |
| Follow-up lead ngưỡng | 7 ngày không tương tác | [ASSUMPTION] |
| Gia hạn nhắc trước | 7–14 ngày | Brief success criteria |
| Pagination list | 25 rows | UX banned infinite scroll |

## Rejected / deferred alternatives

| Option | Lý do defer |
|--------|-------------|
| Kanban drag pipeline | Banned MVP — click-first, no drag |
| Zalo auto-sync | v2+ — solo nhập tay đủ MVP |
| Countdown progress bar gói | v1.1 — salon-inspired, không block MVP |
| Multi-tenant / billing SaaS | Sau khi chứng minh nội bộ |

## Nguồn gốc

Brief addendum, brainstorming session 2026-06-19, UX EXPERIENCE.md flows.
