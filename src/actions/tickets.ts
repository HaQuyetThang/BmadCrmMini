"use server";

import { TicketPriority } from "@/generated/prisma/client";
import type { ActionResult } from "@/lib/action-result";
import { requireSession } from "@/lib/auth-guard";
import { LOGIN_SUPPORT_PRESET } from "@/lib/constants/timeline";
import { activeCustomersWhere } from "@/lib/db-helpers";
import { db } from "@/lib/db";
import { revalidateTicketDetail, revalidateTicketSurfaces } from "@/lib/revalidate-ticket-surfaces";
import { closeTicketSchema, completeTicketSupportSchema, createTicketSchema } from "@/lib/validations/ticket";

type CreatedTicket = {
  id: string;
  title: string;
};

export async function createTicket(formData: FormData): Promise<ActionResult<CreatedTicket>> {
  const authResult = await requireSession();

  if (!authResult.ok) {
    return authResult;
  }

  const parsed = createTicketSchema.safeParse({
    customerId: formData.get("customerId"),
    title: formData.get("title"),
    priority: formData.get("priority"),
  });

  if (!parsed.success) {
    return {
      ok: false,
      error: "Vui lòng kiểm tra lại thông tin ticket.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const { customerId, title, priority } = parsed.data;

  try {
    const customer = await db.customer.findFirst({
      where: { id: customerId, deletedAt: null },
      select: { id: true },
    });

    if (!customer) {
      return { ok: false, error: "Không tìm thấy khách." };
    }

    const ticket = await db.ticket.create({
      data: {
        customerId,
        title,
        priority,
      },
      select: {
        id: true,
        title: true,
      },
    });

    revalidateTicketSurfaces(customerId);

    return { ok: true, data: ticket };
  } catch (error) {
    console.error("createTicket failed", error);
    return { ok: false, error: "Không tạo được ticket. Thử lại sau." };
  }
}

export async function closeTicket(ticketId: string): Promise<ActionResult<{ id: string }>> {
  const authResult = await requireSession();

  if (!authResult.ok) {
    return authResult;
  }

  const parsed = closeTicketSchema.safeParse({ ticketId });

  if (!parsed.success) {
    return { ok: false, error: "Ticket không hợp lệ." };
  }

  const { ticketId: validTicketId } = parsed.data;

  try {
    const existing = await db.ticket.findFirst({
      where: {
        id: validTicketId,
        closedAt: null,
        customer: { deletedAt: null },
      },
      select: { id: true, customerId: true },
    });

    if (!existing) {
      return { ok: false, error: "Không tìm thấy ticket đang mở." };
    }

    await db.ticket.update({
      where: { id: validTicketId },
      data: { closedAt: new Date() },
    });

    revalidateTicketSurfaces(existing.customerId);

    return { ok: true, data: { id: validTicketId } };
  } catch (error) {
    console.error("closeTicket failed", error);
    return { ok: false, error: "Không đóng được ticket. Thử lại sau." };
  }
}

export async function completeTicketSupport(
  ticketId: string,
): Promise<ActionResult<{ id: string }>> {
  const authResult = await requireSession();

  if (!authResult.ok) {
    return authResult;
  }

  const parsed = completeTicketSupportSchema.safeParse({ ticketId });

  if (!parsed.success) {
    return { ok: false, error: "Ticket không hợp lệ." };
  }

  const { ticketId: validTicketId } = parsed.data;

  try {
    const now = new Date();

    const existing = await db.ticket.findFirst({
      where: {
        id: validTicketId,
        closedAt: null,
        priority: TicketPriority.KHAN,
        customer: activeCustomersWhere,
      },
      select: { id: true, customerId: true },
    });

    if (!existing) {
      return { ok: false, error: "Không tìm thấy ticket Khẩn đang mở." };
    }

    await db.$transaction(async (tx) => {
      const updated = await tx.customer.updateMany({
        where: { id: existing.customerId, ...activeCustomersWhere },
        data: { lastInteractionAt: now },
      });

      if (updated.count === 0) {
        throw new Error("CUSTOMER_NOT_FOUND");
      }

      const closed = await tx.ticket.updateMany({
        where: { id: validTicketId, closedAt: null },
        data: { closedAt: now },
      });

      if (closed.count !== 1) {
        throw new Error("TICKET_ALREADY_CLOSED");
      }

      await tx.timelineEntry.create({
        data: {
          customerId: existing.customerId,
          type: LOGIN_SUPPORT_PRESET.type,
          content: LOGIN_SUPPORT_PRESET.content,
        },
      });
    });

    revalidateTicketDetail(validTicketId, existing.customerId);

    return { ok: true, data: { id: validTicketId } };
  } catch (error) {
    if (error instanceof Error && error.message === "CUSTOMER_NOT_FOUND") {
      return { ok: false, error: "Không tìm thấy khách." };
    }

    if (error instanceof Error && error.message === "TICKET_ALREADY_CLOSED") {
      return { ok: false, error: "Ticket đã được đóng." };
    }

    console.error("completeTicketSupport failed", error);
    return { ok: false, error: "Không hoàn thành được hỗ trợ. Thử lại sau." };
  }
}
