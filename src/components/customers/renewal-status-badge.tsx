import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type RenewalStatusBadgeProps = {
  label: string;
  status: "approaching" | "overdue";
  className?: string;
};

export function RenewalStatusBadge({ label, status, className }: RenewalStatusBadgeProps) {
  return (
    <Badge
      variant="secondary"
      className={cn(
        "border-transparent",
        status === "approaching"
          ? "bg-status-warning-muted text-status-warning"
          : "bg-status-danger-muted text-status-danger",
        className,
      )}
    >
      {label}
    </Badge>
  );
}
