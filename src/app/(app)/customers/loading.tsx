import { Skeleton } from "@/components/ui/skeleton";

export default function CustomersLoading() {
  return (
    <div className="flex flex-col gap-section">
      <Skeleton className="h-7 w-40" />
      <div className="flex flex-col gap-section sm:flex-row">
        <Skeleton className="h-8 flex-1" />
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-8 w-20" />
      </div>
      <div className="flex flex-col gap-row-gap">
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton key={index} className="h-16 w-full rounded-md" />
        ))}
      </div>
    </div>
  );
}
