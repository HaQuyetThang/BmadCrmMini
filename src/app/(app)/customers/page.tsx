import { CustomerList } from "@/components/customers/customer-list";
import { listCustomers } from "@/lib/customers/list-customers";
import { customerListQuerySchema } from "@/lib/validations/customer";

type CustomersPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function CustomersPage({ searchParams }: CustomersPageProps) {
  const rawParams = await searchParams;
  const parsed = customerListQuerySchema.safeParse({
    page: rawParams.page,
    group: rawParams.group,
    q: rawParams.q,
  });

  const query = parsed.success ? parsed.data : { page: 1 as const };
  const result = await listCustomers(query);

  return (
    <div className="flex flex-col gap-section">
      <h1 className="text-display-sm text-foreground">Khách hàng</h1>
      <CustomerList result={result} group={query.group} q={query.q} />
    </div>
  );
}
