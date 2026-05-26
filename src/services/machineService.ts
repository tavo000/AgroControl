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