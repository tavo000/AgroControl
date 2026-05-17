import { useIotStore } from "../store/iotStore";

export function startIotSimulation() {
  setInterval(() => {
    const { machines, updateMachines } =
      useIotStore.getState();

    const updated = machines.map(
      (machine) => ({
        ...machine,

        lat:
          machine.lat +
          (Math.random() - 0.5) * 0.002,

        lng:
          machine.lng +
          (Math.random() - 0.5) * 0.002,

        fuel: Math.max(
          0,
          machine.fuel - Math.random()
        ),

        temperature:
          60 + Math.random() * 20,

        speed:
          5 + Math.random() * 20,
      })
    );

    updateMachines(updated);
  }, 3000);
}