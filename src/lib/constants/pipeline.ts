import type { PipelineStatus } from "@/generated/prisma/client";

export type PipelineVisualGroup = "lead" | "closing" | "customer";

export type PipelineStatusMeta = {
  label: string;
  group: PipelineVisualGroup;
};

export const PIPELINE_STATUS_LABELS: Record<PipelineStatus, PipelineStatusMeta> = {
  LEAD_MOI: { label: "Lead mới", group: "lead" },
  DANG_TU_VAN: { label: "Đang tư vấn", group: "lead" },
  HEN_DEMO: { label: "Hẹn demo", group: "closing" },
  BAO_GIA_DA_GUI: { label: "Báo giá đã gửi", group: "closing" },
  CHO_THANH_TOAN: { label: "Chờ thanh toán", group: "closing" },
  DA_CHOT: { label: "Đã chốt", group: "customer" },
  DANG_ONBOARD: { label: "Đang onboard", group: "customer" },
  ACTIVE: { label: "Active", group: "customer" },
  CAN_CHAM_SOC: { label: "Cần chăm sóc", group: "customer" },
};

export const PIPELINE_GROUP_CLASS: Record<PipelineVisualGroup, string> = {
  lead: "bg-muted text-foreground",
  closing: "bg-status-warning-muted text-status-warning",
  customer: "bg-status-success-muted text-status-success",
};

export const PIPELINE_GROUP_DOT_CLASS: Record<PipelineVisualGroup, string> = {
  lead: "bg-foreground/60",
  closing: "bg-status-warning",
  customer: "bg-status-success",
};

export const PIPELINE_STATUS_OPTIONS = (
  Object.entries(PIPELINE_STATUS_LABELS) as [PipelineStatus, PipelineStatusMeta][]
).map(([value, meta]) => ({ value, label: meta.label, group: meta.group }));

export const PIPELINE_STATUS_GROUP_LABELS: Record<PipelineVisualGroup, string> = {
  lead: "Lead",
  closing: "Đang chốt",
  customer: "Khách",
};

export const LEAD_PIPELINE_STATUSES = (
  Object.entries(PIPELINE_STATUS_LABELS) as [PipelineStatus, PipelineStatusMeta][]
)
  .filter(([, meta]) => meta.group === "lead")
  .map(([status]) => status);
