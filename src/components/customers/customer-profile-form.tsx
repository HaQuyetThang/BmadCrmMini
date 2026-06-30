"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import { softDeleteCustomer, updateCustomer } from "@/actions/customers";
import { CreateTicketForm } from "@/components/customers/create-ticket-form";
import { CustomerProfileHeader } from "@/components/customers/customer-profile-header";
import { RenewalStatusBadge } from "@/components/customers/renewal-status-badge";
import { clearStaleBannerDismiss, StaleBanner } from "@/components/pipeline/stale-banner";
import { TimelineSection, type TimelineEntryData } from "@/components/timeline/timeline-section";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { BUSINESS_GROUP_OPTIONS } from "@/lib/constants/business-group";
import { formatCurrency, toDateInputValue } from "@/lib/format";
import type { BusinessGroup, PipelineStatus } from "@/generated/prisma/client";
import type { RenewalInfo } from "@/lib/customers/renewal-status";
import type { StaleInfo } from "@/lib/customers/stale-status";

type FieldErrors = Record<string, string[] | undefined>;

export type CustomerProfileData = {
  id: string;
  name: string;
  pipelineStatus: PipelineStatus;
  businessGroup: BusinessGroup;
  serviceType: string | null;
  contactChannel: string | null;
  specialNotes: string | null;
  renewalDate: string | null;
  demoScheduledAt: string | null;
  paymentDueAt: string | null;
  packagePrice: string | null;
  billingCycle: string | null;
  licenseKey: string | null;
  staleInfo: StaleInfo | null;
  renewalInfo: RenewalInfo | null;
  timelineEntries: TimelineEntryData[];
};

type CustomerProfileFormProps = {
  customer: CustomerProfileData;
};

const BILLING_CYCLE_OPTIONS = [
  { value: "", label: "Chưa chọn" },
  { value: "monthly", label: "Tháng" },
  { value: "yearly", label: "Năm" },
  { value: "project", label: "Dự án" },
] as const;

