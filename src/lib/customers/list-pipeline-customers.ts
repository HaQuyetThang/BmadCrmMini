import type { PipelineStatus, Prisma } from "@/generated/prisma/client";

import { PAGE_SIZE } from "@/lib/constants/pagination";
import { activeCustomersWhere } from "@/lib/db-helpers";
import { db } from "@/lib/db";

export type PipelineListItem = {
  id: string;
  name: string;
  source: string;
  pipelineStatus: PipelineStatus;
  statusChangedAt: Date;
  staleDaysCount?: number;
};

export type PipelineListResult = {
  customers: PipelineListItem[];
  total: number;
  page: number;
  pageCount: number;
};

type ListPipelineCustomersInput = {
  page: number;
  status?: PipelineStatus;
};

export async function listPipelineCustomers({
  page,
  status,
}: ListPipelineCustomersInput): Promise<PipelineListResult> {
  const where: Prisma.CustomerWhereInput = {
    ...activeCustomersWhere,
    ...(status ? { pipelineStatus: status } : {}),
  };

  const total = await db.customer.count({ where });
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const customers = await db.customer.findMany({
    where,
    orderBy: [{ statusChangedAt: "desc" }, { id: "desc" }],
    skip: (currentPage - 1) * PAGE_SIZE,
    take: PAGE_SIZE,
    select: {
      id: true,
      name: true,
      source: true,
      pipelineStatus: true,
      statusChangedAt: true,
    },
  });

  return {
    customers,
    total,
    page: currentPage,
    pageCount,
  };
}
