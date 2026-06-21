import type { PipelineStatus } from "@/generated/prisma/client";

export type PipelineVisualGroup = "lead" | "closing" | "customer";

export type PipelineStatusMeta = {
  label: string;
  group: PipelineVisualGroup;
};

export const PIPELINE_STATUS_LABELS: Record<PipelineStatus, PipelineStatusMeta> = {
  LEAD_MOI: { label: "Lead mới", group: "lead" },
  DANG_TU_VAN: { label: "Đang tư vấn", group: "lead" },
};

export const PIPELINE_GROUP_CLASS: Record<PipelineVisualGroup, string> = {
  lead: "bg-muted text-foreground",
  closing: "bg-status-warning-muted text-status-warning",
  customer: "bg-status-success-muted text-status-success",
};
