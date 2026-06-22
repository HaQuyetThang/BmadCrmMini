import { DASHBOARD_SECTION_TITLES } from "@/lib/constants/dashboard";

import { AlertStripRow } from "./alert-strip-row";
import { DashboardListSection } from "./dashboard-list-section";
import { KpiRow } from "./kpi-row";

export function TodayDashboard() {
  return (
    <div className="flex flex-col gap-section">
      <KpiRow />
      <AlertStripRow />
      <div className="flex flex-col gap-section">
        <DashboardListSection title={DASHBOARD_SECTION_TITLES.todayTasks} />
        <DashboardListSection title={DASHBOARD_SECTION_TITLES.renewals} />
        <DashboardListSection title={DASHBOARD_SECTION_TITLES.followUpLeads} />
      </div>
    </div>
  );
}
