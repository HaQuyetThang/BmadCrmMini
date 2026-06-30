import { test, expect } from "@playwright/test";

import { login, uniqueName } from "../../helpers/auth";
import { cleanupE2eCustomers, seedCustomer } from "../../helpers/db";

function parseOpenTicketCount(label: string): number {
  const match = label.match(/Ticket mở:\s*(\d+)/);
  if (!match) {
    throw new Error(`Could not parse open ticket KPI from: ${label}`);
  }

  return Number(match[1]);
}

test.describe("Story 3.1 — Ticket CRUD and queue", () => {
  test.afterAll(async () => {
    await cleanupE2eCustomers();
  });

  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test("creates urgent ticket from customer detail and shows in open queue", async ({ page }) => {
    const customer = await seedCustomer({ name: uniqueName("TicketCustomer") });
    const ticketTitle = uniqueName("LoginSupport");

    await page.goto(`/customers/${customer.id}`);

    await page.locator("#ticket-title").fill(ticketTitle);
    await page.locator("#ticket-priority").selectOption("KHAN");
    await page.getByRole("button", { name: "Tạo ticket" }).click();

    await expect(page.getByText("Đã tạo ticket")).toBeVisible();

    await page.goto("/tickets?status=open");
    const row = page.getByRole("link", { name: new RegExp(ticketTitle) }).locator("..").locator("..");
    await expect(page.getByRole("link", { name: new RegExp(ticketTitle) })).toBeVisible();
    await expect(row.getByText("Khẩn")).toBeVisible();
    await expect(page.getByText(customer.name)).toBeVisible();
  });

  test("closes ticket and updates open ticket KPI", async ({ page }) => {
    const customer = await seedCustomer({ name: uniqueName("CloseTicket") });
    const ticketTitle = uniqueName("CloseMe");

    await page.goto(`/customers/${customer.id}`);
    await page.locator("#ticket-title").fill(ticketTitle);
    await page.getByRole("button", { name: "Tạo ticket" }).click();
    await expect(page.getByText("Đã tạo ticket")).toBeVisible();

    await page.goto("/");
    const kpiLink = page.getByRole("link", { name: /Ticket mở: \d+/ });
    const openCountBefore = parseOpenTicketCount(await kpiLink.getAttribute("aria-label") ?? "");

    await page.goto("/tickets?status=open");
    const ticketRow = page.getByRole("link", { name: new RegExp(ticketTitle) }).locator("../..");
    await ticketRow.getByRole("button", { name: "Đóng" }).click();
    await expect(page.getByText("Đã đóng ticket")).toBeVisible();
    await expect(page.getByRole("link", { name: new RegExp(ticketTitle) })).toHaveCount(0);

    await page.goto("/");
    const openCountAfter = parseOpenTicketCount(await kpiLink.getAttribute("aria-label") ?? "");
    expect(openCountAfter).toBe(openCountBefore - 1);

    await page.goto("/tickets?status=closed");
    await expect(page.getByRole("link", { name: new RegExp(ticketTitle) })).toBeVisible();
  });

  test("filters urgent tickets only", async ({ page }) => {
    const customer = await seedCustomer({ name: uniqueName("UrgentFilter") });

    await page.goto(`/customers/${customer.id}`);
    await page.locator("#ticket-title").fill(uniqueName("NormalTicket"));
    await page.locator("#ticket-priority").selectOption("NORMAL");
    await page.getByRole("button", { name: "Tạo ticket" }).click();
    await expect(page.getByText("Đã tạo ticket")).toBeVisible();

    const urgentTitle = uniqueName("UrgentTicket");
    await page.locator("#ticket-title").fill(urgentTitle);
    await page.locator("#ticket-priority").selectOption("KHAN");
    await page.getByRole("button", { name: "Tạo ticket" }).click();
    await expect(page.getByText("Đã tạo ticket")).toBeVisible();

    await page.goto("/tickets?status=open&urgent=1");
    await expect(page.getByRole("link", { name: new RegExp(urgentTitle) })).toBeVisible();
    await expect(page.getByRole("link", { name: /E2E NormalTicket/ })).toHaveCount(0);
  });
});
