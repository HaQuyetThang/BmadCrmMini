export function getSafeCallbackUrl(value: unknown): string {
  if (typeof value !== "string") {
    return "/";
  }

  const url = value.trim();

  if (!url.startsWith("/") || url.startsWith("//")) {
    return "/";
  }

  return url;
}

export function normalizeEmail(value: unknown): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const email = value.trim().toLowerCase();

  return email.length > 0 ? email : null;
}
