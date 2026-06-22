import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoginSupportButton } from "@/components/timeline/login-support-button";
import { PipelineStatusChip } from "@/components/pipeline/pipeline-status-chip";
import { StatusSelect } from "@/components/pipeline/status-select";
import { BUSINESS_GROUP_LABELS } from "@/lib/constants/business-group";
import type { BusinessGroup, PipelineStatus } from "@/generated/prisma/client";

type CustomerProfileHeaderProps = {
  customer: {
    id: string;
    name: string;
    businessGroup: BusinessGroup;
    pipelineStatus: PipelineStatus;
    licenseKey: string | null;
  };
  onPipelineStatusChange?: (status: PipelineStatus) => void;
};

export function CustomerProfileHeader({
  customer,
  onPipelineStatusChange,
}: CustomerProfileHeaderProps) {
  return (
    <header className="flex flex-col gap-section rounded-lg border border-border bg-card p-card-padding">
      <div className="flex flex-col gap-2">
        <h1 className="text-display-sm text-foreground">{customer.name}</h1>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary" className="border-transparent bg-muted text-foreground">
            {BUSINESS_GROUP_LABELS[customer.businessGroup]}
          </Badge>
          <PipelineStatusChip status={customer.pipelineStatus} />
          <StatusSelect
            customerId={customer.id}
            value={customer.pipelineStatus}
            className="sm:max-w-52"
            refreshOnSuccess={false}
            onSuccess={onPipelineStatusChange}
          />
        </div>
      </div>

      <div className="flex flex-col gap-row-gap">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <Label htmlFor="profile-license-display" className="flex-1">
            License/key
          </Label>
          <LoginSupportButton customerId={customer.id} />
        </div>
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
