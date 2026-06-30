"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import { closeTicket } from "@/actions/tickets";
import { TicketPriorityBadge } from "@/components/tickets/ticket-priority-badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/format";
import type { TicketListItem } from "@/lib/tickets/list-tickets";
import { cn } from "@/lib/utils";

type TicketListRowProps = {
  ticket: TicketListItem;
  showCloseAction?: boolean;
};

export function TicketListRow({ ticket, showCloseAction = false }: TicketListRowProps) {
  const router = useRouter();
  const [isClosed, setIsClosed] = useState(Boolean(ticket.closedAt));
  const [isClosing, startCloseTransition] = useTransition();

  function handleClose() {
    if (isClosed || isClosing) {
      return;
    }

    startCloseTransition(async () => {
      const result = await closeTicket(ticket.id);

      if (!result.ok) {
        toast.error(result.error);
        return;
      }

      setIsClosed(true);
      toast.success("Đã đóng ticket");
      router.refresh();
    });
  }

  return (
    <div
      className={cn(
        "relative flex items-center justify-between gap-4 rounded-md border border-border bg-card px-4 py-3",
        "transition-colors hover:bg-muted/40",
      )}
    >
      <Link
        href={`/tickets/${ticket.id}`}
        className={cn(
          "absolute inset-0 rounded-md",
          "focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none",
        )}
        aria-label={`${ticket.title}: ${ticket.customer.name}`}
      />
      <div className="relative min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-foreground">{ticket.title}</p>
        <p className="text-body-sm text-muted-foreground">
          {ticket.customer.name} · {ticket.customer.source} · {formatDate(ticket.createdAt)}
        </p>
      </div>
      <div className="relative z-10 flex shrink-0 flex-col items-end gap-1 sm:flex-row sm:items-center">
        <TicketPriorityBadge priority={ticket.priority} />
        {showCloseAction && !isClosed ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={isClosing}
            onClick={(event) => {
              event.stopPropagation();
              handleClose();
            }}
          >
            {isClosing ? "Đang đóng..." : "Đóng"}
          </Button>
        ) : null}
      </div>
    </div>
  );
}
