-- CreateTable
CREATE TABLE "Tenant" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Tenant_pkey" PRIMARY KEY ("id")
);

-- SeedDefaultTenant
INSERT INTO "Tenant" ("id", "name", "active", "createdAt")
VALUES (1, 'AgroControl Demo', true, CURRENT_TIMESTAMP);

-- ResetTenantSequence
SELECT setval(
    pg_get_serial_sequence('"Tenant"', 'id'),
    1,
    true
);

-- AlterTable
ALTER TABLE "Alert" ADD COLUMN "tenantId" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "Machine" ADD COLUMN "tenantId" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "Telemetry" ADD COLUMN "tenantId" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "User" ADD COLUMN "tenantId" INTEGER NOT NULL DEFAULT 1;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Machine" ADD CONSTRAINT "Machine_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Telemetry" ADD CONSTRAINT "Telemetry_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Alert" ADD CONSTRAINT "Alert_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;