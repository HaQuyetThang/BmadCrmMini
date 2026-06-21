import { db } from "@/lib/db";

const DEFAULT_SETTINGS = {
  staleStatusDays: 14,
  followUpDays: 7,
  renewalWindowDays: 14,
} as const;

export type AppSettings = {
  staleStatusDays: number;
  followUpDays: number;
  renewalWindowDays: number;
};

const SETTING_KEYS = {
  staleStatusDays: "staleStatusDays",
  followUpDays: "followUpDays",
  renewalWindowDays: "renewalWindowDays",
} as const;

function parsePositiveInt(value: string | undefined, fallback: number): number {
  if (!value) return fallback;

  const trimmed = value.trim();
  if (!/^\d+$/.test(trimmed)) return fallback;

  const parsed = Number(trimmed);
  if (!Number.isInteger(parsed) || parsed <= 0) return fallback;

  return parsed;
}

export async function getSettings(): Promise<AppSettings> {
  const rows = await db.appSetting.findMany({
    where: {
      key: {
        in: Object.values(SETTING_KEYS),
      },
    },
    select: {
      key: true,
      value: true,
    },
  });

  const values = Object.fromEntries(rows.map((row) => [row.key, row.value]));

  return {
    staleStatusDays: parsePositiveInt(
      values[SETTING_KEYS.staleStatusDays],
      DEFAULT_SETTINGS.staleStatusDays,
    ),
    followUpDays: parsePositiveInt(values[SETTING_KEYS.followUpDays], DEFAULT_SETTINGS.followUpDays),
    renewalWindowDays: parsePositiveInt(
      values[SETTING_KEYS.renewalWindowDays],
      DEFAULT_SETTINGS.renewalWindowDays,
    ),
  };
}
