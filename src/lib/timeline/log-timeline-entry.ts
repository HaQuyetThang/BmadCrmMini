import type { TimelineType } from "@/generated/prisma/client";

import type { ActionResult } from "@/lib/action-result";
import { db } from "@/lib/db";

type LogTimelineEntryInput = {
  customerId: string;
  type: TimelineType;
  content: string;
};

export async function logTimelineEntry({
  customerId,
  type,
  content,
}: LogTimelineEntryInput): Promise<ActionResult<{ id: string }>> {
  try {
    const now = new Date();
    const entry = await db.$transaction(async (tx) => {
      const updated = await tx.customer.updateMany({
        where: { id: customerId, deletedAt: null },
        data: { lastInteractionAt: now },
      });

      if (updated.count === 0) {
        throw new Error("CUSTOMER_NOT_FOUND");
      }

      return tx.timelineEntry.create({
        data: { customerId, type, content },
      });
    });

    return { ok: true, data: { id: entry.id } };
  } catch (error) {
    if (error instanceof Error && error.message === "CUSTOMER_NOT_FOUND") {
      return { ok: false, error: "Không tìm thấy khách." };
    }

    console.error("logTimelineEntry failed", error);
    return { ok: false, error: "Không ghi được timeline. Thử lại sau." };
  }
}
