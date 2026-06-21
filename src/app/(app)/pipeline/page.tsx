import { PipelineList } from "@/components/pipeline/pipeline-list";
import { listPipelineCustomers } from "@/lib/customers/list-pipeline-customers";
import { getLeadStaleDaysCount } from "@/lib/customers/stale-status";
import { getSettings } from "@/lib/settings/get-settings";
import { pipelineListQuerySchema } from "@/lib/validations/customer";

type PipelinePageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function PipelinePage({ searchParams }: PipelinePageProps) {
  const rawParams = await searchParams;
  const parsed = pipelineListQuerySchema.safeParse({
    page: rawParams.page,
    status: rawParams.status,
  });

  const query = parsed.success ? parsed.data : { page: 1 as const };
  const [settings, listResult] = await Promise.all([
    getSettings(),
    listPipelineCustomers(query),
  ]);

  const result = {
    ...listResult,
    customers: listResult.customers.map((customer) => {
      const staleDaysCount = getLeadStaleDaysCount(
        customer.pipelineStatus,
        customer.statusChangedAt,
        settings.staleStatusDays,
      );

      return staleDaysCount === undefined ? customer : { ...customer, staleDaysCount };
    }),
  };

  return (
    <div className="flex flex-col gap-section">
      <h1 className="text-display-sm text-foreground">Lead & pipeline</h1>
      <PipelineList result={result} status={query.status} />
    </div>
  );
}
