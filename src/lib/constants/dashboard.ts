export const DASHBOARD_KPI_LABELS = {
  activeCustomers: "Khách Active",
  revenue: "Doanh thu tuần/tháng",
  openTickets: "Ticket mở",
} as const;

export const DASHBOARD_ALERT_LABELS = {
  appointmentsToday: "Lịch hẹn hôm nay",
  overduePayments: "Thanh toán quá hạn",
  urgentTickets: "Ticket Khẩn mở",
} as const;

export const DASHBOARD_ALERT_HREFS = {
  appointmentsToday: "/customers?filter=demo-today",
  overduePayments: "/customers?filter=payment-overdue",
  urgentTickets: "/tickets?urgent=1",
} as const;

export const DASHBOARD_SECTION_TITLES = {
  todayTasks: "Việc hôm nay",
  renewals: "Khách sắp gia hạn",
  followUpLeads: "Lead cần follow-up",
} as const;

export const DASHBOARD_EMPTY_COPY = "Chưa có việc hôm nay.";
