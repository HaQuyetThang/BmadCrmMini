import Link from "next/link";
import { notFound } from "next/navigation";

import { TicketCustomerContext } from "@/components/tickets/ticket-customer-context";
import { TicketDetailPanel } from "@/components/tickets/ticket-detail-panel";
import { getTicketById } from "@/lib/tickets/get-ticket-by-id";

export const dynamic = "force-dynamic";

type TicketDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function TicketDetailPage({ params }: TicketDetailPageProps) {
  const { id } = await params;
  const ticket = await getTicketById(id);

  if (!ticket) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-section">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-display-sm text-foreground">Chi tiết ticket</h1>
        <Link
          href="/tickets?status=open&urgent=1"
          className="text-body-sm text-muted-foreground underline-offset-4 hover:underline"
        >
          Về queue ticket Khẩn
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-section lg:grid-cols-2">
        <TicketDetailPanel ticket={ticket} />
        <TicketCustomerContext customer={ticket.customer} />
      </div>
    </div>
  );
}
