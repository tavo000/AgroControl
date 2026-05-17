import { create } from "zustand";

import type { MachineData } from "../types/iot";

import { socket } from "../services/socket";

interface IoTStore {
  machines: MachineData[];
}

export const useIoTStore =
  create<IoTStore>(() => ({
    machines: [],
  }));

socket.on(
  "machines-update",
  (machines: MachineData[]) => {
    useIoTStore.setState({
      machines,
    });
  }
);