import { TicketPriority, type Prisma } from "@/generated/prisma/client";
import { PAGE_SIZE } from "@/lib/constants/pagination";
import { activeCustomersWhere } from "@/lib/db-helpers";
import { db } from "@/lib/db";
import type { TicketListQuery } from "@/lib/validations/ticket";

export type TicketListItem = {
  id: string;
  title: string;
  priority: TicketPriority;
  closedAt: Date | null;
  createdAt: Date;
  customer: {
    id: string;
    name: string;
    source: string;
  };
};

export type TicketListResult = {
  tickets: TicketListItem[];
  total: number;
  page: number;
  pageCount: number;
};

function buildTicketWhere({
  status = "open",
  urgent,
}: Pick<TicketListQuery, "status" | "urgent">): Prisma.TicketWhereInput {
  const statusFilter =
    status === "closed" ? { closedAt: { not: null } } : { closedAt: null };

  const priorityFilter = urgent === "1" ? { priority: TicketPriority.KHAN } : {};

  return {
    ...statusFilter,
    ...priorityFilter,
    customer: activeCustomersWhere,
  };
}

export async function listTickets({
  page,
  status = "open",
  urgent,
}: TicketListQuery): Promise<TicketListResult> {
  const where = buildTicketWhere({ status, urgent });

  const total = await db.ticket.count({ where });
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);

  const tickets = await db.ticket.findMany({
    where,
    orderBy: [{ priority: "desc" }, { createdAt: "desc" }],
    skip: (currentPage - 1) * PAGE_SIZE,
    take: PAGE_SIZE,
    select: {
      id: true,
      title: true,
      priority: true,
      closedAt: true,
      createdAt: true,
      customer: {
        select: {
          id: true,
          name: true,
          source: true,
        },
      },
    },
  });

  return {
    tickets,
    total,
    page: currentPage,
    pageCount,
  };
}

export async function countOpenTickets(): Promise<number> {
  return db.ticket.count({
    where: {
      closedAt: null,
      customer: activeCustomersWhere,
    },
  });
}

export async function countOpenUrgentTickets(): Promise<number> {
  return db.ticket.count({
    where: {
      closedAt: null,
      priority: TicketPriority.KHAN,
      customer: activeCustomersWhere,
    },
  });
}

export async function getFirstOpenUrgentTicketId(): Promise<string | null> {
  const ticket = await db.ticket.findFirst({
    where: {
      closedAt: null,
      priority: TicketPriority.KHAN,
      customer: activeCustomersWhere,
    },
    orderBy: { createdAt: "asc" },
    select: { id: true },
  });

  return ticket?.id ?? null;
}
