import { useEffect, useMemo, useState } from "react";

import KpiCard from "../components/dashboard/KpiCard";

import ProductionChart from "../components/charts/ProductionChart";

import RecentActivity from "../components/tables/RecentActivity";

import FarmMap from "../components/maps/FarmMap";

import MachineTelemetry from "../components/dashboard/MachineTelemetry";

import TelemetryChart from "../components/charts/TelemetryChart";

import { useIoTStore } from "../store/iotStore";

import {
  getMachines,
  getAlerts,
  resolveAlert,
} from "../services/machineService";

import type { Alert } from "../types/alert";

interface Machine {
  id: number;
  name: string;
  lat: number;
  lng: number;
  fuel: number;
  temperature: number;
  speed: number;
  active: boolean;
}

export default function Dashboard() {
  const { machines } = useIoTStore();

  const [realMachines, setRealMachines] =
    useState<Machine[]>([]);

  const [savedAlerts, setSavedAlerts] =
    useState<Alert[]>([]);

  useEffect(() => {
    loadMachines();
    loadAlerts();
  }, []);

  const loadMachines = async () => {
    try {
      const data =
        await getMachines();

      setRealMachines(data);
    } catch (error) {
      console.error(error);
    }
  };

  const loadAlerts = async () => {
    try {
      const data =
        await getAlerts();

      setSavedAlerts(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleResolveAlert =
    async (id: number) => {
      try {
        await resolveAlert(id);

        loadAlerts();
      } catch (error) {
        console.error(error);
      }
    };

  const realtimeAlerts = useMemo(() => {
    const machineAlerts: string[] = [];

    machines.forEach((machine) => {
      if (machine.fuel < 25) {
        machineAlerts.push(
          `${machine.name}: combustible bajo`,
        );
      }

      if (machine.temperature > 75) {
        machineAlerts.push(
          `${machine.name}: temperatura elevada`,
        );
      }

      if (
        machine.active &&
        machine.speed > 40
      ) {
        machineAlerts.push(
          `${machine.name}: velocidad excesiva`,
        );
      }
    });

    return machineAlerts;
  }, [machines]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          Dashboard Agrícola
        </h1>

        <p className="text-slate-400 mt-1">
          Monitoreo general de operaciones
        </p>
      </div>

      <div className="grid grid-cols-4 gap-6">
        <KpiCard
          title="Producción"
          value="1.240 tn"
        />

        <KpiCard
          title="Combustible"
          value="12.500 L"
        />

        <KpiCard
          title="Maquinaria Activa"
          value={
            realMachines
              .filter(
                (machine) =>
                  machine.active,
              )
              .length.toString()
          }
        />

        <KpiCard
          title="Alertas"
          value={savedAlerts
            .filter(
              (alert) =>
                !alert.resolved,
            )
            .length.toString()}
        />
      </div>

      {realtimeAlerts.length > 0 && (
        <div
          className="
            bg-red-500/10
            border
            border-red-500/30
            rounded-2xl
            p-6
          "
        >
          <h2 className="text-lg font-semibold text-red-300 mb-4">
            Alertas IoT en tiempo real
          </h2>

          <div className="space-y-2">
            {realtimeAlerts.map(
              (alert, index) => (
                <div
                  key={index}
                  className="
                    text-sm
                    text-red-200
                    bg-red-500/5
                    rounded-lg
                    p-3
                  "
                >
                  {alert}
                </div>
              ),
            )}
          </div>
        </div>
      )}

      {savedAlerts.length > 0 && (
        <div
          className="
            bg-slate-900
            border
            border-slate-800
            rounded-2xl
            p-6
          "
        >
          <h2 className="text-xl font-semibold mb-6">
            Historial de Alertas
          </h2>

          <div className="space-y-3">
            {savedAlerts.map(
              (alert) => (
                <div
                  key={alert.id}
                  className="
                    flex
                    items-center
                    justify-between
                    bg-slate-950
                    border
                    border-slate-800
                    rounded-xl
                    p-4
                  "
                >
                  <div>
                    <h3 className="font-semibold">
                      {alert.machineName}
                    </h3>

                    <p className="text-sm text-slate-400">
                      {alert.message}
                    </p>
                  </div>

                  <div className="text-right">
                    <p
                      className={
                        alert.resolved
                          ? "text-emerald-400 text-sm"
                          : "text-red-400 text-sm"
                      }
                    >
                      {alert.resolved
                        ? "Resuelta"
                        : "Activa"}
                    </p>

                    <p className="text-xs text-slate-500 mt-1 mb-3">
                      {alert.severity}
                    </p>

                    {!alert.resolved && (
                      <button
                        onClick={() =>
                          handleResolveAlert(
                            alert.id,
                          )
                        }
                        className="
                          px-3
                          py-1
                          rounded-lg
                          bg-emerald-500
                          hover:bg-emerald-400
                          text-slate-950
                          text-xs
                          font-semibold
                          transition
                        "
                      >
                        Resolver
                      </button>
                    )}
                  </div>
                </div>
              ),
            )}
          </div>
        </div>
      )}

      <TelemetryChart data={machines} />

      <div
        className="
          grid
          grid-cols-1
          xl:grid-cols-3
          gap-6
        "
      >
        <div
          className="
            xl:col-span-2
            bg-slate-900
            border
            border-slate-800
            rounded-2xl
            h-96
            p-6
          "
        >
          <h2 className="text-xl font-semibold mb-6">
            Producción Mensual
          </h2>

          <ProductionChart />
        </div>

        <div
          className="
            bg-slate-900
            border
            border-slate-800
            rounded-2xl
            h-auto
            p-6
          "
        >
          <h2 className="text-xl font-semibold mb-4">
            Mapa Agrícola
          </h2>

          <div className="h-[300px] mb-4">
            <FarmMap machines={realMachines} />
          </div>

          <MachineTelemetry />
        </div>
      </div>

      <div
        className="
          bg-slate-900
          border
          border-slate-800
          rounded-2xl
          p-6
        "
      >
        <h2 className="text-xl font-semibold mb-6">
          Maquinaria Registrada
        </h2>

        <div className="space-y-4">
          {realMachines.map(
            (machine) => (
              <div
                key={machine.id}
                className="
                  flex
                  items-center
                  justify-between
                  bg-slate-950
                  border
                  border-slate-800
                  rounded-xl
                  p-4
                "
              >
                <div>
                  <h3 className="font-semibold">
                    {machine.name}
                  </h3>

                  <p className="text-sm text-slate-400">
                    Velocidad:
                    {" "}
                    {machine.speed}
                    {" "}
                    km/h
                  </p>
                </div>

                <div
                  className="
                    flex
                    items-center
                    gap-4
                    text-sm
                  "
                >
                  <span>
                    ⛽
                    {" "}
                    {machine.fuel}
                    %
                  </span>

                  <span>
                    🌡️
                    {" "}
                    {machine.temperature}
                    °C
                  </span>

                  <span
                    className={
                      machine.active
                        ? "text-emerald-400"
                        : "text-red-400"
                    }
                  >
                    {machine.active
                      ? "Activa"
                      : "Inactiva"}
                  </span>
                </div>
              </div>
            ),
          )}
        </div>
      </div>

      <div
        className="
          bg-slate-900
          border
          border-slate-800
          rounded-2xl
          p-6
        "
      >
        <RecentActivity />
      </div>
    </div>
  );
}