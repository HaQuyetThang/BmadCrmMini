import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BUSINESS_GROUP_LABELS } from "@/lib/constants/business-group";
import {
  PIPELINE_GROUP_CLASS,
  PIPELINE_STATUS_LABELS,
} from "@/lib/constants/pipeline";
import type { BusinessGroup, PipelineStatus } from "@/generated/prisma/client";
import { cn } from "@/lib/utils";

type CustomerProfileHeaderProps = {
  customer: {
    name: string;
    businessGroup: BusinessGroup;
    pipelineStatus: PipelineStatus;
    licenseKey: string | null;
  };
};

export function CustomerProfileHeader({ customer }: CustomerProfileHeaderProps) {
  const statusMeta = PIPELINE_STATUS_LABELS[customer.pipelineStatus];

  return (
    <header className="flex flex-col gap-section rounded-lg border border-border bg-card p-card-padding">
      <div className="flex flex-col gap-2">
        <h1 className="text-display-sm text-foreground">{customer.name}</h1>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary" className="border-transparent bg-muted text-foreground">
            {BUSINESS_GROUP_LABELS[customer.businessGroup]}
          </Badge>
          <Badge
            className={cn(
              "border-transparent",
              PIPELINE_GROUP_CLASS[statusMeta.group],
            )}
          >
            {statusMeta.label}
          </Badge>
        </div>
      </div>

      <div className="flex flex-col gap-row-gap">
        <Label htmlFor="profile-license-display">License/key</Label>
        <Input
          id="profile-license-display"
          readOnly
          value={customer.licenseKey ?? ""}
          placeholder="Chưa có license/key"
          className="bg-background"
        />
      </div>
    </header>
  );
}
