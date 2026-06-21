import Link from "next/link";

import { PipelineStatusChip } from "@/components/pipeline/pipeline-status-chip";
import { StaleStatusBadge } from "@/components/pipeline/stale-status-badge";
import { StatusSelect } from "@/components/pipeline/status-select";
import type { PipelineListItem } from "@/lib/customers/list-pipeline-customers";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";

type PipelineListRowProps = {
  customer: PipelineListItem;
};

export function PipelineListRow({ customer }: PipelineListRowProps) {
  return (
    <div
      className={cn(
        "relative flex items-center justify-between gap-4 rounded-md border border-border bg-card px-4 py-3",
        "transition-colors hover:bg-muted/40",
      )}
    >
      <Link
        href={`/customers/${customer.id}`}
        className={cn(
          "absolute inset-0 rounded-md",
          "focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none",
        )}
        aria-label={`Mở hồ sơ ${customer.name}`}
      />
      <div className="relative min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-foreground">{customer.name}</p>
        <p className="text-body-sm text-muted-foreground">
          {customer.source} · Cập nhật {formatDate(customer.statusChangedAt)}
        </p>
      </div>
      <div className="relative z-10 flex shrink-0 flex-col items-end gap-1 sm:flex-row sm:items-center">
        {customer.staleDaysCount !== undefined ? (
          <StaleStatusBadge daysCount={customer.staleDaysCount} />
        ) : null}
        <PipelineStatusChip status={customer.pipelineStatus} className="hidden sm:inline-flex" />
        <StatusSelect
          customerId={customer.id}
          value={customer.pipelineStatus}
          className="w-40 sm:w-44"
          onClick={(event) => event.stopPropagation()}
        />
      </div>
    </div>
  );
}
