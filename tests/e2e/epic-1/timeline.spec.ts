import { test, expect } from "@playwright/test";

import { expectToast, login, uniqueName } from "../../helpers/auth";
import { cleanupE2eCustomers, seedCustomer } from "../../helpers/db";

test.describe("Story 1.8 — Timeline trên chi tiết khách", () => {
  test.afterAll(async () => {
    await cleanupE2eCustomers();
  });

  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test("shows empty state, adds manual entry, and logs login support", async ({ page }) => {
    const customerName = uniqueName("Timeline");
    const customer = await seedCustomer({ name: customerName, licenseKey: "LIC-TIMELINE" });

    await page.goto(`/customers/${customer.id}`);
    await expect(page.getByText("Chưa có tương tác nào.")).toBeVisible();

    const timelineContent = "Cuộc gọi Zalo test E2E";
    await page.locator("#timeline-content").fill(timelineContent);
    await page.getByRole("button", { name: "Thêm entry" }).click();

    await expectToast(page, "Đã ghi timeline");
    await expect(page.getByText(timelineContent)).toBeVisible();
    await expect(page.locator("#timeline-content")).toHaveValue("");

    await page.getByRole("button", { name: "Hỗ trợ login" }).click();
    await expectToast(page, "Đã ghi timeline");
    await expect(page.getByText("Hỗ trợ login").first()).toBeVisible();
  });
});
