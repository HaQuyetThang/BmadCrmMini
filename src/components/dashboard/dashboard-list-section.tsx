import Link from "next/link";

import { DASHBOARD_EMPTY_COPY } from "@/lib/constants/dashboard";
import { cn } from "@/lib/utils";

type DashboardListSectionProps = {
  title: string;
  children?: React.ReactNode;
  className?: string;
  total?: number;
  visibleCount?: number;
  viewMoreHref?: string;
  viewMoreLabel?: string;
};

export function DashboardListSection({
  title,
  children,
  className,
  total = 0,
  visibleCount = 0,
  viewMoreHref,
  viewMoreLabel = "Xem thêm",
}: DashboardListSectionProps) {
  const childCount = Array.isArray(children) ? children.length : children ? 1 : 0;
  const resolvedVisibleCount = visibleCount > 0 ? visibleCount : childCount;
  const isEmpty = resolvedVisibleCount === 0;
  const showViewMore = Boolean(viewMoreHref && total > resolvedVisibleCount);

  return (
    <section className={cn("flex flex-col gap-row-gap", className)}>
      <h2 className="text-display-sm text-foreground">{title}</h2>
      {isEmpty ? (
        <p className="text-body-sm text-muted-foreground">{DASHBOARD_EMPTY_COPY}</p>
      ) : (
        <>
          <div className="flex flex-col gap-row-gap">{children}</div>
          {showViewMore ? (
            <Link
              href={viewMoreHref!}
              className="text-body-sm text-muted-foreground underline-offset-4 hover:underline focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
            >
              {viewMoreLabel}
            </Link>
          ) : null}
        </>
      )}
    </section>
  );
}
