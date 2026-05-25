export interface Alert {
  id: number;
  machineName: string;
  type:
    | "LOW_FUEL"
    | "HIGH_TEMPERATURE"
    | "HIGH_SPEED"
    | "OFFLINE";
  severity:
    | "LOW"
    | "MEDIUM"
    | "HIGH"
    | "CRITICAL";
  message: string;
  resolved: boolean;
  createdAt: string;
}