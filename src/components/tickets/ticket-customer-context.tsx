import Link from "next/link";

import { PipelineStatusChip } from "@/components/pipeline/pipeline-status-chip";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BUSINESS_GROUP_LABELS } from "@/lib/constants/business-group";
import type { TicketDetail } from "@/lib/tickets/get-ticket-by-id";

type TicketCustomerContextProps = {
  customer: TicketDetail["customer"];
};

export function TicketCustomerContext({ customer }: TicketCustomerContextProps) {
  return (
    <aside className="flex flex-col gap-section rounded-lg border border-border bg-card p-card-padding">
      <div className="flex flex-col gap-2">
        <p className="text-body-sm font-medium text-muted-foreground">Chi tiết khách</p>
        <h2 className="text-display-sm text-foreground">
          <Link
            href={`/customers/${customer.id}`}
            className="hover:underline focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
          >
            {customer.name}
          </Link>
        </h2>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary" className="border-transparent bg-muted text-foreground">
            {BUSINESS_GROUP_LABELS[customer.businessGroup]}
          </Badge>
          <PipelineStatusChip status={customer.pipelineStatus} />
        </div>
        <p className="text-body-sm text-muted-foreground">{customer.source}</p>
      </div>

      <div className="flex flex-col gap-row-gap">
        <Label htmlFor="ticket-context-license">License/key</Label>
        <Input
          id="ticket-context-license"
          readOnly
          value={customer.licenseKey ?? ""}
          placeholder="Chưa có license/key"
          className="bg-background"
        />
      </div>
    </aside>
  );
}
