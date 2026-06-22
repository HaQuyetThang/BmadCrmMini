import type { TimelineType } from "@/generated/prisma/client";

export const TIMELINE_TYPE_LABELS: Record<TimelineType, string> = {
  ZALO: "Zalo",
  CALL: "Gọi",
  TICKET: "Ticket",
  NOTE: "Ghi chú",
};

export const TIMELINE_TYPE_OPTIONS = (
  Object.entries(TIMELINE_TYPE_LABELS) as [TimelineType, string][]
).map(([value, label]) => ({ value, label }));

export const LOGIN_SUPPORT_PRESET = {
  type: "NOTE" as const,
  content: "Hỗ trợ login",
};
