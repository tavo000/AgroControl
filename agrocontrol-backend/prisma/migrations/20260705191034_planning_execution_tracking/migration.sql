-- AlterTable
ALTER TABLE "PlanningTask" ADD COLUMN     "actualCost" DOUBLE PRECISION,
ADD COLUMN     "actualDuration" DOUBLE PRECISION,
ADD COLUMN     "actualEndDate" TIMESTAMP(3),
ADD COLUMN     "actualStartDate" TIMESTAMP(3),
ADD COLUMN     "progress" DOUBLE PRECISION NOT NULL DEFAULT 0;
