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
      if (!name.trim()) return;

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
      const confirmed = window.confirm(
        "¿Seguro que deseas eliminar esta maquinaria?",
      );

      if (!confirmed) return;

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
      <div
        className="
          flex
          flex-col
          md:flex-row
          md:items-center
          md:justify-between
          gap-4
        "
      >
        <div>
          <h1 className="text-3xl font-bold">
            Maquinaria
          </h1>

          <p className="text-slate-400 mt-1">
            Gestión operativa de maquinaria agrícola conectada
          </p>
        </div>

        <div className="text-sm text-slate-400">
          Total registrado:{" "}
          <span className="text-white font-semibold">
            {machines.length}
          </span>
        </div>
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

        <div
          className="
            flex
            flex-col
            md:flex-row
            gap-4
          "
        >
          <input
            value={name}
            onChange={(event) =>
              setName(event.target.value)
            }
            placeholder="Ejemplo: Tractor John Deere 8R"
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
              py-3
              transition
            "
          >
            Crear maquinaria
          </button>
        </div>
      </div>

      <div
        className="
          bg-slate-900
          border
          border-slate-800
          rounded-2xl
          overflow-hidden
        "
      >
        <div
          className="
            p-6
            border-b
            border-slate-800
            flex
            items-center
            justify-between
          "
        >
          <div>
            <h2 className="text-xl font-semibold">
              Flota conectada
            </h2>

            <p className="text-sm text-slate-400 mt-1">
              Estado operativo en tiempo real
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-950 text-slate-400">
              <tr>
                <th className="text-left px-6 py-4">
                  ID
                </th>

                <th className="text-left px-6 py-4">
                  Maquinaria
                </th>

                <th className="text-left px-6 py-4">
                  Combustible
                </th>

                <th className="text-left px-6 py-4">
                  Temperatura
                </th>

                <th className="text-left px-6 py-4">
                  Velocidad
                </th>

                <th className="text-left px-6 py-4">
                  Estado
                </th>

                <th className="text-right px-6 py-4">
                  Acciones
                </th>
              </tr>
            </thead>

            <tbody>
              {machines.map((machine) => {
                const lowFuel =
                  machine.fuel < 20;

                const highTemperature =
                  machine.temperature > 75;

                return (
                  <tr
                    key={machine.id}
                    className="
                      border-t
                      border-slate-800
                      hover:bg-slate-800/40
                      transition
                    "
                  >
                    <td className="px-6 py-4 text-slate-400">
                      #{machine.id}
                    </td>

                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold">
                          {machine.name}
                        </p>

                        <p className="text-xs text-slate-500">
                          Unidad IoT conectada
                        </p>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={
                          lowFuel
                            ? "text-red-400 font-semibold"
                            : "text-emerald-400"
                        }
                      >
                        {machine.fuel.toFixed(0)}%
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={
                          highTemperature
                            ? "text-red-400 font-semibold"
                            : "text-slate-300"
                        }
                      >
                        {machine.temperature.toFixed(0)}
                        °C
                      </span>
                    </td>

                    <td className="px-6 py-4 text-slate-300">
                      {machine.speed.toFixed(0)} km/h
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={
                          machine.active
                            ? `
                              px-3
                              py-1
                              rounded-full
                              text-xs
                              bg-emerald-500/10
                              text-emerald-400
                              border
                              border-emerald-500/30
                            `
                            : `
                              px-3
                              py-1
                              rounded-full
                              text-xs
                              bg-red-500/10
                              text-red-400
                              border
                              border-red-500/30
                            `
                        }
                      >
                        {machine.active
                          ? "Activa"
                          : "Inactiva"}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div
                        className="
                          flex
                          justify-end
                          gap-2
                        "
                      >
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
                                px-4
                                py-2
                                rounded-lg
                                bg-yellow-500
                                hover:bg-yellow-400
                                text-slate-950
                                font-semibold
                                transition
                              `
                              : `
                                px-4
                                py-2
                                rounded-lg
                                bg-emerald-500
                                hover:bg-emerald-400
                                text-slate-950
                                font-semibold
                                transition
                              `
                          }
                        >
                          {machine.active
                            ? "Desactivar"
                            : "Activar"}
                        </button>

                        <button
                          onClick={() =>
                            handleDeleteMachine(
                              machine.id,
                            )
                          }
                          className="
                            px-4
                            py-2
                            rounded-lg
                            bg-red-500
                            hover:bg-red-400
                            text-white
                            font-semibold
                            transition
                          "
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {machines.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="
                      px-6
                      py-10
                      text-center
                      text-slate-400
                    "
                  >
                    No hay maquinaria registrada para esta empresa.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}