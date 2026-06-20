"use server";

import type { ActionResult } from "@/lib/action-result";
import { requireSession } from "@/lib/auth-guard";

export async function pingProtectedAction(): Promise<ActionResult<{ message: string }>> {
  const authResult = await requireSession();

  if (!authResult.ok) {
    return authResult;
  }

  return {
    ok: true,
    data: { message: "authenticated" },
  };
}
