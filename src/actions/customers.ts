"use server";

import { revalidatePath } from "next/cache";

import type { ActionResult } from "@/lib/action-result";
import { requireSession } from "@/lib/auth-guard";
import { db } from "@/lib/db";
import { createCustomerSchema } from "@/lib/validations/customer";
import { PipelineStatus } from "@/generated/prisma/client";

type CreatedCustomer = {
  id: string;
  name: string;
};

export async function createCustomer(formData: FormData): Promise<ActionResult<CreatedCustomer>> {
  const authResult = await requireSession();

  if (!authResult.ok) {
    return authResult;
  }

  const parsed = createCustomerSchema.safeParse({
    name: formData.get("name"),
    source: formData.get("source") || "Zalo",
    firstMessage: formData.get("firstMessage") ?? undefined,
  });

  if (!parsed.success) {
    return {
      ok: false,
      error: "Vui lòng kiểm tra lại thông tin lead.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    const customer = await db.customer.create({
      data: parsed.data,
      select: {
        id: true,
        name: true,
      },
    });

    revalidatePath("/");
    revalidatePath("/customers");
    revalidatePath("/pipeline");

    return { ok: true, data: customer };
  } catch (error) {
    console.error("createCustomer failed", error);
    return { ok: false, error: "Không lưu được lead. Thử lại sau." };
  }
}

export async function promoteCustomerToConsulting(
  customerId: string,
): Promise<ActionResult<{ id: string }>> {
  const authResult = await requireSession();

  if (!authResult.ok) {
    return authResult;
  }

  try {
    const updated = await db.customer.updateMany({
      where: { id: customerId, deletedAt: null },
      data: { pipelineStatus: PipelineStatus.DANG_TU_VAN, statusChangedAt: new Date() },
    });

    if (updated.count === 0) {
      return { ok: false, error: "Không tìm thấy lead để cập nhật." };
    }

    revalidatePath("/");
    revalidatePath("/customers");
    revalidatePath("/pipeline");

    return { ok: true, data: { id: customerId } };
  } catch (error) {
    console.error("promoteCustomerToConsulting failed", error);
    return { ok: false, error: "Không cập nhật được trạng thái." };
  }
}
