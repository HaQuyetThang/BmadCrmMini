import { z } from "zod";

export const createTicketSchema = z.object({
  customerId: z.string().trim().min(1),
  title: z.string().trim().min(1, "Vui lòng nhập tiêu đề ticket.").max(200),
  priority: z.enum(["NORMAL", "KHAN"]),
});

export type CreateTicketInput = z.infer<typeof createTicketSchema>;

export const closeTicketSchema = z.object({
  ticketId: z.string().trim().min(1, "Ticket không hợp lệ."),
});

export type CloseTicketInput = z.infer<typeof closeTicketSchema>;

export const completeTicketSupportSchema = closeTicketSchema;

export const ticketListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).catch(1),
  status: z.enum(["open", "closed"]).optional().catch(undefined),
  urgent: z.literal("1").optional().catch(undefined),
});

export type TicketListQuery = z.infer<typeof ticketListQuerySchema>;
