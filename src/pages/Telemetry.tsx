import { useEffect, useMemo, useState } from "react";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  getCampaigns,
  getCrops,
  getHarvests,
  getPlots,
} from "../services/machineService";

interface Plot {
  id: number;
  name: string;
  area?: number;
  farm?: {
    id: number;
    name: string;
  };
}

interface Crop {
  id: number;
  name: string;
  variety?: string;
  status?: string;
  plot?: Plot;
}

interface Campaign {
  id: number;
  name: string;
  active: boolean;
}

interface Harvest {
  id: number;
  totalProduction: number;
  harvestedArea: number;
  yieldPerHectare: number;
  unit: string;
  campaign?: string;
  crop?: {
    id: number;
    name: string;
    variety?: string;
    plot?: {
      id: number;
      name: string;
      farm?: {
        id: number;
        name: string;
      };
    };
  };
}

interface ChartRow {
  name: string;
  production: number;
  yield: number;
  area: number;
}

export default function Telemetry() {
  const [harvests, setHarvests] =
    useState<Harvest[]>([]);

  const [campaigns, setCampaigns] =
    useState<Campaign[]>([]);

  const [crops, setCrops] =
    useState<Crop[]>([]);

  const [plots, setPlots] =
    useState<Plot[]>([]);

  const [selectedCampaign, setSelectedCampaign] =
    useState("ALL");

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    const [
      harvestsData,
      campaignsData,
      cropsData,
      plotsData,
    ] = await Promise.all([
      getHarvests(),
      getCampaigns(),
      getCrops(),
      getPlots(),
    ]);

    setHarvests(harvestsData);
    setCampaigns(campaignsData);
    setCrops(cropsData);
    setPlots(plotsData);
  };

  const filteredHarvests =
    selectedCampaign === "ALL"
      ? harvests
      : harvests.filter(
          (harvest) =>
            harvest.campaign ===
            selectedCampaign,
        );

  const totalProduction =
    filteredHarvests.reduce(
      (acc, harvest) =>
        acc + harvest.totalProduction,
      0,
    );

  const totalHarvestedArea =
    filteredHarvests.reduce(
      (acc, harvest) =>
        acc + harvest.harvestedArea,
      0,
    );

  const plantedArea =
    plots.reduce(
      (acc, plot) =>
        acc + (plot.area || 0),
      0,
    );

  const averageYield =
    filteredHarvests.length > 0
      ? (
          filteredHarvests.reduce(
            (acc, harvest) =>
              acc +
              harvest.yieldPerHectare,
            0,
          ) / filteredHarvests.length
        ).toFixed(2)
      : "0";

  const activeCampaigns =
    campaigns.filter(
      (campaign) => campaign.active,
    ).length;

  const activeCrops =
    crops.filter(
      (crop) =>
        crop.status !== "Finalizado",
    ).length;

  const productionByCampaign =
    useMemo(() => {
      const grouped = new Map<
        string,
        ChartRow
      >();

      filteredHarvests.forEach((harvest) => {
        const key =
          harvest.campaign ||
          "Sin campaña";

        const current =
          grouped.get(key) || {
            name: key,
            production: 0,
            yield: 0,
            area: 0,
          };

        current.production +=
          harvest.totalProduction;

        current.area +=
          harvest.harvestedArea;

        current.yield =
          current.area > 0
            ? current.production /
              current.area
            : 0;

        grouped.set(key, current);
      });

      return Array.from(grouped.values());
    }, [filteredHarvests]);

  const productionByCrop =
    useMemo(() => {
      const grouped = new Map<
        string,
        ChartRow
      >();

      filteredHarvests.forEach((harvest) => {
        const key =
          harvest.crop?.name ||
          "Sin cultivo";

        const current =
          grouped.get(key) || {
            name: key,
            production: 0,
            yield: 0,
            area: 0,
          };

        current.production +=
          harvest.totalProduction;

        current.area +=
          harvest.harvestedArea;

        current.yield =
          current.area > 0
            ? current.production /
              current.area
            : 0;

        grouped.set(key, current);
      });

      return Array.from(grouped.values()).sort(
        (a, b) =>
          b.production - a.production,
      );
    }, [filteredHarvests]);

  const productionByField =
    useMemo(() => {
      const grouped = new Map<
        string,
        ChartRow
      >();

      filteredHarvests.forEach((harvest) => {
        const key =
          harvest.crop?.plot?.farm?.name ||
          "Sin campo";

        const current =
          grouped.get(key) || {
            name: key,
            production: 0,
            yield: 0,
            area: 0,
          };

        current.production +=
          harvest.totalProduction;

        current.area +=
          harvest.harvestedArea;

        current.yield =
          current.area > 0
            ? current.production /
              current.area
            : 0;

        grouped.set(key, current);
      });

      return Array.from(grouped.values()).sort(
        (a, b) =>
          b.production - a.production,
      );
    }, [filteredHarvests]);

  const rankingCrops =
    productionByCrop.slice(0, 5);

  const latestHarvests =
    filteredHarvests.slice(0, 8);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          Analítica Agrícola
        </h1>

        <p className="text-slate-400 mt-1">
          Análisis de producción, campañas, cultivos, lotes y rendimiento.
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
            Selecciona una campaña para analizar producción y rendimiento.
          </p>
        </div>

        <select
          value={selectedCampaign}
          onChange={(event) =>
            setSelectedCampaign(
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
            Todas las campañas
          </option>

          {campaigns.map((campaign) => (
            <option
              key={campaign.id}
              value={campaign.name}
            >
              {campaign.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <p className="text-sm text-slate-400">
            Producción total
          </p>

          <h2 className="text-3xl font-bold mt-2">
            {totalProduction.toFixed(0)} tn
          </h2>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <p className="text-sm text-slate-400">
            Rendimiento promedio
          </p>

          <h2 className="text-3xl font-bold mt-2">
            {averageYield} tn/ha
          </h2>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <p className="text-sm text-slate-400">
            Hectáreas cosechadas
          </p>

          <h2 className="text-3xl font-bold mt-2">
            {totalHarvestedArea.toFixed(0)} ha
          </h2>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <p className="text-sm text-slate-400">
            Hectáreas sembradas
          </p>

          <h2 className="text-3xl font-bold mt-2">
            {plantedArea.toFixed(0)} ha
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <p className="text-sm text-slate-400">
            Campañas activas
          </p>

          <h2 className="text-3xl font-bold mt-2">
            {activeCampaigns}
          </h2>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <p className="text-sm text-slate-400">
            Cultivos activos
          </p>

          <h2 className="text-3xl font-bold mt-2">
            {activeCrops}
          </h2>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <p className="text-sm text-slate-400">
            Cosechas registradas
          </p>

          <h2 className="text-3xl font-bold mt-2">
            {filteredHarvests.length}
          </h2>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <p className="text-sm text-slate-400">
            Lotes registrados
          </p>

          <h2 className="text-3xl font-bold mt-2">
            {plots.length}
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h2 className="text-xl font-semibold mb-6">
            Producción por campaña
          </h2>

          <div className="h-[340px]">
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <BarChart
                data={productionByCampaign}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#334155"
                />

                <XAxis
                  dataKey="name"
                  stroke="#94a3b8"
                />

                <YAxis stroke="#94a3b8" />

                <Tooltip />

                <Legend />

                <Bar
                  dataKey="production"
                  name="Producción"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h2 className="text-xl font-semibold mb-6">
            Rendimiento por cultivo
          </h2>

          <div className="h-[340px]">
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <LineChart data={productionByCrop}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#334155"
                />

                <XAxis
                  dataKey="name"
                  stroke="#94a3b8"
                />

                <YAxis stroke="#94a3b8" />

                <Tooltip />

                <Legend />

                <Line
                  type="monotone"
                  dataKey="yield"
                  name="Rendimiento"
                  dot
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-slate-800">
            <h2 className="text-xl font-semibold">
              Ranking de cultivos
            </h2>

            <p className="text-sm text-slate-400 mt-1">
              Cultivos ordenados por producción total.
            </p>
          </div>

          <div className="divide-y divide-slate-800">
            {rankingCrops.map((crop, index) => (
              <div
                key={crop.name}
                className="p-5 flex items-center justify-between"
              >
                <div>
                  <p className="font-semibold">
                    #{index + 1} {crop.name}
                  </p>

                  <p className="text-sm text-slate-400">
                    {crop.area.toFixed(0)} ha cosechadas
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-emerald-400 font-semibold">
                    {crop.production.toFixed(0)} tn
                  </p>

                  <p className="text-sm text-slate-400">
                    {crop.yield.toFixed(2)} tn/ha
                  </p>
                </div>
              </div>
            ))}

            {rankingCrops.length === 0 && (
              <div className="p-8 text-center text-slate-400">
                No hay datos de producción.
              </div>
            )}
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-slate-800">
            <h2 className="text-xl font-semibold">
              Producción por campo
            </h2>

            <p className="text-sm text-slate-400 mt-1">
              Resumen productivo agrupado por campo.
            </p>
          </div>

          <div className="divide-y divide-slate-800">
            {productionByField.map((field) => (
              <div
                key={field.name}
                className="p-5 flex items-center justify-between"
              >
                <div>
                  <p className="font-semibold">
                    {field.name}
                  </p>

                  <p className="text-sm text-slate-400">
                    {field.area.toFixed(0)} ha cosechadas
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-emerald-400 font-semibold">
                    {field.production.toFixed(0)} tn
                  </p>

                  <p className="text-sm text-slate-400">
                    {field.yield.toFixed(2)} tn/ha
                  </p>
                </div>
              </div>
            ))}

            {productionByField.length === 0 && (
              <div className="p-8 text-center text-slate-400">
                No hay datos por campo.
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-slate-800">
          <h2 className="text-xl font-semibold">
            Últimas cosechas
          </h2>

          <p className="text-sm text-slate-400 mt-1">
            Detalle reciente de cosechas por campo, lote, cultivo y campaña.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-950 text-slate-400">
              <tr>
                <th className="text-left px-6 py-4">
                  Campo
                </th>

                <th className="text-left px-6 py-4">
                  Lote
                </th>

                <th className="text-left px-6 py-4">
                  Cultivo
                </th>

                <th className="text-left px-6 py-4">
                  Campaña
                </th>

                <th className="text-left px-6 py-4">
                  Producción
                </th>

                <th className="text-left px-6 py-4">
                  Superficie
                </th>

                <th className="text-left px-6 py-4">
                  Rendimiento
                </th>
              </tr>
            </thead>

            <tbody>
              {latestHarvests.map((harvest) => (
                <tr
                  key={harvest.id}
                  className="border-t border-slate-800 hover:bg-slate-800/40 transition"
                >
                  <td className="px-6 py-4 font-semibold">
                    {harvest.crop?.plot?.farm
                      ?.name || "-"}
                  </td>

                  <td className="px-6 py-4 text-slate-300">
                    {harvest.crop?.plot
                      ?.name || "-"}
                  </td>

                  <td className="px-6 py-4 text-slate-300">
                    {harvest.crop?.name || "-"}
                  </td>

                  <td className="px-6 py-4 text-slate-300">
                    {harvest.campaign || "-"}
                  </td>

                  <td className="px-6 py-4 text-emerald-400 font-semibold">
                    {harvest.totalProduction.toFixed(
                      0,
                    )}{" "}
                    {harvest.unit}
                  </td>

                  <td className="px-6 py-4 text-slate-300">
                    {harvest.harvestedArea.toFixed(
                      0,
                    )}{" "}
                    ha
                  </td>

                  <td className="px-6 py-4 text-slate-300">
                    {harvest.yieldPerHectare.toFixed(
                      2,
                    )}{" "}
                    tn/ha
                  </td>
                </tr>
              ))}

              {latestHarvests.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-10 text-center text-slate-400"
                  >
                    No hay cosechas registradas.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
