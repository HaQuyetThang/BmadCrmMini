import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

import type { BusinessGroup, PipelineStatus } from "@/generated/prisma/client";
import { PrismaClient } from "@/generated/prisma/client";

const E2E_NAME_PREFIX = "E2E ";

let pool: Pool | undefined;
let db: PrismaClient | undefined;

export function getTestDb() {
  if (!db) {
    pool = new Pool({ connectionString: process.env.DATABASE_URL });
    db = new PrismaClient({ adapter: new PrismaPg(pool) });
  }

  return db;
}

export async function disconnectTestDb() {
  if (db) {
    await db.$disconnect();
    db = undefined;
  }

  if (pool) {
    await pool.end();
    pool = undefined;
  }
}

export type SeedCustomerInput = {
  name: string;
  pipelineStatus?: PipelineStatus;
  businessGroup?: BusinessGroup;
  statusChangedAt?: Date;
  renewalDate?: Date | null;
  licenseKey?: string | null;
  packagePrice?: number | null;
};

export async function seedCustomer(input: SeedCustomerInput) {
  return getTestDb().customer.create({
    data: {
      name: input.name,
      pipelineStatus: input.pipelineStatus ?? "LEAD_MOI",
      businessGroup: input.businessGroup ?? "KHAC",
      statusChangedAt: input.statusChangedAt ?? new Date(),
      renewalDate: input.renewalDate ?? null,
      licenseKey: input.licenseKey ?? null,
      packagePrice: input.packagePrice ?? null,
    },
  });
}

export async function cleanupE2eCustomers() {
  await getTestDb().customer.deleteMany({
    where: { name: { startsWith: E2E_NAME_PREFIX } },
  });
}

export { E2E_NAME_PREFIX };
