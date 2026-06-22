import { DASHBOARD_ALERT_LABELS } from "@/lib/constants/dashboard";

import { AlertStrip } from "./alert-strip";

const ALERT_ITEMS = [
  { key: "appointmentsToday", label: DASHBOARD_ALERT_LABELS.appointmentsToday },
  { key: "overduePayments", label: DASHBOARD_ALERT_LABELS.overduePayments },
  { key: "urgentTickets", label: DASHBOARD_ALERT_LABELS.urgentTickets },
] as const;

export function AlertStripRow() {
  return (
    <div
      className="grid grid-cols-1 gap-row-gap sm:flex sm:flex-col md:grid md:grid-cols-2 lg:grid-cols-3"
      role="region"
      aria-label="Cảnh báo ưu tiên"
    >
      {ALERT_ITEMS.map((item) => (
        <AlertStrip key={item.key} count={0} label={item.label} />
      ))}
    </div>
  );
}
