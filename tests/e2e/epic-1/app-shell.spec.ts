import { test, expect } from "@playwright/test";

import { login } from "../../helpers/auth";

test.describe("Story 1.1 — App shell", () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test("renders sidebar navigation links", async ({ page }) => {
    await expect(page.getByRole("link", { name: "Hôm nay" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Khách hàng" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Lead & pipeline" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Ticket" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Cài đặt" })).toBeVisible();
  });

  test("navigates between main surfaces", async ({ page }) => {
    await page.getByRole("link", { name: "Khách hàng" }).click();
    await expect(page).toHaveURL("/customers");
    await expect(page.getByRole("heading", { name: "Khách hàng" })).toBeVisible();

    await page.getByRole("link", { name: "Lead & pipeline" }).click();
    await expect(page).toHaveURL("/pipeline");
    await expect(page.getByRole("heading", { name: "Lead & pipeline" })).toBeVisible();
  });
});
