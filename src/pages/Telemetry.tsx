import { useEffect, useMemo, useState } from "react";

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

  const [selectedMachine, setSelectedMachine] =
    useState("ALL");

  useEffect(() => {
    loadTelemetry();
  }, []);

  const loadTelemetry = async () => {
    const data = await getTelemetry();

    setTelemetry(data.reverse());
  };

  const machineNames = useMemo(() => {
    return Array.from(
      new Set(
        telemetry.map(
          (item) => item.machineName,
        ),
      ),
    );
  }, [telemetry]);

  const filteredTelemetry =
    selectedMachine === "ALL"
      ? telemetry
      : telemetry.filter(
          (item) =>
            item.machineName ===
            selectedMachine,
        );

  const latestRecords =
    filteredTelemetry
      .slice()
      .reverse()
      .slice(0, 20);

  const averageFuel =
    filteredTelemetry.length > 0
      ? (
          filteredTelemetry.reduce(
            (acc, item) =>
              acc + item.fuel,
            0,
          ) / filteredTelemetry.length
        ).toFixed(0)
      : "0";

  const averageTemperature =
    filteredTelemetry.length > 0
      ? (
          filteredTelemetry.reduce(
            (acc, item) =>
              acc + item.temperature,
            0,
          ) / filteredTelemetry.length
        ).toFixed(0)
      : "0";

  const averageSpeed =
    filteredTelemetry.length > 0
      ? (
          filteredTelemetry.reduce(
            (acc, item) =>
              acc + item.speed,
            0,
          ) / filteredTelemetry.length
        ).toFixed(0)
      : "0";

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

      <div
        className="
          bg-slate-900
          border
          border-slate-800
          rounded-2xl
          p-6
          flex
          flex-col
          md:flex-row
          gap-4
          md:items-center
          md:justify-between
        "
      >
        <div>
          <h2 className="text-xl font-semibold">
            Filtros de análisis
          </h2>

          <p className="text-sm text-slate-400 mt-1">
            Selecciona una maquinaria para analizar su historial.
          </p>
        </div>

        <select
          value={selectedMachine}
          onChange={(event) =>
            setSelectedMachine(
              event.target.value,
            )
          }
          className="
            rounded-xl
            bg-slate-950
            border
            border-slate-800
            px-4
            py-3
            outline-none
            focus:border-emerald-500
          "
        >
          <option value="ALL">
            Todas las máquinas
          </option>

          {machineNames.map((name) => (
            <option
              key={name}
              value={name}
            >
              {name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <p className="text-sm text-slate-400">
            Combustible promedio
          </p>

          <h2 className="text-3xl font-bold mt-2">
            {averageFuel}%
          </h2>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <p className="text-sm text-slate-400">
            Temperatura promedio
          </p>

          <h2 className="text-3xl font-bold mt-2">
            {averageTemperature}°C
          </h2>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <p className="text-sm text-slate-400">
            Velocidad promedio
          </p>

          <h2 className="text-3xl font-bold mt-2">
            {averageSpeed} km/h
          </h2>
        </div>
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
            <LineChart data={filteredTelemetry}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#334155"
              />

              <XAxis
  dataKey="createdAt"
  stroke="#94a3b8"
  minTickGap={40}
  tickFormatter={(value) =>
    new Date(value).toLocaleTimeString(
      [],
      {
        hour: "2-digit",
        minute: "2-digit",
      },
    )
  }
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
          {latestRecords.map((item) => (
            <div
              key={item.id}
              className="
                bg-slate-950
                border
                border-slate-800
                rounded-xl
                p-4
                flex
                items-center
                justify-between
              "
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