import { DASHBOARD_SECTION_TITLES } from "@/lib/constants/dashboard";
import type { DashboardAlerts } from "@/lib/dashboard/get-alerts";
import type { FollowUpLeadsResult } from "@/lib/dashboard/get-follow-up-leads";
import type { DashboardKpis } from "@/lib/dashboard/get-kpis";
import type { RenewalCustomersResult } from "@/lib/dashboard/get-renewals";
import type { TodayTasksResult } from "@/lib/dashboard/get-today-tasks";

import { AlertStripRow } from "./alert-strip-row";
import { DashboardListSection } from "./dashboard-list-section";
import { DashboardPriorityRow } from "./dashboard-priority-row";
import { KpiRow } from "./kpi-row";

type TodayDashboardProps = {
  kpis: DashboardKpis;
  alerts: DashboardAlerts;
  todayTasks: TodayTasksResult;
  renewals: RenewalCustomersResult;
  followUpLeads: FollowUpLeadsResult;
};

export function TodayDashboard({
  kpis,
  alerts,
  todayTasks,
  renewals,
  followUpLeads,
}: TodayDashboardProps) {
  return (
    <div className="flex flex-col gap-section">
      <KpiRow kpis={kpis} />
      <AlertStripRow alerts={alerts} />
      <div className="flex flex-col gap-section">
        <DashboardListSection
          title={DASHBOARD_SECTION_TITLES.todayTasks}
          total={todayTasks.total}
          visibleCount={todayTasks.items.length}
          viewMoreHref="/customers?filter=demo-today"
        >
          {todayTasks.items.map((task) => (
            <DashboardPriorityRow
              key={task.id}
              name={task.name}
              subtitle={task.source}
              href={task.href}
              ariaLabel={
                task.staleDaysCount !== undefined
                  ? `${task.name}: ${task.staleDaysCount} ngày không đổi`
                  : `${task.name}: ${task.badgeLabel ?? task.kind}`
              }
              staleDaysCount={task.staleDaysCount}
              kindLabel={task.staleDaysCount === undefined ? task.badgeLabel : undefined}
            />
          ))}
        </DashboardListSection>

        <DashboardListSection
          title={DASHBOARD_SECTION_TITLES.renewals}
          total={renewals.total}
          visibleCount={renewals.customers.length}
          viewMoreHref="/customers"
        >
          {renewals.customers.map((customer) => (
            <DashboardPriorityRow
              key={customer.id}
              name={customer.name}
              subtitle={customer.source}
              href={`/customers/${customer.id}`}
              ariaLabel={`${customer.name}: ${customer.renewalInfo.label}`}
              renewalBadge={{
                label: customer.renewalInfo.label,
                status: customer.renewalInfo.status,
              }}
            />
          ))}
        </DashboardListSection>

        <DashboardListSection
          title={DASHBOARD_SECTION_TITLES.followUpLeads}
          total={followUpLeads.total}
          visibleCount={followUpLeads.leads.length}
          viewMoreHref="/pipeline"
        >
          {followUpLeads.leads.map((lead) => (
            <DashboardPriorityRow
              key={lead.id}
              name={lead.name}
              subtitle={lead.source}
              href={lead.href}
              ariaLabel={
                lead.staleDaysCount !== undefined
                  ? `${lead.name}: ${lead.staleDaysCount} ngày không đổi`
                  : `${lead.name}: Cần follow-up`
              }
              staleDaysCount={lead.staleDaysCount}
            />
          ))}
        </DashboardListSection>
      </div>
    </div>
  );
}
