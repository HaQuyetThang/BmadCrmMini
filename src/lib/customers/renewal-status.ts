export type RenewalInfo = {
  status: "approaching" | "overdue";
  daysCount: number;
  label: string;
};

function startOfLocalDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function getDaysUntilRenewal(renewalDate: Date, now: Date = new Date()): number {
  const renewalDay = startOfLocalDay(renewalDate);
  const today = startOfLocalDay(now);

  return Math.floor((renewalDay.getTime() - today.getTime()) / 86_400_000);
}

function buildRenewalLabel(daysUntil: number): string {
  if (daysUntil <= 0) {
    if (daysUntil === 0) return "Gia hạn hôm nay";
    return `Quá hạn ${Math.abs(daysUntil)} ngày`;
  }

  return `Gia hạn sau ${daysUntil} ngày`;
}

export function getRenewalInfo(
  renewalDate: Date | null,
  renewalWindowDays: number,
  now: Date = new Date(),
): RenewalInfo | null {
  if (!renewalDate) return null;

  const daysUntil = getDaysUntilRenewal(renewalDate, now);

  if (daysUntil <= 0) {
    return {
      status: "overdue",
      daysCount: daysUntil === 0 ? 0 : Math.abs(daysUntil),
      label: buildRenewalLabel(daysUntil),
    };
  }

  if (daysUntil <= renewalWindowDays) {
    return {
      status: "approaching",
      daysCount: daysUntil,
      label: buildRenewalLabel(daysUntil),
    };
  }

  return null;
}

export function getRenewalDateUpperBound(
  renewalWindowDays: number,
  now: Date = new Date(),
): Date {
  const today = startOfLocalDay(now);
  const maxDate = new Date(today);
  maxDate.setDate(maxDate.getDate() + renewalWindowDays);
  maxDate.setHours(23, 59, 59, 999);

  return maxDate;
}
