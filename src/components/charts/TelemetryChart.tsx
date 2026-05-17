import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";

import type { MachineData } from "../../types/iot";

interface Props {
  data: MachineData[];
}

export default function TelemetryChart({
  data,
}: Props) {
  return (
    <div className="bg-zinc-900 p-4 rounded-xl">
      <h2 className="text-white text-lg mb-4">
        Telemetría en tiempo real
      </h2>

      <div className="w-full h-[260px]">
        <ResponsiveContainer
          width="99%"
          height={260}
      >
          <LineChart
            data={data}
            margin={{
              top: 10,
              right: 20,
              left: 0,
              bottom: 0,
            }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#3f3f46"
            />

            <XAxis hide />

            <YAxis
              stroke="#a1a1aa"
              domain={[0, 100]}
            />

            <Tooltip
              contentStyle={{
                backgroundColor: "#18181b",
                border: "1px solid #3f3f46",
                borderRadius: "8px",
                color: "#fff",
              }}
            />

            <Legend />

            <Line
              type="monotone"
              dataKey="fuel"
              stroke="#22c55e"
              strokeWidth={3}
              dot={false}
              name="Combustible"
            />

            <Line
              type="monotone"
              dataKey="temperature"
              stroke="#ef4444"
              strokeWidth={3}
              dot={false}
              name="Temperatura"
            />

            <Line
              type="monotone"
              dataKey="speed"
              stroke="#3b82f6"
              strokeWidth={3}
              dot={false}
              name="Velocidad"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}