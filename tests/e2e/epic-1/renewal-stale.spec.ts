import { test, expect } from "@playwright/test";

import { login, uniqueName } from "../../helpers/auth";
import { cleanupE2eCustomers, seedCustomer } from "../../helpers/db";

function daysAgo(count: number) {
  const date = new Date();
  date.setDate(date.getDate() - count);
  return date;
}

function daysFromNow(count: number) {
  const date = new Date();
  date.setDate(date.getDate() + count);
  return date;
}

test.describe("Story 1.6 & 1.7 — Stale và renewal badges", () => {
  test.afterAll(async () => {
    await cleanupE2eCustomers();
  });

  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test("shows stale badge on lead list when status unchanged too long", async ({ page }) => {
    const customerName = uniqueName("StaleLead");
    await seedCustomer({
      name: customerName,
      pipelineStatus: "LEAD_MOI",
      statusChangedAt: daysAgo(15),
    });

    await page.goto("/customers");
    const row = page.locator("a").filter({ hasText: customerName });
    await expect(row).toBeVisible();
    await expect(row.getByText("15 ngày không đổi")).toBeVisible();
  });

  test("shows renewal approaching badge on profile", async ({ page }) => {
    const customerName = uniqueName("Renewal");
    const customer = await seedCustomer({
      name: customerName,
      renewalDate: daysFromNow(10),
    });

    await page.goto(`/customers/${customer.id}`);
    await expect(page.getByText("Gia hạn sau 10 ngày")).toBeVisible();
  });

  test("shows overdue renewal badge on profile", async ({ page }) => {
    const customerName = uniqueName("Overdue");
    const customer = await seedCustomer({
      name: customerName,
      renewalDate: daysAgo(2),
    });

    await page.goto(`/customers/${customer.id}`);
    await expect(page.getByText("Quá hạn 2 ngày")).toBeVisible();
  });
});
