import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  Tooltip,
} from "recharts";

import { productionData } from "../../data/productionData";

export default function ProductionChart() {
  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer
        width="99%"
        height={300}
    >
        <AreaChart data={productionData}>
          <XAxis
            dataKey="month"
            stroke="#94a3b8"
          />

          <Tooltip />

          <Area
            type="monotone"
            dataKey="production"
            stroke="#10b981"
            fill="#10b981"
            fillOpacity={0.2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}