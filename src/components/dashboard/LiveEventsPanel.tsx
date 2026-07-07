import {
  AlertTriangle,
  CheckCircle2,
  RadioTower,
  Tractor,
} from "lucide-react";

interface LiveEvent {
  id: number;
  time: string;
  title: string;
  description: string;
  type: "machine" | "alert" | "success" | "telemetry";
}

const events: LiveEvent[] = [
  {
    id: 1,
    time: "Ahora",
    title: "Centro operativo activo",
    description:
      "Monitoreo GIS, maquinaria y alertas en tiempo real.",
    type: "telemetry",
  },
  {
    id: 2,
    time: "Hace 1 min",
    title: "Tractor Tenant 1 en operación",
    description:
      "La unidad se encuentra transmitiendo posición y telemetría.",
    type: "machine",
  },
  {
    id: 3,
    time: "Hace 3 min",
    title: "Alerta operativa detectada",
    description:
      "Evento vinculado a maquinaria activa dentro del mapa GIS.",
    type: "alert",
  },
  {
    id: 4,
    time: "Hoy",
    title: "Mapa GIS sincronizado",
    description:
      "Capas de maquinaria, lotes, cultivos y rutas disponibles.",
    type: "success",
  },
];

function getEventStyle(type: LiveEvent["type"]) {
  if (type === "alert") {
    return {
      icon: AlertTriangle,
      bg: "bg-red-500/10",
      color: "text-red-400",
      border: "border-red-500/20",
    };
  }

  if (type === "machine") {
    return {
      icon: Tractor,
      bg: "bg-emerald-500/10",
      color: "text-emerald-400",
      border: "border-emerald-500/20",
    };
  }

  if (type === "success") {
    return {
      icon: CheckCircle2,
      bg: "bg-cyan-500/10",
      color: "text-cyan-400",
      border: "border-cyan-500/20",
    };
  }

  return {
    icon: RadioTower,
    bg: "bg-violet-500/10",
    color: "text-violet-400",
    border: "border-violet-500/20",
  };
}

export default function LiveEventsPanel() {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold">
          Eventos en vivo
        </h2>

        <p className="text-sm text-slate-400 mt-1">
          Línea temporal operativa del Centro de Operaciones.
        </p>
      </div>

      <div className="space-y-4">
        {events.map((event) => {
          const style = getEventStyle(event.type);
          const Icon = style.icon;

          return (
            <div
              key={event.id}
              className={`rounded-xl border ${style.border} bg-slate-950 p-4`}
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