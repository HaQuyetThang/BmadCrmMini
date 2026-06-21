import Link from "next/link";

import { CustomerListRow } from "@/components/customers/customer-list-row";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { CustomerListResult } from "@/lib/customers/list-customers";
import { BUSINESS_GROUP_OPTIONS } from "@/lib/constants/business-group";
import type { BusinessGroup } from "@/generated/prisma/client";

type CustomerListProps = {
  result: CustomerListResult;
  group?: BusinessGroup;
  q?: string;
};

function buildCustomersHref({
  page,
  group,
  q,
}: {
  page: number;
  group?: BusinessGroup;
  q?: string;
}) {
  const params = new URLSearchParams();

  if (page > 1) params.set("page", String(page));
  if (group) params.set("group", group);
  if (q) params.set("q", q);

  const query = params.toString();
  return query ? `/customers?${query}` : "/customers";
}

export function CustomerList({ result, group, q }: CustomerListProps) {
  const { customers, page, pageCount, total } = result;
  const hasFilters = Boolean(group || q);
  const isEmpty = customers.length === 0;

  return (
    <div className="flex flex-col gap-section">
      <form method="get" className="flex flex-col gap-section sm:flex-row sm:items-end">
        <div className="flex flex-1 flex-col gap-row-gap">
          <Label htmlFor="customer-search">Tìm khách</Label>
          <Input
            id="customer-search"
            name="q"
            defaultValue={q ?? ""}
            placeholder="Tên hoặc Zalo"
          />
        </div>
        <div className="flex flex-col gap-row-gap sm:w-48">
          <Label htmlFor="customer-group">Nhóm nghiệp vụ</Label>
          <select
            id="customer-group"
            name="group"
            defaultValue={group ?? ""}
            className="h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <option value="">Tất cả</option>
            {BUSINESS_GROUP_OPTIONS.map((option) => (
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
          {hasFilters
            ? "Không thấy khách. Thử tên hoặc Zalo."
            : "Chưa có khách. Dùng Quick capture để thêm lead."}
        </p>
      ) : (
        <ul className="flex flex-col gap-row-gap">
          {customers.map((customer) => (
            <li key={customer.id}>
              <CustomerListRow customer={customer} />
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
                render={<Link href={buildCustomersHref({ page: page - 1, group, q })} />}
              >
                Trước
              </Button>
            ) : null}
            {page < pageCount ? (
              <Button
                variant="outline"
                size="sm"
                render={<Link href={buildCustomersHref({ page: page + 1, group, q })} />}
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
