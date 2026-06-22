import { TIMELINE_TYPE_LABELS } from "@/lib/constants/timeline";
import { formatDateTime } from "@/lib/format";
import type { TimelineType } from "@/generated/prisma/client";
import { cn } from "@/lib/utils";

type TimelineItemProps = {
  type: TimelineType;
  content: string;
  createdAt: Date | string;
  className?: string;
};

export function TimelineItem({ type, content, createdAt, className }: TimelineItemProps) {
  return (
    <div className={cn("flex gap-3", className)}>
      <div className="mt-1.5 size-2 shrink-0 rounded-full bg-muted-foreground/40" aria-hidden />
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
          <span className="text-label text-muted-foreground">{formatDateTime(createdAt)}</span>
          <span className="text-label text-muted-foreground">·</span>
          <span className="text-label text-muted-foreground">{TIMELINE_TYPE_LABELS[type]}</span>
        </div>
        <p className="text-body-sm whitespace-pre-wrap text-foreground">{content}</p>
      </div>
    </div>
  );
}
