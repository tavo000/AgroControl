import { Activity, Fuel, Gauge, Thermometer } from "lucide-react";

import { useIoTStore } from "../../store/iotStore";

export default function MachineTelemetry() {
  const { machines } = useIoTStore();

  return (
    <div className="space-y-4">
      {machines.length === 0 && (
        <p className="text-sm text-slate-400">
          Esperando telemetría en tiempo real...
        </p>
      )}

      {machines.map((machine) => {
        const fuelLow = machine.fuel < 25;

        const temperatureHigh =
          machine.temperature > 75;

        return (
          <div
            key={machine.id}
            className="
              bg-slate-800
              border
              border-slate-700
              rounded-xl
              p-4
              space-y-4
            "
          >
            <div className="flex justify-between gap-4">
              <div>
                <h3 className="font-semibold">
                  {machine.name}
                </h3>

                <p className="text-xs text-slate-400">
                  ID #{machine.id}
                </p>
              </div>

              <span
                className={
                  machine.active
                    ? "text-emerald-400 text-sm font-medium"
                    : "text-red-400 text-sm font-medium"
                }
              >
                {machine.active
                  ? "Activo"
                  : "Inactivo"}
              </span>
            </div>

            <div className="grid grid-cols-1 gap-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-slate-300">
                  <Fuel size={16} />
                  Combustible
                </span>

                <span
                  className={
                    fuelLow
                      ? "text-red-400 font-semibold"
                      : "text-emerald-400 font-semibold"
                  }
                >
                  {machine.fuel.toFixed(0)}%
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-slate-300">
                  <Thermometer size={16} />
                  Temperatura
                </span>

                <span
                  className={
                    temperatureHigh
                      ? "text-red-400 font-semibold"
                      : "text-slate-200 font-semibold"
                  }
                >
                  {machine.temperature.toFixed(0)}°C
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-slate-300">
                  <Gauge size={16} />
                  Velocidad
                </span>

                <span className="text-slate-200 font-semibold">
                  {machine.speed.toFixed(0)} km/h
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-slate-300">
                  <Activity size={16} />
                  Estado IoT
                </span>

                <span className="text-emerald-400 font-semibold">
                  En línea
                </span>
              </div>
            </div>

            {(fuelLow || temperatureHigh) && (
              <div className="rounded-lg bg-red-500/10 border border-red-500/30 p-3 text-xs text-red-300">
                {fuelLow && (
                  <p>
                    Alerta: combustible bajo.
                  </p>
                )}

                {temperatureHigh && (
                  <p>
                    Alerta: temperatura elevada.
                  </p>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}