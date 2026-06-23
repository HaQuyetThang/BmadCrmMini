import { TodayDashboard } from "@/components/dashboard/today-dashboard";
import { getDashboardAlerts } from "@/lib/dashboard/get-alerts";
import { getDashboardKpis } from "@/lib/dashboard/get-kpis";

export const dynamic = "force-dynamic";

export default async function TodayPage() {
  const [kpis, alerts] = await Promise.all([getDashboardKpis(), getDashboardAlerts()]);

  return (
    <section className="flex flex-col gap-section">
      <h1 className="text-display text-foreground">Hôm nay</h1>
      <TodayDashboard kpis={kpis} alerts={alerts} />
    </section>
  );
}
