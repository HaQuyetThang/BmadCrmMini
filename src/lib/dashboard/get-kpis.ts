import { PipelineStatus } from "@/generated/prisma/client";
import { activeCustomersWhere } from "@/lib/db-helpers";
import { db } from "@/lib/db";
import { countOpenTickets } from "@/lib/tickets/list-tickets";

export type DashboardKpis = {
  activeCustomerCount: number;
  revenueTotal: number;
  openTicketCount: number;
};

const activeCustomerWhere = {
  ...activeCustomersWhere,
  pipelineStatus: PipelineStatus.ACTIVE,
} as const;

export async function getDashboardKpis(): Promise<DashboardKpis> {
  const [activeCustomerCount, revenueAggregate, openTicketCount] = await Promise.all([
    db.customer.count({ where: activeCustomerWhere }),
    db.customer.aggregate({
      where: activeCustomerWhere,
      _sum: { packagePrice: true },
    }),
    countOpenTickets(),
  ]);

  const revenueTotal = revenueAggregate._sum.packagePrice?.toNumber() ?? 0;

  return {
    activeCustomerCount,
    revenueTotal,
    openTicketCount,
  };
}
