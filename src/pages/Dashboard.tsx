import { useEffect, useState } from "react";

import KpiCard from "../components/dashboard/KpiCard";

import ProductionChart from "../components/charts/ProductionChart";

import RecentActivity from "../components/tables/RecentActivity";

import FarmMap from "../components/maps/FarmMap";

import MachineTelemetry from "../components/dashboard/MachineTelemetry";

import TelemetryChart from "../components/charts/TelemetryChart";

import { useIoTStore } from "../store/iotStore";

import { getMachines } from "../services/machineService";

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

  useEffect(() => {
    loadMachines();
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
          value="7"
        />
      </div>

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