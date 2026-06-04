-- CreateTable
CREATE TABLE "Harvest" (
    "id" SERIAL NOT NULL,
    "tenantId" INTEGER NOT NULL DEFAULT 1,
    "cropId" INTEGER NOT NULL,
    "harvestDate" TIMESTAMP(3),
    "totalProduction" DOUBLE PRECISION NOT NULL,
    "harvestedArea" DOUBLE PRECISION NOT NULL,
    "yieldPerHectare" DOUBLE PRECISION NOT NULL,
    "unit" TEXT NOT NULL DEFAULT 'tn',
    "campaign" TEXT,
    "observations" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Harvest_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Harvest" ADD CONSTRAINT "Harvest_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Harvest" ADD CONSTRAINT "Harvest_cropId_fkey" FOREIGN KEY ("cropId") REFERENCES "Crop"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
