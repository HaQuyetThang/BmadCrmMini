"use client";

import { Plus } from "lucide-react";
import { useEffect, useRef, useState, useTransition } from "react";
import { toast } from "sonner";

import { createCustomer, promoteCustomerToConsulting } from "@/actions/customers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";

type FieldErrors = Record<string, string[] | undefined>;

const OPEN_SHORTCUT_KEY = "k";

export function QuickCaptureSheet() {
  const [open, setOpen] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      const editing =
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.isContentEditable;

      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === OPEN_SHORTCUT_KEY) {
        event.preventDefault();

        if (!editing && !open) {
          setOpen(true);
        }
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const id = window.setTimeout(() => {
      nameInputRef.current?.focus();
    }, 0);

    return () => window.clearTimeout(id);
  }, [open]);

  function resetForm() {
    formRef.current?.reset();
    setErrors({});
  }

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);

    if (!nextOpen) {
      resetForm();
    }
  }

  function handleSubmit(formData: FormData) {
    setErrors({});

    startTransition(async () => {
      const result = await createCustomer(formData);

      if (!result.ok) {
        setErrors(result.fieldErrors ?? {});
        toast.error(result.error);
        return;
      }

      handleOpenChange(false);
      toast.success("Đã lưu", {
        description: result.data.name,
        action: {
          label: "Promote sang Đang tư vấn?",
          onClick: async () => {
            const promoteResult = await promoteCustomerToConsulting(result.data.id);

            if (promoteResult.ok) {
              toast.success("Đã chuyển sang Đang tư vấn");
            } else {
              toast.error(promoteResult.error);
            }
          },
        },
      });
    });
  }

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetTrigger
        render={
          <Button
            type="button"
            size="icon"
            className="fixed right-6 bottom-6 z-40 rounded-full shadow-lg"
            aria-label="Tạo lead nhanh"
            title="Tạo lead nhanh (Ctrl+K)"
          />
        }
      >
        <Plus />
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Quick capture lead</SheetTitle>
          <SheetDescription>
            Lưu lead Zalo trong 30 giây. Esc để đóng mà không lưu.
          </SheetDescription>
        </SheetHeader>

        <form ref={formRef} action={handleSubmit} className="flex flex-1 flex-col">
          <div className="flex flex-col gap-section px-4">
            <div className="flex flex-col gap-row-gap">
              <Label htmlFor="quick-capture-name">Tên</Label>
              <Input
                id="quick-capture-name"
                name="name"
                required
                ref={nameInputRef}
                disabled={isPending}
                aria-invalid={Boolean(errors.name)}
              />
              {errors.name?.[0] ? (
                <p className="text-body-sm text-destructive">{errors.name[0]}</p>
              ) : null}
            </div>

            <div className="flex flex-col gap-row-gap">
              <Label htmlFor="quick-capture-source">Nguồn</Label>
              <Input
                id="quick-capture-source"
                name="source"
                defaultValue="Zalo"
                required
                disabled={isPending}
                aria-invalid={Boolean(errors.source)}
              />
              {errors.source?.[0] ? (
                <p className="text-body-sm text-destructive">{errors.source[0]}</p>
              ) : null}
            </div>

            <div className="flex flex-col gap-row-gap">
              <Label htmlFor="quick-capture-first-message">Nội dung tin nhắn đầu</Label>
              <Textarea
                id="quick-capture-first-message"
                name="firstMessage"
                rows={5}
                disabled={isPending}
                aria-invalid={Boolean(errors.firstMessage)}
              />
              {errors.firstMessage?.[0] ? (
                <p className="text-body-sm text-destructive">{errors.firstMessage[0]}</p>
              ) : null}
            </div>
          </div>

          <SheetFooter>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Đang lưu..." : "Lưu"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
