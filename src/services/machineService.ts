import type { TelemetryData } from "../types/telemetry";

function getAuthHeaders() {
  const preferredKeys = [
    "agrocontrol_token",
    "token",
    "access_token",
    "accessToken",
    "jwt",
  ];

  let token = "";

  for (const key of preferredKeys) {
    const value = localStorage.getItem(key);

    if (value && value.split(".").length === 3) {
      token = value;
      break;
    }

    if (value) {
      try {
        const parsed = JSON.parse(value);

        const possibleToken =
          parsed?.token ||
          parsed?.accessToken ||
          parsed?.access_token ||
          parsed?.jwt;

        if (
          possibleToken &&
          possibleToken.split(".").length === 3
        ) {
          token = possibleToken;
          break;
        }
      } catch {
        // No es JSON, se ignora.
      }
    }
  }

  if (!token) {
    console.error(
      "No se encontró un token JWT válido en localStorage.",
    );
  }

  return {
    Authorization: token ? `Bearer ${token}` : "",
    "Content-Type": "application/json",
  };
}

interface CreateMachinePayload {
  name: string;
  lat: number;
  lng: number;
  fuel: number;
  temperature: number;
  speed: number;
  active: boolean;
}

interface CreateFarmPayload {
  name: string;
  location?: string;
  area?: number;
}

interface CreatePlotPayload {
  farmId: number;
  name: string;
  area?: number;
  crop?: string;
  status?: string;
  soilType?: string;
  lastActivity?: string;
}

interface CreateCropPayload {
  plotId: number;
  campaignId?: number;
  name: string;
  variety?: string;
  sowingDate?: string;
  expectedHarvest?: string;
  status?: string;
}

export async function getMachines() {
  const response = await fetch(
    "http://localhost:4000/machines",
    {
      headers: getAuthHeaders(),
    },
  );

  if (!response.ok) {
    throw new Error(
      "Error al obtener maquinaria",
    );
  }

  return response.json();
}

export async function createMachine(
  payload: CreateMachinePayload,
) {
  const response = await fetch(
    "http://localhost:4000/machines",
    {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    },
  );

  if (!response.ok) {
    throw new Error(
      "Error al crear maquinaria",
    );
  }

  return response.json();
}

export async function deleteMachine(
  id: number,
) {
  const response = await fetch(
    `http://localhost:4000/machines/${id}`,
    {
      method: "DELETE",
      headers: getAuthHeaders(),
    },
  );

  if (!response.ok) {
    throw new Error(
      "Error al eliminar maquinaria",
    );
  }

  return response.json();
}

export async function getAlerts() {
  const response = await fetch(
    "http://localhost:4000/alerts",
    {
      headers: getAuthHeaders(),
    },
  );

  if (!response.ok) {
    throw new Error(
      "Error al obtener alertas",
    );
  }

  return response.json();
}

export async function resolveAlert(
  id: number,
) {
  const response = await fetch(
    `http://localhost:4000/alerts/${id}/resolve`,
    {
      method: "PATCH",
      headers: getAuthHeaders(),
    },
  );

  if (!response.ok) {
    throw new Error(
      "Error al resolver alerta",
    );
  }

  return response.json();
}

export async function getTelemetry(): Promise<
  TelemetryData[]
> {
  const response = await fetch(
    "http://localhost:4000/telemetry",
    {
      headers: getAuthHeaders(),
    },
  );

  if (!response.ok) {
    throw new Error(
      "Error al obtener telemetría",
    );
  }

  return response.json();
}

export async function getTelemetryByMachine(
  machineName: string,
): Promise<TelemetryData[]> {
  const response = await fetch(
    `http://localhost:4000/telemetry/${machineName}`,
    {
      headers: getAuthHeaders(),
    },
  );

  if (!response.ok) {
    throw new Error(
      "Error al obtener historial de telemetría",
    );
  }

  return response.json();
}

export async function getFarms() {
  const response = await fetch(
    "http://localhost:4000/farms",
    {
      headers: getAuthHeaders(),
    },
  );

  if (!response.ok) {
    throw new Error(
      "Error al obtener campos",
    );
  }

  return response.json();
}

export async function createFarm(
  payload: CreateFarmPayload,
) {
  const response = await fetch(
    "http://localhost:4000/farms",
    {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    },
  );

  if (!response.ok) {
    throw new Error(
      "Error al crear campo",
    );
  }

  return response.json();
}

export async function deleteFarm(id: number) {
  const response = await fetch(
    `http://localhost:4000/farms/${id}`,
    {
      method: "DELETE",
      headers: getAuthHeaders(),
    },
  );

  if (!response.ok) {
    throw new Error(
      "Error al eliminar campo",
    );
  }

  return response.json();
}

