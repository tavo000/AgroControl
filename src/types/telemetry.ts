export interface TelemetryData {
  id: number;

  machineName: string;

  fuel: number;

  temperature: number;

  speed: number;

  lat: number;

  lng: number;

  active: boolean;

  createdAt: string;
}