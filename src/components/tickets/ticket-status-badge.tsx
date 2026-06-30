import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type TicketStatusBadgeProps = {
  className?: string;
};

export function TicketClosedBadge({ className }: TicketStatusBadgeProps) {
  return (
    <Badge
      variant="secondary"
      className={cn(
        "border-transparent bg-status-success-muted text-status-success",
        className,
      )}
    >
      Đã đóng
    </Badge>
  );
}
