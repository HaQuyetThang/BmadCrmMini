import type { BusinessGroup } from "@/generated/prisma/client";

export const BUSINESS_GROUP_LABELS: Record<BusinessGroup, string> = {
  KE_TOAN: "Kế toán",
  MARKETING: "Marketing",
  KHAC: "Khác",
};

export const BUSINESS_GROUP_OPTIONS = (
  Object.entries(BUSINESS_GROUP_LABELS) as [BusinessGroup, string][]
).map(([value, label]) => ({ value, label }));
