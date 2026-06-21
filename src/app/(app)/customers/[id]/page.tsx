import { notFound } from "next/navigation";

import {
  CustomerProfileForm,
  type CustomerProfileData,
} from "@/components/customers/customer-profile-form";
import { getCustomerById } from "@/lib/customers/list-customers";

type CustomerDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function CustomerDetailPage({ params }: CustomerDetailPageProps) {
  const { id } = await params;
  const customer = await getCustomerById(id);

  if (!customer) {
    notFound();
  }

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
  };

  return <CustomerProfileForm customer={profile} />;
}
