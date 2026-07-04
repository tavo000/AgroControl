import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  CalendarDays,
  CheckCircle2,
  Clock,
  Flag,
  Plus,
  Trash2,
} from "lucide-react";

import {
  createPlanningTask,
  deletePlanningTask,
  getCampaigns,
  getFarms,
  getMachines,
  getPlanningTasks,
  getPlanningConflicts,
  getPlots,
  updatePlanningTaskStatus,
} from "../services/machineService";

interface Farm {
  id: number;
  name: string;
}

interface Plot {
  id: number;
  farmId: number;
  name: string;
}

interface Campaign {
  id: number;
  name: string;
}

interface Machine {
  id: number;
  name: string;
}

interface PlanningTask {
  id: number;
  title: string;
  description?: string;
  operationType: string;
  status: string;
  priority: string;
  plannedDate: string;
  estimatedArea?: number;
  estimatedDuration?: number;
  estimatedCost?: number;
  assignedOperator?: string;
  notes?: string;
  farm?: Farm;
  plot?: Plot;
  campaign?: Campaign;
  machine?: Machine;
}

const operationLabels: Record<string, string> = {
  SOWING: "Siembra",
  FERTILIZATION: "Fertilización",
  SPRAYING: "Pulverización",
  IRRIGATION: "Riego",
  HARVEST: "Cosecha",
  SOIL_WORK: "Trabajo de suelo",
  MAINTENANCE: "Mantenimiento",
  OTHER: "Otro",
};

const statusLabels: Record<string, string> = {
  PLANNED: "Planificada",
  IN_PROGRESS: "En curso",
  COMPLETED: "Completada",
  CANCELLED: "Cancelada",
  POSTPONED: "Postergada",
};

const priorityLabels: Record<string, string> = {
  LOW: "Baja",
  MEDIUM: "Media",
  HIGH: "Alta",
  CRITICAL: "Crítica",
};

