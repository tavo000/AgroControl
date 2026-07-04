-- CreateEnum
CREATE TYPE "PlanningTaskStatus" AS ENUM ('PLANNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'POSTPONED');

-- CreateEnum
CREATE TYPE "PlanningTaskPriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- AlterTable
ALTER TABLE "FieldOperation" ADD COLUMN     "planningTaskId" INTEGER;

-- CreateTable
CREATE TABLE "PlanningTask" (
    "id" SERIAL NOT NULL,
    "tenantId" INTEGER NOT NULL DEFAULT 1,
    "farmId" INTEGER NOT NULL,
    "plotId" INTEGER NOT NULL,
    "campaignId" INTEGER,
    "machineId" INTEGER,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "operationType" "FieldOperationType" NOT NULL,
    "status" "PlanningTaskStatus" NOT NULL DEFAULT 'PLANNED',
    "priority" "PlanningTaskPriority" NOT NULL DEFAULT 'MEDIUM',
    "plannedDate" TIMESTAMP(3) NOT NULL,
    "estimatedArea" DOUBLE PRECISION,
    "estimatedDuration" DOUBLE PRECISION,
    "estimatedCost" DOUBLE PRECISION,
    "assignedOperator" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlanningTask_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "FieldOperation" ADD CONSTRAINT "FieldOperation_planningTaskId_fkey" FOREIGN KEY ("planningTaskId") REFERENCES "PlanningTask"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlanningTask" ADD CONSTRAINT "PlanningTask_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlanningTask" ADD CONSTRAINT "PlanningTask_farmId_fkey" FOREIGN KEY ("farmId") REFERENCES "Farm"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlanningTask" ADD CONSTRAINT "PlanningTask_plotId_fkey" FOREIGN KEY ("plotId") REFERENCES "Plot"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlanningTask" ADD CONSTRAINT "PlanningTask_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlanningTask" ADD CONSTRAINT "PlanningTask_machineId_fkey" FOREIGN KEY ("machineId") REFERENCES "Machine"("id") ON DELETE SET NULL ON UPDATE CASCADE;
