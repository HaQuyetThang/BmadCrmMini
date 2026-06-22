import { TodayDashboard } from "@/components/dashboard/today-dashboard";

export default function TodayPage() {
  return (
    <section className="flex flex-col gap-section">
      <h1 className="text-display text-foreground">Hôm nay</h1>
      <TodayDashboard />
    </section>
  );
}
