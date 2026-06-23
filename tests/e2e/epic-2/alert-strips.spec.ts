import { test, expect } from "@playwright/test";

import { login, uniqueName } from "../../helpers/auth";
import { cleanupE2eCustomers, seedCustomer } from "../../helpers/db";

function startOfToday() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate(), 10, 0, 0, 0);
}

function yesterday() {
  const date = startOfToday();
  date.setDate(date.getDate() - 1);
  return date;
}

test.describe("Story 2.3 — Alert strips", () => {
  test.afterAll(async () => {
    await cleanupE2eCustomers();
  });

  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test("shows appointment and overdue payment alert counts", async ({ page }) => {
    await seedCustomer({
      name: uniqueName("DemoToday"),
      demoScheduledAt: startOfToday(),
    });

    await seedCustomer({
      name: uniqueName("OverduePay"),
      pipelineStatus: "CHO_THANH_TOAN",
      paymentDueAt: yesterday(),
    });

    await page.goto("/");
    const alertRegion = page.getByRole("region", { name: "Cảnh báo ưu tiên" });

    await expect(
      alertRegion.getByRole("link", { name: /Lịch hẹn hôm nay: \d+/ }),
    ).toBeVisible();
    await expect(
      alertRegion.getByRole("link", { name: /Thanh toán quá hạn: \d+/ }),
    ).toBeVisible();
    await expect(alertRegion.getByRole("link", { name: /Ticket Khẩn mở/ })).toHaveCount(0);
  });

  test("navigates to filtered customer lists from alert strips", async ({ page }) => {
    await seedCustomer({
      name: uniqueName("DemoNav"),
      demoScheduledAt: startOfToday(),
    });

    await seedCustomer({
      name: uniqueName("PayNav"),
      pipelineStatus: "CHO_THANH_TOAN",
      paymentDueAt: yesterday(),
    });

    await page.goto("/");
    const alertRegion = page.getByRole("region", { name: "Cảnh báo ưu tiên" });

    await alertRegion.getByRole("link", { name: /Lịch hẹn hôm nay: \d+/ }).click();
    await expect(page).toHaveURL("/customers?filter=demo-today");

    await page.goto("/");
    await alertRegion.getByRole("link", { name: /Thanh toán quá hạn: \d+/ }).click();
    await expect(page).toHaveURL("/customers?filter=payment-overdue");
  });
});
