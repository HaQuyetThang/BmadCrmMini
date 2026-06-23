import {
  DASHBOARD_ALERT_HREFS,
  DASHBOARD_ALERT_LABELS,
} from "@/lib/constants/dashboard";
import { appointmentsTodayWhere, overduePaymentsWhere } from "@/lib/dashboard/date-range";
import { db } from "@/lib/db";

export type DashboardAlertKind = "appointmentsToday" | "overduePayments" | "urgentTickets";

export type DashboardAlertVariant = "warning" | "danger";

export type DashboardAlert = {
  kind: DashboardAlertKind;
  count: number;
  label: string;
  href: string;
  variant: DashboardAlertVariant;
  priority: number;
};

export type DashboardAlerts = {
  visible: DashboardAlert[];
  overflowTotal: number;
  viewAllHref?: string;
};

const ALERT_PRIORITY: Record<DashboardAlertKind, number> = {
  overduePayments: 1,
  urgentTickets: 2,
  appointmentsToday: 3,
};

const ALERT_VARIANT: Record<DashboardAlertKind, DashboardAlertVariant> = {
  appointmentsToday: "warning",
  overduePayments: "danger",
  urgentTickets: "danger",
};

const MAX_VISIBLE_ALERTS = 3;

export async function getDashboardAlerts(): Promise<DashboardAlerts> {
  const [appointmentsTodayCount, overduePaymentsCount] = await Promise.all([
    db.customer.count({ where: appointmentsTodayWhere() }),
    db.customer.count({ where: overduePaymentsWhere() }),
  ]);

  const urgentTicketCount = 0;

  const rawAlerts: DashboardAlert[] = [
    {
      kind: "overduePayments",
      count: overduePaymentsCount,
      label: DASHBOARD_ALERT_LABELS.overduePayments,
      href: DASHBOARD_ALERT_HREFS.overduePayments,
      variant: ALERT_VARIANT.overduePayments,
      priority: ALERT_PRIORITY.overduePayments,
    },
    {
      kind: "urgentTickets",
      count: urgentTicketCount,
      label: DASHBOARD_ALERT_LABELS.urgentTickets,
      href: DASHBOARD_ALERT_HREFS.urgentTickets,
      variant: ALERT_VARIANT.urgentTickets,
      priority: ALERT_PRIORITY.urgentTickets,
    },
    {
      kind: "appointmentsToday",
      count: appointmentsTodayCount,
      label: DASHBOARD_ALERT_LABELS.appointmentsToday,
      href: DASHBOARD_ALERT_HREFS.appointmentsToday,
      variant: ALERT_VARIANT.appointmentsToday,
      priority: ALERT_PRIORITY.appointmentsToday,
    },
  ];

  const candidates = rawAlerts
    .filter((alert) => alert.count > 0)
    .sort((a, b) => a.priority - b.priority);

  const visible = candidates.slice(0, MAX_VISIBLE_ALERTS);
  const hidden = candidates.slice(MAX_VISIBLE_ALERTS);
  const overflowTotal = hidden.reduce((sum, alert) => sum + alert.count, 0);

  return {
    visible,
    overflowTotal,
    ...(overflowTotal > 0 ? { viewAllHref: "/customers" } : {}),
  };
}
