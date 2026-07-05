-- CreateEnum
CREATE TYPE "FieldOperationStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'PAUSED', 'COMPLETED', 'CANCELLED');

-- AlterTable
ALTER TABLE "FieldOperation" ADD COLUMN     "actualEndDate" TIMESTAMP(3),
ADD COLUMN     "actualStartDate" TIMESTAMP(3),
ADD COLUMN     "assignedOperator" TEXT,
ADD COLUMN     "executionNotes" TEXT,
ADD COLUMN     "fuelConsumed" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "machineHours" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "operatorHours" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "status" "FieldOperationStatus" NOT NULL DEFAULT 'PENDING';
