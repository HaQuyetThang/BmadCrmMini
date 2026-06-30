"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import { createTicket } from "@/actions/tickets";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type CreateTicketFormProps = {
  customerId: string;
};

type FieldErrors = Record<string, string[] | undefined>;

export function CreateTicketForm({ customerId }: CreateTicketFormProps) {
  const router = useRouter();
  const [errors, setErrors] = useState<FieldErrors>({});
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    setErrors({});
    formData.set("customerId", customerId);

    startTransition(async () => {
      const result = await createTicket(formData);

      if (!result.ok) {
        setErrors(result.fieldErrors ?? {});
        toast.error(result.error);
        return;
      }

      toast.success("Đã tạo ticket");
      router.refresh();
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Tạo ticket hỗ trợ</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={handleSubmit} className="flex flex-col gap-section">
          <div className="flex flex-col gap-row-gap">
            <Label htmlFor="ticket-title">Tiêu đề</Label>
            <Input
              id="ticket-title"
              name="title"
              placeholder="VD: Hỗ trợ đăng nhập"
              disabled={isPending}
              aria-invalid={Boolean(errors.title)}
            />
            {errors.title?.[0] ? (
              <p className="text-body-sm text-destructive">{errors.title[0]}</p>
            ) : null}
          </div>

          <div className="flex flex-col gap-row-gap sm:max-w-xs">
            <Label htmlFor="ticket-priority">Ưu tiên</Label>
            <select
              id="ticket-priority"
              name="priority"
              defaultValue="NORMAL"
              disabled={isPending}
              className="h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              <option value="NORMAL">Thường</option>
              <option value="KHAN">Khẩn</option>
            </select>
            {errors.priority?.[0] ? (
              <p className="text-body-sm text-destructive">{errors.priority[0]}</p>
            ) : null}
          </div>

          <Button type="submit" disabled={isPending}>
            {isPending ? "Đang tạo..." : "Tạo ticket"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
