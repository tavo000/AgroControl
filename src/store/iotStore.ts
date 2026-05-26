import { create } from "zustand";

import type { MachineData } from "../types/iot";

import { socket } from "../services/socket";

interface IoTStore {
  machines: MachineData[];

  setMachines: (
    machines: MachineData[],
  ) => void;

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