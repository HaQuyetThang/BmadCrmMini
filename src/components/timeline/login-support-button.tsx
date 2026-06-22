"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

import { logLoginSupport } from "@/actions/timeline";
import { Button } from "@/components/ui/button";

type LoginSupportButtonProps = {
  customerId: string;
};

export function LoginSupportButton({ customerId }: LoginSupportButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    startTransition(async () => {
      const result = await logLoginSupport(customerId);

      if (!result.ok) {
        toast.error(result.error);
        return;
      }

      toast.success("Đã ghi timeline");
      router.refresh();
    });
  }

  return (
    <Button type="button" variant="outline" onClick={handleClick} disabled={isPending}>
      {isPending ? "Đang ghi..." : "Hỗ trợ login"}
    </Button>
  );
}
