import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  AlertTriangle,
  ArrowDownCircle,
  ArrowUpCircle,
  Boxes,
  Layers,
  PackagePlus,
  Plus,
  Trash2,
} from "lucide-react";

import {
  createInventoryCategory,
  createInventoryItem,
  createInventoryMovement,
  deleteInventoryCategory,
  deleteInventoryItem,
  getCampaigns,
  getInventoryCategories,
  getInventoryItems,
  getInventoryMovements,
} from "../services/machineService";

interface InventoryCategory {
  id: number;
  name: string;
  description?: string;
  active: boolean;
  items?: InventoryItem[];
}

interface InventoryItem {
  id: number;
  categoryId: number;
  name: string;
  description?: string;
  unit: string;
  currentStock: number;
  minimumStock: number;
  averageCost: number;
  active: boolean;
  category?: InventoryCategory;
}

interface InventoryMovement {
  id: number;
  itemId: number;
  campaignId?: number;
  type: "IN" | "OUT" | "ADJUSTMENT";
  quantity: number;
  unitCost: number;
  totalCost: number;
  reason?: string;
  supplier?: string;
  movementDate?: string;
  item?: InventoryItem;
  campaign?: {
    id: number;
    name: string;
  };
}

interface Campaign {
  id: number;
  name: string;
}

