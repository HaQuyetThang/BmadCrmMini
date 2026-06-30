import { TicketQueue } from "@/components/tickets/ticket-queue";
import { listTickets } from "@/lib/tickets/list-tickets";
import { ticketListQuerySchema } from "@/lib/validations/ticket";

export const dynamic = "force-dynamic";

type TicketsPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function TicketsPage({ searchParams }: TicketsPageProps) {
  const rawParams = await searchParams;
  const parsed = ticketListQuerySchema.safeParse({
    page: rawParams.page,
    status: rawParams.status,
    urgent: rawParams.urgent,
  });

  const query = parsed.success ? parsed.data : { page: 1 as const };
  const status = query.status ?? "open";
  const result = await listTickets({ ...query, status });

  return (
    <div className="flex flex-col gap-section">
      <h1 className="text-display-sm text-foreground">Ticket</h1>
      <TicketQueue result={result} status={status} urgent={query.urgent} />
    </div>
  );
}
