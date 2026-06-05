import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Banknote,
  Download,
  Layers,
  Plus,
  Receipt,
  Sprout,
  Trash2,
} from "lucide-react";

import {
  createAgriculturalCost,
  deleteAgriculturalCost,
  getAgriculturalCosts,
  getCampaigns,
} from "../services/machineService";

interface Campaign {
  id: number;
  name: string;
  active: boolean;
}

interface AgriculturalCost {
  id: number;
  campaignId: number;
  category: string;
  description?: string;
  quantity: number;
  unitCost: number;
  totalCost: number;
  costDate?: string;
  supplier?: string;
  campaign?: Campaign;
}

export default function AgriculturalCosts() {
  const [campaigns, setCampaigns] =
    useState<Campaign[]>([]);

  const [costs, setCosts] =
    useState<AgriculturalCost[]>([]);

  const [selectedCampaign, setSelectedCampaign] =
    useState("ALL");

  const [campaignId, setCampaignId] =
    useState("");

  const [category, setCategory] =
    useState("Semillas");

  const [description, setDescription] =
    useState("");

  const [quantity, setQuantity] =
    useState("1");

  const [unitCost, setUnitCost] =
    useState("");

  const [costDate, setCostDate] =
    useState("");

  const [supplier, setSupplier] =
    useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [campaignsData, costsData] =
      await Promise.all([
        getCampaigns(),
        getAgriculturalCosts(),
      ]);

    setCampaigns(campaignsData);
    setCosts(costsData);
  };

  const filteredCosts =
    selectedCampaign === "ALL"
      ? costs
      : costs.filter(
          (cost) =>
            cost.campaign?.name ===
            selectedCampaign,
        );

  const totalInvested =
    filteredCosts.reduce(
      (acc, cost) => acc + cost.totalCost,
      0,
    );

  const totalRecords = filteredCosts.length;

  const averageCost =
    totalRecords > 0
      ? totalInvested / totalRecords
      : 0;

  const categories = useMemo(() => {
    return Array.from(
      new Set(
        costs
          .map((cost) => cost.category)
          .filter(Boolean),
      ),
    );
  }, [costs]);

  const campaignsFilter = useMemo(() => {
    return Array.from(
      new Set(
        costs
          .map((cost) => cost.campaign?.name)
          .filter(Boolean),
      ),
    ) as string[];
  }, [costs]);

  const mainCategory =
    categories.length > 0
      ? categories
          .map((cat) => ({
            name: cat,
            total: filteredCosts
              .filter(
                (cost) =>
                  cost.category === cat,
              )
              .reduce(
                (acc, cost) =>
                  acc + cost.totalCost,
                0,
              ),
          }))
          .sort((a, b) => b.total - a.total)[0]
          ?.name || "-"
      : "-";

  const previewTotal =
    Number(quantity || 0) *
    Number(unitCost || 0);

  const handleCreate = async () => {
    if (!campaignId || !category || !unitCost) {
      return;
    }

    await createAgriculturalCost({
      campaignId: Number(campaignId),
      category,
      description,
      quantity: Number(quantity || 1),
      unitCost: Number(unitCost),
      costDate: costDate || undefined,
      supplier,
    });

    setCampaignId("");
    setCategory("Semillas");
    setDescription("");
    setQuantity("1");
    setUnitCost("");
    setCostDate("");
    setSupplier("");

    await loadData();
  };

  const exportCsv = () => {
    const headers = [
      "Campaña",
      "Categoría",
      "Descripción",
      "Cantidad",
      "Costo unitario",
      "Costo total",
      "Fecha",
      "Proveedor",
    ];

    const rows = filteredCosts.map((cost) => [
      cost.campaign?.name || "",
      cost.category,
      cost.description || "",
      cost.quantity,
      cost.unitCost,
      cost.totalCost,
      cost.costDate
        ? new Date(
            cost.costDate,
          ).toLocaleDateString()
        : "",
      cost.supplier || "",
    ]);

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
    link.download = "costos-agricolas.csv";
    link.click();

    URL.revokeObjectURL(url);
  };

  const kpis = [
    {
      title: "Inversión Total",
      value: `$ ${totalInvested.toLocaleString(
        "es-AR",
      )}`,
      icon: Banknote,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
    },
    {
      title: "Costos Registrados",
      value: totalRecords.toString(),
      icon: Receipt,
      color: "text-cyan-400",
      bg: "bg-cyan-500/10",
    },
    {
      title: "Costo Promedio",
      value: `$ ${averageCost.toLocaleString(
        "es-AR",
      )}`,
      icon: Layers,
      color: "text-yellow-400",
      bg: "bg-yellow-500/10",
    },
    {
      title: "Mayor Rubro",
      value: mainCategory,
      icon: Sprout,
      color: "text-violet-400",
      bg: "bg-violet-500/10",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          Costos Agrícolas
        </h1>

        <p className="text-slate-400 mt-1">
          Control de inversión, insumos y gastos
          operativos por campaña.
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
            <Plus size={22} />
          </div>

          <div>
            <h2 className="text-xl font-semibold">
              Nuevo costo agrícola
            </h2>

            <p className="text-sm text-slate-400">
              Registra insumos, labores, combustible,
              cosecha, transporte y otros gastos.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          <select
            value={campaignId}
            onChange={(event) =>
              setCampaignId(event.target.value)
            }
            className="rounded-xl bg-slate-950 border border-slate-800 px-4 py-3 outline-none focus:border-emerald-500"
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

          <select
            value={category}
            onChange={(event) =>
              setCategory(event.target.value)
            }
            className="rounded-xl bg-slate-950 border border-slate-800 px-4 py-3 outline-none focus:border-emerald-500"
          >
            <option value="Semillas">
              Semillas
            </option>
            <option value="Fertilizantes">
              Fertilizantes
            </option>
            <option value="Agroquímicos">
              Agroquímicos
            </option>
            <option value="Combustible">
              Combustible
            </option>
            <option value="Mano de obra">
              Mano de obra
            </option>
            <option value="Mantenimiento">
              Mantenimiento
            </option>
            <option value="Cosecha">
              Cosecha
            </option>
            <option value="Transporte">
              Transporte
            </option>
            <option value="Otros">
              Otros
            </option>
          </select>

          <input
            value={description}
            onChange={(event) =>
              setDescription(
                event.target.value,
              )
            }
            placeholder="Descripción"
            className="rounded-xl bg-slate-950 border border-slate-800 px-4 py-3 outline-none focus:border-emerald-500"
          />

          <input
            type="number"
            value={quantity}
            onChange={(event) =>
              setQuantity(event.target.value)
            }
            placeholder="Cantidad"
            className="rounded-xl bg-slate-950 border border-slate-800 px-4 py-3 outline-none focus:border-emerald-500"
          />

          <input
            type="number"
            value={unitCost}
            onChange={(event) =>
              setUnitCost(event.target.value)
            }
            placeholder="Costo unitario"
            className="rounded-xl bg-slate-950 border border-slate-800 px-4 py-3 outline-none focus:border-emerald-500"
          />

          <input
            type="date"
            value={costDate}
            onChange={(event) =>
              setCostDate(event.target.value)
            }
            className="rounded-xl bg-slate-950 border border-slate-800 px-4 py-3 outline-none focus:border-emerald-500"
          />

          <input
            value={supplier}
            onChange={(event) =>
              setSupplier(event.target.value)
            }
            placeholder="Proveedor"
            className="rounded-xl bg-slate-950 border border-slate-800 px-4 py-3 outline-none focus:border-emerald-500"
          />
        </div>

        <div className="mt-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 px-4 py-3 text-sm text-emerald-300">
          Total estimado:{" "}
          <strong>
            $ {previewTotal.toLocaleString("es-AR")}
          </strong>
        </div>

        <button
          onClick={handleCreate}
          className="mt-6 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold px-6 py-3 transition"
        >
          Crear costo
        </button>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-slate-800 flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-semibold">
              Historial de costos
            </h2>

            <p className="text-sm text-slate-400 mt-1">
              Gastos agrícolas registrados por campaña.
            </p>
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

              {campaignsFilter.map((campaign) => (
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
                  Campaña
                </th>
                <th className="text-left px-6 py-4">
                  Categoría
                </th>
                <th className="text-left px-6 py-4">
                  Descripción
                </th>
                <th className="text-left px-6 py-4">
                  Cantidad
                </th>
                <th className="text-left px-6 py-4">
                  Unitario
                </th>
                <th className="text-left px-6 py-4">
                  Total
                </th>
                <th className="text-left px-6 py-4">
                  Proveedor
                </th>
                <th className="text-right px-6 py-4">
                  Acciones
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredCosts.map((cost) => (
                <tr
                  key={cost.id}
                  className="border-t border-slate-800 hover:bg-slate-800/50 transition"
                >
                  <td className="px-6 py-4 font-semibold">
                    {cost.campaign?.name || "-"}
                  </td>

                  <td className="px-6 py-4 text-emerald-400 font-semibold">
                    {cost.category}
                  </td>

                  <td className="px-6 py-4 text-slate-300">
                    {cost.description || "-"}
                  </td>

                  <td className="px-6 py-4 text-slate-300">
                    {cost.quantity}
                  </td>

                  <td className="px-6 py-4 text-cyan-400 font-semibold">
                    ${" "}
                    {cost.unitCost.toLocaleString(
                      "es-AR",
                    )}
                  </td>

                  <td className="px-6 py-4 text-yellow-400 font-semibold">
                    ${" "}
                    {cost.totalCost.toLocaleString(
                      "es-AR",
                    )}
                  </td>

                  <td className="px-6 py-4 text-slate-300">
                    {cost.supplier || "-"}
                  </td>

                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={async () => {
                        await deleteAgriculturalCost(
                          cost.id,
                        );
                        await loadData();
                      }}
                      className="px-3 py-2 rounded-lg bg-red-500 hover:bg-red-400 text-white font-semibold transition inline-flex items-center gap-2"
                    >
                      <Trash2 size={16} />
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}

              {filteredCosts.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    className="px-6 py-10 text-center text-slate-400"
                  >
                    No hay costos agrícolas registrados.
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