export default function Planning() {
  const [tasks, setTasks] = useState<PlanningTask[]>(
    [],
  );
  const [farms, setFarms] = useState<Farm[]>([]);
  const [plots, setPlots] = useState<Plot[]>([]);
  const [campaigns, setCampaigns] = useState<
    Campaign[]
  >([]);

  const [conflicts, setConflicts] = useState<{
    totalTasks: number;
    overdueTasks: PlanningTask[];
    criticalTasks: PlanningTask[];
  } | null>(null);

  const [machines, setMachines] = useState<
    Machine[]
  >([]);

  const [farmId, setFarmId] = useState("");
  const [plotId, setPlotId] = useState("");
  const [campaignId, setCampaignId] = useState("");
  const [machineId, setMachineId] = useState("");

  const [title, setTitle] = useState("");
  const [description, setDescription] =
    useState("");
  const [operationType, setOperationType] =
    useState("SOWING");
  const [priority, setPriority] =
    useState("MEDIUM");
  const [plannedDate, setPlannedDate] =
    useState("");
  const [estimatedArea, setEstimatedArea] =
    useState("");
  const [
    estimatedDuration,
    setEstimatedDuration,
  ] = useState("");
  const [estimatedCost, setEstimatedCost] =
    useState("");
  const [
    assignedOperator,
    setAssignedOperator,
  ] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [
      tasksData,
      farmsData,
      plotsData,
      campaignsData,
            machinesData,
      conflictsData,
    ] = await Promise.all([
      getPlanningTasks(),
      getFarms(),
      getPlots(),
      getCampaigns(),
      getMachines(),
      getPlanningConflicts(),
    ]);

    setTasks(tasksData);
    setFarms(farmsData);
    setPlots(plotsData);
    setCampaigns(campaignsData);
    setMachines(machinesData);
    setConflicts(conflictsData);
  };

  const filteredPlots = plots.filter(
    (plot) =>
      !farmId || plot.farmId === Number(farmId),
  );

  const today = new Date();

  const plannedTasks = tasks.filter(
    (task) => task.status === "PLANNED",
  );

  const inProgressTasks = tasks.filter(
    (task) => task.status === "IN_PROGRESS",
  );

  const completedTasks = tasks.filter(
    (task) => task.status === "COMPLETED",
  );

  const overdueTasks = tasks.filter((task) => {
    const date = new Date(task.plannedDate);

    return (
      date < today &&
      task.status !== "COMPLETED" &&
      task.status !== "CANCELLED"
    );
  });

  const totalEstimatedCost = tasks.reduce(
    (acc, task) =>
      acc + Number(task.estimatedCost || 0),
    0,
  );

  const tasksThisWeek = useMemo(() => {
    const now = new Date();
    const weekFromNow = new Date();

    weekFromNow.setDate(now.getDate() + 7);

    return tasks.filter((task) => {
      const date = new Date(task.plannedDate);

      return date >= now && date <= weekFromNow;
    });
  }, [tasks]);

  const handleCreateTask = async () => {
    if (!farmId || !plotId || !title.trim()) return;
    if (!plannedDate) return;

    await createPlanningTask({
      farmId: Number(farmId),
      plotId: Number(plotId),
      campaignId: campaignId
        ? Number(campaignId)
        : undefined,
      machineId: machineId
        ? Number(machineId)
        : undefined,
      title,
      description,
      operationType: operationType as
        | "SOWING"
        | "FERTILIZATION"
        | "SPRAYING"
        | "IRRIGATION"
        | "HARVEST"
        | "SOIL_WORK"
        | "MAINTENANCE"
        | "OTHER",
      priority: priority as
        | "LOW"
        | "MEDIUM"
        | "HIGH"
        | "CRITICAL",
      plannedDate,
      estimatedArea: estimatedArea
        ? Number(estimatedArea)
        : 0,
      estimatedDuration: estimatedDuration
        ? Number(estimatedDuration)
        : 0,
      estimatedCost: estimatedCost
        ? Number(estimatedCost)
        : 0,
      assignedOperator,
      notes,
    });

    setFarmId("");
    setPlotId("");
    setCampaignId("");
    setMachineId("");
    setTitle("");
    setDescription("");
    setOperationType("SOWING");
    setPriority("MEDIUM");
    setPlannedDate("");
    setEstimatedArea("");
    setEstimatedDuration("");
    setEstimatedCost("");
    setAssignedOperator("");
    setNotes("");

    await loadData();
  };

  const kpis = [
    {
      title: "Planificadas",
      value: plannedTasks.length.toString(),
      icon: CalendarDays,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
    },
    {
      title: "En curso",
      value: inProgressTasks.length.toString(),
      icon: Clock,
      color: "text-cyan-400",
      bg: "bg-cyan-500/10",
    },
    {
      title: "Completadas",
      value: completedTasks.length.toString(),
      icon: CheckCircle2,
      color: "text-violet-400",
      bg: "bg-violet-500/10",
    },
    {
      title: "Vencidas",
      value: overdueTasks.length.toString(),
      icon: Flag,
      color: "text-red-400",
      bg: "bg-red-500/10",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          Planificación Agrícola
        </h1>

        <p className="text-slate-400 mt-1">
          Calendario operativo, prioridades,
          recursos y seguimiento de tareas por
          campaña.
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

            {conflicts && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <p className="text-sm text-slate-400">
              Tareas activas
            </p>
            <h2 className="text-3xl font-bold text-emerald-400 mt-3">
              {conflicts.totalTasks}
            </h2>
          </div>

          <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6">
            <p className="text-sm text-red-300">
              Tareas vencidas
            </p>
            <h2 className="text-3xl font-bold text-red-400 mt-3">
              {conflicts.overdueTasks.length}
            </h2>
          </div>

          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-2xl p-6">
            <p className="text-sm text-yellow-300">
              Tareas críticas
            </p>
            <h2 className="text-3xl font-bold text-yellow-400 mt-3">
              {conflicts.criticalTasks.length}
            </h2>
          </div>
        </div>
      )}

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-emerald-500/10 text-emerald-400 rounded-xl p-2">
            <Plus size={22} />
          </div>

          <div>
            <h2 className="text-xl font-semibold">
              Nueva tarea planificada
            </h2>

            <p className="text-sm text-slate-400">
              Planifica labores futuras, recursos,
              costos estimados y responsables.
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
            <option value="">
              Seleccionar campo
            </option>

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
            value={machineId}
            onChange={(event) =>
              setMachineId(event.target.value)
            }
            className="rounded-xl bg-slate-950 border border-slate-800 px-4 py-3 outline-none focus:border-emerald-500"
          >
            <option value="">
              Sin maquinaria asignada
            </option>

            {machines.map((machine) => (
              <option
                key={machine.id}
                value={machine.id}
              >
                {machine.name}
              </option>
            ))}
          </select>

          <input
            value={title}
            onChange={(event) =>
              setTitle(event.target.value)
            }
            placeholder="Título de la tarea"
            className="rounded-xl bg-slate-950 border border-slate-800 px-4 py-3 outline-none focus:border-emerald-500"
          />

          <select
            value={operationType}
            onChange={(event) =>
              setOperationType(event.target.value)
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

          <select
            value={priority}
            onChange={(event) =>
              setPriority(event.target.value)
            }
            className="rounded-xl bg-slate-950 border border-slate-800 px-4 py-3 outline-none focus:border-emerald-500"
          >
            <option value="LOW">Prioridad baja</option>
            <option value="MEDIUM">
              Prioridad media
            </option>
            <option value="HIGH">Prioridad alta</option>
            <option value="CRITICAL">
              Prioridad crítica
            </option>
          </select>

          <input
            type="date"
            value={plannedDate}
            onChange={(event) =>
              setPlannedDate(event.target.value)
            }
            className="rounded-xl bg-slate-950 border border-slate-800 px-4 py-3 outline-none focus:border-emerald-500"
          />

          <input
            type="number"
            value={estimatedArea}
            onChange={(event) =>
              setEstimatedArea(event.target.value)
            }
            placeholder="Área estimada"
            className="rounded-xl bg-slate-950 border border-slate-800 px-4 py-3 outline-none focus:border-emerald-500"
          />

          <input
            type="number"
            value={estimatedDuration}
            onChange={(event) =>
              setEstimatedDuration(
                event.target.value,
              )
            }
            placeholder="Duración estimada (hs)"
            className="rounded-xl bg-slate-950 border border-slate-800 px-4 py-3 outline-none focus:border-emerald-500"
          />

          <input
            type="number"
            value={estimatedCost}
            onChange={(event) =>
              setEstimatedCost(event.target.value)
            }
            placeholder="Costo estimado"
            className="rounded-xl bg-slate-950 border border-slate-800 px-4 py-3 outline-none focus:border-emerald-500"
          />

          <input
            value={assignedOperator}
            onChange={(event) =>
              setAssignedOperator(
                event.target.value,
              )
            }
            placeholder="Operador asignado"
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
            value={notes}
            onChange={(event) =>
              setNotes(event.target.value)
            }
            placeholder="Notas internas"
            className="rounded-xl bg-slate-950 border border-slate-800 px-4 py-3 outline-none focus:border-emerald-500"
          />
        </div>

        <div className="mt-5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 px-4 py-3 text-sm text-emerald-300">
          Costo estimado total planificado:{" "}
          <strong>
            ${" "}
            {Number(
              estimatedCost || 0,
            ).toLocaleString("es-AR")}
          </strong>
        </div>

        <button
          onClick={handleCreateTask}
          className="mt-6 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold px-6 py-3 transition"
        >
          Crear planificación
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-slate-800">
            <h2 className="text-xl font-semibold">
              Próximos 7 días
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Tareas operativas próximas a ejecutar.
            </p>
          </div>

          <div className="divide-y divide-slate-800">
            {tasksThisWeek.map((task) => (
              <div key={task.id} className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-semibold">
                      {task.title}
                    </h3>

                    <p className="text-sm text-slate-400 mt-1">
                      {operationLabels[
                        task.operationType
                      ] || task.operationType}
                    </p>

                    <p className="text-xs text-slate-500 mt-2">
                      {new Date(
                        task.plannedDate,
                      ).toLocaleDateString("es-AR")}{" "}
                      · {task.farm?.name || "-"} ·{" "}
                      {task.plot?.name || "-"}
                    </p>
                  </div>

                  <span className="rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-3 py-1 text-xs">
                    {priorityLabels[task.priority] ||
                      task.priority}
                  </span>
                </div>
              </div>
            ))}

            {tasksThisWeek.length === 0 && (
              <div className="p-10 text-center text-slate-400">
                No hay tareas planificadas para los
                próximos 7 días.
              </div>
            )}
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-slate-800">
            <h2 className="text-xl font-semibold">
              Presupuesto planificado
            </h2>

            <p className="text-sm text-slate-400 mt-1">
              Estimación económica de tareas
              futuras.
            </p>
          </div>

          <div className="p-6">
            <p className="text-sm text-slate-400">
              Costo total estimado
            </p>

            <h3 className="text-4xl font-bold text-emerald-400 mt-3">
              ${" "}
              {totalEstimatedCost.toLocaleString(
                "es-AR",
              )}
            </h3>

            <p className="text-sm text-slate-500 mt-3">
              Este valor se convertirá en costo real
              cuando la tarea planificada sea
              ejecutada como labor agrícola.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-slate-800">
          <h2 className="text-xl font-semibold">
            Historial de planificación
          </h2>

          <p className="text-sm text-slate-400 mt-1">
            Seguimiento de tareas por estado,
            prioridad, campo, lote y campaña.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-950 text-slate-400">
              <tr>
                <th className="text-left px-6 py-4">
                  Tarea
                </th>
                <th className="text-left px-6 py-4">
                  Fecha
                </th>
                <th className="text-left px-6 py-4">
                  Campo
                </th>
                <th className="text-left px-6 py-4">
                  Lote
                </th>
                <th className="text-left px-6 py-4">
                  Estado
                </th>
                <th className="text-left px-6 py-4">
                  Prioridad
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
              {tasks.map((task) => (
                <tr
                  key={task.id}
                  className="border-t border-slate-800 hover:bg-slate-800/50 transition"
                >
                  <td className="px-6 py-4">
                    <p className="font-semibold">
                      {task.title}
                    </p>

                    <p className="text-xs text-slate-400">
                      {operationLabels[
                        task.operationType
                      ] || task.operationType}
                    </p>
                  </td>

                  <td className="px-6 py-4 text-slate-300">
                    {new Date(
                      task.plannedDate,
                    ).toLocaleDateString("es-AR")}
                  </td>

                  <td className="px-6 py-4 text-slate-300">
                    {task.farm?.name || "-"}
                  </td>

                  <td className="px-6 py-4 text-slate-300">
                    {task.plot?.name || "-"}
                  </td>

                  <td className="px-6 py-4">
                    <select
                      value={task.status}
                      onChange={async (event) => {
                        await updatePlanningTaskStatus(
                          task.id,
                          event.target.value as
                            | "PLANNED"
                            | "IN_PROGRESS"
                            | "COMPLETED"
                            | "CANCELLED"
                            | "POSTPONED",
                        );

                        await loadData();
                      }}
                      className="rounded-lg bg-slate-950 border border-slate-800 px-3 py-2 outline-none focus:border-emerald-500"
                    >
                      <option value="PLANNED">
                        Planificada
                      </option>
                      <option value="IN_PROGRESS">
                        En curso
                      </option>
                      <option value="COMPLETED">
                        Completada
                      </option>
                      <option value="POSTPONED">
                        Postergada
                      </option>
                      <option value="CANCELLED">
                        Cancelada
                      </option>
                    </select>
                  </td>

                  <td className="px-6 py-4 text-slate-300">
                    {priorityLabels[task.priority] ||
                      task.priority}
                  </td>

                  <td className="px-6 py-4 text-emerald-400 font-semibold">
                    ${" "}
                    {Number(
                      task.estimatedCost || 0,
                    ).toLocaleString("es-AR")}
                  </td>

                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={async () => {
                        await deletePlanningTask(
                          task.id,
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

              {tasks.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    className="px-6 py-10 text-center text-slate-400"
                  >
                    No hay tareas planificadas.
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