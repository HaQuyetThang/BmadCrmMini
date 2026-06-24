import { PipelineStatus } from "@/generated/prisma/client";
import { LEAD_PIPELINE_STATUSES } from "@/lib/constants/pipeline";
import {
  getDaysSinceStatusChange,
  getInclusiveDayCutoff,
  getLeadStaleDaysCount,
  isStaleStatus,
} from "@/lib/customers/stale-status";
import { PAGE_SIZE } from "@/lib/constants/pagination";
import { activeCustomersWhere } from "@/lib/db-helpers";
import { db } from "@/lib/db";
import { getSettings } from "@/lib/settings/get-settings";

export type FollowUpLeadItem = {
  id: string;
  name: string;
  source: string;
  staleDaysCount?: number;
  interactionGapDays: number;
  href: string;
};

export type FollowUpLeadsResult = {
  leads: FollowUpLeadItem[];
  total: number;
};

export async function getFollowUpLeads({
  limit = PAGE_SIZE,
}: { limit?: number } = {}): Promise<FollowUpLeadsResult> {
  const settings = await getSettings();
  const staleCutoff = getInclusiveDayCutoff(settings.staleStatusDays);
  const followUpCutoff = getInclusiveDayCutoff(settings.followUpDays);

  const rows = await db.customer.findMany({
    where: {
      ...activeCustomersWhere,
      pipelineStatus: { in: LEAD_PIPELINE_STATUSES as PipelineStatus[] },
      OR: [
        { statusChangedAt: { lte: staleCutoff } },
        { lastInteractionAt: { lte: followUpCutoff } },
        { lastInteractionAt: null, statusChangedAt: { lte: followUpCutoff } },
      ],
    },
    select: {
      id: true,
      name: true,
      source: true,
      pipelineStatus: true,
      statusChangedAt: true,
      lastInteractionAt: true,
    },
  });

  const matched = rows
    .map((row) => {
      const stale = isStaleStatus(row.statusChangedAt, settings.staleStatusDays);
      const interactionAt = row.lastInteractionAt ?? row.statusChangedAt;
      const interactionGapDays = getDaysSinceStatusChange(interactionAt);
      const needsFollowUp = interactionGapDays >= settings.followUpDays;

      if (!stale && !needsFollowUp) {
        return null;
      }

      const staleDaysCount = getLeadStaleDaysCount(
        row.pipelineStatus,
        row.statusChangedAt,
        settings.staleStatusDays,
      );

      return {
        id: row.id,
        name: row.name,
        source: row.source,
        staleDaysCount,
        interactionGapDays,
        sortStale: staleDaysCount ?? 0,
        href: `/customers/${row.id}`,
      };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null)
    .sort((a, b) => {
      if (a.sortStale !== b.sortStale) {
        return b.sortStale - a.sortStale;
      }

      return b.interactionGapDays - a.interactionGapDays;
    });

  return {
    leads: matched.slice(0, limit).map(({ sortStale: _sortStale, ...lead }) => lead),
    total: matched.length,
  };
}
