import { create } from "zustand";

import type { MachineData } from "../types/iot";

import { socket } from "../services/socket";

interface IoTStore {
  machines: MachineData[];

  setMachines: (
    machines: MachineData[],
  ) => void;
}

export const useIoTStore =
  create<IoTStore>((set) => ({
    machines: [],

    setMachines: (machines) =>
      set({
        machines,
      }),
  }));

socket.on(
  "machines-update",
  (machines: MachineData[]) => {
    useIoTStore
      .getState()
      .setMachines(machines);
  },
);