export default function Inventory() {
  const [categories, setCategories] =
    useState<InventoryCategory[]>([]);
  const [items, setItems] =
    useState<InventoryItem[]>([]);
  const [movements, setMovements] =
    useState<InventoryMovement[]>([]);
  const [campaigns, setCampaigns] =
    useState<Campaign[]>([]);

  const [categoryName, setCategoryName] =
    useState("");
  const [
    categoryDescription,
    setCategoryDescription,
  ] = useState("");

  const [itemCategoryId, setItemCategoryId] =
    useState("");
  const [itemName, setItemName] =
    useState("");
  const [
    itemDescription,
    setItemDescription,
  ] = useState("");
  const [itemUnit, setItemUnit] =
    useState("kg");
  const [
    itemMinimumStock,
    setItemMinimumStock,
  ] = useState("");
  const [itemAverageCost, setItemAverageCost] =
    useState("");

  const [movementItemId, setMovementItemId] =
    useState("");
  const [
    movementCampaignId,
    setMovementCampaignId,
  ] = useState("");
  const [movementType, setMovementType] =
    useState<"IN" | "OUT" | "ADJUSTMENT">(
      "IN",
    );
  const [
    movementQuantity,
    setMovementQuantity,
  ] = useState("");
  const [movementUnitCost, setMovementUnitCost] =
    useState("");
  const [movementReason, setMovementReason] =
    useState("");
  const [movementSupplier, setMovementSupplier] =
    useState("");
  const [
    createCostFromMovement,
    setCreateCostFromMovement,
  ] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [
      categoriesData,
      itemsData,
      movementsData,
      campaignsData,
    ] = await Promise.all([
      getInventoryCategories(),
      getInventoryItems(),
      getInventoryMovements(),
      getCampaigns(),
    ]);

    setCategories(categoriesData);
    setItems(itemsData);
    setMovements(movementsData);
    setCampaigns(campaignsData);
  };

  const totalStockValue = items.reduce(
    (acc, item) =>
      acc + item.currentStock * item.averageCost,
    0,
  );

  const lowStockItems = items.filter(
    (item) =>
      item.minimumStock > 0 &&
      item.currentStock <= item.minimumStock,
  );

  const totalInputs = items.length;

  const totalMovements = movements.length;

  const selectedMovementItem = useMemo(() => {
    return items.find(
      (item) => item.id === Number(movementItemId),
    );
  }, [items, movementItemId]);

  const previewMovementCost =
    Number(movementQuantity || 0) *
    Number(
      movementUnitCost ||
        selectedMovementItem?.averageCost ||
        0,
    );

  const handleCreateCategory = async () => {
    if (!categoryName.trim()) return;

    await createInventoryCategory({
      name: categoryName,
      description: categoryDescription,
    });

    setCategoryName("");
    setCategoryDescription("");

    await loadData();
  };

  const handleCreateItem = async () => {
    if (!itemCategoryId || !itemName.trim()) return;

    await createInventoryItem({
      categoryId: Number(itemCategoryId),
      name: itemName,
      description: itemDescription,
      unit: itemUnit,
      minimumStock: itemMinimumStock
        ? Number(itemMinimumStock)
        : 0,
      averageCost: itemAverageCost
        ? Number(itemAverageCost)
        : 0,
    });

    setItemCategoryId("");
    setItemName("");
    setItemDescription("");
    setItemUnit("kg");
    setItemMinimumStock("");
    setItemAverageCost("");

    await loadData();
  };

  const handleCreateMovement = async () => {
    if (!movementItemId || !movementQuantity) return;

    await createInventoryMovement({
      itemId: Number(movementItemId),
      campaignId: movementCampaignId
        ? Number(movementCampaignId)
        : undefined,
      type: movementType,
      quantity: Number(movementQuantity),
      unitCost: movementUnitCost
        ? Number(movementUnitCost)
        : undefined,
      reason: movementReason,
      supplier: movementSupplier,
      createAgriculturalCost:
        createCostFromMovement,
    });

    setMovementItemId("");
    setMovementCampaignId("");
    setMovementType("IN");
    setMovementQuantity("");
    setMovementUnitCost("");
    setMovementReason("");
    setMovementSupplier("");
    setCreateCostFromMovement(false);

    await loadData();
  };

  const kpis = [
    {
      title: "Valor del stock",
      value: `$ ${totalStockValue.toLocaleString(
        "es-AR",
      )}`,
      icon: Boxes,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
    },
    {
      title: "Insumos activos",
      value: totalInputs.toString(),
      icon: Layers,
      color: "text-cyan-400",
      bg: "bg-cyan-500/10",
    },
    {
      title: "Stock bajo",
      value: lowStockItems.length.toString(),
      icon: AlertTriangle,
      color: "text-yellow-400",
      bg: "bg-yellow-500/10",
    },
    {
      title: "Movimientos",
      value: totalMovements.toString(),
      icon: PackagePlus,
      color: "text-violet-400",
      bg: "bg-violet-500/10",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          Inventario Agrícola
        </h1>

        <p className="text-slate-400 mt-1">
          Control de insumos, stock,
          movimientos y consumo por campaña.
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

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="bg-emerald-500/10 text-emerald-400 rounded-xl p-2">
              <Plus size={20} />
            </div>

            <div>
              <h2 className="text-xl font-semibold">
                Nueva categoría
              </h2>
              <p className="text-sm text-slate-400">
                Semillas, fertilizantes,
                agroquímicos, combustible.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <input
              value={categoryName}
              onChange={(event) =>
                setCategoryName(event.target.value)
              }
              placeholder="Nombre de categoría"
              className="w-full rounded-xl bg-slate-950 border border-slate-800 px-4 py-3 outline-none focus:border-emerald-500"
            />

            <textarea
              value={categoryDescription}
              onChange={(event) =>
                setCategoryDescription(
                  event.target.value,
                )
              }
              placeholder="Descripción"
              rows={3}
              className="w-full rounded-xl bg-slate-950 border border-slate-800 px-4 py-3 outline-none focus:border-emerald-500 resize-none"
            />

            <button
              onClick={handleCreateCategory}
              className="w-full rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold px-5 py-3 transition"
            >
              Crear categoría
            </button>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="bg-cyan-500/10 text-cyan-400 rounded-xl p-2">
              <PackagePlus size={20} />
            </div>

            <div>
              <h2 className="text-xl font-semibold">
                Nuevo insumo
              </h2>
              <p className="text-sm text-slate-400">
                Registra productos con stock
                mínimo y costo promedio.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <select
              value={itemCategoryId}
              onChange={(event) =>
                setItemCategoryId(
                  event.target.value,
                )
              }
              className="w-full rounded-xl bg-slate-950 border border-slate-800 px-4 py-3 outline-none focus:border-emerald-500"
            >
              <option value="">
                Seleccionar categoría
              </option>

              {categories.map((category) => (
                <option
                  key={category.id}
                  value={category.id}
                >
                  {category.name}
                </option>
              ))}
            </select>

            <input
              value={itemName}
              onChange={(event) =>
                setItemName(event.target.value)
              }
              placeholder="Nombre del insumo"
              className="w-full rounded-xl bg-slate-950 border border-slate-800 px-4 py-3 outline-none focus:border-emerald-500"
            />

            <input
              value={itemDescription}
              onChange={(event) =>
                setItemDescription(
                  event.target.value,
                )
              }
              placeholder="Descripción"
              className="w-full rounded-xl bg-slate-950 border border-slate-800 px-4 py-3 outline-none focus:border-emerald-500"
            />

            <div className="grid grid-cols-3 gap-3">
              <input
                value={itemUnit}
                onChange={(event) =>
                  setItemUnit(event.target.value)
                }
                placeholder="Unidad"
                className="rounded-xl bg-slate-950 border border-slate-800 px-4 py-3 outline-none focus:border-emerald-500"
              />

              <input
                type="number"
                value={itemMinimumStock}
                onChange={(event) =>
                  setItemMinimumStock(
                    event.target.value,
                  )
                }
                placeholder="Stock mínimo"
                className="rounded-xl bg-slate-950 border border-slate-800 px-4 py-3 outline-none focus:border-emerald-500"
              />

              <input
                type="number"
                value={itemAverageCost}
                onChange={(event) =>
                  setItemAverageCost(
                    event.target.value,
                  )
                }
                placeholder="Costo promedio"
                className="rounded-xl bg-slate-950 border border-slate-800 px-4 py-3 outline-none focus:border-emerald-500"
              />
            </div>

            <button
              onClick={handleCreateItem}
              className="w-full rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold px-5 py-3 transition"
            >
              Crear insumo
            </button>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="bg-violet-500/10 text-violet-400 rounded-xl p-2">
              <ArrowDownCircle size={20} />
            </div>

            <div>
              <h2 className="text-xl font-semibold">
                Nuevo movimiento
              </h2>
              <p className="text-sm text-slate-400">
                Entradas, salidas o ajustes de
                inventario.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <select
              value={movementItemId}
              onChange={(event) =>
                setMovementItemId(
                  event.target.value,
                )
              }
              className="w-full rounded-xl bg-slate-950 border border-slate-800 px-4 py-3 outline-none focus:border-emerald-500"
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

            <select
              value={movementType}
              onChange={(event) =>
                setMovementType(
                  event.target.value as
                    | "IN"
                    | "OUT"
                    | "ADJUSTMENT",
                )
              }
              className="w-full rounded-xl bg-slate-950 border border-slate-800 px-4 py-3 outline-none focus:border-emerald-500"
            >
              <option value="IN">Entrada</option>
              <option value="OUT">Salida</option>
              <option value="ADJUSTMENT">
                Ajuste
              </option>
            </select>

            <select
              value={movementCampaignId}
              onChange={(event) =>
                setMovementCampaignId(
                  event.target.value,
                )
              }
              className="w-full rounded-xl bg-slate-950 border border-slate-800 px-4 py-3 outline-none focus:border-emerald-500"
            >
              <option value="">
                Sin campaña asociada
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

            <div className="grid grid-cols-2 gap-3">
              <input
                type="number"
                value={movementQuantity}
                onChange={(event) =>
                  setMovementQuantity(
                    event.target.value,
                  )
                }
                placeholder="Cantidad"
                className="rounded-xl bg-slate-950 border border-slate-800 px-4 py-3 outline-none focus:border-emerald-500"
              />

              <input
                type="number"
                value={movementUnitCost}
                onChange={(event) =>
                  setMovementUnitCost(
                    event.target.value,
                  )
                }
                placeholder="Costo unitario"
                className="rounded-xl bg-slate-950 border border-slate-800 px-4 py-3 outline-none focus:border-emerald-500"
              />
            </div>

            <input
              value={movementReason}
              onChange={(event) =>
                setMovementReason(
                  event.target.value,
                )
              }
              placeholder="Motivo"
              className="w-full rounded-xl bg-slate-950 border border-slate-800 px-4 py-3 outline-none focus:border-emerald-500"
            />

            <input
              value={movementSupplier}
              onChange={(event) =>
                setMovementSupplier(
                  event.target.value,
                )
              }
              placeholder="Proveedor"
              className="w-full rounded-xl bg-slate-950 border border-slate-800 px-4 py-3 outline-none focus:border-emerald-500"
            />

            <label className="flex items-center gap-3 text-sm text-slate-300">
              <input
                type="checkbox"
                checked={createCostFromMovement}
                onChange={(event) =>
                  setCreateCostFromMovement(
                    event.target.checked,
                  )
                }
              />

              Crear costo agrícola automático
            </label>

            <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/30 px-4 py-3 text-sm text-emerald-300">
              Costo estimado:{" "}
              <strong>
                ${" "}
                {previewMovementCost.toLocaleString(
                  "es-AR",
                )}
              </strong>
            </div>

            <button
              onClick={handleCreateMovement}
              className="w-full rounded-xl bg-violet-500 hover:bg-violet-400 text-white font-semibold px-5 py-3 transition"
            >
              Registrar movimiento
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-slate-800">
            <h2 className="text-xl font-semibold">
              Insumos registrados
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Stock actual, costos y alertas de
              reposición.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-950 text-slate-400">
                <tr>
                  <th className="text-left px-6 py-4">
                    Insumo
                  </th>
                  <th className="text-left px-6 py-4">
                    Categoría
                  </th>
                  <th className="text-left px-6 py-4">
                    Stock
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
                {items.map((item) => {
                  const isLowStock =
                    item.minimumStock > 0 &&
                    item.currentStock <=
                      item.minimumStock;

                  return (
                    <tr
                      key={item.id}
                      className="border-t border-slate-800 hover:bg-slate-800/50 transition"
                    >
                      <td className="px-6 py-4 font-semibold">
                        {item.name}
                        {isLowStock && (
                          <span className="ml-2 rounded-full bg-yellow-500/10 text-yellow-400 border border-yellow-500/30 px-2 py-1 text-xs">
                            Stock bajo
                          </span>
                        )}
                      </td>

                      <td className="px-6 py-4 text-slate-300">
                        {item.category?.name || "-"}
                      </td>

                      <td className="px-6 py-4 text-cyan-400 font-semibold">
                        {item.currentStock} {item.unit}
                      </td>

                      <td className="px-6 py-4 text-emerald-400 font-semibold">
                        ${" "}
                        {item.averageCost.toLocaleString(
                          "es-AR",
                        )}
                      </td>

                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={async () => {
                            await deleteInventoryItem(
                              item.id,
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
                  );
                })}

                {items.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-10 text-center text-slate-400"
                    >
                      No hay insumos registrados.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-slate-800">
            <h2 className="text-xl font-semibold">
              Categorías
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Clasificación de insumos agrícolas.
            </p>
          </div>

          <div className="divide-y divide-slate-800">
            {categories.map((category) => (
              <div
                key={category.id}
                className="p-5 flex items-start justify-between gap-4"
              >
                <div>
                  <h3 className="font-semibold">
                    {category.name}
                  </h3>
                  <p className="text-sm text-slate-400 mt-1">
                    {category.description ||
                      "Sin descripción"}
                  </p>
                  <p className="text-xs text-slate-500 mt-2">
                    {category.items?.length || 0}{" "}
                    insumos asociados
                  </p>
                </div>

                <button
                  onClick={async () => {
                    await deleteInventoryCategory(
                      category.id,
                    );
                    await loadData();
                  }}
                  className="rounded-lg bg-red-500 hover:bg-red-400 text-white px-3 py-2 transition inline-flex items-center gap-2"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}

            {categories.length === 0 && (
              <div className="p-10 text-center text-slate-400">
                No hay categorías registradas.
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-slate-800">
          <h2 className="text-xl font-semibold">
            Últimos movimientos
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Entradas, salidas y ajustes de stock.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-950 text-slate-400">
              <tr>
                <th className="text-left px-6 py-4">
                  Tipo
                </th>
                <th className="text-left px-6 py-4">
                  Insumo
                </th>
                <th className="text-left px-6 py-4">
                  Campaña
                </th>
                <th className="text-left px-6 py-4">
                  Cantidad
                </th>
                <th className="text-left px-6 py-4">
                  Total
                </th>
                <th className="text-left px-6 py-4">
                  Motivo
                </th>
              </tr>
            </thead>

            <tbody>
              {movements.map((movement) => (
                <tr
                  key={movement.id}
                  className="border-t border-slate-800 hover:bg-slate-800/50 transition"
                >
                  <td className="px-6 py-4">
                    <span
                      className={
                        movement.type === "IN"
                          ? "inline-flex items-center gap-2 text-emerald-400"
                          : movement.type === "OUT"
                            ? "inline-flex items-center gap-2 text-red-400"
                            : "inline-flex items-center gap-2 text-yellow-400"
                      }
                    >
                      {movement.type === "IN" ? (
                        <ArrowDownCircle size={18} />
                      ) : movement.type === "OUT" ? (
                        <ArrowUpCircle size={18} />
                      ) : (
                        <AlertTriangle size={18} />
                      )}

                      {movement.type === "IN"
                        ? "Entrada"
                        : movement.type === "OUT"
                          ? "Salida"
                          : "Ajuste"}
                    </span>
                  </td>

                  <td className="px-6 py-4 font-semibold">
                    {movement.item?.name || "-"}
                  </td>

                  <td className="px-6 py-4 text-slate-300">
                    {movement.campaign?.name || "-"}
                  </td>

                  <td className="px-6 py-4 text-cyan-400 font-semibold">
                    {movement.quantity}{" "}
                    {movement.item?.unit || ""}
                  </td>

                  <td className="px-6 py-4 text-emerald-400 font-semibold">
                    ${" "}
                    {movement.totalCost.toLocaleString(
                      "es-AR",
                    )}
                  </td>

                  <td className="px-6 py-4 text-slate-300">
                    {movement.reason || "-"}
                  </td>
                </tr>
              ))}

              {movements.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-10 text-center text-slate-400"
                  >
                    No hay movimientos registrados.
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