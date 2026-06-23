import { DASHBOARD_SECTION_TITLES } from "@/lib/constants/dashboard";
import type { DashboardAlerts } from "@/lib/dashboard/get-alerts";
import type { DashboardKpis } from "@/lib/dashboard/get-kpis";

import { AlertStripRow } from "./alert-strip-row";
import { DashboardListSection } from "./dashboard-list-section";
import { KpiRow } from "./kpi-row";

type TodayDashboardProps = {
  kpis: DashboardKpis;
  alerts: DashboardAlerts;
};

export function TodayDashboard({ kpis, alerts }: TodayDashboardProps) {
  return (
    <div className="flex flex-col gap-section">
      <KpiRow kpis={kpis} />
      <AlertStripRow alerts={alerts} />
      <div className="flex flex-col gap-section">
        <DashboardListSection title={DASHBOARD_SECTION_TITLES.todayTasks} />
        <DashboardListSection title={DASHBOARD_SECTION_TITLES.renewals} />
        <DashboardListSection title={DASHBOARD_SECTION_TITLES.followUpLeads} />
      </div>
    </div>
  );
}
