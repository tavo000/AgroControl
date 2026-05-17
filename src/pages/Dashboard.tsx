import KpiCard from "../components/dashboard/KpiCard";

import ProductionChart from "../components/charts/ProductionChart";

import RecentActivity from "../components/tables/RecentActivity";

import FarmMap from "../components/maps/FarmMap";

import MachineTelemetry from "../components/dashboard/MachineTelemetry";

import TelemetryChart from "../components/charts/TelemetryChart";

import { useIoTStore } from "../store/iotStore";

export default function Dashboard() {
  const { machines } = useIoTStore();

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
          value="18"
        />

        <KpiCard
          title="Alertas"
          value="7"
        />
      </div>

      <TelemetryChart data={machines} />

      <div className="grid grid-cols-3 gap-6">
        <div
          className="
            col-span-2
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