export function CustomerProfileForm({ customer }: CustomerProfileFormProps) {
  const router = useRouter();
  const [errors, setErrors] = useState<FieldErrors>({});
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [pipelineStatus, setPipelineStatus] = useState(customer.pipelineStatus);
  const [showStaleBanner, setShowStaleBanner] = useState(Boolean(customer.staleInfo?.isStale));
  const [isPending, startTransition] = useTransition();
  const [isDeleting, startDeleteTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    setErrors({});

    startTransition(async () => {
      const result = await updateCustomer(customer.id, formData);

      if (!result.ok) {
        setErrors(result.fieldErrors ?? {});
        toast.error(result.error);
        return;
      }

      toast.success("Đã lưu");
      router.refresh();
    });
  }

  function handleDelete() {
    startDeleteTransition(async () => {
      const result = await softDeleteCustomer(customer.id);

      if (!result.ok) {
        toast.error(result.error);
        return;
      }

      toast.success("Đã xóa khách");
      setDeleteOpen(false);
      router.push("/customers");
    });
  }

  const packagePriceValue = customer.packagePrice ?? "";

  return (
    <div className="flex flex-col gap-section">
      {showStaleBanner && customer.staleInfo ? (
        <StaleBanner customerId={customer.id} daysCount={customer.staleInfo.daysCount} />
      ) : null}

      <CustomerProfileHeader
        customer={{ ...customer, pipelineStatus }}
        onPipelineStatusChange={(status) => {
          setPipelineStatus(status);
          setShowStaleBanner(false);
          clearStaleBannerDismiss(customer.id);
        }}
      />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Hồ sơ khách</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={handleSubmit} className="flex flex-col gap-section">
            <div className="grid gap-section sm:grid-cols-2">
              <div className="flex flex-col gap-row-gap sm:col-span-2">
                <Label htmlFor="businessGroup">Nhóm nghiệp vụ</Label>
                <select
                  id="businessGroup"
                  name="businessGroup"
                  defaultValue={customer.businessGroup}
                  disabled={isPending}
                  className="h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  {BUSINESS_GROUP_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-row-gap">
                <Label htmlFor="serviceType">Loại dịch vụ</Label>
                <Input
                  id="serviceType"
                  name="serviceType"
                  defaultValue={customer.serviceType ?? ""}
                  disabled={isPending}
                  aria-invalid={Boolean(errors.serviceType)}
                />
              </div>

              <div className="flex flex-col gap-row-gap">
                <Label htmlFor="contactChannel">Kênh liên hệ chính</Label>
                <Input
                  id="contactChannel"
                  name="contactChannel"
                  defaultValue={customer.contactChannel ?? ""}
                  disabled={isPending}
                  aria-invalid={Boolean(errors.contactChannel)}
                />
              </div>

              <div className="flex flex-col gap-row-gap sm:col-span-2">
                <Label htmlFor="specialNotes">Ghi chú đặc biệt</Label>
                <Textarea
                  id="specialNotes"
                  name="specialNotes"
                  rows={4}
                  defaultValue={customer.specialNotes ?? ""}
                  disabled={isPending}
                  aria-invalid={Boolean(errors.specialNotes)}
                />
              </div>

              <div className="flex flex-col gap-row-gap">
                <div className="flex flex-wrap items-center gap-2">
                  <Label htmlFor="renewalDate">Ngày gia hạn tiếp theo</Label>
                  {customer.renewalInfo ? (
                    <RenewalStatusBadge
                      label={customer.renewalInfo.label}
                      status={customer.renewalInfo.status}
                    />
                  ) : null}
                </div>
                <Input
                  id="renewalDate"
                  name="renewalDate"
                  type="date"
                  defaultValue={toDateInputValue(customer.renewalDate)}
                  disabled={isPending}
                  aria-invalid={Boolean(errors.renewalDate)}
                />
                {errors.renewalDate?.[0] ? (
                  <p className="text-body-sm text-destructive">{errors.renewalDate[0]}</p>
                ) : null}
              </div>

              <div className="flex flex-col gap-row-gap">
                <Label htmlFor="demoScheduledAt">Lịch hẹn demo</Label>
                <Input
                  id="demoScheduledAt"
                  name="demoScheduledAt"
                  type="date"
                  defaultValue={toDateInputValue(customer.demoScheduledAt)}
                  disabled={isPending}
                  aria-invalid={Boolean(errors.demoScheduledAt)}
                />
                {errors.demoScheduledAt?.[0] ? (
                  <p className="text-body-sm text-destructive">{errors.demoScheduledAt[0]}</p>
                ) : null}
              </div>

              <div className="flex flex-col gap-row-gap">
                <Label htmlFor="paymentDueAt">Hạn thanh toán</Label>
                <Input
                  id="paymentDueAt"
                  name="paymentDueAt"
                  type="date"
                  defaultValue={toDateInputValue(customer.paymentDueAt)}
                  disabled={isPending}
                  aria-invalid={Boolean(errors.paymentDueAt)}
                />
                {errors.paymentDueAt?.[0] ? (
                  <p className="text-body-sm text-destructive">{errors.paymentDueAt[0]}</p>
                ) : null}
              </div>

              <div className="flex flex-col gap-row-gap">
                <Label htmlFor="packagePrice">Giá gói (VND)</Label>
                <Input
                  id="packagePrice"
                  name="packagePrice"
                  type="number"
                  min="0"
                  step="1000"
                  defaultValue={packagePriceValue}
                  disabled={isPending}
                  aria-invalid={Boolean(errors.packagePrice)}
                />
                {packagePriceValue ? (
                  <p className="text-body-sm text-muted-foreground">
                    Hiển thị: {formatCurrency(packagePriceValue)}
                  </p>
                ) : null}
                {errors.packagePrice?.[0] ? (
                  <p className="text-body-sm text-destructive">{errors.packagePrice[0]}</p>
                ) : null}
              </div>

              <div className="flex flex-col gap-row-gap">
                <Label htmlFor="billingCycle">Chu kỳ thanh toán</Label>
                <select
                  id="billingCycle"
                  name="billingCycle"
                  defaultValue={customer.billingCycle ?? ""}
                  disabled={isPending}
                  className="h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  {BILLING_CYCLE_OPTIONS.map((option) => (
                    <option key={option.value || "empty"} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-row-gap sm:col-span-2">
                <Label htmlFor="licenseKey">License/key</Label>
                <Input
                  id="licenseKey"
                  name="licenseKey"
                  defaultValue={customer.licenseKey ?? ""}
                  disabled={isPending}
                  aria-invalid={Boolean(errors.licenseKey)}
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Button type="submit" disabled={isPending}>
                {isPending ? "Đang lưu..." : "Lưu"}
              </Button>

              <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                <DialogTrigger
                  render={
                    <Button type="button" variant="destructive" disabled={isPending || isDeleting} />
                  }
                >
                  Xóa khách
                </DialogTrigger>
                <DialogContent showCloseButton={false}>
                  <DialogHeader>
                    <DialogTitle>Xóa khách?</DialogTitle>
                    <DialogDescription>
                      Khách sẽ được ẩn khỏi danh sách. Bạn có thể không khôi phục trong MVP.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setDeleteOpen(false)}
                      disabled={isDeleting}
                    >
                      Hủy
                    </Button>
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={handleDelete}
                      disabled={isDeleting}
                    >
                      {isDeleting ? "Đang xóa..." : "Xóa"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </form>
        </CardContent>
      </Card>

      <CreateTicketForm customerId={customer.id} />

      <TimelineSection customerId={customer.id} entries={customer.timelineEntries} />
    </div>
  );
}
