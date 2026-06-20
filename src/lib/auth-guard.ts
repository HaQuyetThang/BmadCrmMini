import { auth } from "@/auth";

import type { ActionResult } from "@/lib/action-result";

export type SessionUser = {
  userId: string;
  email: string;
  name: string | null;
};

export async function requireSession(): Promise<ActionResult<SessionUser>> {
  const session = await auth();

  if (!session?.user?.id || !session.user.email) {
    return { ok: false, error: "Chưa đăng nhập." };
  }

  return {
    ok: true,
    data: {
      userId: session.user.id,
      email: session.user.email,
      name: session.user.name ?? null,
    },
  };
}
