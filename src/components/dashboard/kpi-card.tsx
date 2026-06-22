import { cn } from "@/lib/utils";

type KpiCardProps = {
  label: string;
  value: number | string;
  ariaLabel: string;
  className?: string;
};

export function KpiCard({ label, value, ariaLabel, className }: KpiCardProps) {
  return (
    <div
      className={cn(
        "rounded-md border border-border bg-card p-card-padding",
        className,
      )}
      aria-label={ariaLabel}
      role="group"
    >
      <p className="text-label text-muted-foreground">{label}</p>
      <p className="text-display-sm tabular-nums text-foreground">{value}</p>
    </div>
  );
}
