"use server";

import type { ActionResult } from "@/lib/action-result";
import { requireSession } from "@/lib/auth-guard";
import { db } from "@/lib/db";
import { revalidateCustomerSurfaces } from "@/lib/revalidate-customer-surfaces";
import {
  createCustomerSchema,
  updateCustomerSchema,
  updatePipelineStatusSchema,
} from "@/lib/validations/customer";
import { PipelineStatus, Prisma } from "@/generated/prisma/client";

type CreatedCustomer = {
  id: string;
  name: string;
};

async function applyPipelineStatusUpdate(
  customerId: string,
  pipelineStatus: PipelineStatus,
): Promise<ActionResult<{ id: string }>> {
  try {
    const updated = await db.customer.updateMany({
      where: { id: customerId, deletedAt: null },
      data: { pipelineStatus, statusChangedAt: new Date() },
    });

    if (updated.count === 0) {
      return { ok: false, error: "Không tìm thấy khách." };
    }

    revalidateCustomerSurfaces(customerId);

    return { ok: true, data: { id: customerId } };
  } catch (error) {
    console.error("applyPipelineStatusUpdate failed", error);
    return { ok: false, error: "Không cập nhật được trạng thái." };
  }
}

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

    revalidateCustomerSurfaces();

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

  return applyPipelineStatusUpdate(customerId, PipelineStatus.DANG_TU_VAN);
}

export async function updatePipelineStatus(
  customerId: string,
  pipelineStatus: PipelineStatus,
): Promise<ActionResult<{ id: string }>> {
  const authResult = await requireSession();

  if (!authResult.ok) {
    return authResult;
  }

  const parsed = updatePipelineStatusSchema.safeParse({ pipelineStatus });

  if (!parsed.success) {
    return { ok: false, error: "Trạng thái không hợp lệ." };
  }

  return applyPipelineStatusUpdate(customerId, parsed.data.pipelineStatus);
}

export async function updateCustomer(
  customerId: string,
  formData: FormData,
): Promise<ActionResult<{ id: string }>> {
  const authResult = await requireSession();

  if (!authResult.ok) {
    return authResult;
  }

  const parsed = updateCustomerSchema.safeParse({
    businessGroup: formData.get("businessGroup"),
    serviceType: formData.get("serviceType") ?? undefined,
    contactChannel: formData.get("contactChannel") ?? undefined,
    specialNotes: formData.get("specialNotes") ?? undefined,
    renewalDate: formData.get("renewalDate") ?? undefined,
    packagePrice: formData.get("packagePrice") ?? undefined,
    billingCycle: formData.get("billingCycle") ?? undefined,
    licenseKey: formData.get("licenseKey") ?? undefined,
  });

  if (!parsed.success) {
    return {
      ok: false,
      error: "Vui lòng kiểm tra lại thông tin hồ sơ.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    const updated = await db.customer.updateMany({
      where: { id: customerId, deletedAt: null },
      data: {
        businessGroup: parsed.data.businessGroup,
        serviceType: parsed.data.serviceType,
        contactChannel: parsed.data.contactChannel,
        specialNotes: parsed.data.specialNotes,
        renewalDate: parsed.data.renewalDate,
        packagePrice:
          parsed.data.packagePrice === null
            ? null
            : new Prisma.Decimal(parsed.data.packagePrice),
        billingCycle: parsed.data.billingCycle,
        licenseKey: parsed.data.licenseKey,
      },
    });

    if (updated.count === 0) {
      return { ok: false, error: "Không tìm thấy khách." };
    }

    revalidateCustomerSurfaces(customerId);

    return { ok: true, data: { id: customerId } };
  } catch (error) {
    console.error("updateCustomer failed", error);
    return { ok: false, error: "Không lưu được hồ sơ. Thử lại sau." };
  }
}

export async function softDeleteCustomer(
  customerId: string,
): Promise<ActionResult<{ id: string }>> {
  const authResult = await requireSession();

  if (!authResult.ok) {
    return authResult;
  }

  try {
    const updated = await db.customer.updateMany({
      where: { id: customerId, deletedAt: null },
      data: { deletedAt: new Date() },
    });

    if (updated.count === 0) {
      return { ok: false, error: "Không tìm thấy khách." };
    }

    revalidateCustomerSurfaces();

    return { ok: true, data: { id: customerId } };
  } catch (error) {
    console.error("softDeleteCustomer failed", error);
    return { ok: false, error: "Không xóa được khách. Thử lại sau." };
  }
}
