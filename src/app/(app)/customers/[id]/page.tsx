import { notFound } from "next/navigation";

import {
  CustomerProfileForm,
  type CustomerProfileData,
} from "@/components/customers/customer-profile-form";
import { getCustomerById } from "@/lib/customers/list-customers";
import { getRenewalInfo } from "@/lib/customers/renewal-status";
import { getStaleInfo } from "@/lib/customers/stale-status";
import { getSettings } from "@/lib/settings/get-settings";

type CustomerDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function CustomerDetailPage({ params }: CustomerDetailPageProps) {
  const { id } = await params;
  const [settings, customer] = await Promise.all([getSettings(), getCustomerById(id)]);

  if (!customer) {
    notFound();
  }

  const staleInfo = getStaleInfo(customer.statusChangedAt, settings.staleStatusDays);
  const renewalInfo = getRenewalInfo(customer.renewalDate, settings.renewalWindowDays);

  const profile: CustomerProfileData = {
    id: customer.id,
    name: customer.name,
    pipelineStatus: customer.pipelineStatus,
    businessGroup: customer.businessGroup,
    serviceType: customer.serviceType,
    contactChannel: customer.contactChannel,
    specialNotes: customer.specialNotes,
    renewalDate: customer.renewalDate?.toISOString() ?? null,
    packagePrice: customer.packagePrice?.toString() ?? null,
    billingCycle: customer.billingCycle,
    licenseKey: customer.licenseKey,
    staleInfo: staleInfo.isStale ? staleInfo : null,
    renewalInfo,
  };

  return <CustomerProfileForm customer={profile} />;
}
