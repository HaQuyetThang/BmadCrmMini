import Link from "next/link";

import { PipelineStatusChip } from "@/components/pipeline/pipeline-status-chip";
import { RenewalStatusBadge } from "@/components/customers/renewal-status-badge";
import { StaleStatusBadge } from "@/components/pipeline/stale-status-badge";
import type { CustomerListItem } from "@/lib/customers/list-customers";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";

type CustomerListRowProps = {
  customer: CustomerListItem;
};

export function CustomerListRow({ customer }: CustomerListRowProps) {
  return (
    <Link
      href={`/customers/${customer.id}`}
      className={cn(
        "flex items-center justify-between gap-4 rounded-md border border-border bg-card px-4 py-3 transition-colors",
        "hover:bg-muted/40 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none",
      )}
    >
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-foreground">{customer.name}</p>
        <p className="text-body-sm text-muted-foreground">
          {customer.source} · {formatDate(customer.createdAt)}
        </p>
      </div>
      <div className="flex shrink-0 flex-col items-end gap-1 sm:flex-row sm:items-center">
        {customer.renewalInfo ? (
          <RenewalStatusBadge
            label={customer.renewalInfo.label}
            status={customer.renewalInfo.status}
          />
        ) : null}
        {customer.staleDaysCount !== undefined ? (
          <StaleStatusBadge daysCount={customer.staleDaysCount} />
        ) : null}
        <PipelineStatusChip status={customer.pipelineStatus} />
      </div>
    </Link>
  );
}
