import { Skeleton } from "@/components/ui/skeleton";

function KpiCardSkeleton() {
  return (
    <div className="rounded-md border border-border bg-card p-card-padding">
      <Skeleton className="mb-2 h-3 w-24" />
      <Skeleton className="h-7 w-12" />
    </div>
  );
}

function AlertStripSkeleton() {
  return (
    <div className="rounded-md border border-border border-l-[3px] border-l-muted-foreground/30 bg-muted/30 px-3 py-2">
      <Skeleton className="h-4 w-32" />
    </div>
  );
}

function ListSectionSkeleton({ rows = 2 }: { rows?: number }) {
  return (
    <div className="flex flex-col gap-row-gap">
      <Skeleton className="h-6 w-40" />
      <div className="flex flex-col gap-row-gap">
        {Array.from({ length: rows }).map((_, index) => (
          <Skeleton key={index} className="h-16 w-full rounded-md" />
        ))}
      </div>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="flex flex-col gap-section" aria-busy="true" aria-label="Đang tải dashboard">
      <div className="grid grid-cols-3 gap-row-gap max-md:flex max-md:overflow-x-auto max-md:pb-1">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="min-w-[140px] flex-1 max-md:shrink-0">
            <KpiCardSkeleton />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-row-gap sm:flex sm:flex-col md:grid md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <AlertStripSkeleton key={index} />
        ))}
      </div>

      <div className="flex flex-col gap-section">
        {Array.from({ length: 3 }).map((_, index) => (
          <ListSectionSkeleton key={index} rows={2} />
        ))}
      </div>
    </div>
  );
}
