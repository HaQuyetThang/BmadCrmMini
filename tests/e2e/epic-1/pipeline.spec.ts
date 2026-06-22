import { test, expect } from "@playwright/test";

import { login, uniqueName } from "../../helpers/auth";
import { cleanupE2eCustomers, seedCustomer } from "../../helpers/db";

function profileLink(page: import("@playwright/test").Page, customerName: string) {
  return page.getByRole("link", { name: `Mở hồ sơ ${customerName}` });
}

test.describe("Story 1.5 — Pipeline status và lead pipeline list", () => {
  test.afterAll(async () => {
    await cleanupE2eCustomers();
  });

  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test("shows new lead on pipeline and filters by status", async ({ page }) => {
    const customerName = uniqueName("Pipeline");
    await seedCustomer({ name: customerName, pipelineStatus: "LEAD_MOI" });

    await page.goto("/pipeline");
    await expect(profileLink(page, customerName)).toBeVisible();
    const row = page.locator("div.border-border").filter({ hasText: customerName });
    await expect(row.locator('[data-slot="badge"]').getByText("Lead mới")).toBeVisible();

    await page.getByLabel("Trạng thái pipeline").selectOption("LEAD_MOI");
    await page.getByRole("button", { name: "Lọc" }).click();
    await expect(profileLink(page, customerName)).toBeVisible();

    await page.getByLabel("Trạng thái pipeline").selectOption("DA_CHOT");
    await page.getByRole("button", { name: "Lọc" }).click();
    await expect(profileLink(page, customerName)).not.toBeVisible();
    await expect(page.getByText("Không có lead ở trạng thái này.")).toBeVisible();
  });

  test("updates pipeline status from customer profile", async ({ page }) => {
    const customerName = uniqueName("StatusChange");
    const customer = await seedCustomer({ name: customerName, pipelineStatus: "LEAD_MOI" });

    await page.goto(`/customers/${customer.id}`);
    await page.getByLabel("Pipeline status").selectOption("DANG_TU_VAN");
    await expect(page.getByText("Đã cập nhật trạng thái")).toBeVisible();

    await page.goto("/pipeline");
    await page.getByLabel("Trạng thái pipeline").selectOption("DANG_TU_VAN");
    await page.getByRole("button", { name: "Lọc" }).click();
    await expect(profileLink(page, customerName)).toBeVisible();
  });
});
