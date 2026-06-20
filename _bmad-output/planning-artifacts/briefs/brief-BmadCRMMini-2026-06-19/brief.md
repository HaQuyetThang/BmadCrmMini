---
title: "Product Brief: BmadCRMMini"
status: draft
created: 2026-06-19
updated: 2026-06-19
author: ANPHATPC
language: Vietnamese
---

# Product Brief: BmadCRMMini

## Executive Summary

**BmadCRMMini** là web app CRM cá nhân dành cho **tool provider làm việc một mình** — người cung cấp phần mềm và tool cho khách hàng nhỏ lẻ (kế toán, marketing, freelancer) trong khi khách hàng chủ yếu liên hệ qua Zalo và ít am hiểu công nghệ.

Sản phẩm giải quyết nỗi đau quản lý khách hàng bằng ghi chú rời rạc (Zalo, Excel, trí nhớ): dễ quên follow-up lead, bỏ sót ngày gia hạn, và mất context khi hỗ trợ. BmadCRMMini tập trung vào **vận hành hàng ngày trong ≤5 phút buổi sáng** — không phải pipeline bán hàng kiểu doanh nghiệp.

Phiên bản đầu phục vụ nhu cầu nội bộ của ANPHATPC. Nếu thành công, sản phẩm có thể **bán hoặc cho thuê** cho các tool provider khác cùng mô hình.

## The Problem

ANPHATPC quản lý khách hàng đang cung cấp tool/phần mềm — những người làm kế toán, marketing, kinh doanh nhỏ lẻ. Khách không dùng CRM; họ nhắn Zalo, gọi điện, chuyển khoản. Toàn bộ gánh nặng ghi nhận, theo dõi và hỗ trợ nằm trên vai một người.

**Hệ quả thực tế:**

- Lead mới inbox nhưng **không follow-up** kịp — kẹt giữa pipeline hoặc bị bỏ quên
- **Quên gia hạn** — mất doanh thu định kỳ
- Mở Zalo không có ngay context: khách dùng gói gì, key nào, ticket cũ ra sao
- CRM enterprise (HubSpot, Salesforce…) quá nặng, quá nhiều trường — **ngại điền** rồi bỏ không dùng

## The Solution

Web app CRM nhẹ, thiết kế cho **một người vận hành**:

- **Dashboard buổi sáng:** 3 KPI (khách active, doanh thu tuần/tháng, ticket mở), 3 cảnh báo (lịch hẹn, thanh toán, ticket khẩn), 3 danh sách (việc hôm nay, khách sắp gia hạn, lead cần follow-up)
- **Hồ sơ khách tối giản:** 5 trường cốt lõi + license/key gắn trực tiếp — enrich dần theo trạng thái, không bắt form dài lúc tạo mới
- **Pipeline trạng thái** phản ánh thực tế bán tool: lead → tư vấn → demo → báo giá → chờ thanh toán → chốt → onboard → active → chăm sóc
- **Ticket hỗ trợ** và **timeline tương tác** (log thủ công Zalo/call/ticket)

Trải nghiệm mục tiêu: mở app, biết việc gì, khách nào, ai cần ping — rồi đóng app đi làm việc.

## What Makes This Different

| Khác biệt | Giải thích |
|-----------|------------|
| **Tool-provider-centric** | Gắn license/key, ticket hỗ trợ, gia hạn gói — không phải CRM sales generic |
| **Capture nhanh** | Lead mới chỉ cần 3 trường trong 30 giây (tên, nguồn, tin nhắn đầu) |
| **Pipeline thực tế VN** | Tách "báo giá" và "chờ thanh toán" trước khi coi là chốt |
| **Phân loại theo nghiệp vụ khách** | Kế toán (gói tháng) vs marketing (theo dự án) — cùng khung, catalog khác |
| **Right-sized** | Solo operator, không enterprise bloat |

**Moat thật:** execution speed + hiểu sâu workflow tool provider Việt Nam. Không claim moat công nghệ ở giai đoạn này.

## Who This Serves

**Primary (v1):** ANPHATPC — solo dev/tool provider quản lý ~vài chục khách nhỏ lẻ.

**End customers (đối tượng của khách ANPHATPC):** kế toán, marketer, freelancer — *không* dùng CRM trực tiếp; họ là lý do ANPHATPC cần context khi hỗ trợ.

**Secondary (tương lai):** tool provider khác cùng mô hình — nếu sản phẩm chứng minh giá trị nội bộ.

## Success Criteria

| Metric | Mục tiêu |
|--------|----------|
| Thời gian buổi sáng | ≤ **5 phút** trong CRM mỗi sáng để nắm việc |
| Follow-up lead | **Không bỏ quên** lead trong pipeline (list "cần follow-up" luôn có actionable items) |
| Gia hạn | **Không miss** ngày hết hạn — danh sách "sắp gia hạn" nhắc trước 7–14 ngày |
| Adoption | Dùng CRM **hàng ngày** thay vì quay lại chỉ ghi Zalo [GIẢ ĐỊNH: đo bằng self-report sau 30 ngày] |

## Scope

### In (MVP — ~2 tuần, 1 người)

- Dashboard 3 KPI + 3 cảnh báo + 3 danh sách
- CRUD khách + phân nhóm (kế toán / marketing / khác)
- Hồ sơ 5 trường + license/key
- Pipeline trạng thái đầy đủ
- Lead capture 30 giây
- Ticket hỗ trợ (tạo, đóng, ưu tiên khẩn)
- Timeline log thủ công
- Cảnh báo stale status
- Ngày gia hạn + tính sắp hết hạn

### Out (v1.1+)

- Countdown progress bar gói, ping tự động im lặng
- Dự án con (marketing), milestone, invoice theo phase
- Tích hợp Zalo tự động, time log, tier gói basic/pro
- Multi-tenant / billing khi bán cho provider khác

*Chi tiết tính năng, pipeline status, rủi ro: xem `addendum.md`.*

## Vision

**Năm 1:** CRM nội bộ ổn định — ANPHATPC không thể làm việc thiếu nó.

**Năm 2–3:** Đóng gói thành sản phẩm **bán/cho thuê** cho tool provider nhỏ khác (self-host hoặc SaaS nhẹ) — cùng pain point, cùng workflow Zalo-first. [GIẢ ĐỊNH: mô hình pricing chưa chốt — cần validate khi có 3–5 provider beta.]

## Risks (tóm tắt)

1. **Form phobia** — giữ form tối thiểu, enrich dần
2. **Status lỗi thời** — cảnh báo stale + nhắc cập nhật khi đổi giai đoạn
3. **Lead bị bỏ quên** — list follow-up trên dashboard (MVP)
4. **License/key** — risk thấp (solo use); mask UI sau nếu cần
