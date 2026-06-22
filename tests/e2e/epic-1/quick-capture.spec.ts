import { test, expect } from "@playwright/test";

import { expectToast, login, uniqueName } from "../../helpers/auth";
import { cleanupE2eCustomers } from "../../helpers/db";

test.describe("Story 1.3 — Quick capture lead", () => {
  test.afterAll(async () => {
    await cleanupE2eCustomers();
  });

  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test("opens sheet via floating button and saves a lead", async ({ page }) => {
    const leadName = uniqueName("QuickCapture");

    await page.getByRole("button", { name: "Tạo lead nhanh" }).click();
    await expect(page.getByRole("heading", { name: "Quick capture lead" })).toBeVisible();

    await page.getByLabel("Tên").fill(leadName);
    await page.getByLabel("Nguồn").fill("Zalo");
    await page.getByLabel("Nội dung tin nhắn đầu").fill("Tin nhắn test E2E");
    await page.getByRole("button", { name: "Lưu" }).click();

    await expectToast(page, "Đã lưu");
    await expect(page.getByRole("heading", { name: "Quick capture lead" })).not.toBeVisible();

    await page.goto("/customers");
    await expect(page.getByRole("link", { name: leadName })).toBeVisible();
  });

  test("opens sheet via Ctrl+K shortcut when page is focused", async ({ page }) => {
    await page.getByRole("heading", { name: "Hôm nay" }).click();
    await page.keyboard.press("Control+KeyK");
    await expect(page.getByRole("heading", { name: "Quick capture lead" })).toBeVisible();
  });
});
