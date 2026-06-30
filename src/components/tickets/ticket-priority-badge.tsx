import { Badge } from "@/components/ui/badge";
import { TICKET_PRIORITY_LABELS } from "@/lib/constants/ticket";
import type { TicketPriority } from "@/generated/prisma/client";
import { cn } from "@/lib/utils";

type TicketPriorityBadgeProps = {
  priority: TicketPriority;
  className?: string;
};

export function TicketPriorityBadge({ priority, className }: TicketPriorityBadgeProps) {
  const isUrgent = priority === "KHAN";

  return (
    <Badge
      variant="secondary"
      className={cn(
        isUrgent
          ? "border-transparent bg-status-danger-muted text-status-danger"
          : "border-transparent bg-muted text-muted-foreground",
        className,
      )}
    >
      {TICKET_PRIORITY_LABELS[priority]}
    </Badge>
  );
}
