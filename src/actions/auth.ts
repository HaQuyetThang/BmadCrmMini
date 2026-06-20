"use server";

import { AuthError } from "next-auth";

import { signIn, signOut } from "@/auth";
import { getSafeCallbackUrl, normalizeEmail } from "@/lib/safe-redirect";

export type LoginFormState = {
  error?: string;
};

export async function loginAction(
  _prevState: LoginFormState | undefined,
  formData: FormData,
): Promise<LoginFormState> {
  const email = normalizeEmail(formData.get("email"));
  const password = formData.get("password");

  if (!email || typeof password !== "string" || password.length === 0) {
    return { error: "Email hoặc mật khẩu không đúng." };
  }

  const redirectTo = getSafeCallbackUrl(formData.get("callbackUrl"));

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Email hoặc mật khẩu không đúng." };
    }

    throw error;
  }

  return {};
}

export async function logoutAction() {
  await signOut({ redirectTo: "/login" });
}
