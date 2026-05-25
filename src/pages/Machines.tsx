import { useEffect, useState } from "react";

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

export default function Machines() {
  const [machines, setMachines] =
    useState<Machine[]>([]);

  useEffect(() => {
    loadMachines();
  }, []);

  const loadMachines = async () => {
    const data = await getMachines();
    setMachines(data);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          Maquinaria
        </h1>

        <p className="text-slate-400 mt-1">
          Gestión de maquinaria agrícola registrada
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {machines.map((machine) => (
          <div
            key={machine.id}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-6"
          >
            <h2 className="text-xl font-semibold">
              {machine.name}
            </h2>

            <p className="text-sm text-slate-400 mt-1">
              ID #{machine.id}
            </p>

            <div className="mt-4 space-y-2 text-sm">
              <p>⛽ Combustible: {machine.fuel}%</p>
              <p>🌡️ Temperatura: {machine.temperature}°C</p>
              <p>⚙️ Velocidad: {machine.speed} km/h</p>
              <p>
                Estado:{" "}
                <span
                  className={
                    machine.active
                      ? "text-emerald-400"
                      : "text-red-400"
                  }
                >
                  {machine.active ? "Activa" : "Inactiva"}
                </span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}