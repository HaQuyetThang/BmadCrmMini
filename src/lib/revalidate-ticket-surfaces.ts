import { revalidatePath } from "next/cache";

export function revalidateTicketSurfaces(customerId?: string) {
  revalidatePath("/");
  revalidatePath("/tickets");

  if (customerId) {
    revalidatePath(`/customers/${customerId}`);
  }
}

export function revalidateTicketDetail(ticketId: string, customerId?: string) {
  revalidatePath(`/tickets/${ticketId}`);
  revalidateTicketSurfaces(customerId);
}
