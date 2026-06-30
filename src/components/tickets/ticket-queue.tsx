import Link from "next/link";

import { TicketListRow } from "@/components/tickets/ticket-list-row";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  TICKET_PRIORITY_FILTER_OPTIONS,
  TICKET_STATUS_FILTER_OPTIONS,
} from "@/lib/constants/ticket";
import type { TicketListResult } from "@/lib/tickets/list-tickets";
import type { TicketListQuery } from "@/lib/validations/ticket";

type TicketQueueProps = {
  result: TicketListResult;
  status: TicketListQuery["status"];
  urgent?: TicketListQuery["urgent"];
};

function buildTicketsHref({
  page,
  status,
  urgent,
}: {
  page: number;
  status?: TicketListQuery["status"];
  urgent?: TicketListQuery["urgent"];
}) {
  const params = new URLSearchParams();

  if (page > 1) params.set("page", String(page));
  if (status) params.set("status", status);
  if (urgent === "1") params.set("urgent", "1");

  const query = params.toString();
  return query ? `/tickets?${query}` : "/tickets";
}

export function TicketQueue({ result, status = "open", urgent }: TicketQueueProps) {
  const { tickets, page, pageCount, total } = result;
  const isEmpty = tickets.length === 0;
  const showCloseAction = status !== "closed";

  return (
    <div className="flex flex-col gap-section">
      <form method="get" className="flex flex-col gap-section sm:flex-row sm:items-end">
        <div className="flex flex-col gap-row-gap sm:w-44">
          <Label htmlFor="ticket-status">Trạng thái</Label>
          <select
            id="ticket-status"
            name="status"
            defaultValue={status ?? "open"}
            className="h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            {TICKET_STATUS_FILTER_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-row-gap sm:w-44">
          <Label htmlFor="ticket-urgent">Ưu tiên</Label>
          <select
            id="ticket-urgent"
            name="urgent"
            defaultValue={urgent === "1" ? "1" : ""}
            className="h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            {TICKET_PRIORITY_FILTER_OPTIONS.map((option) => (
              <option key={option.value || "all"} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <Button type="submit">Lọc</Button>
      </form>

      {isEmpty ? (
        <p className="text-body-sm text-muted-foreground">
          {status === "closed"
            ? "Chưa có ticket đã đóng."
            : urgent === "1"
              ? "Chưa có ticket Khẩn đang mở."
              : "Chưa có ticket đang mở."}
        </p>
      ) : (
        <ul className="flex flex-col gap-row-gap">
          {tickets.map((ticket) => (
            <li key={ticket.id}>
              <TicketListRow ticket={ticket} showCloseAction={showCloseAction} />
            </li>
          ))}
        </ul>
      )}

      {total > 0 ? (
        <div className="flex items-center justify-between gap-4">
          <p className="text-body-sm text-muted-foreground">
            Trang {page} / {pageCount}
          </p>
          <div className="flex gap-2">
            {page > 1 ? (
              <Button
                variant="outline"
                size="sm"
                render={<Link href={buildTicketsHref({ page: page - 1, status, urgent })} />}
              >
                Trước
              </Button>
            ) : null}
            {page < pageCount ? (
              <Button
                variant="outline"
                size="sm"
                render={<Link href={buildTicketsHref({ page: page + 1, status, urgent })} />}
              >
                Sau
              </Button>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}
