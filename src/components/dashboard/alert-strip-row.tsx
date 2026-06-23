import Link from "next/link";

import type { DashboardAlerts } from "@/lib/dashboard/get-alerts";

import { AlertStrip } from "./alert-strip";

type AlertStripRowProps = {
  alerts: DashboardAlerts;
};

export function AlertStripRow({ alerts }: AlertStripRowProps) {
  return (
    <div
      className="flex min-h-10 flex-col gap-row-gap"
      role="region"
      aria-label="Cảnh báo ưu tiên"
    >
      {alerts.visible.length > 0 ? (
        <div className="grid grid-cols-1 gap-row-gap sm:flex sm:flex-col md:grid md:grid-cols-2 lg:grid-cols-3">
          {alerts.visible.map((alert) => (
            <AlertStrip
              key={alert.kind}
              count={alert.count}
              label={alert.label}
              href={alert.href}
              variant={alert.variant}
            />
          ))}
        </div>
      ) : null}

      {alerts.overflowTotal > 0 && alerts.viewAllHref ? (
        <Link
          href={alerts.viewAllHref}
          className="text-body-sm text-muted-foreground underline-offset-4 hover:underline focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
        >
          Xem tất cả ({alerts.overflowTotal})
        </Link>
      ) : null}
    </div>
  );
}
