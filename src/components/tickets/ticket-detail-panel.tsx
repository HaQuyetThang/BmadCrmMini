"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";

import { completeTicketSupport } from "@/actions/tickets";
import { TicketClosedBadge } from "@/components/tickets/ticket-status-badge";
import { TicketPriorityBadge } from "@/components/tickets/ticket-priority-badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/format";
import type { TicketDetail } from "@/lib/tickets/get-ticket-by-id";

type TicketDetailPanelProps = {
  ticket: TicketDetail;
};

export function TicketDetailPanel({ ticket }: TicketDetailPanelProps) {
  const router = useRouter();
  const [isClosed, setIsClosed] = useState(Boolean(ticket.closedAt));
  const [isCompleting, startCompleteTransition] = useTransition();

  useEffect(() => {
    setIsClosed(Boolean(ticket.closedAt));
  }, [ticket.id, ticket.closedAt]);

  const isOpen = !isClosed;
  const canCompleteSupport = ticket.priority === "KHAN";

  function handleCompleteSupport() {
    if (!isOpen || isCompleting) {
      return;
    }

    startCompleteTransition(async () => {
      const result = await completeTicketSupport(ticket.id);

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
    <section className="flex flex-col gap-section rounded-lg border border-border bg-card p-card-padding">
      <div className="flex flex-col gap-2">
        <p className="text-body-sm font-medium text-muted-foreground">Ticket hỗ trợ</p>
        <h2 className="text-display-sm text-foreground">{ticket.title}</h2>
        <div className="flex flex-wrap items-center gap-2">
          {isOpen ? (
            <TicketPriorityBadge priority={ticket.priority} />
          ) : (
            <TicketClosedBadge />
          )}
          <span className="text-body-sm text-muted-foreground">
            Tạo {formatDate(ticket.createdAt)}
          </span>
        </div>
      </div>

      {isOpen ? (
        <div className="flex flex-wrap gap-2">
          {canCompleteSupport ? (
            <Button type="button" onClick={handleCompleteSupport} disabled={isCompleting}>
              {isCompleting ? "Đang xử lý..." : "Hoàn thành hỗ trợ"}
            </Button>
          ) : null}
          <Button
            type="button"
            variant="outline"
            render={<Link href={`/customers/${ticket.customer.id}`} />}
          >
            Mở hồ sơ khách
          </Button>
        </div>
      ) : (
        <p className="text-body-sm text-muted-foreground">
          Ticket đã đóng.{" "}
          <Link
            href={`/customers/${ticket.customer.id}`}
            className="underline-offset-4 hover:underline"
          >
            Xem timeline khách
          </Link>
        </p>
      )}
    </section>
  );
}
