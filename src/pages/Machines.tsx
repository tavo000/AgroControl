import { useEffect, useState } from "react";

import {
  createMachine,
  deleteMachine,
} from "../services/machineService";

import { useIoTStore } from "../store/iotStore";

export default function Machines() {
  const [name, setName] =
    useState("");

  const machines = useIoTStore(
    (state) => state.machines,
  );

  const loadInitialMachines =
  useIoTStore(
    (state) =>
      state.loadInitialMachines,
  );

  const sendMachineCommand =
    useIoTStore(
      (state) =>
        state.sendMachineCommand,
    );

  useEffect(() => {
    loadInitialMachines();
  }, []);


  const handleCreateMachine =
    async () => {
      if (!name) return;

      await createMachine({
        name,
        lat: -32.95,
        lng: -61.3,
        fuel: 100,
        temperature: 28,
        speed: 0,
        active: true,
      });

      setName("");

      await loadInitialMachines();
    };

  const handleDeleteMachine =
    async (id: number) => {
      await deleteMachine(id);
      await loadInitialMachines();
    };

  const handleToggleMachine =
    (
      id: number,
      active: boolean,
    ) => {
      sendMachineCommand(
        id,
        !active,
      );
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

      <div
        className="
          bg-slate-900
          border
          border-slate-800
          rounded-2xl
          p-6
          space-y-4
        "
      >
        <h2 className="text-xl font-semibold">
          Nueva maquinaria
        </h2>

        <div className="flex gap-4">
          <input
            value={name}
            onChange={(event) =>
              setName(event.target.value)
            }
            placeholder="Nombre de la maquinaria"
            className="
              flex-1
              rounded-xl
              bg-slate-950
              border
              border-slate-800
              px-4
              py-3
              outline-none
              focus:border-emerald-500
            "
          />

          <button
            onClick={handleCreateMachine}
            className="
              px-6
              rounded-xl
              bg-emerald-500
              hover:bg-emerald-400
              text-slate-950
              font-semibold
              transition
            "
          >
            Crear
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {machines.map((machine) => (
          <div
            key={machine.id}
            className="
              bg-slate-900
              border
              border-slate-800
              rounded-2xl
              p-6
            "
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold">
                  {machine.name}
                </h2>

                <p className="text-sm text-slate-400 mt-1">
                  ID #{machine.id}
                </p>
              </div>

              <button
                onClick={() =>
                  handleDeleteMachine(
                    machine.id,
                  )
                }
                className="
                  px-3
                  py-2
                  rounded-lg
                  bg-red-500
                  hover:bg-red-400
                  text-white
                  text-sm
                  font-semibold
                  transition
                "
              >
                Eliminar
              </button>
            </div>

            <div className="mt-4 space-y-2 text-sm">
              <p>
                ⛽ Combustible:{" "}
                {machine.fuel.toFixed(0)}%
              </p>

              <p>
                🌡️ Temperatura:{" "}
                {machine.temperature.toFixed(0)}
                °C
              </p>

              <p>
                ⚙️ Velocidad:{" "}
                {machine.speed.toFixed(0)} km/h
              </p>

              <p>
                Estado:{" "}
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
              </p>
            </div>

            <button
              onClick={() =>
                handleToggleMachine(
                  machine.id,
                  machine.active,
                )
              }
              className={
                machine.active
                  ? `
                    mt-5
                    w-full
                    rounded-xl
                    bg-yellow-500
                    hover:bg-yellow-400
                    text-slate-950
                    font-semibold
                    py-3
                    transition
                  `
                  : `
                    mt-5
                    w-full
                    rounded-xl
                    bg-emerald-500
                    hover:bg-emerald-400
                    text-slate-950
                    font-semibold
                    py-3
                    transition
                  `
              }
            >
              {machine.active
                ? "Desactivar"
                : "Activar"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}