import { useEffect, useState } from "react";

import {
  AlertTriangle,
  Banknote,
  BarChart3,
  Target,
  TrendingUp,
} from "lucide-react";

import { getAgriculturalProfitability } from "../services/machineService";

interface ProfitabilityResponse {
  summary: {
    totalCosts: number;
    totalProduction: number;
    estimatedIncome: number;
    grossMargin: number;
    profitabilityRate: number;
  };
  campaigns: {
    campaignId: number;
    campaignName: string;
    totalCosts: number;
    totalProduction: number;
    estimatedIncome: number;
    grossMargin: number;
    profitabilityRate: number;
    status: string;
  }[];
}

export default function Financial() {
  const [data, setData] =
    useState<ProfitabilityResponse | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await getAgriculturalProfitability();

      setData(response);
    } catch (err) {
      console.error(err);
      setError(
        "No se pudo cargar la rentabilidad agrícola. Revisar backend, token o endpoint /agricultural-costs/profitability.",
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-slate-400">
        Cargando finanzas...
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6 text-red-300 flex items-start gap-3">
        <AlertTriangle size={24} />

        <div>
          <h2 className="text-lg font-semibold">
            Error al cargar finanzas
          </h2>

          <p className="text-sm mt-2">{error}</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-slate-400">
        No hay información financiera disponible.
      </div>
    );
  }

  const kpis = [
    {
      title: "Costos Totales",
      value: `$ ${data.summary.totalCosts.toLocaleString(
        "es-AR",
      )}`,
      icon: Banknote,
      color: "text-red-400",
      bg: "bg-red-500/10",
    },
    {
      title: "Ingresos Estimados",
      value: `$ ${data.summary.estimatedIncome.toLocaleString(
        "es-AR",
      )}`,
      icon: TrendingUp,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
    },
    {
      title: "Margen Bruto",
      value: `$ ${data.summary.grossMargin.toLocaleString(
        "es-AR",
      )}`,
      icon: BarChart3,
      color: "text-cyan-400",
      bg: "bg-cyan-500/10",
    },
    {
      title: "Rentabilidad",
      value: `${data.summary.profitabilityRate.toFixed(
        1,
      )}%`,
      icon: Target,
      color: "text-yellow-400",
      bg: "bg-yellow-500/10",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          Finanzas Agrícolas
        </h1>

        <p className="text-slate-400 mt-1">
          Rentabilidad y análisis económico por campaña.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {kpis.map((kpi) => (
          <div
            key={kpi.title}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-6"
          >
            <div className="flex justify-between">
              <p className="text-slate-400 text-sm">
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

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-slate-800">
          <h2 className="text-xl font-semibold">
            Ranking de campañas
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-950 text-slate-400">
              <tr>
                <th className="text-left px-6 py-4">Campaña</th>
                <th className="text-left px-6 py-4">Costos</th>
                <th className="text-left px-6 py-4">Producción</th>
                <th className="text-left px-6 py-4">Ingreso</th>
                <th className="text-left px-6 py-4">Margen</th>
                <th className="text-left px-6 py-4">Rentabilidad</th>
                <th className="text-left px-6 py-4">Estado</th>
              </tr>
            </thead>

            <tbody>
              {data.campaigns.map((campaign) => (
                <tr
                  key={campaign.campaignId}
                  className="border-t border-slate-800 hover:bg-slate-800/50 transition"
                >
                  <td className="px-6 py-4 font-semibold">
                    {campaign.campaignName}
                  </td>

                  <td className="px-6 py-4 text-red-400 font-semibold">
                    $ {campaign.totalCosts.toLocaleString("es-AR")}
                  </td>

                  <td className="px-6 py-4 text-slate-300">
                    {campaign.totalProduction.toFixed(0)} tn
                  </td>

                  <td className="px-6 py-4 text-emerald-400 font-semibold">
                    $ {campaign.estimatedIncome.toLocaleString("es-AR")}
                  </td>

                  <td className="px-6 py-4 text-cyan-400 font-semibold">
                    $ {campaign.grossMargin.toLocaleString("es-AR")}
                  </td>

                  <td className="px-6 py-4 text-yellow-400 font-bold">
                    {campaign.profitabilityRate.toFixed(1)}%
                  </td>

                  <td className="px-6 py-4">
                    <span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-300">
                      {campaign.status}
                    </span>
                  </td>
                </tr>
              ))}

              {data.campaigns.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-10 text-center text-slate-400"
                  >
                    No hay campañas con datos financieros.
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