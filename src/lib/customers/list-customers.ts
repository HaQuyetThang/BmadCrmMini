import type { BusinessGroup, Prisma } from "@/generated/prisma/client";

import { PAGE_SIZE } from "@/lib/constants/pagination";
import type { RenewalInfo } from "@/lib/customers/renewal-status";
import { appointmentsTodayWhere, overduePaymentsWhere } from "@/lib/dashboard/date-range";
import { activeCustomersWhere } from "@/lib/db-helpers";
import { db } from "@/lib/db";
import type { CustomerListQuery } from "@/lib/validations/customer";

export type CustomerListItem = {
  id: string;
  name: string;
  source: string;
  pipelineStatus: Prisma.CustomerGetPayload<object>["pipelineStatus"];
  businessGroup: BusinessGroup;
  statusChangedAt: Date;
  renewalDate: Date | null;
  createdAt: Date;
  staleDaysCount?: number;
  renewalInfo?: RenewalInfo;
};

export type CustomerListResult = {
  customers: CustomerListItem[];
  total: number;
  page: number;
  pageCount: number;
};

type ListCustomersInput = CustomerListQuery;

function buildListWhere({
  group,
  q,
  filter,
}: Pick<ListCustomersInput, "group" | "q" | "filter">): Prisma.CustomerWhereInput {
  const searchFilter = q
    ? {
        OR: [
          { name: { contains: q, mode: "insensitive" as const } },
          { source: { contains: q, mode: "insensitive" as const } },
        ],
      }
    : {};

  const groupFilter = group ? { businessGroup: group } : {};

  if (filter === "demo-today") {
    return {
      ...appointmentsTodayWhere(),
      ...groupFilter,
      ...searchFilter,
    };
  }

  if (filter === "payment-overdue") {
    return {
      ...overduePaymentsWhere(),
      ...groupFilter,
      ...searchFilter,
    };
  }

  return {
    ...activeCustomersWhere,
    ...groupFilter,
    ...searchFilter,
  };
}

function buildListOrderBy(
  filter?: ListCustomersInput["filter"],
): Prisma.CustomerOrderByWithRelationInput {
  if (filter === "demo-today") {
    return { demoScheduledAt: "asc" };
  }

  if (filter === "payment-overdue") {
    return { paymentDueAt: "asc" };
  }

  return { createdAt: "desc" };
}

export async function listCustomers({
  page,
  group,
  q,
  filter,
}: ListCustomersInput): Promise<CustomerListResult> {
  const where = buildListWhere({ group, q, filter });
  const orderBy = buildListOrderBy(filter);

  const total = await db.customer.count({ where });
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const customers = await db.customer.findMany({
    where,
    orderBy,
    skip: (currentPage - 1) * PAGE_SIZE,
    take: PAGE_SIZE,
    select: {
      id: true,
      name: true,
      source: true,
      pipelineStatus: true,
      businessGroup: true,
      statusChangedAt: true,
      renewalDate: true,
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