export async function getPlots() {
  const response = await fetch(
    "http://localhost:4000/plots",
    {
      headers: getAuthHeaders(),
    },
  );

  if (!response.ok) {
    throw new Error(
      "Error al obtener lotes",
    );
  }

  return response.json();
}

export async function createPlot(
  payload: CreatePlotPayload,
) {
  const response = await fetch(
    "http://localhost:4000/plots",
    {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    },
  );

  if (!response.ok) {
    throw new Error(
      "Error al crear lote",
    );
  }

  return response.json();
}

export async function deletePlot(id: number) {
  const response = await fetch(
    `http://localhost:4000/plots/${id}`,
    {
      method: "DELETE",
      headers: getAuthHeaders(),
    },
  );

  if (!response.ok) {
    throw new Error(
      "Error al eliminar lote",
    );
  }

  return response.json();
}

export async function getCrops() {
  const response = await fetch(
    "http://localhost:4000/crops",
    {
      headers: getAuthHeaders(),
    },
  );

  if (!response.ok) {
    throw new Error(
      "Error al obtener cultivos",
    );
  }

  return response.json();
}

export async function createCrop(
  payload: CreateCropPayload,
) {
  const response = await fetch(
    "http://localhost:4000/crops",
    {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    },
  );

  if (!response.ok) {
    throw new Error(
      "Error al crear cultivo",
    );
  }

  return response.json();
}

export async function deleteCrop(id: number) {
  const response = await fetch(
    `http://localhost:4000/crops/${id}`,
    {
      method: "DELETE",
      headers: getAuthHeaders(),
    },
  );

  if (!response.ok) {
    throw new Error(
      "Error al eliminar cultivo",
    );
  }

  return response.json();
}

interface CreateHarvestPayload {
  cropId: number;
  harvestDate?: string;
  totalProduction: number;
  harvestedArea: number;
  yieldPerHectare: number;
  unit?: string;
  campaign?: string;
  observations?: string;
}

export async function getHarvests() {
  const response = await fetch(
    "http://localhost:4000/harvests",
    {
      headers: getAuthHeaders(),
    },
  );

  if (!response.ok) {
    throw new Error(
      "Error al obtener cosechas",
    );
  }

  return response.json();
}

export async function createHarvest(
  payload: CreateHarvestPayload,
) {
  const response = await fetch(
    "http://localhost:4000/harvests",
    {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    },
  );

  if (!response.ok) {
    throw new Error(
      "Error al crear cosecha",
    );
  }

  return response.json();
}

export async function deleteHarvest(id: number) {
  const response = await fetch(
    `http://localhost:4000/harvests/${id}`,
    {
      method: "DELETE",
      headers: getAuthHeaders(),
    },
  );

  if (!response.ok) {
    throw new Error(
      "Error al eliminar cosecha",
    );
  }

  return response.json();
}


interface CreateCampaignPayload {
  name: string;
  startDate?: string;
  endDate?: string;
  description?: string;
  active?: boolean;
  salePricePerTon?: number;
}

export async function getCampaigns() {
  const response = await fetch(
    "http://localhost:4000/campaigns",
    {
      headers: getAuthHeaders(),
    },
  );

  if (!response.ok) {
    throw new Error(
      "Error al obtener campañas",
    );
  }

  return response.json();
}

export async function createCampaign(
  payload: CreateCampaignPayload,
) {
  const response = await fetch(
    "http://localhost:4000/campaigns",
    {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    },
  );

  if (!response.ok) {
    throw new Error(
      "Error al crear campaña",
    );
  }

  return response.json();
}

export async function updateCampaign(
  id: number,
  payload: Partial<CreateCampaignPayload>,
) {
  const response = await fetch(
    `http://localhost:4000/campaigns/${id}`,
    {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    },
  );

  if (!response.ok) {
    throw new Error(
      "Error al actualizar campaña",
    );
  }

  return response.json();
}

export async function deleteCampaign(id: number) {
  const response = await fetch(
    `http://localhost:4000/campaigns/${id}`,
    {
      method: "DELETE",
      headers: getAuthHeaders(),
    },
  );

  if (!response.ok) {
    throw new Error(
      "Error al eliminar campaña",
    );
  }

  return response.json();
}


interface CreateAgriculturalCostPayload {
  campaignId: number;
  category: string;
  description?: string;
  quantity?: number;
  unitCost: number;
  totalCost?: number;
  costDate?: string;
  supplier?: string;
}

