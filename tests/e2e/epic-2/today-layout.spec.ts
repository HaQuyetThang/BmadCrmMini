import { test, expect } from "@playwright/test";

import { login } from "../../helpers/auth";

test.describe("Story 2.1 — Hôm nay layout", () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test("renders dashboard layout with empty states", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: "Hôm nay", level: 1 })).toBeVisible();
    await expect(page.getByRole("region", { name: "Chỉ số vận hành" })).toBeVisible();
    await expect(page.getByRole("region", { name: "Cảnh báo ưu tiên" })).toBeVisible();
    await expect(page.getByText("Chưa có việc hôm nay.")).toHaveCount(3);
    await expect(page.getByRole("group", { name: /Khách active: \d+/ })).toBeVisible();
    await expect(page.getByRole("group", { name: /Doanh thu tuần tháng:/ })).toBeVisible();
    await expect(page.getByRole("link", { name: /Ticket mở: \d+/ })).toBeVisible();
    await expect(page.getByRole("link", { name: /Ticket Khẩn mở/ })).toHaveCount(0);
  });

  test("navigates to customers without regression", async ({ page }) => {
    await page.getByRole("link", { name: "Khách hàng" }).click();
    await expect(page).toHaveURL("/customers");
    await expect(page.getByRole("heading", { name: "Khách hàng" })).toBeVisible();
  });

  test("navigates to pipeline without regression", async ({ page }) => {
    await page.getByRole("link", { name: "Lead & pipeline" }).click();
    await expect(page).toHaveURL("/pipeline");
    await expect(page.getByRole("heading", { name: "Lead & pipeline" })).toBeVisible();
  });
});
