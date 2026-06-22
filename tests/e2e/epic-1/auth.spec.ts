import { test, expect } from "@playwright/test";

import { login, logout, operatorCredentials } from "../../helpers/auth";

test.describe("Story 1.2 — Auth", () => {
  test("redirects unauthenticated users to login", async ({ page }) => {
    await page.goto("/customers");
    await expect(page).toHaveURL(/\/login/);
  });

  test("logs in with valid operator credentials", async ({ page }) => {
    await login(page);
    await expect(page.getByRole("heading", { name: "Hôm nay" })).toBeVisible();
    await expect(page.getByText("BmadCRMMini")).toBeVisible();
  });

  test("shows error for invalid credentials", async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel("Email").fill(operatorCredentials.email);
    await page.getByLabel("Mật khẩu").fill("wrong-password");
    await page.getByRole("button", { name: "Đăng nhập" }).click();

    await expect(page.getByRole("alert")).toBeVisible();
    await expect(page).toHaveURL(/\/login/);
  });

  test("logs out and returns to login", async ({ page }) => {
    await login(page);
    await logout(page);
    await expect(page.getByLabel("Email")).toBeVisible();
  });
});
