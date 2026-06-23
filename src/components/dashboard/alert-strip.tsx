import Link from "next/link";

import { cn } from "@/lib/utils";

type AlertStripVariant = "warning" | "danger" | "neutral";

type AlertStripProps = {
  count: number;
  label: string;
  href?: string;
  variant?: AlertStripVariant;
  className?: string;
};

const VARIANT_CLASSES: Record<AlertStripVariant, string> = {
  warning: "border-l-status-warning bg-status-warning-muted",
  danger: "border-l-status-danger bg-status-danger-muted",
  neutral: "border-l-muted-foreground/40 bg-muted/30",
};

export function AlertStrip({
  count,
  label,
  href,
  variant = "neutral",
  className,
}: AlertStripProps) {
  const ariaLabel = `${label}: ${count}`;
  const stripClass = cn(
    "flex w-full items-center gap-2 rounded-md border border-border border-l-[3px] px-3 py-2 text-left transition-colors",
    VARIANT_CLASSES[variant],
    href &&
      "hover:bg-muted/40 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none",
    className,
  );

  const content = (
    <>
      <span className="text-display-sm tabular-nums text-foreground">{count}</span>
      <span className="text-body-sm text-muted-foreground">{label}</span>
    </>
  );

  if (href) {
    return (
      <Link href={href} className={stripClass} aria-label={ariaLabel}>
        {content}
      </Link>
    );
  }

  return (
    <div className={stripClass} aria-label={ariaLabel} role="group">
      {content}
    </div>
  );
}
