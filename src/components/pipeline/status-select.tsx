"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import { updatePipelineStatus } from "@/actions/customers";
import {
  PIPELINE_STATUS_GROUP_LABELS,
  PIPELINE_STATUS_OPTIONS,
} from "@/lib/constants/pipeline";
import type { PipelineStatus } from "@/generated/prisma/client";
import type { PipelineVisualGroup } from "@/lib/constants/pipeline";
import { cn } from "@/lib/utils";

type StatusSelectProps = {
  customerId: string;
  value: PipelineStatus;
  disabled?: boolean;
  className?: string;
  onClick?: (event: React.MouseEvent) => void;
  /** When false, skips router.refresh() — use with onSuccess for local state updates. */
  refreshOnSuccess?: boolean;
  onSuccess?: (status: PipelineStatus) => void;
};

const GROUP_ORDER: PipelineVisualGroup[] = ["lead", "closing", "customer"];

export function StatusSelect({
  customerId,
  value,
  disabled = false,
  className,
  onClick,
  refreshOnSuccess = true,
  onSuccess,
}: StatusSelectProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [optimisticStatus, setOptimisticStatus] = useState<PipelineStatus | null>(null);
  const selected = optimisticStatus ?? value;

  function handleChange(nextStatus: string) {
    if (nextStatus === selected) return;

    setOptimisticStatus(nextStatus as PipelineStatus);

    startTransition(async () => {
      const result = await updatePipelineStatus(
        customerId,
        nextStatus as PipelineStatus,
      );

      if (!result.ok) {
        setOptimisticStatus(null);
        toast.error(result.error);
        return;
      }

      setOptimisticStatus(null);
      toast.success("Đã cập nhật trạng thái");
      onSuccess?.(nextStatus as PipelineStatus);

      if (refreshOnSuccess) {
        router.refresh();
      }
    });
  }

  return (
    <select
      value={selected}
      disabled={disabled || isPending}
      onClick={onClick}
      onChange={(event) => handleChange(event.target.value)}
      aria-label="Pipeline status"
      className={cn(
        "h-8 max-w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
        className,
      )}
    >
      {GROUP_ORDER.map((group) => (
        <optgroup key={group} label={PIPELINE_STATUS_GROUP_LABELS[group]}>
          {PIPELINE_STATUS_OPTIONS.filter((option) => option.group === group).map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </optgroup>
      ))}
    </select>
  );
}
