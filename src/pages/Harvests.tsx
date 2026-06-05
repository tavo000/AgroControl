import { useEffect, useMemo, useState } from "react";

import {
  BarChart3,
  Download,
  Layers,
  Map,
  Package,
  Sprout,
  TrendingUp,
  Wheat,
} from "lucide-react";

import {
  createHarvest,
  deleteHarvest,
  getCrops,
  getHarvests,
} from "../services/machineService";

interface Crop {
  id: number;
  name: string;
  variety?: string;
  plot?: {
    name: string;
    farm?: {
      name: string;
    };
  };
  campaign?: {
    name: string;
  };
}

interface Harvest {
  id: number;
  cropId: number;
  harvestDate?: string;
  totalProduction: number;
  harvestedArea: number;
  yieldPerHectare: number;
  unit: string;
  campaign?: string;
  observations?: string;
  crop?: Crop;
}

export default function Harvests() {
  const [crops, setCrops] = useState<Crop[]>([]);
  const [harvests, setHarvests] =
    useState<Harvest[]>([]);

  const [selectedCampaign, setSelectedCampaign] =
    useState("ALL");

  const [cropId, setCropId] = useState("");
  const [harvestDate, setHarvestDate] =
    useState("");
  const [totalProduction, setTotalProduction] =
    useState("");
  const [harvestedArea, setHarvestedArea] =
    useState("");
  const [unit, setUnit] = useState("tn");
  const [observations, setObservations] =
    useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [cropsData, harvestsData] =
      await Promise.all([
        getCrops(),
        getHarvests(),
      ]);

    setCrops(cropsData);
    setHarvests(harvestsData);
  };

  const selectedCrop = crops.find(
    (crop) => crop.id === Number(cropId),
  );

  const campaigns = useMemo(() => {
    return Array.from(
      new Set(
        harvests
          .map(
            (harvest) =>
              harvest.campaign ||
              harvest.crop?.campaign?.name,
          )
          .filter(Boolean),
      ),
    ) as string[];
  }, [harvests]);

  const filteredHarvests =
    selectedCampaign === "ALL"
      ? harvests
      : harvests.filter(
          (harvest) =>
            (harvest.campaign ||
              harvest.crop?.campaign?.name) ===
            selectedCampaign,
        );

  const totalHarvestProduction =
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

  const previewYield =
    Number(harvestedArea) > 0
      ? (
          Number(totalProduction || 0) /
          Number(harvestedArea)
        ).toFixed(2)
      : "0";

  const handleCreateHarvest = async () => {
    if (
      !cropId ||
      !totalProduction ||
      !harvestedArea
    ) {
      return;
    }

    const production = Number(totalProduction);
    const area = Number(harvestedArea);

    await createHarvest({
      cropId: Number(cropId),
      harvestDate:
        harvestDate || undefined,
      totalProduction: production,
      harvestedArea: area,
      yieldPerHectare:
        area > 0 ? production / area : 0,
      unit,
      campaign:
        selectedCrop?.campaign?.name ||
        undefined,
      observations,
    });

    setCropId("");
    setHarvestDate("");
    setTotalProduction("");
    setHarvestedArea("");
    setUnit("tn");
    setObservations("");

    await loadData();
  };

  const exportCsv = () => {
    const headers = [
      "Cultivo",
      "Campo",
      "Lote",
      "Campaña",
      "Producción",
      "Área",
      "Rendimiento",
      "Unidad",
      "Observaciones",
    ];

    const rows = filteredHarvests.map(
      (harvest) => [
        harvest.crop?.name || "",
        harvest.crop?.plot?.farm?.name || "",
        harvest.crop?.plot?.name || "",
        harvest.campaign ||
          harvest.crop?.campaign?.name ||
          "",
        harvest.totalProduction,
        harvest.harvestedArea,
        harvest.yieldPerHectare,
        harvest.unit,
        harvest.observations || "",
      ],
    );

    const csvContent = [
      headers.join(","),
      ...rows.map((row) =>
        row
          .map((value) => `"${value}"`)
          .join(","),
      ),
    ].join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "cosechas.csv";
    link.click();

    URL.revokeObjectURL(url);
  };

  const kpis = [
    {
      title: "Producción Total",
      value: `${totalHarvestProduction.toFixed(
        0,
      )} tn`,
      icon: Wheat,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
    },
    {
      title: "Área Cosechada",
      value: `${totalHarvestedArea.toFixed(
        0,
      )} ha`,
      icon: Map,
      color: "text-cyan-400",
      bg: "bg-cyan-500/10",
    },
    {
      title: "Rendimiento Promedio",
      value: `${averageYield} tn/ha`,
      icon: TrendingUp,
      color: "text-yellow-400",
      bg: "bg-yellow-500/10",
    },
    {
      title: "Cosechas Registradas",
      value: filteredHarvests.length.toString(),
      icon: Package,
      color: "text-violet-400",
      bg: "bg-violet-500/10",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          Cosechas
        </h1>

        <p className="text-slate-400 mt-1">
          Registro productivo por cultivo, campaña,
          campo y lote.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {kpis.map((kpi) => (
          <div
            key={kpi.title}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-6"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-400">
                {kpi.title}
              </p>

              <div
                className={`${kpi.bg} ${kpi.color} rounded-xl p-2`}
              >
                <kpi.icon size={20} />
              </div>
            </div>

            <h2
              className={`text-3xl font-bold mt-4 ${kpi.color}`}
            >
              {kpi.value}
            </h2>
          </div>
        ))}
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-emerald-500/10 text-emerald-400 rounded-xl p-2">
            <Sprout size={22} />
          </div>

          <div>
            <h2 className="text-xl font-semibold">
              Nueva cosecha
            </h2>

            <p className="text-sm text-slate-400">
              Carga productiva con rendimiento
              automático.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          <select
            value={cropId}
            onChange={(event) =>
              setCropId(event.target.value)
            }
            className="rounded-xl bg-slate-950 border border-slate-800 px-4 py-3 outline-none focus:border-emerald-500"
          >
            <option value="">
              Seleccionar cultivo
            </option>

            {crops.map((crop) => (
              <option
                key={crop.id}
                value={crop.id}
              >
                {crop.name}
                {crop.plot?.name
                  ? ` - ${crop.plot.name}`
                  : ""}
              </option>
            ))}
          </select>

          <input
            type="date"
            value={harvestDate}
            onChange={(event) =>
              setHarvestDate(
                event.target.value,
              )
            }
            className="rounded-xl bg-slate-950 border border-slate-800 px-4 py-3 outline-none focus:border-emerald-500"
          />

          <input
            type="number"
            value={totalProduction}
            onChange={(event) =>
              setTotalProduction(
                event.target.value,
              )
            }
            placeholder="Producción total"
            className="rounded-xl bg-slate-950 border border-slate-800 px-4 py-3 outline-none focus:border-emerald-500"
          />

          <input
            type="number"
            value={harvestedArea}
            onChange={(event) =>
              setHarvestedArea(
                event.target.value,
              )
            }
            placeholder="Área cosechada"
            className="rounded-xl bg-slate-950 border border-slate-800 px-4 py-3 outline-none focus:border-emerald-500"
          />

          <select
            value={unit}
            onChange={(event) =>
              setUnit(event.target.value)
            }
            className="rounded-xl bg-slate-950 border border-slate-800 px-4 py-3 outline-none focus:border-emerald-500"
          >
            <option value="tn">Toneladas</option>
            <option value="kg">Kilogramos</option>
            <option value="qq">Quintales</option>
          </select>

          <input
            value={observations}
            onChange={(event) =>
              setObservations(
                event.target.value,
              )
            }
            placeholder="Observaciones"
            className="rounded-xl bg-slate-950 border border-slate-800 px-4 py-3 outline-none focus:border-emerald-500"
          />
        </div>

        {selectedCrop && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
              <p className="text-xs text-slate-500">
                Cultivo
              </p>
              <p className="font-semibold">
                {selectedCrop.name}
              </p>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
              <p className="text-xs text-slate-500">
                Campo
              </p>
              <p className="font-semibold">
                {selectedCrop.plot?.farm
                  ?.name || "-"}
              </p>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
              <p className="text-xs text-slate-500">
                Lote
              </p>
              <p className="font-semibold">
                {selectedCrop.plot?.name || "-"}
              </p>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
              <p className="text-xs text-slate-500">
                Campaña
              </p>
              <p className="font-semibold">
                {selectedCrop.campaign?.name ||
                  "-"}
              </p>
            </div>
          </div>
        )}

        <div className="mt-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 px-4 py-3 text-sm text-emerald-300 flex items-center gap-2">
          <BarChart3 size={18} />
          <span>
            Rendimiento estimado:{" "}
            <strong>{previewYield} tn/ha</strong>
          </span>
        </div>

        <button
          onClick={handleCreateHarvest}
          className="mt-6 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold px-6 py-3 transition"
        >
          Crear cosecha
        </button>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-slate-800 flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-slate-800 text-slate-300 rounded-xl p-2">
              <Layers size={22} />
            </div>

            <div>
              <h2 className="text-xl font-semibold">
                Historial de cosechas
              </h2>

              <p className="text-sm text-slate-400 mt-1">
                Producción registrada por cultivo.
              </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-3">
            <select
              value={selectedCampaign}
              onChange={(event) =>
                setSelectedCampaign(
                  event.target.value,
                )
              }
              className="rounded-xl bg-slate-950 border border-slate-800 px-4 py-3 outline-none focus:border-emerald-500"
            >
              <option value="ALL">
                Todas las campañas
              </option>

              {campaigns.map((campaign) => (
                <option
                  key={campaign}
                  value={campaign}
                >
                  {campaign}
                </option>
              ))}
            </select>

            <button
              onClick={exportCsv}
              className="rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold px-5 py-3 transition flex items-center gap-2"
            >
              <Download size={18} />
              Exportar CSV
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-950 text-slate-400">
              <tr>
                <th className="text-left px-6 py-4">
                  Cultivo
                </th>
                <th className="text-left px-6 py-4">
                  Campo
                </th>
                <th className="text-left px-6 py-4">
                  Lote
                </th>
                <th className="text-left px-6 py-4">
                  Campaña
                </th>
                <th className="text-left px-6 py-4">
                  Producción
                </th>
                <th className="text-left px-6 py-4">
                  Área
                </th>
                <th className="text-left px-6 py-4">
                  Rendimiento
                </th>
                <th className="text-right px-6 py-4">
                  Acciones
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredHarvests.map((harvest) => (
                <tr
                  key={harvest.id}
                  className="border-t border-slate-800 hover:bg-slate-800/50 transition cursor-pointer"
                >
                  <td className="px-6 py-4 font-semibold">
                    {harvest.crop?.name || "-"}
                  </td>

                  <td className="px-6 py-4 text-slate-300">
                    {harvest.crop?.plot?.farm
                      ?.name || "-"}
                  </td>

                  <td className="px-6 py-4 text-slate-300">
                    {harvest.crop?.plot?.name ||
                      "-"}
                  </td>

                  <td className="px-6 py-4 text-slate-300">
                    {harvest.campaign ||
                      harvest.crop?.campaign
                        ?.name ||
                      "-"}
                  </td>

                  <td className="px-6 py-4 text-emerald-400 font-semibold">
                    {harvest.totalProduction.toFixed(
                      0,
                    )}{" "}
                    {harvest.unit}
                  </td>

                  <td className="px-6 py-4 text-cyan-400 font-semibold">
                    {harvest.harvestedArea.toFixed(
                      0,
                    )}{" "}
                    ha
                  </td>

                  <td className="px-6 py-4 text-yellow-400 font-semibold">
                    {harvest.yieldPerHectare.toFixed(
                      2,
                    )}{" "}
                    tn/ha
                  </td>

                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={async () => {
                        await deleteHarvest(
                          harvest.id,
                        );
                        await loadData();
                      }}
                      className="px-3 py-2 rounded-lg bg-red-500 hover:bg-red-400 text-white font-semibold transition"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}

              {filteredHarvests.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
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