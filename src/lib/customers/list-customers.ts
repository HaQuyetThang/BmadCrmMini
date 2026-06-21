import type { BusinessGroup, Prisma } from "@/generated/prisma/client";

import { PAGE_SIZE } from "@/lib/constants/pagination";
import { activeCustomersWhere } from "@/lib/db-helpers";
import { db } from "@/lib/db";

export type CustomerListItem = {
  id: string;
  name: string;
  source: string;
  pipelineStatus: Prisma.CustomerGetPayload<object>["pipelineStatus"];
  businessGroup: BusinessGroup;
  createdAt: Date;
};

export type CustomerListResult = {
  customers: CustomerListItem[];
  total: number;
  page: number;
  pageCount: number;
};

type ListCustomersInput = {
  page: number;
  group?: BusinessGroup;
  q?: string;
};

export async function listCustomers({
  page,
  group,
  q,
}: ListCustomersInput): Promise<CustomerListResult> {
  const where: Prisma.CustomerWhereInput = {
    ...activeCustomersWhere,
    ...(group ? { businessGroup: group } : {}),
    ...(q
      ? {
          OR: [
            { name: { contains: q, mode: "insensitive" } },
            { source: { contains: q, mode: "insensitive" } },
          ],
        }
      : {}),
  };

  const total = await db.customer.count({ where });
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const customers = await db.customer.findMany({
    where,
    orderBy: { createdAt: "desc" },
    skip: (currentPage - 1) * PAGE_SIZE,
    take: PAGE_SIZE,
    select: {
      id: true,
      name: true,
      source: true,
      pipelineStatus: true,
      businessGroup: true,
      createdAt: true,
    },
  });

  return {
    customers,
    total,
    page: currentPage,
    pageCount,
  };
}

export async function getCustomerById(id: string) {
  return db.customer.findFirst({
    where: {
      id,
      ...activeCustomersWhere,
    },
  });
}
