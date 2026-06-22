import { cn } from "@/lib/utils";

type AlertStripProps = {
  count: number;
  label: string;
  className?: string;
};

export function AlertStrip({ count, label, className }: AlertStripProps) {
  return (
    <button
      type="button"
      disabled
      aria-label={`${label}: ${count}`}
      aria-disabled="true"
      className={cn(
        "flex w-full items-center gap-2 rounded-md border border-border border-l-[3px] border-l-muted-foreground/40",
        "bg-muted/30 px-3 py-2 text-left transition-colors",
        "focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none",
        "disabled:cursor-default disabled:opacity-100",
        className,
      )}
    >
      <span className="text-display-sm tabular-nums text-foreground">{count}</span>
      <span className="text-body-sm text-muted-foreground">{label}</span>
    </button>
  );
}
