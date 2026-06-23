import { DASHBOARD_KPI_LABELS } from "@/lib/constants/dashboard";
import type { DashboardKpis } from "@/lib/dashboard/get-kpis";
import { formatCurrency } from "@/lib/format";

import { KpiCard } from "./kpi-card";

type KpiRowProps = {
  kpis: DashboardKpis;
};

export function KpiRow({ kpis }: KpiRowProps) {
  const items = [
    {
      key: "activeCustomers",
      label: DASHBOARD_KPI_LABELS.activeCustomers,
      value: kpis.activeCustomerCount,
      ariaLabel: `Khách active: ${kpis.activeCustomerCount}`,
      href: undefined,
    },
    {
      key: "revenue",
      label: DASHBOARD_KPI_LABELS.revenue,
      value: formatCurrency(kpis.revenueTotal),
      ariaLabel: `Doanh thu tuần tháng: ${formatCurrency(kpis.revenueTotal)}`,
      href: undefined,
    },
    {
      key: "openTickets",
      label: DASHBOARD_KPI_LABELS.openTickets,
      value: kpis.openTicketCount,
      ariaLabel: `Ticket mở: ${kpis.openTicketCount}`,
      href: "/tickets?status=open",
    },
  ];

  return (
    <div
      className="grid grid-cols-3 gap-row-gap max-md:flex max-md:overflow-x-auto max-md:pb-1"
      role="region"
      aria-label="Chỉ số vận hành"
    >
      {items.map((item) => (
        <KpiCard
          key={item.key}
          label={item.label}
          value={item.value}
          ariaLabel={item.ariaLabel}
          href={item.href}
          className="min-w-[140px] flex-1 max-md:shrink-0"
        />
      ))}
    </div>
  );
}
