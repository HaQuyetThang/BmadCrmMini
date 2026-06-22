import { activeCustomersWhere } from "@/lib/db-helpers";
import { db } from "@/lib/db";

export async function getTimelineEntries(customerId: string) {
  const customer = await db.customer.findFirst({
    where: { id: customerId, ...activeCustomersWhere },
    select: { id: true },
  });

  if (!customer) {
    return [];
  }

  return db.timelineEntry.findMany({
    where: { customerId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      type: true,
      content: true,
      createdAt: true,
    },
  });
}
