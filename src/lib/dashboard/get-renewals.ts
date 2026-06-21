import { PAGE_SIZE } from "@/lib/constants/pagination";
import {
  getRenewalDateUpperBound,
  getRenewalInfo,
  type RenewalInfo,
} from "@/lib/customers/renewal-status";
import { activeCustomersWhere } from "@/lib/db-helpers";
import { db } from "@/lib/db";
import { getSettings } from "@/lib/settings/get-settings";

export type RenewalCustomerItem = {
  id: string;
  name: string;
  source: string;
  renewalDate: Date;
  renewalInfo: RenewalInfo;
};

export type RenewalCustomersResult = {
  customers: RenewalCustomerItem[];
  total: number;
  page: number;
  pageCount: number;
};

type GetRenewalCustomersInput = {
  page: number;
};

export async function getRenewalCustomers({
  page,
}: GetRenewalCustomersInput): Promise<RenewalCustomersResult> {
  const settings = await getSettings();
  const maxRenewalDate = getRenewalDateUpperBound(settings.renewalWindowDays);

  const where = {
    ...activeCustomersWhere,
    renewalDate: {
      not: null,
      lte: maxRenewalDate,
    },
  };

  const total = await db.customer.count({ where });
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);

  const rows = await db.customer.findMany({
    where,
    orderBy: { renewalDate: "asc" },
    skip: (currentPage - 1) * PAGE_SIZE,
    take: PAGE_SIZE,
    select: {
      id: true,
      name: true,
      source: true,
      renewalDate: true,
    },
  });

  const customers = rows.map((row) => {
    const renewalDate = row.renewalDate!;
    const renewalInfo = getRenewalInfo(renewalDate, settings.renewalWindowDays)!;

    return {
      id: row.id,
      name: row.name,
      source: row.source,
      renewalDate,
      renewalInfo,
    };
  });

  return {
    customers,
    total,
    page: currentPage,
    pageCount,
  };
}
