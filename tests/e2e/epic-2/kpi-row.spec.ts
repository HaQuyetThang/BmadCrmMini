import { test, expect } from "@playwright/test";

import { login, uniqueName } from "../../helpers/auth";
import { cleanupE2eCustomers, seedCustomer } from "../../helpers/db";

test.describe("Story 2.2 — KPI row", () => {
  test.afterAll(async () => {
    await cleanupE2eCustomers();
  });

  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test("shows active customer count and revenue from database", async ({ page }) => {
    await page.goto("/");
    const revenueBefore = await page
      .getByRole("group", { name: /Doanh thu tuần tháng:/ })
      .innerText();

    await seedCustomer({
      name: uniqueName("ActiveKpi"),
      pipelineStatus: "ACTIVE",
      packagePrice: 1_234_567,
    });

    await page.goto("/");
    const kpiRegion = page.getByRole("region", { name: "Chỉ số vận hành" });
    await expect(kpiRegion.getByRole("group", { name: /Khách active: [1-9]/ })).toBeVisible();

    const revenueAfter = await kpiRegion
      .getByRole("group", { name: /Doanh thu tuần tháng:/ })
      .innerText();
    expect(revenueAfter).not.toEqual(revenueBefore);
    await expect(kpiRegion.getByText(/đ/)).toBeVisible();
  });

  test("navigates to open tickets when clicking ticket KPI", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: "Ticket mở: 0" }).click();
    await expect(page).toHaveURL("/tickets?status=open");
  });
});
