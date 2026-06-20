import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

import { PrismaClient } from "../src/generated/prisma/client.js";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const db = new PrismaClient({ adapter });

const DEFAULTS = [
  { key: "staleStatusDays", value: "14" },
  { key: "followUpDays", value: "7" },
  { key: "renewalWindowDays", value: "14" },
] as const;

async function main() {
  for (const setting of DEFAULTS) {
    await db.appSetting.upsert({
      where: { key: setting.key },
      update: { value: setting.value },
      create: setting,
    });
  }
}

main()
  .then(async () => {
    await db.$disconnect();
    await pool.end();
  })
  .catch(async (error) => {
    console.error(error);
    await db.$disconnect();
    await pool.end();
    process.exit(1);
  });
