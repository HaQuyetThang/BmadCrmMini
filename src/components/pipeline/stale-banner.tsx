"use client";

import { useCallback, useSyncExternalStore } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type StaleBannerProps = {
  customerId: string;
  daysCount: number;
  className?: string;
};

const STALE_BANNER_DISMISS_EVENT = "stale-banner-dismiss";

function getDismissStorageKey(customerId: string) {
  return `stale-banner-dismissed:${customerId}`;
}

export function clearStaleBannerDismiss(customerId: string) {
  sessionStorage.removeItem(getDismissStorageKey(customerId));
  window.dispatchEvent(new Event(STALE_BANNER_DISMISS_EVENT));
}

function subscribe(onStoreChange: () => void) {
  window.addEventListener(STALE_BANNER_DISMISS_EVENT, onStoreChange);
  window.addEventListener("storage", onStoreChange);

  return () => {
    window.removeEventListener(STALE_BANNER_DISMISS_EVENT, onStoreChange);
    window.removeEventListener("storage", onStoreChange);
  };
}

function getDismissSnapshot(customerId: string) {
  return sessionStorage.getItem(getDismissStorageKey(customerId)) === "1";
}

export function StaleBanner({ customerId, daysCount, className }: StaleBannerProps) {
  const dismissed = useSyncExternalStore(
    subscribe,
    () => getDismissSnapshot(customerId),
    () => false,
  );

  const handleDismiss = useCallback(() => {
    sessionStorage.setItem(getDismissStorageKey(customerId), "1");
    window.dispatchEvent(new Event(STALE_BANNER_DISMISS_EVENT));
  }, [customerId]);

  if (dismissed) {
    return null;
  }

  return (
    <div
      role="status"
      className={cn(
        "flex items-center justify-between gap-3 rounded-lg border border-status-warning/30 bg-status-warning-muted px-4 py-3 text-sm text-status-warning",
        className,
      )}
    >
      <p>
        Cập nhật trạng thái?
        <span className="sr-only">{daysCount} ngày không đổi</span>
      </p>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={handleDismiss}
        aria-label="Đóng cảnh báo"
        className="h-7 shrink-0 px-2 text-status-warning hover:bg-status-warning/10 hover:text-status-warning"
      >
        Đóng
      </Button>
    </div>
  );
}
