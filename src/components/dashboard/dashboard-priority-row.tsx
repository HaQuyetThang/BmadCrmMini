import Link from "next/link";

import { RenewalStatusBadge } from "@/components/customers/renewal-status-badge";
import { StaleStatusBadge } from "@/components/pipeline/stale-status-badge";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type DashboardPriorityRowProps = {
  name: string;
  subtitle: string;
  href: string;
  ariaLabel: string;
  renewalBadge?: {
    label: string;
    status: "approaching" | "overdue";
  };
  staleDaysCount?: number;
  kindLabel?: string;
  className?: string;
};

export function DashboardPriorityRow({
  name,
  subtitle,
  href,
  ariaLabel,
  renewalBadge,
  staleDaysCount,
  kindLabel,
  className,
}: DashboardPriorityRowProps) {
  return (
    <Link
      href={href}
      aria-label={ariaLabel}
      className={cn(
        "flex items-center justify-between gap-4 rounded-md border border-border bg-card px-4 py-3 transition-colors",
        "hover:bg-muted/40 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none",
        className,
      )}
    >
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-foreground">{name}</p>
        <p className="text-body-sm text-muted-foreground">{subtitle}</p>
      </div>
      <div className="flex shrink-0 flex-col items-end gap-1 sm:flex-row sm:items-center">
        {renewalBadge ? (
          <RenewalStatusBadge label={renewalBadge.label} status={renewalBadge.status} />
        ) : null}
        {staleDaysCount !== undefined ? <StaleStatusBadge daysCount={staleDaysCount} /> : null}
        {kindLabel && !renewalBadge && staleDaysCount === undefined ? (
          <Badge
            variant="secondary"
            className="border-transparent bg-status-warning-muted text-status-warning"
          >
            {kindLabel}
          </Badge>
        ) : null}
      </div>
    </Link>
  );
}
