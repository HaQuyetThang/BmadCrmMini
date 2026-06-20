import { z } from "zod";

export const createCustomerSchema = z.object({
  name: z
    .string({ error: "Tên khách là bắt buộc." })
    .trim()
    .min(1, "Tên khách là bắt buộc.")
    .max(120, "Tên khách quá dài."),
  source: z
    .string()
    .trim()
    .min(1, "Nguồn là bắt buộc.")
    .max(60, "Nguồn quá dài.")
    .default("Zalo"),
  firstMessage: z
    .string()
    .trim()
    .max(1000, "Tin nhắn đầu quá dài.")
    .optional()
    .transform((value) => (value ? value : null)),
});

export type CreateCustomerInput = z.infer<typeof createCustomerSchema>;
