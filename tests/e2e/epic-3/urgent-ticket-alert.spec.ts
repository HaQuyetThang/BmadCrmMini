import { test, expect } from "@playwright/test";

import { login, uniqueName } from "../../helpers/auth";
import { cleanupE2eCustomers, seedCustomer, seedTicket } from "../../helpers/db";

test.describe("Story 3.2 — Urgent ticket alert", () => {
  test.afterAll(async () => {
    await cleanupE2eCustomers();
  });

  test.beforeEach(async ({ page }) => {
    await cleanupE2eCustomers();
    await login(page);
  });

  test("shows urgent ticket alert and opens split detail view", async ({ page }) => {
    const licenseKey = `KEY-${uniqueName("License")}`;
    const customer = await seedCustomer({
      name: uniqueName("UrgentCtx"),
      licenseKey,
      pipelineStatus: "ACTIVE",
    });
    const ticket = await seedTicket({
      customerId: customer.id,
      title: uniqueName("UrgentAlert"),
      priority: "KHAN",
    });

    await page.goto("/");
    const alertRegion = page.getByRole("region", { name: "Cảnh báo ưu tiên" });
    const urgentLink = alertRegion.getByRole("link", { name: /Ticket Khẩn mở: \d+/ });
    await expect(urgentLink).toBeVisible();

    await urgentLink.click();
    await expect(page).toHaveURL(`/tickets/${ticket.id}`);

    await expect(page.getByRole("heading", { name: ticket.title, level: 2 })).toBeVisible();
    await expect(page.getByLabel("License/key")).toHaveValue(licenseKey);
    await expect(page.getByRole("heading", { name: customer.name, level: 2 })).toBeVisible();
    await expect(page.getByText("Khẩn")).toBeVisible();
  });

  test("completes support: closes ticket, logs timeline, shows success badge", async ({
    page,
  }) => {
    const customer = await seedCustomer({
      name: uniqueName("CompleteSupport"),
      licenseKey: "E2E-LICENSE-001",
    });
    const ticket = await seedTicket({
      customerId: customer.id,
      title: uniqueName("CompleteMe"),
      priority: "KHAN",
    });

    await page.goto(`/tickets/${ticket.id}`);
    await page.getByRole("button", { name: "Hoàn thành hỗ trợ" }).click();
    await expect(page.getByText("Đã đóng ticket")).toBeVisible();
    await expect(page.getByText("Đã đóng")).toBeVisible();

    await page.goto(`/customers/${customer.id}`);
    await expect(page.getByText("Hỗ trợ login").first()).toBeVisible();

    await page.goto("/");
    await expect(
      page.getByRole("region", { name: "Cảnh báo ưu tiên" }).getByRole("link", {
        name: /Ticket Khẩn mở/,
      }),
    ).toHaveCount(0);
  });
});
