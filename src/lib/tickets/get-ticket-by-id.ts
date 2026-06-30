import { type BusinessGroup, type PipelineStatus, TicketPriority } from "@/generated/prisma/client";
import { activeCustomersWhere } from "@/lib/db-helpers";
import { db } from "@/lib/db";

export type TicketDetail = {
  id: string;
  title: string;
  priority: TicketPriority;
  closedAt: Date | null;
  createdAt: Date;
  customer: {
    id: string;
    name: string;
    source: string;
    businessGroup: BusinessGroup;
    pipelineStatus: PipelineStatus;
    licenseKey: string | null;
  };
};

export async function getTicketById(id: string): Promise<TicketDetail | null> {
  return db.ticket.findFirst({
    where: {
      id,
      customer: activeCustomersWhere,
    },
    select: {
      id: true,
      title: true,
      priority: true,
      closedAt: true,
      createdAt: true,
      customer: {
        select: {
          id: true,
          name: true,
          source: true,
          businessGroup: true,
          pipelineStatus: true,
          licenseKey: true,
        },
      },
    },
  });
}
