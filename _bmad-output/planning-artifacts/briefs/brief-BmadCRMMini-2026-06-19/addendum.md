# Addendum — BmadCRMMini

Tài liệu bổ sung cho PRD và thiết kế kỹ thuật. Không thuộc executive brief.

## Pipeline trạng thái (11 status)

```
Lead mới → Đang tư vấn → Hẹn demo → Báo giá đã gửi → Chờ thanh toán
  → Đã chốt → Đang onboard → Active → Cần chăm sóc
```

**Lead mới — capture 30 giây:** tên, nguồn (Zalo), nội dung tin nhắn đầu.

## Hồ sơ khách — 5 trường cốt lõi

1. Loại dịch vụ đang dùng
2. Kênh liên hệ chính (Zalo, phone…)
3. Ghi chú đặc biệt
4. Ngày gia hạn tiếp theo
5. Gói / giá / chu kỳ thanh toán

+ License/key hoặc tài khoản tool (field bổ sung trên MVP)

## Phân loại khách

| Nhóm | Catalog dịch vụ | Billing | Ghi chú đặc thù |
|------|-----------------|---------|-----------------|
| Kế toán | Tool KT, báo cáo thuế… | Gói tháng/năm | Trả chậm, hay hỏi giờ |
| Marketing | Ads, LP, automation… | Theo dự án | Hay đổi ý; dự án con v1.1+ |
| Khác | TBD khi qualify | TBD | 3 trường lead ban đầu |

## MVP feature matrix

| Tính năng | MVP | V1.1 | Sau |
|-----------|-----|------|-----|
| Dashboard 3 KPI | ✅ | | |
| 3 cảnh báo | ✅ | | |
| 3 danh sách (việc hôm nay, sắp gia hạn, lead follow-up) | ✅ | | |
| Hồ sơ 5 trường + phân nhóm | ✅ | | |
| Pipeline đầy đủ | ✅ | | |
| Lead 30 giây | ✅ | | |
| Ticket hỗ trợ | ✅ | | |
| License/key | ✅ | | |
| Timeline thủ công | ✅ | | |
| Stale status alert | ✅ | | |
| Countdown bar gói | | ✅ | |
| Ping 30 ngày im lặng | | ✅ | |
| Thanh toán chi tiết | | ✅ | |
| Dự án con, Zalo sync, tier gói | | | ✅ |

## Dashboard wireframe (text)

```
┌─────────────────────────────────────────────────┐
│ KPI: Active | DT tuần/tháng | Ticket mở         │
├─────────────────────────────────────────────────┤
│ Cảnh báo: Lịch hẹn | Thanh toán | Ticket khẩn   │
├─────────────────────────────────────────────────┤
│ Việc hôm nay                                    │
│ Khách sắp gia hạn                               │
│ Lead cần follow-up                              │
└─────────────────────────────────────────────────┘
```

## Nguồn

- Brainstorming session: `_bmad-output/brainstorming/brainstorming-session-2026-06-19-2238.md`
