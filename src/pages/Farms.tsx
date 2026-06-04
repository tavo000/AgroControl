import { useEffect, useState } from "react";

import {
  createCrop,
  createFarm,
  createPlot,
  deleteCrop,
  deleteFarm,
  deletePlot,
  getCrops,
  getFarms,
  getPlots,
} from "../services/machineService";

interface Farm {
  id: number;
  name: string;
  location?: string;
  area?: number;
}

interface Plot {
  id: number;
  farmId: number;
  name: string;
  area?: number;
  crop?: string;
  status?: string;
  soilType?: string;
  lastActivity?: string;
  farm?: Farm;
}

interface Crop {
  id: number;
  plotId: number;
  name: string;
  variety?: string;
  sowingDate?: string;
  expectedHarvest?: string;
  status?: string;
  plot?: Plot;
}

export default function Farms() {
  const [farms, setFarms] = useState<Farm[]>([]);
  const [plots, setPlots] = useState<Plot[]>([]);
  const [crops, setCrops] = useState<Crop[]>([]);

  const [farmName, setFarmName] = useState("");
  const [farmLocation, setFarmLocation] = useState("");
  const [farmArea, setFarmArea] = useState("");

  const [plotFarmId, setPlotFarmId] = useState("");
  const [plotName, setPlotName] = useState("");
  const [plotArea, setPlotArea] = useState("");
  const [plotCrop, setPlotCrop] = useState("");

  const [cropPlotId, setCropPlotId] = useState("");
  const [cropName, setCropName] = useState("");
  const [cropVariety, setCropVariety] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [farmsData, plotsData, cropsData] =
      await Promise.all([
        getFarms(),
        getPlots(),
        getCrops(),
      ]);

    setFarms(farmsData);
    setPlots(plotsData);
    setCrops(cropsData);
  };

  const handleCreateFarm = async () => {
    if (!farmName.trim()) return;

    await createFarm({
      name: farmName,
      location: farmLocation,
      area: farmArea ? Number(farmArea) : undefined,
    });

    setFarmName("");
    setFarmLocation("");
    setFarmArea("");

    await loadData();
  };

  const handleCreatePlot = async () => {
    if (!plotFarmId || !plotName.trim()) return;

    await createPlot({
      farmId: Number(plotFarmId),
      name: plotName,
      area: plotArea ? Number(plotArea) : undefined,
      crop: plotCrop,
      status: "Activo",
      soilType: "",
      lastActivity: "Registro inicial",
    });

    setPlotFarmId("");
    setPlotName("");
    setPlotArea("");
    setPlotCrop("");

    await loadData();
  };

  const handleCreateCrop = async () => {
    if (!cropPlotId || !cropName.trim()) return;

    await createCrop({
      plotId: Number(cropPlotId),
      name: cropName,
      variety: cropVariety,
      status: "Activo",
    });

    setCropPlotId("");
    setCropName("");
    setCropVariety("");

    await loadData();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          Campos, Lotes y Cultivos
        </h1>

        <p className="text-slate-400 mt-1">
          Gestión agrícola por empresa, campo, lote y cultivo.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h2 className="text-xl font-semibold">
            Nuevo campo
          </h2>

          <input
            value={farmName}
            onChange={(e) => setFarmName(e.target.value)}
            placeholder="Nombre del campo"
            className="w-full rounded-xl bg-slate-950 border border-slate-800 px-4 py-3 outline-none focus:border-emerald-500"
          />

          <input
            value={farmLocation}
            onChange={(e) => setFarmLocation(e.target.value)}
            placeholder="Ubicación"
            className="w-full rounded-xl bg-slate-950 border border-slate-800 px-4 py-3 outline-none focus:border-emerald-500"
          />

          <input
            value={farmArea}
            onChange={(e) => setFarmArea(e.target.value)}
            placeholder="Superficie total"
            type="number"
            className="w-full rounded-xl bg-slate-950 border border-slate-800 px-4 py-3 outline-none focus:border-emerald-500"
          />

          <button
            onClick={handleCreateFarm}
            className="w-full rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold py-3 transition"
          >
            Crear campo
          </button>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h2 className="text-xl font-semibold">
            Nuevo lote
          </h2>

          <select
            value={plotFarmId}
            onChange={(e) => setPlotFarmId(e.target.value)}
            className="w-full rounded-xl bg-slate-950 border border-slate-800 px-4 py-3 outline-none focus:border-emerald-500"
          >
            <option value="">Seleccionar campo</option>

            {farms.map((farm) => (
              <option key={farm.id} value={farm.id}>
                {farm.name}
              </option>
            ))}
          </select>

          <input
            value={plotName}
            onChange={(e) => setPlotName(e.target.value)}
            placeholder="Nombre del lote"
            className="w-full rounded-xl bg-slate-950 border border-slate-800 px-4 py-3 outline-none focus:border-emerald-500"
          />

          <input
            value={plotArea}
            onChange={(e) => setPlotArea(e.target.value)}
            placeholder="Superficie"
            type="number"
            className="w-full rounded-xl bg-slate-950 border border-slate-800 px-4 py-3 outline-none focus:border-emerald-500"
          />

          <input
            value={plotCrop}
            onChange={(e) => setPlotCrop(e.target.value)}
            placeholder="Cultivo actual"
            className="w-full rounded-xl bg-slate-950 border border-slate-800 px-4 py-3 outline-none focus:border-emerald-500"
          />

          <button
            onClick={handleCreatePlot}
            className="w-full rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold py-3 transition"
          >
            Crear lote
          </button>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h2 className="text-xl font-semibold">
            Nuevo cultivo
          </h2>

          <select
            value={cropPlotId}
            onChange={(e) => setCropPlotId(e.target.value)}
            className="w-full rounded-xl bg-slate-950 border border-slate-800 px-4 py-3 outline-none focus:border-emerald-500"
          >
            <option value="">Seleccionar lote</option>

            {plots.map((plot) => (
              <option key={plot.id} value={plot.id}>
                {plot.name}
              </option>
            ))}
          </select>

          <input
            value={cropName}
            onChange={(e) => setCropName(e.target.value)}
            placeholder="Cultivo"
            className="w-full rounded-xl bg-slate-950 border border-slate-800 px-4 py-3 outline-none focus:border-emerald-500"
          />

          <input
            value={cropVariety}
            onChange={(e) => setCropVariety(e.target.value)}
            placeholder="Variedad"
            className="w-full rounded-xl bg-slate-950 border border-slate-800 px-4 py-3 outline-none focus:border-emerald-500"
          />

          <button
            onClick={handleCreateCrop}
            className="w-full rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold py-3 transition"
          >
            Crear cultivo
          </button>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-slate-800">
          <h2 className="text-xl font-semibold">
            Estructura agrícola
          </h2>

          <p className="text-sm text-slate-400 mt-1">
            Relación entre campos, lotes y cultivos.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-950 text-slate-400">
              <tr>
                <th className="text-left px-6 py-4">Campo</th>
                <th className="text-left px-6 py-4">Ubicación</th>
                <th className="text-left px-6 py-4">Lote</th>
                <th className="text-left px-6 py-4">Superficie</th>
                <th className="text-left px-6 py-4">Cultivo</th>
                <th className="text-left px-6 py-4">Estado</th>
                <th className="text-right px-6 py-4">Acciones</th>
              </tr>
            </thead>

            <tbody>
              {plots.map((plot) => {
                const crop = crops.find(
                  (item) => item.plotId === plot.id,
                );

                return (
                  <tr
                    key={plot.id}
                    className="border-t border-slate-800 hover:bg-slate-800/40 transition"
                  >
                    <td className="px-6 py-4 font-semibold">
                      {plot.farm?.name || "Sin campo"}
                    </td>

                    <td className="px-6 py-4 text-slate-300">
                      {plot.farm?.location || "-"}
                    </td>

                    <td className="px-6 py-4 text-slate-300">
                      {plot.name}
                    </td>

                    <td className="px-6 py-4 text-slate-300">
                      {plot.area || 0} ha
                    </td>

                    <td className="px-6 py-4 text-slate-300">
                      {crop?.name || plot.crop || "-"}
                    </td>

                    <td className="px-6 py-4">
                      <span className="px-3 py-1 rounded-full text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                        {crop?.status || plot.status || "Activo"}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        {crop && (
                          <button
                            onClick={async () => {
                              await deleteCrop(crop.id);
                              await loadData();
                            }}
                            className="px-3 py-2 rounded-lg bg-red-500 hover:bg-red-400 text-white font-semibold transition"
                          >
                            Eliminar cultivo
                          </button>
                        )}

                        <button
                          onClick={async () => {
                            await deletePlot(plot.id);
                            await loadData();
                          }}
                          className="px-3 py-2 rounded-lg bg-red-500 hover:bg-red-400 text-white font-semibold transition"
                        >
                          Eliminar lote
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {plots.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-10 text-center text-slate-400"
                  >
                    No hay lotes registrados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <h2 className="text-xl font-semibold mb-4">
          Campos registrados
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {farms.map((farm) => (
            <div
              key={farm.id}
              className="bg-slate-950 border border-slate-800 rounded-xl p-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-semibold">{farm.name}</h3>

                  <p className="text-sm text-slate-400">
                    {farm.location || "Sin ubicación"}
                  </p>

                  <p className="text-sm text-slate-500 mt-1">
                    {farm.area || 0} ha
                  </p>
                </div>

                <button
                  onClick={async () => {
                    await deleteFarm(farm.id);
                    await loadData();
                  }}
                  className="px-3 py-2 rounded-lg bg-red-500 hover:bg-red-400 text-white text-sm font-semibold transition"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}

          {farms.length === 0 && (
            <p className="text-slate-400">
              No hay campos registrados.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}