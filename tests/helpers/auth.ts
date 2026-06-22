import type { Page } from "@playwright/test";

export const operatorCredentials = {
  email: process.env.OPERATOR_EMAIL ?? "operator@example.com",
  password: process.env.OPERATOR_PASSWORD ?? "change-me-local-only",
};

export async function login(page: Page) {
  await page.goto("/login");
  await page.getByLabel("Email").fill(operatorCredentials.email);
  await page.getByLabel("Mật khẩu").fill(operatorCredentials.password);
  await page.getByRole("button", { name: "Đăng nhập" }).click();
  await page.waitForURL((url) => !url.pathname.startsWith("/login"));
}

export async function logout(page: Page) {
  await page.getByRole("button", { name: "Đăng xuất" }).click();
  await page.waitForURL(/\/login(?:\?|$)/);
}

export function uniqueName(label: string) {
  return `E2E ${label} ${Date.now()}`;
}

export async function expectToast(page: Page, text: string | RegExp) {
  await page.getByText(text).first().waitFor({ state: "visible", timeout: 10_000 });
}
