import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import type { CustomerListItem } from "@/lib/customers/list-customers";
import {
  PIPELINE_GROUP_CLASS,
  PIPELINE_STATUS_LABELS,
} from "@/lib/constants/pipeline";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";

type CustomerListRowProps = {
  customer: CustomerListItem;
};

export function CustomerListRow({ customer }: CustomerListRowProps) {
  const statusMeta = PIPELINE_STATUS_LABELS[customer.pipelineStatus];

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
      <Badge
        className={cn(
          "shrink-0 border-transparent",
          PIPELINE_GROUP_CLASS[statusMeta.group],
        )}
      >
        {statusMeta.label}
      </Badge>
    </Link>
  );
}
