import { useEffect, useMemo, useState } from "react";

import {
  getAlerts,
  resolveAlert,
} from "../services/machineService";

import type { Alert } from "../types/alert";

import {
  translations,
  type Language,
} from "../i18n/translations";

const severities = [
  "ALL",
  "LOW",
  "MEDIUM",
  "HIGH",
  "CRITICAL",
];

const getSeverityLabel = (
  severity: string,
) => {
  if (severity === "LOW") return "Baja";
  if (severity === "MEDIUM") return "Media";
  if (severity === "HIGH") return "Alta";
  if (severity === "CRITICAL") return "Crítica";

  return "Todas";
};

const getTypeLabel = (type: string) => {
  if (type === "LOW_FUEL") {
    return "Combustible bajo";
  }

  if (type === "HIGH_TEMPERATURE") {
    return "Temperatura elevada";
  }

  if (type === "HIGH_SPEED") {
    return "Velocidad elevada";
  }

  if (type === "OFFLINE") {
    return "Sin conexión";
  }

  return type;
};

export default function Alerts() {
  const [alerts, setAlerts] =
    useState<Alert[]>([]);

  const [severityFilter, setSeverityFilter] =
    useState("ALL");

    const language: Language = "es";

    const t = translations[language].alerts;

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

  const filteredAlerts = useMemo(() => {
    if (severityFilter === "ALL") {
      return alerts;
    }

    return alerts.filter(
      (alert) =>
        alert.severity === severityFilter,
    );
  }, [alerts, severityFilter]);

  const openAlerts = alerts.filter(
    (alert) => !alert.resolved,
  );

  const getSeverityClass = (
    severity: string,
  ) => {
    if (severity === "CRITICAL") {
      return "bg-red-500/10 text-red-400 border-red-500/30";
    }

    if (severity === "HIGH") {
      return "bg-orange-500/10 text-orange-400 border-orange-500/30";
    }

    if (severity === "MEDIUM") {
      return "bg-yellow-500/10 text-yellow-400 border-yellow-500/30";
    }

    return "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
  };

  return (
    <div className="space-y-6">
      <div
        className="
          flex
          flex-col
          md:flex-row
          md:items-center
          md:justify-between
          gap-4
        "
      >
        <div>
          <h1 className="text-3xl font-bold">
            {t.title}
          </h1>

          <p className="text-slate-400 mt-1">
            Monitoreo de incidentes operativos por maquinaria, sensores y telemetría.
          </p>
        </div>

        <div className="text-sm text-slate-400">
          Alertas abiertas:{" "}
          <span className="text-red-400 font-semibold">
            {openAlerts.length}
          </span>
        </div>
      </div>

      <div
        className="
          grid
          grid-cols-1
          md:grid-cols-3
          gap-6
        "
      >
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <p className="text-sm text-slate-400">
            Total de alertas
          </p>

          <h2 className="text-3xl font-bold mt-2">
            {alerts.length}
          </h2>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <p className="text-sm text-slate-400">
            Alertas abiertas
          </p>

          <h2 className="text-3xl font-bold mt-2 text-red-400">
            {openAlerts.length}
          </h2>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <p className="text-sm text-slate-400">
            Críticas abiertas
          </p>

          <h2 className="text-3xl font-bold mt-2 text-red-400">
            {
              openAlerts.filter(
                (alert) =>
                  alert.severity === "CRITICAL",
              ).length
            }
          </h2>
        </div>
      </div>

      <div
        className="
          bg-slate-900
          border
          border-slate-800
          rounded-2xl
          p-6
          flex
          flex-col
          md:flex-row
          md:items-center
          md:justify-between
          gap-4
        "
      >
        <div>
          <h2 className="text-xl font-semibold">
            Filtros
          </h2>

          <p className="text-sm text-slate-400 mt-1">
            Filtra alertas por severidad.
          </p>
        </div>

        <select
          value={severityFilter}
          onChange={(event) =>
            setSeverityFilter(
              event.target.value,
            )
          }
          className="
            rounded-xl
            bg-slate-950
            border
            border-slate-800
            px-4
            py-3
            outline-none
            focus:border-emerald-500
          "
        >
          {severities.map((severity) => (
            <option
              key={severity}
              value={severity}
            >
              {getSeverityLabel(severity)}
            </option>
          ))}
        </select>
      </div>

      <div
        className="
          bg-slate-900
          border
          border-slate-800
          rounded-2xl
          overflow-hidden
        "
      >
        <div className="p-6 border-b border-slate-800">
          <h2 className="text-xl font-semibold">
            Historial de alertas
          </h2>

          <p className="text-sm text-slate-400 mt-1">
            Eventos detectados automáticamente por el sistema IoT.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-950 text-slate-400">
              <tr>
                <th className="text-left px-6 py-4">
                  ID
                </th>

                <th className="text-left px-6 py-4">
                  Maquinaria
                </th>

                <th className="text-left px-6 py-4">
                  Tipo
                </th>

                <th className="text-left px-6 py-4">
                  Severidad
                </th>

                <th className="text-left px-6 py-4">
                  Estado
                </th>

                <th className="text-left px-6 py-4">
                  Mensaje
                </th>

                <th className="text-right px-6 py-4">
                  Acciones
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredAlerts.map((alert) => (
                <tr
                  key={alert.id}
                  className="
                    border-t
                    border-slate-800
                    hover:bg-slate-800/40
                    transition
                  "
                >
                  <td className="px-6 py-4 text-slate-400">
                    #{alert.id}
                  </td>

                  <td className="px-6 py-4 font-semibold">
                    {alert.machineName}
                  </td>

                  <td className="px-6 py-4 text-slate-300">
                    {getTypeLabel(alert.type)}
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`
                        px-3
                        py-1
                        rounded-full
                        text-xs
                        border
                        ${getSeverityClass(
                          alert.severity,
                        )}
                      `}
                    >
                      {getSeverityLabel(
                        alert.severity,
                      )}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={
                        alert.resolved
                          ? "text-emerald-400"
                          : "text-red-400"
                      }
                    >
                      {alert.resolved
                        ? "Resuelta"
                        : "Abierta"}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-slate-300">
                    {alert.message}
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex justify-end">
                      {!alert.resolved ? (
                        <button
                          onClick={() =>
                            handleResolve(
                              alert.id,
                            )
                          }
                          className="
                            px-4
                            py-2
                            rounded-lg
                            bg-emerald-500
                            hover:bg-emerald-400
                            text-slate-950
                            font-semibold
                            transition
                          "
                        >
                          Resolver
                        </button>
                      ) : (
                        <span className="text-slate-500">
                          —
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}

              {filteredAlerts.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="
                      px-6
                      py-10
                      text-center
                      text-slate-400
                    "
                  >
                    No hay alertas para el filtro seleccionado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}