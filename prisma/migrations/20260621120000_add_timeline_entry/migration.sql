-- CreateEnum
CREATE TYPE "TimelineType" AS ENUM ('ZALO', 'CALL', 'TICKET', 'NOTE');

-- AlterTable
ALTER TABLE "Customer" ADD COLUMN "lastInteractionAt" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "TimelineEntry" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "type" "TimelineType" NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TimelineEntry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TimelineEntry_customerId_createdAt_idx" ON "TimelineEntry"("customerId", "createdAt" DESC);

-- AddForeignKey
ALTER TABLE "TimelineEntry" ADD CONSTRAINT "TimelineEntry_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;
