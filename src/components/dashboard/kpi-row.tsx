import { DASHBOARD_KPI_LABELS } from "@/lib/constants/dashboard";

import { KpiCard } from "./kpi-card";

const KPI_ITEMS = [
  {
    key: "activeCustomers",
    label: DASHBOARD_KPI_LABELS.activeCustomers,
  },
  {
    key: "revenue",
    label: DASHBOARD_KPI_LABELS.revenue,
  },
  {
    key: "openTickets",
    label: DASHBOARD_KPI_LABELS.openTickets,
  },
] as const;

export function KpiRow() {
  return (
    <div
      className="grid grid-cols-3 gap-row-gap max-md:flex max-md:overflow-x-auto max-md:pb-1"
      role="region"
      aria-label="Chỉ số vận hành"
    >
      {KPI_ITEMS.map((item) => (
        <KpiCard
          key={item.key}
          label={item.label}
          value={0}
          ariaLabel={`${item.label}: 0`}
          className="min-w-[140px] flex-1 max-md:shrink-0"
        />
      ))}
    </div>
  );
}