export async function getAgriculturalCosts() {
  const response = await fetch(
    "http://localhost:4000/agricultural-costs",
    {
      headers: getAuthHeaders(),
    },
  );

  if (!response.ok) {
    throw new Error(
      "Error al obtener costos agrícolas",
    );
  }

  return response.json();
}

export async function createAgriculturalCost(
  payload: CreateAgriculturalCostPayload,
) {
  const response = await fetch(
    "http://localhost:4000/agricultural-costs",
    {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    },
  );

  if (!response.ok) {
    throw new Error(
      "Error al crear costo agrícola",
    );
  }

  return response.json();
}

export async function deleteAgriculturalCost(
  id: number,
) {
  const response = await fetch(
    `http://localhost:4000/agricultural-costs/${id}`,
    {
      method: "DELETE",
      headers: getAuthHeaders(),
    },
  );

  if (!response.ok) {
    throw new Error(
      "Error al eliminar costo agrícola",
    );
  }

  return response.json();
}

export async function getAgriculturalProfitability() {
  const response = await fetch(
    "http://localhost:4000/agricultural-costs/profitability",
    {
      headers: getAuthHeaders(),
    },
  );

  if (!response.ok) {
    const errorText = await response.text();

    throw new Error(
      `Error al obtener rentabilidad agrícola. Status: ${response.status}. Respuesta: ${errorText}`,
    );
  }

  return response.json();
}

interface CreateInventoryCategoryPayload {
  name: string;
  description?: string;
}

interface CreateInventoryItemPayload {
  categoryId: number;
  name: string;
  description?: string;
  unit?: string;
  minimumStock?: number;
  averageCost?: number;
}

interface CreateInventoryMovementPayload {
  itemId: number;
  campaignId?: number;
  type: "IN" | "OUT" | "ADJUSTMENT";
  quantity: number;
  unitCost?: number;
  reason?: string;
  supplier?: string;
  createAgriculturalCost?: boolean;
}

export async function getInventoryCategories() {
  const response = await fetch(
    "http://localhost:4000/inventory/categories",
    {
      headers: getAuthHeaders(),
    },
  );

  if (!response.ok) {
    throw new Error(
      "Error al obtener categorías de inventario",
    );
  }

  return response.json();
}

export async function createInventoryCategory(
  payload: CreateInventoryCategoryPayload,
) {
  const response = await fetch(
    "http://localhost:4000/inventory/categories",
    {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    },
  );

  if (!response.ok) {
    throw new Error(
      "Error al crear categoría de inventario",
    );
  }

  return response.json();
}

export async function deleteInventoryCategory(
  id: number,
) {
  const response = await fetch(
    `http://localhost:4000/inventory/categories/${id}`,
    {
      method: "DELETE",
      headers: getAuthHeaders(),
    },
  );

  if (!response.ok) {
    throw new Error(
      "Error al eliminar categoría de inventario",
    );
  }

  return response.json();
}

export async function getInventoryItems() {
  const response = await fetch(
    "http://localhost:4000/inventory/items",
    {
      headers: getAuthHeaders(),
    },
  );

  if (!response.ok) {
    throw new Error(
      "Error al obtener insumos de inventario",
    );
  }

  return response.json();
}

export async function createInventoryItem(
  payload: CreateInventoryItemPayload,
) {
  const response = await fetch(
    "http://localhost:4000/inventory/items",
    {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    },
  );

  if (!response.ok) {
    throw new Error(
      "Error al crear insumo de inventario",
    );
  }

  return response.json();
}

export async function deleteInventoryItem(
  id: number,
) {
  const response = await fetch(
    `http://localhost:4000/inventory/items/${id}`,
    {
      method: "DELETE",
      headers: getAuthHeaders(),
    },
  );

  if (!response.ok) {
    throw new Error(
      "Error al eliminar insumo de inventario",
    );
  }

  return response.json();
}

export async function getInventoryMovements() {
  const response = await fetch(
    "http://localhost:4000/inventory/movements",
    {
      headers: getAuthHeaders(),
    },
  );

  if (!response.ok) {
    throw new Error(
      "Error al obtener movimientos de inventario",
    );
  }

  return response.json();
}

export async function createInventoryMovement(
  payload: CreateInventoryMovementPayload,
) {
  const response = await fetch(
    "http://localhost:4000/inventory/movements",
    {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    },
  );

  if (!response.ok) {
    throw new Error(
      "Error al crear movimiento de inventario",
    );
  }

  return response.json();
}

interface CreateFieldOperationPayload {
  farmId: number;
  plotId: number;
  campaignId?: number;
  type:
    | "SOWING"
    | "FERTILIZATION"
    | "SPRAYING"
    | "IRRIGATION"
    | "HARVEST"
    | "SOIL_WORK"
    | "MAINTENANCE"
    | "OTHER";

