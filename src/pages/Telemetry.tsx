import { useEffect, useState } from "react";

import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";

import { getTelemetry } from "../services/machineService";

import type { TelemetryData } from "../types/telemetry";

export default function Telemetry() {
  const [telemetry, setTelemetry] =
    useState<TelemetryData[]>([]);

  useEffect(() => {
    loadTelemetry();
  }, []);

  const loadTelemetry = async () => {
    const data = await getTelemetry();

    setTelemetry(data.reverse());
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          Telemetría Histórica
        </h1>

        <p className="text-slate-400 mt-1">
          Historial operativo de maquinaria IoT
        </p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <h2 className="text-xl font-semibold mb-6">
          Evolución de Telemetría
        </h2>

        <div className="h-[360px]">
          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            <LineChart data={telemetry}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#334155"
              />

              <XAxis
                dataKey="machineName"
                stroke="#94a3b8"
              />

              <YAxis stroke="#94a3b8" />

              <Tooltip />

              <Legend />

              <Line
                type="monotone"
                dataKey="fuel"
                stroke="#22c55e"
                name="Combustible"
                dot={false}
              />

              <Line
                type="monotone"
                dataKey="temperature"
                stroke="#ef4444"
                name="Temperatura"
                dot={false}
              />

              <Line
                type="monotone"
                dataKey="speed"
                stroke="#3b82f6"
                name="Velocidad"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <h2 className="text-xl font-semibold mb-6">
          Últimos registros
        </h2>

        <div className="space-y-3">
          {telemetry
            .slice()
            .reverse()
            .slice(0, 20)
            .map((item) => (
              <div
                key={item.id}
                className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex items-center justify-between"
              >
                <div>
                  <h3 className="font-semibold">
                    {item.machineName}
                  </h3>

                  <p className="text-xs text-slate-500">
                    {new Date(
                      item.createdAt,
                    ).toLocaleString()}
                  </p>
                </div>

                <div className="flex gap-4 text-sm">
                  <span>
                    ⛽ {item.fuel.toFixed(0)}%
                  </span>

                  <span>
                    🌡️{" "}
                    {item.temperature.toFixed(0)}
                    °C
                  </span>

                  <span>
                    ⚙️ {item.speed.toFixed(0)} km/h
                  </span>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}