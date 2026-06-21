import { Badge } from "@/components/ui/badge";
import {
  PIPELINE_GROUP_CLASS,
  PIPELINE_GROUP_DOT_CLASS,
  PIPELINE_STATUS_LABELS,
} from "@/lib/constants/pipeline";
import type { PipelineStatus } from "@/generated/prisma/client";
import { cn } from "@/lib/utils";

type PipelineStatusChipProps = {
  status: PipelineStatus;
  className?: string;
};

export function PipelineStatusChip({ status, className }: PipelineStatusChipProps) {
  const meta = PIPELINE_STATUS_LABELS[status];

  return (
    <Badge
      className={cn(
        "inline-flex items-center gap-1.5 border-transparent",
        PIPELINE_GROUP_CLASS[meta.group],
        className,
      )}
    >
      <span
        className={cn("size-1.5 shrink-0 rounded-full", PIPELINE_GROUP_DOT_CLASS[meta.group])}
        aria-hidden
      />
      {meta.label}
    </Badge>
  );
}
