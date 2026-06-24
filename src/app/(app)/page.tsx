import { TodayDashboard } from "@/components/dashboard/today-dashboard";
import { getDashboardAlerts } from "@/lib/dashboard/get-alerts";
import { getFollowUpLeads } from "@/lib/dashboard/get-follow-up-leads";
import { getDashboardKpis } from "@/lib/dashboard/get-kpis";
import { getRenewalCustomers } from "@/lib/dashboard/get-renewals";
import { getTodayTasks } from "@/lib/dashboard/get-today-tasks";

export const dynamic = "force-dynamic";

export default async function TodayPage() {
  const [kpis, alerts, todayTasks, renewals, followUpLeads] = await Promise.all([
    getDashboardKpis(),
    getDashboardAlerts(),
    getTodayTasks(),
    getRenewalCustomers({ page: 1 }),
    getFollowUpLeads(),
  ]);

  return (
    <section className="flex flex-col gap-section">
      <h1 className="text-display text-foreground">Hôm nay</h1>
      <TodayDashboard
        kpis={kpis}
        alerts={alerts}
        todayTasks={todayTasks}
        renewals={renewals}
        followUpLeads={followUpLeads}
      />
    </section>
  );
}
