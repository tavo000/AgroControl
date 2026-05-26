import { create } from "zustand";

import type { MachineData } from "../types/iot";

import { socket } from "../services/socket";

import { getMachines } from "../services/machineService";

interface IoTStore {
  machines: MachineData[];

  setMachines: (
    machines: MachineData[],
  ) => void;

  loadInitialMachines: () => Promise<void>;

  sendMachineCommand: (
    machineId: number,
    active: boolean,
  ) => void;
}

export const useIoTStore =
  create<IoTStore>((set) => ({
    machines: [],

    setMachines: (machines) =>
      set({
        machines,
      }),

    loadInitialMachines: async () => {
      const machines = await getMachines();

      set({
        machines,
      });
    },

    sendMachineCommand: (
      machineId,
      active,
    ) => {
      socket.emit(
        "machine-command",
        {
          machineId,
          active,
        },
      );
    },
  }));

socket.on(
  "machines-update",
  (machines: MachineData[]) => {
    useIoTStore
      .getState()
      .setMachines(machines);
  },
);

socket.on(
  "machine-command-result",
  () => {
    console.log(
      "Comando IoT ejecutado",
    );
  },
);