import { revalidatePath } from "next/cache";

export function revalidateCustomerSurfaces(customerId?: string) {
  revalidatePath("/");
  revalidatePath("/customers");
  revalidatePath("/pipeline");

  if (customerId) {
    revalidatePath(`/customers/${customerId}`);
  }
}
