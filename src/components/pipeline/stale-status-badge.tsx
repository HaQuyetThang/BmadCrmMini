import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type StaleStatusBadgeProps = {
  daysCount: number;
  className?: string;
};

export function StaleStatusBadge({ daysCount, className }: StaleStatusBadgeProps) {
  return (
    <Badge
      variant="secondary"
      className={cn(
        "border-transparent bg-status-warning-muted text-status-warning",
        className,
      )}
    >
      {daysCount} ngày không đổi
    </Badge>
  );
}
