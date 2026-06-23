import { PipelineStatus } from "@/generated/prisma/client";
import { activeCustomersWhere } from "@/lib/db-helpers";

export function getTodayRange() {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
  const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

  return { start, end };
}

export function appointmentsTodayWhere() {
  const { start, end } = getTodayRange();

  return {
    ...activeCustomersWhere,
    demoScheduledAt: {
      gte: start,
      lte: end,
    },
  } as const;
}

export function overduePaymentsWhere() {
  const { end } = getTodayRange();

  return {
    ...activeCustomersWhere,
    pipelineStatus: PipelineStatus.CHO_THANH_TOAN,
    paymentDueAt: {
      lte: end,
    },
  } as const;
}
