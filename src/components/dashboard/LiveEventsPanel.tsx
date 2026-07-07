import { useEffect, useState } from "react";

import {
  AlertTriangle,
  CheckCircle2,
  RadioTower,
  Tractor,
} from "lucide-react";

import { getOpenAlerts } from "../../services/machineService";

interface OpenAlert {
  id: number;
  machineName: string;
  type: string;
  severity: string;
  message: string;
  createdAt: string;
}

interface LiveEvent {
  id: number;
  time: string;
  title: string;
  description: string;
  machineName?: string;
  type: "machine" | "alert" | "success" | "telemetry";
}

function formatEventTime(date: string) {
  return new Date(date).toLocaleTimeString("es-AR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getEventStyle(type: LiveEvent["type"]) {
  if (type === "alert") {
    return {
      icon: AlertTriangle,
      bg: "bg-red-500/10",
      color: "text-red-400",
      border: "border-red-500/20",
      highlight: "ring-red-500/40",
    };
  }

  if (type === "machine") {
    return {
      icon: Tractor,
      bg: "bg-emerald-500/10",
      color: "text-emerald-400",
      border: "border-emerald-500/20",
      highlight: "ring-emerald-500/40",
    };
  }

  if (type === "success") {
    return {
      icon: CheckCircle2,
      bg: "bg-cyan-500/10",
      color: "text-cyan-400",
      border: "border-cyan-500/20",
      highlight: "ring-cyan-500/40",
    };
  }

  return {
    icon: RadioTower,
    bg: "bg-violet-500/10",
    color: "text-violet-400",
    border: "border-violet-500/20",
    highlight: "ring-violet-500/40",
  };
}

interface LiveEventsPanelProps {
  onSelectMachine?: (machineName: string) => void;
}

export default function LiveEventsPanel({
  onSelectMachine,
}: LiveEventsPanelProps) {

  const [events, setEvents] = useState<LiveEvent[]>([]);
  const [newEventsCount, setNewEventsCount] = useState(0);
  const [highlightedEventIds, setHighlightedEventIds] =
    useState<number[]>([]);

  useEffect(() => {
    loadEvents();

    const interval = window.setInterval(() => {
      loadEvents();
    }, 5000);

    return () => {
      window.clearInterval(interval);
    };
  }, []);

  const loadEvents = async () => {
    try {
      const alerts: OpenAlert[] = await getOpenAlerts();

      const sortedAlerts = [...alerts]
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() -
            new Date(a.createdAt).getTime(),
        )
        .slice(0, 20);

      const alertEvents: LiveEvent[] = sortedAlerts.map(
        (alert) => ({
          id: alert.id,
          time: formatEventTime(alert.createdAt),
          title:
            alert.severity === "CRITICAL"
              ? `Alerta crítica - ${alert.machineName}`
              : `Alerta ${alert.severity.toLowerCase()} - ${alert.machineName}`,
          description: alert.message,
              machineName: alert.machineName,
              type: "alert",
        }),
      );

      const baseEvents: LiveEvent[] = [
        {
          id: -1,
          time: "Ahora",
          title: "Centro operativo activo",
          description:
            "Monitoreo GIS, maquinaria y alertas en tiempo real.",
          type: "telemetry",
        },
        {
          id: -2,
          time: "Activo",
          title: "Mapa GIS sincronizado",
          description:
            "Capas de maquinaria, lotes, cultivos y rutas disponibles.",
          type: "success",
        },
      ];

      setEvents((previousEvents) => {
        const previousIds = new Set(
          previousEvents.map((event) => event.id),
        );

        const nextEvents = [
          ...alertEvents,
          ...baseEvents,
        ];

        const newIds = nextEvents
          .filter(
            (event) => !previousIds.has(event.id),
          )
          .map((event) => event.id);

        if (
          previousEvents.length > 0 &&
          newIds.length > 0
        ) {
          setNewEventsCount(newIds.length);
          setHighlightedEventIds(newIds);

          window.setTimeout(() => {
            setHighlightedEventIds([]);
            setNewEventsCount(0);
          }, 2500);
        }

        return nextEvents.slice(0, 20);
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-xl font-semibold">
            Eventos en vivo
          </h2>

          <div className="flex items-center gap-2">
            {newEventsCount > 0 && (
              <span className="rounded-full bg-red-500/10 px-3 py-1 text-xs font-semibold text-red-400">
                {newEventsCount} nuevos
              </span>
            )}

            <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">
              En línea
            </span>
          </div>
        </div>

        <p className="text-sm text-slate-400 mt-1">
          Línea temporal operativa del Centro de Operaciones.
        </p>
      </div>

      <div className="mt-4 max-h-[620px] overflow-y-auto pr-2 space-y-4">
        {events.map((event) => {
          const style = getEventStyle(event.type);
          const Icon = style.icon;

          const isHighlighted =
            highlightedEventIds.includes(event.id);

          return (
            <div
              key={event.id}
              onClick={() => {
                if (event.machineName) {
                  onSelectMachine?.(event.machineName);
                    }
                }}
                className={`rounded-xl border ${style.border} bg-slate-950 p-4 transition-all duration-500 ${
                  event.machineName ? "cursor-pointer hover:bg-slate-900" : ""
              } ${
                isHighlighted
                  ? `ring-2 ${style.highlight} scale-[1.01]`
                  : ""
              }`}
            >
              <div className="flex gap-3">
                <div
                  className={`${style.bg} ${style.color} h-9 w-9 rounded-xl flex items-center justify-center shrink-0`}
                >
                  <Icon size={18} />
                </div>

                <div>
                  <p className="text-xs text-slate-500">
                    {event.time}
                  </p>

                  <h3 className="text-sm font-semibold text-slate-100 mt-1">
                    {event.title}
                  </h3>

                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    {event.description}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}