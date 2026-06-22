"use client";

import { useRouter } from "next/navigation";
import { useRef, useState, useTransition } from "react";
import { toast } from "sonner";

import { createTimelineEntry } from "@/actions/timeline";
import { TimelineItem } from "@/components/timeline/timeline-item";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { TIMELINE_TYPE_OPTIONS } from "@/lib/constants/timeline";
import type { TimelineType } from "@/generated/prisma/client";

export type TimelineEntryData = {
  id: string;
  type: TimelineType;
  content: string;
  createdAt: string;
};

type TimelineSectionProps = {
  customerId: string;
  entries: TimelineEntryData[];
};

type FieldErrors = Record<string, string[] | undefined>;

export function TimelineSection({ customerId, entries }: TimelineSectionProps) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    setErrors({});

    startTransition(async () => {
      const result = await createTimelineEntry(customerId, formData);

      if (!result.ok) {
        setErrors(result.fieldErrors ?? {});
        toast.error(result.error);
        return;
      }

      formRef.current?.reset();
      toast.success("Đã ghi timeline");
      router.refresh();
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Timeline</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-section">
        <form ref={formRef} action={handleSubmit} className="flex flex-col gap-row-gap">
          <div className="grid gap-row-gap sm:grid-cols-2">
            <div className="flex flex-col gap-row-gap">
              <Label htmlFor="timeline-type">Loại tương tác</Label>
              <select
                id="timeline-type"
                name="type"
                defaultValue="ZALO"
                disabled={isPending}
                className="h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                aria-invalid={Boolean(errors.type)}
              >
                {TIMELINE_TYPE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {errors.type?.[0] ? (
                <p className="text-body-sm text-destructive">{errors.type[0]}</p>
              ) : null}
            </div>
          </div>

          <div className="flex flex-col gap-row-gap">
            <Label htmlFor="timeline-content">Nội dung</Label>
            <Textarea
              id="timeline-content"
              name="content"
              rows={3}
              maxLength={2000}
              required
              disabled={isPending}
              placeholder="Ghi chú cuộc gọi, tin nhắn Zalo..."
              aria-invalid={Boolean(errors.content)}
            />
            {errors.content?.[0] ? (
              <p className="text-body-sm text-destructive">{errors.content[0]}</p>
            ) : null}
          </div>

          <div>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Đang ghi..." : "Thêm entry"}
            </Button>
          </div>
        </form>

        {entries.length === 0 ? (
          <p className="text-body-sm text-muted-foreground">Chưa có tương tác nào.</p>
        ) : (
          <ul className="flex flex-col gap-4">
            {entries.map((entry) => (
              <li key={entry.id}>
                <TimelineItem
                  type={entry.type}
                  content={entry.content}
                  createdAt={entry.createdAt}
                />
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
