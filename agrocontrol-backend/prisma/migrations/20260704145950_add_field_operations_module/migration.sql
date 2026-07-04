-- CreateEnum
CREATE TYPE "FieldOperationType" AS ENUM ('SOWING', 'FERTILIZATION', 'SPRAYING', 'IRRIGATION', 'HARVEST', 'SOIL_WORK', 'MAINTENANCE', 'OTHER');

-- CreateTable
CREATE TABLE "FieldOperation" (
    "id" SERIAL NOT NULL,
    "tenantId" INTEGER NOT NULL DEFAULT 1,
    "farmId" INTEGER NOT NULL,
    "plotId" INTEGER NOT NULL,
    "campaignId" INTEGER,
    "type" "FieldOperationType" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "operationDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "areaWorked" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "laborCost" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "machineryCost" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "otherCost" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalInputCost" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalOperationCost" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FieldOperation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FieldOperationInput" (
    "id" SERIAL NOT NULL,
    "tenantId" INTEGER NOT NULL DEFAULT 1,
    "operationId" INTEGER NOT NULL,
    "itemId" INTEGER NOT NULL,
    "inventoryMovementId" INTEGER,
    "quantity" DOUBLE PRECISION NOT NULL,
    "unitCost" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalCost" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FieldOperationInput_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "FieldOperation" ADD CONSTRAINT "FieldOperation_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FieldOperation" ADD CONSTRAINT "FieldOperation_farmId_fkey" FOREIGN KEY ("farmId") REFERENCES "Farm"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FieldOperation" ADD CONSTRAINT "FieldOperation_plotId_fkey" FOREIGN KEY ("plotId") REFERENCES "Plot"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FieldOperation" ADD CONSTRAINT "FieldOperation_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FieldOperationInput" ADD CONSTRAINT "FieldOperationInput_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FieldOperationInput" ADD CONSTRAINT "FieldOperationInput_operationId_fkey" FOREIGN KEY ("operationId") REFERENCES "FieldOperation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FieldOperationInput" ADD CONSTRAINT "FieldOperationInput_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "InventoryItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FieldOperationInput" ADD CONSTRAINT "FieldOperationInput_inventoryMovementId_fkey" FOREIGN KEY ("inventoryMovementId") REFERENCES "InventoryMovement"("id") ON DELETE SET NULL ON UPDATE CASCADE;
