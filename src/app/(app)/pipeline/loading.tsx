import { Skeleton } from "@/components/ui/skeleton";

export default function PipelineLoading() {
  return (
    <div className="flex flex-col gap-section">
      <Skeleton className="h-7 w-48" />
      <Skeleton className="h-8 w-64" />
      <div className="flex flex-col gap-row-gap">
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton key={index} className="h-16 w-full rounded-md" />
        ))}
      </div>
    </div>
  );
}
