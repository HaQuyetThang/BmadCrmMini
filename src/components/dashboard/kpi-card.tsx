import Link from "next/link";

import { cn } from "@/lib/utils";

type KpiCardProps = {
  label: string;
  value: number | string;
  ariaLabel: string;
  href?: string;
  className?: string;
};

export function KpiCard({ label, value, ariaLabel, href, className }: KpiCardProps) {
  const cardClass = cn(
    "rounded-md border border-border bg-card p-card-padding",
    href &&
      "transition-colors hover:bg-muted/40 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none",
    className,
  );

  const content = (
    <>
      <p className="text-label text-muted-foreground">{label}</p>
      <p className="text-display-sm tabular-nums text-foreground">{value}</p>
    </>
  );

  if (href) {
    return (
      <Link href={href} className={cardClass} aria-label={ariaLabel}>
        {content}
      </Link>
    );
  }

  return (
    <div className={cardClass} aria-label={ariaLabel} role="group">
      {content}
    </div>
  );
}
