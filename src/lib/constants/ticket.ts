import { TicketPriority } from "@/generated/prisma/client";

export const TICKET_PRIORITY_LABELS: Record<TicketPriority, string> = {
  NORMAL: "Thường",
  KHAN: "Khẩn",
};

export const TICKET_STATUS_FILTER_OPTIONS = [
  { value: "open", label: "Đang mở" },
  { value: "closed", label: "Đã đóng" },
] as const;

export const TICKET_PRIORITY_FILTER_OPTIONS = [
  { value: "", label: "Tất cả" },
  { value: "1", label: "Khẩn" },
] as const;
