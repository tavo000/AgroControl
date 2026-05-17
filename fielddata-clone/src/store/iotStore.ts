import { create } from "zustand";

import type { MachineData } from "../types/iot";

interface IotStore {
  machines: MachineData[];

  updateMachines: (
    machines: MachineData[]
  ) => void;
}

export const useIotStore =
  create<IotStore>((set) => ({
    machines: [
      {
        id: 1,
        name: "Tractor A12",
        lat: -32.955,
        lng: -61.295,
        fuel: 78,
        temperature: 68,
        speed: 12,
        active: true,
      },
      {
        id: 2,
        name: "Cosechadora B7",
        lat: -32.965,
        lng: -61.305,
        fuel: 54,
        temperature: 72,
        speed: 8,
        active: true,
      },
    ],

    updateMachines: (machines) =>
      set({
        machines,
      }),
  }));