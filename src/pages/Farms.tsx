import { useEffect, useState } from "react";

import {
  createCampaign,
  updateCampaign,
  createCrop,
  createFarm,
  createPlot,
  deleteCrop,
  deleteFarm,
  deletePlot,
  getCampaigns,
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

interface Campaign {
  id: number;
  name: string;
  startDate?: string;
  endDate?: string;
  description?: string;
  active: boolean;
  salePricePerTon?: number;
}

interface Crop {
  id: number;
  plotId: number;
  campaignId?: number;
  name: string;
  variety?: string;
  sowingDate?: string;
  expectedHarvest?: string;
  status?: string;
  plot?: Plot;
  campaign?: Campaign;
}

export default function Farms() {
  const [farms, setFarms] = useState<Farm[]>([]);
  const [plots, setPlots] = useState<Plot[]>([]);
  const [crops, setCrops] = useState<Crop[]>([]);
  const [campaigns, setCampaigns] =
    useState<Campaign[]>([]);

  const [farmName, setFarmName] = useState("");
  const [farmLocation, setFarmLocation] =
    useState("");
  const [farmArea, setFarmArea] = useState("");

  const [plotFarmId, setPlotFarmId] =
    useState("");
  const [plotName, setPlotName] = useState("");
  const [plotArea, setPlotArea] = useState("");
  const [plotCrop, setPlotCrop] = useState("");

  const [cropPlotId, setCropPlotId] =
    useState("");
  const [cropCampaignId, setCropCampaignId] =
    useState("");
  const [cropName, setCropName] = useState("");
  const [cropVariety, setCropVariety] =
    useState("");

  const [campaignName, setCampaignName] =
    useState("");
  const [
    campaignDescription,
    setCampaignDescription,
  ] = useState("");

  const [
  campaignSalePricePerTon,
  setCampaignSalePricePerTon,
] = useState("");

  const [
  editingCampaignId,
  setEditingCampaignId,
] = useState<number | null>(null);

const [
  editingCampaignName,
  setEditingCampaignName,
] = useState("");

const [
  editingCampaignDescription,
  setEditingCampaignDescription,
] = useState("");

const [
  editingCampaignSalePricePerTon,
  setEditingCampaignSalePricePerTon,
] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [
      farmsData,
      plotsData,
      cropsData,
      campaignsData,
    ] = await Promise.all([
      getFarms(),
      getPlots(),
      getCrops(),
      getCampaigns(),
    ]);

    setFarms(farmsData);
    setPlots(plotsData);
    setCrops(cropsData);
    setCampaigns(campaignsData);
  };

  const handleCreateFarm = async () => {
    if (!farmName.trim()) return;

    await createFarm({
      name: farmName,
      location: farmLocation,
      area: farmArea
        ? Number(farmArea)
        : undefined,
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
      area: plotArea
        ? Number(plotArea)
        : undefined,
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
      campaignId: cropCampaignId
        ? Number(cropCampaignId)
        : undefined,
      name: cropName,
      variety: cropVariety,
      status: "Activo",
    });

    setCropPlotId("");
    setCropCampaignId("");
    setCropName("");
    setCropVariety("");

    await loadData();
  };

  const handleCreateCampaign = async () => {
  if (!campaignName.trim()) return;

  await createCampaign({
    name: campaignName,
    description: campaignDescription,
    active: true,
    salePricePerTon: campaignSalePricePerTon
      ? Number(campaignSalePricePerTon)
      : 0,
  });

  setCampaignName("");
  setCampaignDescription("");
  setCampaignSalePricePerTon("");

  await loadData();
};

const handleStartEditCampaign = (
  campaign: Campaign,
) => {
  setEditingCampaignId(campaign.id);
  setEditingCampaignName(campaign.name);
  setEditingCampaignDescription(
    campaign.description || "",
  );
  setEditingCampaignSalePricePerTon(
    String(campaign.salePricePerTon || ""),
  );
};

const handleCancelEditCampaign = () => {
  setEditingCampaignId(null);
  setEditingCampaignName("");
  setEditingCampaignDescription("");
  setEditingCampaignSalePricePerTon("");
};

const handleUpdateCampaign = async () => {
  if (!editingCampaignId) return;
  if (!editingCampaignName.trim()) return;

  await updateCampaign(editingCampaignId, {
    name: editingCampaignName,
    description: editingCampaignDescription,
    salePricePerTon:
      editingCampaignSalePricePerTon
        ? Number(
            editingCampaignSalePricePerTon,
          )
        : 0,
  });

  handleCancelEditCampaign();

  await loadData();
};

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          Campos, Lotes, Cultivos y Campañas
        </h1>

        <p className="text-slate-400 mt-1">
          Gestión agrícola por empresa, campo, lote, cultivo y campaña.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h2 className="text-xl font-semibold">
            Nuevo campo
          </h2>

          <input
            value={farmName}
            onChange={(event) =>
              setFarmName(event.target.value)
            }
            placeholder="Nombre del campo"
            className="w-full rounded-xl bg-slate-950 border border-slate-800 px-4 py-3 outline-none focus:border-emerald-500"
          />

          <input
            value={farmLocation}
            onChange={(event) =>
              setFarmLocation(event.target.value)
            }
            placeholder="Ubicación"
            className="w-full rounded-xl bg-slate-950 border border-slate-800 px-4 py-3 outline-none focus:border-emerald-500"
          />

          <input
            value={farmArea}
            onChange={(event) =>
              setFarmArea(event.target.value)
            }
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
            onChange={(event) =>
              setPlotFarmId(event.target.value)
            }
            className="w-full rounded-xl bg-slate-950 border border-slate-800 px-4 py-3 outline-none focus:border-emerald-500"
          >
            <option value="">
              Seleccionar campo
            </option>

            {farms.map((farm) => (
              <option
                key={farm.id}
                value={farm.id}
              >
                {farm.name}
              </option>
            ))}
          </select>

          <input
            value={plotName}
            onChange={(event) =>
              setPlotName(event.target.value)
            }
            placeholder="Nombre del lote"
            className="w-full rounded-xl bg-slate-950 border border-slate-800 px-4 py-3 outline-none focus:border-emerald-500"
          />

          <input
            value={plotArea}
            onChange={(event) =>
              setPlotArea(event.target.value)
            }
            placeholder="Superficie"
            type="number"
            className="w-full rounded-xl bg-slate-950 border border-slate-800 px-4 py-3 outline-none focus:border-emerald-500"
          />

          <input
            value={plotCrop}
            onChange={(event) =>
              setPlotCrop(event.target.value)
            }
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
            onChange={(event) =>
              setCropPlotId(event.target.value)
            }
            className="w-full rounded-xl bg-slate-950 border border-slate-800 px-4 py-3 outline-none focus:border-emerald-500"
          >
            <option value="">
              Seleccionar lote
            </option>

            {plots.map((plot) => (
              <option
                key={plot.id}
                value={plot.id}
              >
                {plot.name}
              </option>
            ))}
          </select>

          <select
            value={cropCampaignId}
            onChange={(event) =>
              setCropCampaignId(event.target.value)
            }
            className="w-full rounded-xl bg-slate-950 border border-slate-800 px-4 py-3 outline-none focus:border-emerald-500"
          >
            <option value="">
              Seleccionar campaña
            </option>

            {campaigns.map((campaign) => (
              <option
                key={campaign.id}
                value={campaign.id}
              >
                {campaign.name}
              </option>
            ))}
          </select>

          <input
            value={cropName}
            onChange={(event) =>
              setCropName(event.target.value)
            }
            placeholder="Cultivo"
            className="w-full rounded-xl bg-slate-950 border border-slate-800 px-4 py-3 outline-none focus:border-emerald-500"
          />

          <input
            value={cropVariety}
            onChange={(event) =>
              setCropVariety(event.target.value)
            }
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

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h2 className="text-xl font-semibold">
            Nueva campaña
          </h2>

          <input
            value={campaignName}
            onChange={(event) =>
              setCampaignName(event.target.value)
            }
            placeholder="Nombre de campaña"
            className="w-full rounded-xl bg-slate-950 border border-slate-800 px-4 py-3 outline-none focus:border-emerald-500"
          />

          <textarea
            value={campaignDescription}
            onChange={(event) =>
              setCampaignDescription(
                event.target.value,
              )
            }
            placeholder="Descripción"
            rows={4}
            className="w-full rounded-xl bg-slate-950 border border-slate-800 px-4 py-3 outline-none focus:border-emerald-500 resize-none"
          />

          <input
  value={campaignSalePricePerTon}
  onChange={(event) =>
    setCampaignSalePricePerTon(event.target.value)
  }
  placeholder="Precio por tonelada"
  type="number"
  className="w-full rounded-xl bg-slate-950 border border-slate-800 px-4 py-3 outline-none focus:border-emerald-500"
/>

          <button
            onClick={handleCreateCampaign}
            className="w-full rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold py-3 transition"
          >
            Crear campaña
          </button>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-slate-800">
          <h2 className="text-xl font-semibold">
            Estructura agrícola
          </h2>

          <p className="text-sm text-slate-400 mt-1">
            Relación entre campos, lotes, campañas y cultivos.
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
                  Ubicación
                </th>

                <th className="text-left px-6 py-4">
                  Lote
                </th>

                <th className="text-left px-6 py-4">
                  Superficie
                </th>

                <th className="text-left px-6 py-4">
                  Campaña
                </th>

                <th className="text-left px-6 py-4">
                  Cultivo
                </th>

                <th className="text-left px-6 py-4">
                  Estado
                </th>

                <th className="text-right px-6 py-4">
                  Acciones
                </th>
              </tr>
            </thead>

            <tbody>
              {plots.map((plot) => {
                const crop = crops.find(
                  (item) =>
                    item.plotId === plot.id,
                );

                return (
                  <tr
                    key={plot.id}
                    className="border-t border-slate-800 hover:bg-slate-800/40 transition"
                  >
                    <td className="px-6 py-4 font-semibold">
                      {plot.farm?.name ||
                        "Sin campo"}
                    </td>

                    <td className="px-6 py-4 text-slate-300">
                      {plot.farm?.location ||
                        "-"}
                    </td>

                    <td className="px-6 py-4 text-slate-300">
                      {plot.name}
                    </td>

                    <td className="px-6 py-4 text-slate-300">
                      {plot.area || 0} ha
                    </td>

                    <td className="px-6 py-4 text-slate-300">
                      {crop?.campaign?.name ||
                        "-"}
                    </td>

                    <td className="px-6 py-4 text-slate-300">
                      {crop?.name ||
                        plot.crop ||
                        "-"}
                    </td>

                    <td className="px-6 py-4">
                      <span className="px-3 py-1 rounded-full text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                        {crop?.status ||
                          plot.status ||
                          "Activo"}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        {crop && (
                          <button
                            onClick={async () => {
                              await deleteCrop(
                                crop.id,
                              );
                              await loadData();
                            }}
                            className="px-3 py-2 rounded-lg bg-red-500 hover:bg-red-400 text-white font-semibold transition"
                          >
                            Eliminar cultivo
                          </button>
                        )}

                        <button
                          onClick={async () => {
                            await deletePlot(
                              plot.id,
                            );
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
                    colSpan={8}
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
                  <h3 className="font-semibold">
                    {farm.name}
                  </h3>

                  <p className="text-sm text-slate-400 mt-2">
                    {farm.location || "Sin ubicación"}
                  </p>

                  <p className="text-sm text-emerald-400 mt-2 font-semibold">
                    {farm.area || 0} ha
                  </p>
                </div>

                <button
                  onClick={async () => {
                    await deleteFarm(farm.id);
                    await loadData();
                  }}
                  className="px-3 py-2 rounded-lg bg-red-500 hover:bg-red-400 text-white font-semibold transition"
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

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <h2 className="text-xl font-semibold mb-4">
          Campañas agrícolas
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {campaigns.map((campaign) => (
            <div
              key={campaign.id}
              className="bg-slate-950 border border-slate-800 rounded-xl p-4"
            >
              <div className="flex items-start justify-between gap-4">
                {editingCampaignId === campaign.id ? (
                  <div className="w-full space-y-3">
                    <input
                      value={editingCampaignName}
                      onChange={(event) =>
                        setEditingCampaignName(
                          event.target.value,
                        )
                      }
                      className="w-full rounded-xl bg-slate-900 border border-slate-800 px-4 py-3 outline-none focus:border-emerald-500"
                    />

                    <textarea
                      value={editingCampaignDescription}
                      onChange={(event) =>
                        setEditingCampaignDescription(
                          event.target.value,
                        )
                      }
                      rows={3}
                      className="w-full rounded-xl bg-slate-900 border border-slate-800 px-4 py-3 outline-none focus:border-emerald-500 resize-none"
                    />

                    <input
                      type="number"
                      value={editingCampaignSalePricePerTon}
                      onChange={(event) =>
                        setEditingCampaignSalePricePerTon(
                          event.target.value,
                        )
                      }
                      placeholder="Precio por tonelada"
                      className="w-full rounded-xl bg-slate-900 border border-slate-800 px-4 py-3 outline-none focus:border-emerald-500"
                    />

                    <div className="flex gap-3">
                      <button
                        onClick={handleUpdateCampaign}
                        className="rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold px-4 py-2 transition"
                      >
                        Guardar
                      </button>

                      <button
                        onClick={handleCancelEditCampaign}
                        className="rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold px-4 py-2 transition"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="w-full">
                    <h3 className="font-semibold">
                      {campaign.name}
                    </h3>

                    <p className="text-sm text-slate-400 mt-2">
                      {campaign.description ||
                        "Sin descripción"}
                    </p>

                    <div className="mt-3">
                      <span
                        className={
                          campaign.active
                            ? "px-3 py-1 rounded-full text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                            : "px-3 py-1 rounded-full text-xs bg-red-500/10 text-red-400 border border-red-500/30"
                        }
                      >
                        {campaign.active
                          ? "Activa"
                          : "Inactiva"}
                      </span>

                      <p className="text-sm text-emerald-400 mt-2 font-semibold">
                        $ {(campaign.salePricePerTon || 0).toLocaleString("es-AR")} / tn
                      </p>

                      <button
                        onClick={() =>
                          handleStartEditCampaign(campaign)
                        }
                        className="mt-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold px-4 py-2 transition"
                      >
                        Editar campaña
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}

          {campaigns.length === 0 && (
            <p className="text-slate-400">
              No hay campañas registradas.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
