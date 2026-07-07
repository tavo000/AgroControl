import { useEffect, useState } from "react";

import {
  AlertTriangle,
  Boxes,
  CircleDollarSign,
  ClipboardList,
  RadioTower,
  Tractor,
  Wheat,
} from "lucide-react";

import { getOperationsCenterOverview } from "../services/machineService";
import FarmMap from "../components/maps/FarmMap";
import LiveEventsPanel from "../components/dashboard/LiveEventsPanel";

interface OperationsOverview {
  planning: {
    pending: number;
    inProgress: number;
    completedToday: number;
  };
  fieldOperations: {
    running: number;
    finishedToday: number;
  };
  inventory: {
    lowStock: number;
  };
  alerts: {
    critical: number;
    high: number;
  };
  machines: {
    active: number;
    offline: number;
  };
  financial: {
    todayCost: number;
  };
}

export default function OperationsCenter() {
  const [overview, setOverview] =
    useState<OperationsOverview | null>(null);

  useEffect(() => {
    loadOverview();
  }, []);

  const loadOverview = async () => {
    const data = await getOperationsCenterOverview();

    setOverview(data);
  };

  const cards = [
    {
      title: "Tareas pendientes",
      value: overview?.planning.pending ?? 0,
      icon: ClipboardList,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
    },
    {
      title: "Labores en ejecución",
      value: overview?.fieldOperations.running ?? 0,
      icon: Wheat,
      color: "text-cyan-400",
      bg: "bg-cyan-500/10",
    },
    {
      title: "Máquinas activas",
      value: overview?.machines.active ?? 0,
      icon: Tractor,
      color: "text-violet-400",
      bg: "bg-violet-500/10",
    },
    {
      title: "Alertas críticas",
      value: overview?.alerts.critical ?? 0,
      icon: AlertTriangle,
      color: "text-red-400",
      bg: "bg-red-500/10",
    },
    {
      title: "Inventario crítico",
      value: overview?.inventory.lowStock ?? 0,
      icon: Boxes,
      color: "text-yellow-400",
      bg: "bg-yellow-500/10",
    },
    {
      title: "Costo del día",
      value: `$ ${(overview?.financial.todayCost ?? 0).toLocaleString(
        "es-AR",
      )}`,
      icon: CircleDollarSign,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          Centro de Operaciones
        </h1>

        <p className="text-slate-400 mt-1">
          Vista ejecutiva en tiempo real del estado operativo
          de AgroControl Enterprise.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-6">
        {cards.map((card) => (
          <div
            key={card.title}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-5"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-400">
                {card.title}
              </p>

              <div
                className={`${card.bg} ${card.color} rounded-xl p-2`}
              >
                <card.icon size={20} />
              </div>
            </div>

            <h2
              className={`text-2xl font-bold mt-4 ${card.color}`}
            >
              {card.value}
            </h2>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-cyan-500/10 text-cyan-400 rounded-xl p-2">
              <RadioTower size={22} />
            </div>

            <div>
              <h2 className="text-xl font-semibold">
                Estado operativo en vivo
              </h2>
              <p className="text-sm text-slate-400">
                Telemetría, labores, maquinaria y eventos del día.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-5">
              <p className="text-sm text-slate-400">
                Planificación en curso
              </p>
              <h3 className="text-3xl font-bold text-cyan-400 mt-3">
                {overview?.planning.inProgress ?? 0}
              </h3>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-xl p-5">
              <p className="text-sm text-slate-400">
                Tareas completadas hoy
              </p>
              <h3 className="text-3xl font-bold text-emerald-400 mt-3">
                {overview?.planning.completedToday ?? 0}
              </h3>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-xl p-5">
              <p className="text-sm text-slate-400">
                Labores finalizadas hoy
              </p>
              <h3 className="text-3xl font-bold text-violet-400 mt-3">
                {overview?.fieldOperations.finishedToday ?? 0}
              </h3>
            </div>
          </div>

          <div className="mt-6 overflow-hidden rounded-2xl border border-slate-800 bg-slate-950">
  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 px-4 py-3">
    <div>
      <p className="text-sm font-semibold text-white">
        Mapa GIS Operativo
      </p>
      <p className="text-xs text-slate-400">
        Maquinaria, lotes y eventos operativos.
      </p>
    </div>

    <div className="flex flex-wrap gap-2 text-xs">
      <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-emerald-400">
        Tiempo real
      </span>

      <span className="rounded-full bg-violet-500/10 px-3 py-1 text-violet-400">
        Máquinas: {overview?.machines.active ?? 0}
      </span>

      <span className="rounded-full bg-yellow-500/10 px-3 py-1 text-yellow-400">
        Alertas: {(overview?.alerts.high ?? 0) + (overview?.alerts.critical ?? 0)}
      </span>
    </div>
  </div>

  <div className="h-80">
    <FarmMap />
  </div>
</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-red-500/10 text-red-400 rounded-xl p-2">
              <AlertTriangle size={22} />
            </div>

            <div>
              <h2 className="text-xl font-semibold">
                Alertas operativas
              </h2>
              <p className="text-sm text-slate-400">
                Riesgos y eventos que requieren atención.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
              <p className="text-sm text-red-300">
                Alertas críticas
              </p>
              <h3 className="text-3xl font-bold text-red-400 mt-2">
                {overview?.alerts.critical ?? 0}
              </h3>
            </div>

            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
              <p className="text-sm text-yellow-300">
                Alertas altas
              </p>
              <h3 className="text-3xl font-bold text-yellow-400 mt-2">
                {overview?.alerts.high ?? 0}
              </h3>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
              <p className="text-sm text-slate-400">
                Máquinas fuera de servicio
              </p>
              <h3 className="text-3xl font-bold text-slate-200 mt-2">
                {overview?.machines.offline ?? 0}
              </h3>
            </div>
            <LiveEventsPanel />
          </div>
          
        </div>
      </div>
    </div>
  );
}