import { useIoTStore } from "../../store/iotStore";

export default function MachineTelemetry() {
  const { machines } = useIoTStore();

  return (
    <div className="space-y-4">
      {machines.map((machine) => (
        <div
          key={machine.id}
          className="
            bg-slate-800
            rounded-xl
            p-4
          "
        >
          <div className="flex justify-between">
            <h3 className="font-semibold">
              {machine.machineName}
            </h3>

            <span
              className={
                machine.active
                  ? "text-emerald-400"
                  : "text-red-400"
              }
            >
              {machine.active
                ? "Activo"
                : "Inactivo"}
            </span>
          </div>

          <div className="mt-3 space-y-1 text-sm text-slate-300">
            <p>
              Combustible:
              {" "}
              {machine.fuel.toFixed(0)}%
            </p>

            <p>
              Temperatura:
              {" "}
              {machine.temperature.toFixed(0)}
              °C
            </p>

            <p>
              Velocidad:
              {" "}
              {machine.speed.toFixed(0)}
              km/h
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}