  title: string;
  description?: string;
  operationDate?: string;

  areaWorked?: number;

  laborCost?: number;
  machineryCost?: number;
  otherCost?: number;

  inputs?: {
    itemId: number;
    quantity: number;
    unitCost?: number;
  }[];
}

export async function getFieldOperations() {
  const response = await fetch(
    "http://localhost:4000/field-operations",
    {
      headers: getAuthHeaders(),
    },
  );

  if (!response.ok) {
    throw new Error(
      "Error al obtener labores agrícolas",
    );
  }

  return response.json();
}

export async function createFieldOperation(
  payload: CreateFieldOperationPayload,
) {
  const response = await fetch(
    "http://localhost:4000/field-operations",
    {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    },
  );

  if (!response.ok) {
    throw new Error(
      "Error al crear labor agrícola",
    );
  }

  return response.json();
}

export async function deleteFieldOperation(
  id: number,
) {
  const response = await fetch(
    `http://localhost:4000/field-operations/${id}`,
    {
      method: "DELETE",
      headers: getAuthHeaders(),
    },
  );

  if (!response.ok) {
    throw new Error(
      "Error al eliminar labor agrícola",
    );
  }

  return response.json();
}

interface CreatePlanningTaskPayload {
  farmId: number;
  plotId: number;
  campaignId?: number;
  machineId?: number;
  title: string;
  description?: string;
  operationType:
    | "SOWING"
    | "FERTILIZATION"
    | "SPRAYING"
    | "IRRIGATION"
    | "HARVEST"
    | "SOIL_WORK"
    | "MAINTENANCE"
    | "OTHER";
  status?:
    | "PLANNED"
    | "IN_PROGRESS"
    | "COMPLETED"
    | "CANCELLED"
    | "POSTPONED";
  priority?:
    | "LOW"
    | "MEDIUM"
    | "HIGH"
    | "CRITICAL";
  plannedDate: string;
  estimatedArea?: number;
  estimatedDuration?: number;
  estimatedCost?: number;
  assignedOperator?: string;
  notes?: string;
}

export async function getPlanningConflicts() {
  const response = await fetch(
    "http://localhost:4000/planning-tasks/conflicts",
    {
      headers: getAuthHeaders(),
    },
  );

  if (!response.ok) {
    throw new Error(
      "Error al obtener conflictos de planificación",
    );
  }

  return response.json();
}

export async function getPlanningTasks() {
  const response = await fetch(
    "http://localhost:4000/planning-tasks",
    {
      headers: getAuthHeaders(),
    },
  );

  if (!response.ok) {
    throw new Error(
      "Error al obtener tareas planificadas",
    );
  }

  return response.json();
}

export async function createPlanningTask(
  payload: CreatePlanningTaskPayload,
) {
  const response = await fetch(
    "http://localhost:4000/planning-tasks",
    {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    },
  );

  if (!response.ok) {
    throw new Error(
      "Error al crear tarea planificada",
    );
  }

  return response.json();
}

export async function updatePlanningTaskStatus(
  id: number,
  status:
    | "PLANNED"
    | "IN_PROGRESS"
    | "COMPLETED"
    | "CANCELLED"
    | "POSTPONED",
) {
  const response = await fetch(
    `http://localhost:4000/planning-tasks/${id}/status`,
    {
      method: "PATCH",
      headers: getAuthHeaders(),
      body: JSON.stringify({ status }),
    },
  );

  if (!response.ok) {
    throw new Error(
      "Error al actualizar estado de planificación",
    );
  }

  return response.json();
}

export async function deletePlanningTask(id: number) {
  const response = await fetch(
    `http://localhost:4000/planning-tasks/${id}`,
    {
      method: "DELETE",
      headers: getAuthHeaders(),
    },
  );

  if (!response.ok) {
    throw new Error(
      "Error al eliminar tarea planificada",
    );
  }

  return response.json();
}


export async function executePlanningTask(
  id: number,
) {
  const response = await fetch(
    `http://localhost:4000/planning-tasks/${id}/execute`,
    {
      method: "PATCH",
      headers: getAuthHeaders(),
    },
  );

  if (!response.ok) {
    throw new Error(
      "Error al ejecutar la planificación",
    );
  }

  return response.json();
}

export async function getOperationsCenterOverview() {
  const response = await fetch(
    "http://localhost:4000/operations-center/overview",
    {
      headers: getAuthHeaders(),
    },
  );

  if (!response.ok) {
    throw new Error(
      "Error al obtener el Centro de Operaciones",
    );
  }

  return response.json();
}