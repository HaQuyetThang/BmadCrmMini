import "dotenv/config";

import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

import { PrismaClient } from "../src/generated/prisma/client.js";

import { normalizeEmail } from "../src/lib/safe-redirect.js";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const db = new PrismaClient({ adapter });

const DEFAULTS = [
  { key: "staleStatusDays", value: "14" },
  { key: "followUpDays", value: "7" },
  { key: "renewalWindowDays", value: "14" },
] as const;

async function seedOperator() {
  const email = normalizeEmail(process.env.OPERATOR_EMAIL);
  const password = process.env.OPERATOR_PASSWORD;
  const name = process.env.OPERATOR_NAME?.trim() || null;

  if (!email || !password) {
    throw new Error("OPERATOR_EMAIL and OPERATOR_PASSWORD are required for seed.");
  }

  const passwordHash = await bcrypt.hash(password, 12);

  await db.user.upsert({
    where: { email },
    update: {
      passwordHash,
      name,
    },
    create: {
      email,
      passwordHash,
      name,
    },
  });
}

async function main() {
  for (const setting of DEFAULTS) {
    await db.appSetting.upsert({
      where: { key: setting.key },
      update: { value: setting.value },
      create: setting,
    });
  }

  await seedOperator();
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
