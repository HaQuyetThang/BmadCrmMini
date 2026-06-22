import { z } from "zod";

import { TimelineType } from "@/generated/prisma/client";

export const createTimelineEntrySchema = z.object({
  type: z.nativeEnum(TimelineType, { message: "Loại tương tác không hợp lệ." }),
  content: z
    .string({ error: "Nội dung là bắt buộc." })
    .trim()
    .min(1, "Nội dung là bắt buộc.")
    .max(2000, "Nội dung quá dài."),
});

export type CreateTimelineEntryInput = z.infer<typeof createTimelineEntrySchema>;
