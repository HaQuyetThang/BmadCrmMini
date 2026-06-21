import Link from "next/link";

import { PipelineListRow } from "@/components/pipeline/pipeline-list-row";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { PIPELINE_STATUS_OPTIONS } from "@/lib/constants/pipeline";
import type { PipelineListResult } from "@/lib/customers/list-pipeline-customers";
import type { PipelineStatus } from "@/generated/prisma/client";

type PipelineListProps = {
  result: PipelineListResult;
  status?: PipelineStatus;
};

function buildPipelineHref({
  page,
  status,
}: {
  page: number;
  status?: PipelineStatus;
}) {
  const params = new URLSearchParams();

  if (page > 1) params.set("page", String(page));
  if (status) params.set("status", status);

  const query = params.toString();
  return query ? `/pipeline?${query}` : "/pipeline";
}

export function PipelineList({ result, status }: PipelineListProps) {
  const { customers, page, pageCount, total } = result;
  const hasFilter = Boolean(status);
  const isEmpty = customers.length === 0;

  return (
    <div className="flex flex-col gap-section">
      <form method="get" className="flex flex-col gap-section sm:flex-row sm:items-end">
        <div className="flex flex-col gap-row-gap sm:w-64">
          <Label htmlFor="pipeline-status">Trạng thái pipeline</Label>
          <select
            id="pipeline-status"
            name="status"
            defaultValue={status ?? ""}
            className="h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <option value="">Tất cả</option>
            {PIPELINE_STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <Button type="submit">Lọc</Button>
      </form>

      {isEmpty ? (
        <p className="text-body-sm text-muted-foreground">
          {hasFilter
            ? "Không có lead ở trạng thái này."
            : "Chưa có lead. Dùng Quick capture để thêm lead."}
        </p>
      ) : (
        <ul className="flex flex-col gap-row-gap">
          {customers.map((customer) => (
            <li key={customer.id}>
              <PipelineListRow customer={customer} />
            </li>
          ))}
        </ul>
      )}

      {total > 0 ? (
        <div className="flex items-center justify-between gap-4">
          <p className="text-body-sm text-muted-foreground">
            Trang {page} / {pageCount}
          </p>
          <div className="flex gap-2">
            {page > 1 ? (
              <Button
                variant="outline"
                size="sm"
                render={<Link href={buildPipelineHref({ page: page - 1, status })} />}
              >
                Trước
              </Button>
            ) : null}
            {page < pageCount ? (
              <Button
                variant="outline"
                size="sm"
                render={<Link href={buildPipelineHref({ page: page + 1, status })} />}
              >
                Sau
              </Button>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}
