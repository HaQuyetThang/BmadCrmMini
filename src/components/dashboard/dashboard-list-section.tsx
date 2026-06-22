import { DASHBOARD_EMPTY_COPY } from "@/lib/constants/dashboard";
import { cn } from "@/lib/utils";

type DashboardListSectionProps = {
  title: string;
  children?: React.ReactNode;
  className?: string;
};

export function DashboardListSection({
  title,
  children,
  className,
}: DashboardListSectionProps) {
  const isEmpty = !children || (Array.isArray(children) && children.length === 0);

  return (
    <section className={cn("flex flex-col gap-row-gap", className)}>
      <h2 className="text-display-sm text-foreground">{title}</h2>
      {isEmpty ? (
        <p className="text-body-sm text-muted-foreground">{DASHBOARD_EMPTY_COPY}</p>
      ) : (
        <div className="flex flex-col gap-row-gap">{children}</div>
      )}
    </section>
  );
}
