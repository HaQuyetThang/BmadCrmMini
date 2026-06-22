import { test, expect } from "@playwright/test";

import { expectToast, login, uniqueName } from "../../helpers/auth";
import { cleanupE2eCustomers, seedCustomer } from "../../helpers/db";

test.describe("Story 1.4 — Danh sách và hồ sơ khách", () => {
  test.afterAll(async () => {
    await cleanupE2eCustomers();
  });

  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test("lists, searches, opens profile, saves edits, and soft-deletes customer", async ({
    page,
  }) => {
    const customerName = uniqueName("Profile");
    const customer = await seedCustomer({ name: customerName, licenseKey: "LIC-E2E-001" });

    await page.goto("/customers");
    await page.getByLabel("Tìm khách").fill(customerName);
    await page.getByRole("button", { name: "Lọc" }).click();

    await expect(page.getByRole("link", { name: customerName })).toBeVisible();
    await page.getByRole("link", { name: customerName }).click();

    await expect(page.getByRole("heading", { name: customerName })).toBeVisible();
    await expect(page.locator("#profile-license-display")).toHaveValue("LIC-E2E-001");

    await page.getByLabel("Loại dịch vụ").fill("Kế toán thuế");
    await page.getByRole("button", { name: "Lưu" }).click();
    await expectToast(page, "Đã lưu");

    await page.getByRole("button", { name: "Xóa khách" }).click();
    await expect(page.getByRole("heading", { name: "Xóa khách?" })).toBeVisible();
    await page.getByRole("dialog").getByRole("button", { name: "Xóa" }).click();

    await expectToast(page, "Đã xóa khách");
    await expect(page).toHaveURL("/customers");
    await page.getByLabel("Tìm khách").fill(customerName);
    await page.getByRole("button", { name: "Lọc" }).click();
    await expect(page.getByText("Không thấy khách. Thử tên hoặc Zalo.")).toBeVisible();

    await page.goto(`/customers/${customer.id}`);
    await expect(page.getByRole("heading", { name: customerName })).not.toBeVisible();
  });

  test("shows empty search copy when no matches", async ({ page }) => {
    await page.goto("/customers");
    await page.getByLabel("Tìm khách").fill("E2E-khong-ton-tai-xyz");
    await page.getByRole("button", { name: "Lọc" }).click();

    await expect(page.getByText("Không thấy khách. Thử tên hoặc Zalo.")).toBeVisible();
  });
});
