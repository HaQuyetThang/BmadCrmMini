import { PIPELINE_STATUS_LABELS } from "@/lib/constants/pipeline";
import type { PipelineStatus } from "@/generated/prisma/client";

export type StaleInfo = {
  isStale: boolean;
  daysCount: number;
};

function startOfLocalDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

/** End of local calendar day N days before today — aligns Prisma `lte` with getDaysSinceStatusChange >= N. */
export function getInclusiveDayCutoff(daysAgo: number, now: Date = new Date()): Date {
  const today = startOfLocalDay(now);
  const cutoff = new Date(today);
  cutoff.setDate(cutoff.getDate() - daysAgo);
  cutoff.setHours(23, 59, 59, 999);
  return cutoff;
}

export function getDaysSinceStatusChange(
  statusChangedAt: Date,
  now: Date = new Date(),
): number {
  const changedDay = startOfLocalDay(statusChangedAt);
  const today = startOfLocalDay(now);

  return Math.floor((today.getTime() - changedDay.getTime()) / 86_400_000);
}

export function isStaleStatus(
  statusChangedAt: Date,
  staleStatusDays: number,
  now: Date = new Date(),
): boolean {
  return getDaysSinceStatusChange(statusChangedAt, now) >= staleStatusDays;
}

export function getStaleInfo(
  statusChangedAt: Date,
  staleStatusDays: number,
  now: Date = new Date(),
): StaleInfo {
  const daysCount = getDaysSinceStatusChange(statusChangedAt, now);

  return {
    isStale: daysCount >= staleStatusDays,
    daysCount,
  };
}

export function isLeadPhaseStatus(status: PipelineStatus): boolean {
  return PIPELINE_STATUS_LABELS[status].group === "lead";
}

export function getLeadStaleDaysCount(
  pipelineStatus: PipelineStatus,
  statusChangedAt: Date,
  staleStatusDays: number,
  now: Date = new Date(),
): number | undefined {
  if (!isLeadPhaseStatus(pipelineStatus)) {
    return undefined;
  }

  const info = getStaleInfo(statusChangedAt, staleStatusDays, now);

  return info.isStale ? info.daysCount : undefined;
}
