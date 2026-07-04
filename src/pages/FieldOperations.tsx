import { useEffect, useMemo, useState } from "react";

import {
  Activity,
  CalendarDays,
  ClipboardList,
  Layers,
  Plus,
  Trash2,
} from "lucide-react";

import {
  createFieldOperation,
  deleteFieldOperation,
  getCampaigns,
  getFarms,
  getFieldOperations,
  getInventoryItems,
  getPlots,
} from "../services/machineService";

interface Farm {
  id: number;
  name: string;
}

interface Plot {
  id: number;
  farmId: number;
  name: string;
  area?: number;
}

interface Campaign {
  id: number;
  name: string;
}

interface InventoryItem {
  id: number;
  name: string;
  unit: string;
  currentStock: number;
  averageCost: number;
}

interface OperationInput {
  itemId: string;
  quantity: string;
  unitCost: string;
}

interface FieldOperation {
  id: number;
  type: string;
  title: string;
  description?: string;
  operationDate?: string;
  areaWorked: number;
  laborCost: number;
  machineryCost: number;
  otherCost: number;
  totalInputCost: number;
  totalOperationCost: number;
  farm?: Farm;
  plot?: Plot;
  campaign?: Campaign;
}

export default function FieldOperations() {
  const [operations, setOperations] = useState<FieldOperation[]>([]);
  const [farms, setFarms] = useState<Farm[]>([]);
  const [plots, setPlots] = useState<Plot[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [items, setItems] = useState<InventoryItem[]>([]);

  const [farmId, setFarmId] = useState("");
  const [plotId, setPlotId] = useState("");
  const [campaignId, setCampaignId] = useState("");
  const [type, setType] = useState("SOWING");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [operationDate, setOperationDate] = useState("");
  const [areaWorked, setAreaWorked] = useState("");
  const [laborCost, setLaborCost] = useState("");
  const [machineryCost, setMachineryCost] = useState("");
  const [otherCost, setOtherCost] = useState("");

  const [operationInputs, setOperationInputs] = useState<OperationInput[]>([
    {
      itemId: "",
      quantity: "",
      unitCost: "",
    },
  ]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [
      operationsData,
      farmsData,
      plotsData,
      campaignsData,
      itemsData,
    ] = await Promise.all([
      getFieldOperations(),
      getFarms(),
      getPlots(),
      getCampaigns(),
      getInventoryItems(),
    ]);

    setOperations(operationsData);
    setFarms(farmsData);
    setPlots(plotsData);
    setCampaigns(campaignsData);
    setItems(itemsData);
  };

  const filteredPlots = plots.filter(
    (plot) =>
      !farmId || plot.farmId === Number(farmId),
  );

  const totalHectares = operations.reduce(
    (acc, operation) => acc + operation.areaWorked,
    0,
  );

  const totalCost = operations.reduce(
    (acc, operation) =>
      acc + operation.totalOperationCost,
    0,
  );

  const operationsThisMonth = useMemo(() => {
    const now = new Date();

    return operations.filter((operation) => {
      if (!operation.operationDate) return false;

      const date = new Date(operation.operationDate);

      return (
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear()
      );
    }).length;
  }, [operations]);

  const previewInputCost = operationInputs.reduce(
    (acc, input) => {
      const selectedItem = items.find(
        (item) => item.id === Number(input.itemId),
      );

      const quantity = Number(input.quantity || 0);
      const unitCost = Number(
        input.unitCost ||
          selectedItem?.averageCost ||
          0,
      );

      return acc + quantity * unitCost;
    },
    0,
  );

  const previewTotalCost =
    previewInputCost +
    Number(laborCost || 0) +
    Number(machineryCost || 0) +
    Number(otherCost || 0);

  const addInputRow = () => {
    setOperationInputs([
      ...operationInputs,
      {
        itemId: "",
        quantity: "",
        unitCost: "",
      },
    ]);
  };

  const updateInputRow = (
    index: number,
    field: keyof OperationInput,
    value: string,
  ) => {
    const nextInputs = [...operationInputs];

    nextInputs[index] = {
      ...nextInputs[index],
      [field]: value,
    };

    setOperationInputs(nextInputs);
  };

  const removeInputRow = (index: number) => {
    setOperationInputs(
      operationInputs.filter((_, itemIndex) => itemIndex !== index),
    );
  };

  const handleCreateOperation = async () => {
    if (!farmId || !plotId || !title.trim()) return;

    const validInputs = operationInputs
      .filter((input) => input.itemId && input.quantity)
      .map((input) => ({
        itemId: Number(input.itemId),
        quantity: Number(input.quantity),
        unitCost: input.unitCost
          ? Number(input.unitCost)
          : undefined,
      }));

    await createFieldOperation({
      farmId: Number(farmId),
      plotId: Number(plotId),
      campaignId: campaignId
        ? Number(campaignId)
        : undefined,
      type: type as
        | "SOWING"
        | "FERTILIZATION"
        | "SPRAYING"
        | "IRRIGATION"
        | "HARVEST"
        | "SOIL_WORK"
        | "MAINTENANCE"
        | "OTHER",
      title,
      description,
      operationDate: operationDate || undefined,
      areaWorked: areaWorked
        ? Number(areaWorked)
        : 0,
      laborCost: laborCost
        ? Number(laborCost)
        : 0,
      machineryCost: machineryCost
        ? Number(machineryCost)
        : 0,
      otherCost: otherCost
        ? Number(otherCost)
        : 0,
      inputs: validInputs,
    });

    setFarmId("");
    setPlotId("");
    setCampaignId("");
    setType("SOWING");
    setTitle("");
    setDescription("");
    setOperationDate("");
    setAreaWorked("");
    setLaborCost("");
    setMachineryCost("");
    setOtherCost("");
    setOperationInputs([
      {
        itemId: "",
        quantity: "",
        unitCost: "",
      },
    ]);

    await loadData();
  };

  const kpis = [
    {
      title: "Labores del mes",
      value: operationsThisMonth.toString(),
      icon: ClipboardList,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
    },
    {
      title: "Hectáreas trabajadas",
      value: `${totalHectares.toFixed(0)} ha`,
      icon: Layers,
      color: "text-cyan-400",
      bg: "bg-cyan-500/10",
    },
    {
      title: "Costo operativo",
      value: `$ ${totalCost.toLocaleString("es-AR")}`,
      icon: Activity,
      color: "text-yellow-400",
      bg: "bg-yellow-500/10",
    },
    {
      title: "Historial",
      value: operations.length.toString(),
      icon: CalendarDays,
      color: "text-violet-400",
      bg: "bg-violet-500/10",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          Labores Agrícolas
        </h1>

        <p className="text-slate-400 mt-1">
          Registro operativo de siembra,
          fertilización, pulverización, riego,
          mantenimiento y otras tareas de campo.
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
              Nueva labor agrícola
            </h2>
            <p className="text-sm text-slate-400">
              Registra una operación y descuenta insumos
              automáticamente del inventario.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          <select
            value={farmId}
            onChange={(event) => {
              setFarmId(event.target.value);
              setPlotId("");
            }}
            className="rounded-xl bg-slate-950 border border-slate-800 px-4 py-3 outline-none focus:border-emerald-500"
          >
            <option value="">Seleccionar campo</option>
            {farms.map((farm) => (
              <option key={farm.id} value={farm.id}>
                {farm.name}
              </option>
            ))}
          </select>

          <select
            value={plotId}
            onChange={(event) =>
              setPlotId(event.target.value)
            }
            className="rounded-xl bg-slate-950 border border-slate-800 px-4 py-3 outline-none focus:border-emerald-500"
          >
            <option value="">Seleccionar lote</option>
            {filteredPlots.map((plot) => (
              <option key={plot.id} value={plot.id}>
                {plot.name}
              </option>
            ))}
          </select>

          <select
            value={campaignId}
            onChange={(event) =>
              setCampaignId(event.target.value)
            }
            className="rounded-xl bg-slate-950 border border-slate-800 px-4 py-3 outline-none focus:border-emerald-500"
          >
            <option value="">Sin campaña</option>
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
            value={type}
            onChange={(event) =>
              setType(event.target.value)
            }
            className="rounded-xl bg-slate-950 border border-slate-800 px-4 py-3 outline-none focus:border-emerald-500"
          >
            <option value="SOWING">Siembra</option>
            <option value="FERTILIZATION">
              Fertilización
            </option>
            <option value="SPRAYING">
              Pulverización
            </option>
            <option value="IRRIGATION">Riego</option>
            <option value="HARVEST">Cosecha</option>
            <option value="SOIL_WORK">
              Trabajo de suelo
            </option>
            <option value="MAINTENANCE">
              Mantenimiento
            </option>
            <option value="OTHER">Otro</option>
          </select>

          <input
            value={title}
            onChange={(event) =>
              setTitle(event.target.value)
            }
            placeholder="Título de la labor"
            className="rounded-xl bg-slate-950 border border-slate-800 px-4 py-3 outline-none focus:border-emerald-500"
          />

          <input
            type="date"
            value={operationDate}
            onChange={(event) =>
              setOperationDate(event.target.value)
            }
            className="rounded-xl bg-slate-950 border border-slate-800 px-4 py-3 outline-none focus:border-emerald-500"
          />

          <input
            type="number"
            value={areaWorked}
            onChange={(event) =>
              setAreaWorked(event.target.value)
            }
            placeholder="Hectáreas trabajadas"
            className="rounded-xl bg-slate-950 border border-slate-800 px-4 py-3 outline-none focus:border-emerald-500"
          />

          <input
            value={description}
            onChange={(event) =>
              setDescription(event.target.value)
            }
            placeholder="Descripción"
            className="rounded-xl bg-slate-950 border border-slate-800 px-4 py-3 outline-none focus:border-emerald-500"
          />

          <input
            type="number"
            value={laborCost}
            onChange={(event) =>
              setLaborCost(event.target.value)
            }
            placeholder="Costo mano de obra"
            className="rounded-xl bg-slate-950 border border-slate-800 px-4 py-3 outline-none focus:border-emerald-500"
          />

          <input
            type="number"
            value={machineryCost}
            onChange={(event) =>
              setMachineryCost(event.target.value)
            }
            placeholder="Costo maquinaria"
            className="rounded-xl bg-slate-950 border border-slate-800 px-4 py-3 outline-none focus:border-emerald-500"
          />

          <input
            type="number"
            value={otherCost}
            onChange={(event) =>
              setOtherCost(event.target.value)
            }
            placeholder="Otros costos"
            className="rounded-xl bg-slate-950 border border-slate-800 px-4 py-3 outline-none focus:border-emerald-500"
          />
        </div>

        <div className="mt-6 bg-slate-950 border border-slate-800 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold">
                Insumos utilizados
              </h3>
              <p className="text-sm text-slate-400">
                Cada insumo se descontará automáticamente
                del inventario.
              </p>
            </div>

            <button
              onClick={addInputRow}
              className="rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold px-4 py-2 transition"
            >
              Agregar insumo
            </button>
          </div>

          <div className="space-y-3">
            {operationInputs.map((input, index) => {
              const selectedItem = items.find(
                (item) =>
                  item.id === Number(input.itemId),
              );

              return (
                <div
                  key={index}
                  className="grid grid-cols-1 md:grid-cols-4 gap-3"
                >
                  <select
                    value={input.itemId}
                    onChange={(event) =>
                      updateInputRow(
                        index,
                        "itemId",
                        event.target.value,
                      )
                    }
                    className="rounded-xl bg-slate-900 border border-slate-800 px-4 py-3 outline-none focus:border-emerald-500"
                  >
                    <option value="">
                      Seleccionar insumo
                    </option>
                    {items.map((item) => (
                      <option
                        key={item.id}
                        value={item.id}
                      >
                        {item.name} - Stock:{" "}
                        {item.currentStock} {item.unit}
                      </option>
                    ))}
                  </select>

                  <input
                    type="number"
                    value={input.quantity}
                    onChange={(event) =>
                      updateInputRow(
                        index,
                        "quantity",
                        event.target.value,
                      )
                    }
                    placeholder="Cantidad"
                    className="rounded-xl bg-slate-900 border border-slate-800 px-4 py-3 outline-none focus:border-emerald-500"
                  />

                  <input
                    type="number"
                    value={input.unitCost}
                    onChange={(event) =>
                      updateInputRow(
                        index,
                        "unitCost",
                        event.target.value,
                      )
                    }
                    placeholder={`Costo unitario ${
                      selectedItem
                        ? selectedItem.averageCost
                        : ""
                    }`}
                    className="rounded-xl bg-slate-900 border border-slate-800 px-4 py-3 outline-none focus:border-emerald-500"
                  />

                  <button
                    onClick={() =>
                      removeInputRow(index)
                    }
                    className="rounded-xl bg-red-500 hover:bg-red-400 text-white font-semibold px-4 py-3 transition inline-flex items-center justify-center gap-2"
                  >
                    <Trash2 size={16} />
                    Quitar
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 px-4 py-3 text-sm text-emerald-300">
          Costo estimado de la labor:{" "}
          <strong>
            $ {previewTotalCost.toLocaleString("es-AR")}
          </strong>
        </div>

        <button
          onClick={handleCreateOperation}
          className="mt-6 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold px-6 py-3 transition"
        >
          Crear labor agrícola
        </button>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-slate-800">
          <h2 className="text-xl font-semibold">
            Historial de labores
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Trazabilidad operativa por campo, lote y campaña.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-950 text-slate-400">
              <tr>
                <th className="text-left px-6 py-4">
                  Labor
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
                  Área
                </th>
                <th className="text-left px-6 py-4">
                  Costo
                </th>
                <th className="text-right px-6 py-4">
                  Acciones
                </th>
              </tr>
            </thead>

            <tbody>
              {operations.map((operation) => (
                <tr
                  key={operation.id}
                  className="border-t border-slate-800 hover:bg-slate-800/50 transition"
                >
                  <td className="px-6 py-4">
                    <p className="font-semibold">
                      {operation.title}
                    </p>
                    <p className="text-xs text-slate-400">
                      {operation.type}
                    </p>
                  </td>

                  <td className="px-6 py-4 text-slate-300">
                    {operation.farm?.name || "-"}
                  </td>

                  <td className="px-6 py-4 text-slate-300">
                    {operation.plot?.name || "-"}
                  </td>

                  <td className="px-6 py-4 text-slate-300">
                    {operation.campaign?.name || "-"}
                  </td>

                  <td className="px-6 py-4 text-cyan-400 font-semibold">
                    {operation.areaWorked.toFixed(0)} ha
                  </td>

                  <td className="px-6 py-4 text-emerald-400 font-semibold">
                    ${" "}
                    {operation.totalOperationCost.toLocaleString(
                      "es-AR",
                    )}
                  </td>

                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={async () => {
                        await deleteFieldOperation(
                          operation.id,
                        );
                        await loadData();
                      }}
                      className="rounded-lg bg-red-500 hover:bg-red-400 text-white px-3 py-2 transition inline-flex items-center gap-2"
                    >
                      <Trash2 size={16} />
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}

              {operations.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-10 text-center text-slate-400"
                  >
                    No hay labores agrícolas registradas.
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