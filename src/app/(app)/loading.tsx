import { DashboardSkeleton } from "@/components/dashboard/dashboard-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function AppLoading() {
  return (
    <section className="flex flex-col gap-section">
      <h1 className="sr-only">Đang tải...</h1>
      <Skeleton className="h-9 w-32" />
      <DashboardSkeleton />
    </section>
  );
}
