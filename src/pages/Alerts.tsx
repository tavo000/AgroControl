import { useEffect, useState } from "react";

import {
  getAlerts,
  resolveAlert,
} from "../services/machineService";

import type { Alert } from "../types/alert";

export default function Alerts() {
  const [alerts, setAlerts] =
    useState<Alert[]>([]);

  useEffect(() => {
    loadAlerts();
  }, []);

  const loadAlerts = async () => {
    const data = await getAlerts();
    setAlerts(data);
  };

  const handleResolve = async (
    id: number,
  ) => {
    await resolveAlert(id);
    await loadAlerts();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          Alertas IoT
        </h1>

        <p className="text-slate-400 mt-1">
          Gestión de incidentes operativos
        </p>
      </div>

      <div className="space-y-4">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className="
              bg-slate-900
              border
              border-slate-800
              rounded-2xl
              p-6
              flex
              items-center
              justify-between
            "
          >
            <div>
              <h2 className="font-semibold">
                {alert.machineName}
              </h2>

              <p className="text-slate-400 text-sm mt-1">
                {alert.message}
              </p>

              <p className="text-xs text-slate-500 mt-2">
                {alert.type} · {alert.severity}
              </p>
            </div>

            <div className="text-right">
              <p
                className={
                  alert.resolved
                    ? "text-emerald-400"
                    : "text-red-400"
                }
              >
                {alert.resolved
                  ? "Resuelta"
                  : "Activa"}
              </p>

              {!alert.resolved && (
                <button
                  onClick={() =>
                    handleResolve(alert.id)
                  }
                  className="
                    mt-3
                    px-4
                    py-2
                    rounded-xl
                    bg-emerald-500
                    hover:bg-emerald-400
                    text-slate-950
                    font-semibold
                    text-sm
                  "
                >
                  Resolver
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}