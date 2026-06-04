import { useEffect, useMemo, useState } from "react";

import KpiCard from "../components/dashboard/KpiCard";

import ProductionChart from "../components/charts/ProductionChart";

import RecentActivity from "../components/tables/RecentActivity";

import FarmMap from "../components/maps/FarmMap";

import MachineTelemetry from "../components/dashboard/MachineTelemetry";

import TelemetryChart from "../components/charts/TelemetryChart";

import { useIoTStore } from "../store/iotStore";

import {
  getAlerts,
  getCrops,
  getFarms,
  getHarvests,
  getPlots,
  resolveAlert,
} from "../services/machineService";

import type { Alert } from "../types/alert";

interface Farm {
  id: number;
  name: string;
}

interface Plot {
  id: number;
  name: string;
}

interface Crop {
  id: number;
  name: string;
  status?: string;
}

interface Harvest {
  id: number;
  totalProduction: number;
  harvestedArea: number;
  yieldPerHectare: number;
  unit: string;
  campaign?: string;
  crop?: {
    name: string;
    plot?: {
      name: string;
      farm?: {
        name: string;
      };
    };
  };
}

export default function Dashboard() {
  const machines = useIoTStore(
    (state) => state.machines,
  );

  const loadInitialMachines =
    useIoTStore(
      (state) =>
        state.loadInitialMachines,
    );

  const [savedAlerts, setSavedAlerts] =
    useState<Alert[]>([]);

  const [farms, setFarms] =
    useState<Farm[]>([]);

  const [plots, setPlots] =
    useState<Plot[]>([]);

  const [crops, setCrops] =
    useState<Crop[]>([]);

  const [harvests, setHarvests] =
    useState<Harvest[]>([]);

  useEffect(() => {
    loadAlerts();

    loadAgriculturalData();

    loadInitialMachines();
  }, []);

  const loadAlerts = async () => {
    try {
      const data = await getAlerts();

      setSavedAlerts(data);
    } catch (error) {
      console.error(error);
    }
  };

  const loadAgriculturalData =
    async () => {
      try {
        const [
          farmsData,
          plotsData,
          cropsData,
          harvestsData,
        ] = await Promise.all([
          getFarms(),
          getPlots(),
          getCrops(),
          getHarvests(),
        ]);

        setFarms(farmsData);
        setPlots(plotsData);
        setCrops(cropsData);
        setHarvests(harvestsData);
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

  const activeMachines =
    machines.filter(
      (machine) => machine.active,
    ).length;

  const averageFuel =
    machines.length > 0
      ? (
          machines.reduce(
            (acc, machine) =>
              acc + machine.fuel,
            0,
          ) / machines.length
        ).toFixed(0)
      : "0";

  const openAlerts =
    savedAlerts.filter(
      (alert) => !alert.resolved,
    ).length;

  const activeCrops =
    crops.filter(
      (crop) =>
        crop.status !== "Finalizado",
    ).length;

  const totalProduction =
    harvests.reduce(
      (acc, harvest) =>
        acc + harvest.totalProduction,
      0,
    );

  const averageYield =
    harvests.length > 0
      ? (
          harvests.reduce(
            (acc, harvest) =>
              acc +
              harvest.yieldPerHectare,
            0,
          ) / harvests.length
        ).toFixed(2)
      : "0";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          Dashboard Agrícola
        </h1>

        <p className="text-slate-400 mt-1">
          Monitoreo general de operaciones, maquinaria, cultivos y producción.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <KpiCard
          title="Campos"
          value={farms.length.toString()}
        />

        <KpiCard
          title="Lotes"
          value={plots.length.toString()}
        />

        <KpiCard
          title="Cultivos Activos"
          value={activeCrops.toString()}
        />

        <KpiCard
          title="Cosechas"
          value={harvests.length.toString()}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <KpiCard
          title="Producción Total"
          value={`${totalProduction.toFixed(
            0,
          )} tn`}
        />

        <KpiCard
          title="Rendimiento Promedio"
          value={`${averageYield} tn/ha`}
        />

        <KpiCard
          title="Combustible Promedio"
          value={`${averageFuel}%`}
        />

        <KpiCard
          title="Alertas Abiertas"
          value={openAlerts.toString()}
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
            <FarmMap />
          </div>

          <MachineTelemetry />
        </div>
      </div>

      <TelemetryChart data={machines} />

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
            Producción y Rendimiento
          </h2>

          <p className="text-sm text-slate-400 mt-1">
            Resumen de cosechas registradas por campo, lote y cultivo.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-950 text-slate-400">
              <tr>
                <th className="text-left px-6 py-4">
                  Campo
                </th>

                <th className="text-left px-6 py-4">
                  Lote
                </th>

                <th className="text-left px-6 py-4">
                  Cultivo
                </th>

                <th className="text-left px-6 py-4">
                  Campaña
                </th>

                <th className="text-left px-6 py-4">
                  Producción
                </th>

                <th className="text-left px-6 py-4">
                  Rendimiento
                </th>
              </tr>
            </thead>

            <tbody>
              {harvests.map((harvest) => (
                <tr
                  key={harvest.id}
                  className="
                    border-t
                    border-slate-800
                    hover:bg-slate-800/40
                    transition
                  "
                >
                  <td className="px-6 py-4 font-semibold">
                    {harvest.crop?.plot?.farm
                      ?.name || "-"}
                  </td>

                  <td className="px-6 py-4 text-slate-300">
                    {harvest.crop?.plot
                      ?.name || "-"}
                  </td>

                  <td className="px-6 py-4 text-slate-300">
                    {harvest.crop?.name || "-"}
                  </td>

                  <td className="px-6 py-4 text-slate-300">
                    {harvest.campaign || "-"}
                  </td>

                  <td className="px-6 py-4 text-emerald-400 font-semibold">
                    {harvest.totalProduction.toFixed(
                      0,
                    )}{" "}
                    {harvest.unit}
                  </td>

                  <td className="px-6 py-4 text-slate-300">
                    {harvest.yieldPerHectare.toFixed(
                      2,
                    )}{" "}
                    tn/ha
                  </td>
                </tr>
              ))}

              {harvests.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="
                      px-6
                      py-10
                      text-center
                      text-slate-400
                    "
                  >
                    No hay cosechas registradas.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

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
            {savedAlerts.slice(0, 6).map(
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
          {machines.map((machine) => (
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
                  Velocidad:{" "}
                  {machine.speed.toFixed(0)}{" "}
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
                  ⛽{" "}
                  {machine.fuel.toFixed(0)}
                  %
                </span>

                <span>
                  🌡️{" "}
                  {machine.temperature.toFixed(
                    0,
                  )}
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
          ))}
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