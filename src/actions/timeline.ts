"use server";

import type { ActionResult } from "@/lib/action-result";
import { requireSession } from "@/lib/auth-guard";
import { LOGIN_SUPPORT_PRESET } from "@/lib/constants/timeline";
import { revalidateCustomerSurfaces } from "@/lib/revalidate-customer-surfaces";
import { logTimelineEntry } from "@/lib/timeline/log-timeline-entry";
import { createTimelineEntrySchema } from "@/lib/validations/timeline";

export async function createTimelineEntry(
  customerId: string,
  formData: FormData,
): Promise<ActionResult<{ id: string }>> {
  const authResult = await requireSession();

  if (!authResult.ok) {
    return authResult;
  }

  const parsed = createTimelineEntrySchema.safeParse({
    type: formData.get("type"),
    content: formData.get("content"),
  });

  if (!parsed.success) {
    return {
      ok: false,
      error: "Vui lòng kiểm tra lại thông tin timeline.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const result = await logTimelineEntry({
    customerId,
    type: parsed.data.type,
    content: parsed.data.content,
  });

  if (!result.ok) {
    return result;
  }

  revalidateCustomerSurfaces(customerId);

  return result;
}

export async function logLoginSupport(
  customerId: string,
): Promise<ActionResult<{ id: string }>> {
  const authResult = await requireSession();

  if (!authResult.ok) {
    return authResult;
  }

  const result = await logTimelineEntry({
    customerId,
    type: LOGIN_SUPPORT_PRESET.type,
    content: LOGIN_SUPPORT_PRESET.content,
  });

  if (!result.ok) {
    return result;
  }

  revalidateCustomerSurfaces(customerId);

  return result;
}
