import { test, expect, type Page } from "@playwright/test";

import { login, uniqueName } from "../../helpers/auth";
import { cleanupE2eCustomers, seedCustomer } from "../../helpers/db";

function startOfToday() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate(), 10, 0, 0, 0);
}

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

function dashboardSection(page: Page, title: string) {
  return page.getByRole("heading", { name: title, level: 2 }).locator("..");
}

test.describe("Story 2.4 — Priority lists", () => {
  test.afterAll(async () => {
    await cleanupE2eCustomers();
  });

  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test("shows today tasks, renewals, and follow-up leads", async ({ page }) => {
    const demoName = uniqueName("DemoTask");
    const overdueName = uniqueName("RenewalOverdue");
    const staleLeadName = uniqueName("StaleFollowUp");
    const noInteractionName = uniqueName("NoInteractionLead");

    await seedCustomer({
      name: demoName,
      demoScheduledAt: startOfToday(),
    });

    await seedCustomer({
      name: overdueName,
      pipelineStatus: "ACTIVE",
      renewalDate: daysAgo(2),
    });

    await seedCustomer({
      name: staleLeadName,
      pipelineStatus: "LEAD_MOI",
      statusChangedAt: daysAgo(15),
    });

    await seedCustomer({
      name: noInteractionName,
      pipelineStatus: "LEAD_MOI",
      statusChangedAt: daysAgo(2),
      lastInteractionAt: daysAgo(10),
    });

    await page.goto("/");

    const todaySection = dashboardSection(page, "Việc hôm nay");
    const renewalsSection = dashboardSection(page, "Khách sắp gia hạn");
    const followUpSection = dashboardSection(page, "Lead cần follow-up");

    await expect(todaySection.getByRole("link", { name: new RegExp(demoName) })).toBeVisible();
    await expect(
      renewalsSection.getByRole("link", { name: new RegExp(overdueName) }),
    ).toBeVisible();
    await expect(renewalsSection.getByText(/Quá hạn|Gia hạn hôm nay/)).toBeVisible();
    await expect(
      followUpSection.getByRole("link", { name: new RegExp(staleLeadName) }),
    ).toBeVisible();
    await expect(followUpSection.getByText("15 ngày không đổi")).toBeVisible();
    await expect(
      followUpSection.getByRole("link", { name: new RegExp(noInteractionName) }),
    ).toBeVisible();
    await expect(
      followUpSection.getByRole("link", { name: new RegExp(noInteractionName) }),
    ).not.toHaveText(/ngày không đổi/);
  });

  test("navigates to customer detail from all section rows", async ({ page }) => {
    const demo = await seedCustomer({
      name: uniqueName("NavDemo"),
      demoScheduledAt: startOfToday(),
    });
    const renewal = await seedCustomer({
      name: uniqueName("NavRenewal"),
      pipelineStatus: "ACTIVE",
      renewalDate: daysAgo(1),
    });
    const lead = await seedCustomer({
      name: uniqueName("NavLead"),
      pipelineStatus: "LEAD_MOI",
      statusChangedAt: daysAgo(15),
    });

    await page.goto("/");

    await dashboardSection(page, "Việc hôm nay")
      .getByRole("link", { name: new RegExp(demo.name) })
      .click();
    await expect(page).toHaveURL(`/customers/${demo.id}`);

    await page.goto("/");
    await dashboardSection(page, "Khách sắp gia hạn")
      .getByRole("link", { name: new RegExp(renewal.name) })
      .click();
    await expect(page).toHaveURL(`/customers/${renewal.id}`);

    await page.goto("/");
    await dashboardSection(page, "Lead cần follow-up")
      .getByRole("link", { name: new RegExp(lead.name) })
      .click();
    await expect(page).toHaveURL(`/customers/${lead.id}`);
  });

  test("shows approaching renewal in renewals section", async ({ page }) => {
    const approachingName = uniqueName("RenewalSoon");
    await seedCustomer({
      name: approachingName,
      pipelineStatus: "ACTIVE",
      renewalDate: daysFromNow(10),
    });

    await page.goto("/");
    const renewalsSection = dashboardSection(page, "Khách sắp gia hạn");

    await expect(
      renewalsSection.getByRole("link", { name: new RegExp(approachingName) }),
    ).toBeVisible();
    await expect(renewalsSection.getByText("Gia hạn sau 10 ngày")).toBeVisible();
  });

  test('shows "Xem thêm" when renewals exceed 25 rows', async ({ page }) => {
    for (let i = 0; i < 26; i++) {
      const renewalDate = i < 13 ? daysAgo(12 - i) : daysFromNow(i - 12);
      await seedCustomer({
        name: uniqueName(`RenewalBulk${String(i).padStart(2, "0")}`),
        pipelineStatus: "ACTIVE",
        renewalDate,
      });
    }

    await page.goto("/");
    const renewalsSection = dashboardSection(page, "Khách sắp gia hạn");

    await expect(renewalsSection.getByRole("link", { name: "Xem thêm" })).toBeVisible();
    await expect(renewalsSection.getByRole("link", { name: "Xem thêm" })).toHaveAttribute(
      "href",
      "/customers",
    );
    await expect(renewalsSection.locator('a[href^="/customers/"]')).toHaveCount(25);
  });
});
