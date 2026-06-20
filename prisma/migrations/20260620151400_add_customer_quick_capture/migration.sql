-- CreateEnum
CREATE TYPE "PipelineStatus" AS ENUM ('LEAD_MOI', 'DANG_TU_VAN');

-- CreateTable
CREATE TABLE "Customer" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "source" TEXT NOT NULL DEFAULT 'Zalo',
    "firstMessage" TEXT,
    "pipelineStatus" "PipelineStatus" NOT NULL DEFAULT 'LEAD_MOI',
    "statusChangedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("id")
);
