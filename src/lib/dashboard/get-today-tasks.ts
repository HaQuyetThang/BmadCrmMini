import {
  getDaysSinceStatusChange,
  getInclusiveDayCutoff,
  getStaleInfo,
  isStaleStatus,
} from "@/lib/customers/stale-status";
import { PAGE_SIZE } from "@/lib/constants/pagination";
import { appointmentsTodayWhere } from "@/lib/dashboard/date-range";
import { activeCustomersWhere } from "@/lib/db-helpers";
import { db } from "@/lib/db";
import { getSettings } from "@/lib/settings/get-settings";

export type TodayTaskKind = "appointment" | "stale" | "follow-up";

export type TodayTaskItem = {
  id: string;
  name: string;
  source: string;
  kind: TodayTaskKind;
  badgeLabel?: string;
  staleDaysCount?: number;
  href: string;
};

export type TodayTasksResult = {
  items: TodayTaskItem[];
  total: number;
};

const KIND_PRIORITY: Record<TodayTaskKind, number> = {
  stale: 0,
  "follow-up": 1,
  appointment: 2,
};

const KIND_LABELS: Record<Exclude<TodayTaskKind, "stale">, string> = {
  appointment: "Lịch hẹn hôm nay",
  "follow-up": "Cần follow-up",
};

type MergedTask = {
  id: string;
  name: string;
  source: string;
  kind: TodayTaskKind;
  badgeLabel?: string;
  staleDaysCount?: number;
  sortTier: number;
  sortSecondary: number;
  sortTertiary: number;
};

function upsertTask(map: Map<string, MergedTask>, task: MergedTask) {
  const existing = map.get(task.id);
  if (!existing || task.sortTier < existing.sortTier) {
    map.set(task.id, task);
  }
}

function compareTasks(a: MergedTask, b: MergedTask): number {
  if (a.sortTier !== b.sortTier) {
    return a.sortTier - b.sortTier;
  }

  if (a.sortTier < 2) {
    return b.sortSecondary - a.sortSecondary;
  }

  return a.sortTertiary - b.sortTertiary;
}

export async function getTodayTasks({
  limit = PAGE_SIZE,
}: { limit?: number } = {}): Promise<TodayTasksResult> {
  const settings = await getSettings();
  const staleCutoff = getInclusiveDayCutoff(settings.staleStatusDays);
  const followUpCutoff = getInclusiveDayCutoff(settings.followUpDays);

  const customerSelect = {
    id: true,
    name: true,
    source: true,
    statusChangedAt: true,
    lastInteractionAt: true,
    demoScheduledAt: true,
  } as const;

  const [appointments, staleCandidates, followUpCandidates] = await Promise.all([
    db.customer.findMany({
      where: appointmentsTodayWhere(),
      select: customerSelect,
      orderBy: { demoScheduledAt: "asc" },
    }),
    db.customer.findMany({
      where: {
        ...activeCustomersWhere,
        statusChangedAt: { lte: staleCutoff },
      },
      select: customerSelect,
    }),
    db.customer.findMany({
      where: {
        ...activeCustomersWhere,
        OR: [
          { lastInteractionAt: { lte: followUpCutoff } },
          { lastInteractionAt: null, statusChangedAt: { lte: followUpCutoff } },
        ],
      },
      select: customerSelect,
    }),
  ]);

  const map = new Map<string, MergedTask>();

  for (const customer of staleCandidates) {
    if (!isStaleStatus(customer.statusChangedAt, settings.staleStatusDays)) {
      continue;
    }

    const info = getStaleInfo(customer.statusChangedAt, settings.staleStatusDays);
    upsertTask(map, {
      id: customer.id,
      name: customer.name,
      source: customer.source,
      kind: "stale",
      staleDaysCount: info.daysCount,
      sortTier: KIND_PRIORITY.stale,
      sortSecondary: info.daysCount,
      sortTertiary: 0,
    });
  }

  for (const customer of followUpCandidates) {
    const interactionAt = customer.lastInteractionAt ?? customer.statusChangedAt;
    const gapDays = getDaysSinceStatusChange(interactionAt);
    if (gapDays < settings.followUpDays) {
      continue;
    }

    upsertTask(map, {
      id: customer.id,
      name: customer.name,
      source: customer.source,
      kind: "follow-up",
      badgeLabel: `${KIND_LABELS["follow-up"]} ${gapDays} ngày`,
      sortTier: KIND_PRIORITY["follow-up"],
      sortSecondary: gapDays,
      sortTertiary: 0,
    });
  }

  for (const customer of appointments) {
    upsertTask(map, {
      id: customer.id,
      name: customer.name,
      source: customer.source,
      kind: "appointment",
      badgeLabel: KIND_LABELS.appointment,
      sortTier: KIND_PRIORITY.appointment,
      sortSecondary: 0,
      sortTertiary: customer.demoScheduledAt?.getTime() ?? 0,
    });
  }

  const sorted = Array.from(map.values()).sort(compareTasks);

  return {
    items: sorted.slice(0, limit).map((task) => ({
      id: task.id,
      name: task.name,
      source: task.source,
      kind: task.kind,
      badgeLabel: task.badgeLabel,
      staleDaysCount: task.staleDaysCount,
      href: `/customers/${task.id}`,
    })),
    total: sorted.length,
  };
}
