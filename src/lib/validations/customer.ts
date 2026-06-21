import { z } from "zod";

import { BusinessGroup, PipelineStatus } from "@/generated/prisma/client";

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

const billingCycleSchema = z.enum(["monthly", "yearly", "project"]);
const MAX_PACKAGE_PRICE = 9_999_999_999.99;

const optionalTrimmedString = (max: number, message: string) =>
  z
    .string()
    .optional()
    .transform((value) => {
      const trimmed = value?.trim() ?? "";
      return trimmed === "" ? null : trimmed;
    })
    .pipe(z.union([z.null(), z.string().max(max, message)]));

export const updateCustomerSchema = z.object({
  businessGroup: z.nativeEnum(BusinessGroup),
  serviceType: optionalTrimmedString(120, "Loại dịch vụ quá dài."),
  contactChannel: optionalTrimmedString(120, "Kênh liên hệ quá dài."),
  specialNotes: optionalTrimmedString(2000, "Ghi chú quá dài."),
  renewalDate: z
    .string()
    .optional()
    .transform((value, ctx) => {
      const trimmed = value?.trim() ?? "";
      if (!trimmed) return null;
      const date = new Date(trimmed);

      if (Number.isNaN(date.getTime())) {
        ctx.addIssue({
          code: "custom",
          message: "Ngày gia hạn không hợp lệ.",
        });
        return z.NEVER;
      }

      return date;
    }),
  packagePrice: z
    .string()
    .optional()
    .transform((value, ctx) => {
      const trimmed = value?.trim() ?? "";
      if (!trimmed) return null;

      const normalized = trimmed.replace(",", ".");
      const hasValidScale = /^\d+(\.\d{1,2})?$/.test(normalized);

      if (!hasValidScale) {
        ctx.addIssue({
          code: "custom",
          message: "Giá gói không hợp lệ.",
        });
        return z.NEVER;
      }

      const amount = Number(normalized);

      if (!Number.isFinite(amount) || amount < 0 || amount > MAX_PACKAGE_PRICE) {
        ctx.addIssue({
          code: "custom",
          message: "Giá gói phải từ 0 đến 9.999.999.999,99.",
        });
        return z.NEVER;
      }

      return amount;
    }),
  billingCycle: z
    .string()
    .optional()
    .transform((value) => {
      const trimmed = value?.trim() ?? "";
      return trimmed === "" ? null : trimmed;
    })
    .pipe(z.union([z.null(), billingCycleSchema])),
  licenseKey: optionalTrimmedString(500, "License/key quá dài."),
});

export type UpdateCustomerInput = z.infer<typeof updateCustomerSchema>;

export const customerListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).catch(1),
  group: z.preprocess(
    (value) => (value === "" || value === undefined ? undefined : value),
    z.nativeEnum(BusinessGroup).optional().catch(undefined),
  ),
  q: z.preprocess(
    (value) => {
      if (typeof value !== "string") return undefined;
      const trimmed = value.trim();
      return trimmed === "" ? undefined : trimmed;
    },
    z.string().max(120).optional().catch(undefined),
  ),
});

export type CustomerListQuery = z.infer<typeof customerListQuerySchema>;

export const updatePipelineStatusSchema = z.object({
  pipelineStatus: z.nativeEnum(PipelineStatus),
});

export type UpdatePipelineStatusInput = z.infer<typeof updatePipelineStatusSchema>;

export const pipelineListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).catch(1),
  status: z.preprocess(
    (value) => (value === "" || value === undefined ? undefined : value),
    z.nativeEnum(PipelineStatus).optional().catch(undefined),
  ),
});

export type PipelineListQuery = z.infer<typeof pipelineListQuerySchema>;
