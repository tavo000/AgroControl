import type { TelemetryData } from "../types/telemetry";

function getAuthHeaders() {
  const token = localStorage.getItem(
    "agrocontrol_token",
  );

  return {
    Authorization: `Bearer ${token}`,
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