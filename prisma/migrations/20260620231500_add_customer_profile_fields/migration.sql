-- CreateEnum
CREATE TYPE "BusinessGroup" AS ENUM ('KE_TOAN', 'MARKETING', 'KHAC');

-- AlterTable
ALTER TABLE "Customer" ADD COLUMN     "businessGroup" "BusinessGroup" NOT NULL DEFAULT 'KHAC',
ADD COLUMN     "serviceType" TEXT,
ADD COLUMN     "contactChannel" TEXT,
ADD COLUMN     "specialNotes" TEXT,
ADD COLUMN     "renewalDate" TIMESTAMP(3),
ADD COLUMN     "packagePrice" DECIMAL(12,2),
ADD COLUMN     "billingCycle" TEXT,
ADD COLUMN     "licenseKey" TEXT;
