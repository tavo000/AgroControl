import {
  LayoutDashboard,
  Tractor,
  Map,
  Bell,
  Settings,
  BarChart3,
  Trees,
} from "lucide-react";

import { NavLink } from "react-router-dom";

import { motion } from "framer-motion";

import { useUiStore } from "../../store/uiStore";

const items = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    path: "/dashboard",
  },
  {
    label: "Maquinaria",
    icon: Tractor,
    path: "/machines",
  },
{
  label: "Campos",
  icon: Trees,
  path: "/farms",
},
  {
    label: "Mapas",
    icon: Map,
    path: "/maps",
  },
  {
    label: "Analítica",
    icon: BarChart3,
    path: "/telemetry",
  },
  {
    label: "Alertas",
    icon: Bell,
    path: "/alerts",
  },
  {
    label: "Configuración",
    icon: Settings,
    path: "/settings",
  },
];

export default function Sidebar() {
  const { sidebarOpen } = useUiStore();

  return (
    <motion.aside
      animate={{
        width: sidebarOpen ? 280 : 90,
      }}
      className="
        bg-slate-900
        border-r
        border-slate-800
        overflow-hidden
      "
    >
      <div
        className="
          p-6
          text-2xl
          font-bold
          whitespace-nowrap
        "
      >
        AgroControl
      </div>

      <nav className="px-4">
        {items.map((item) => (
          <NavLink
            key={item.label}
            to={item.path}
            className={({ isActive }) =>
              `
                w-full
                flex
                items-center
                gap-3
                px-4
                py-3
                rounded-xl
                transition
                mb-2
                ${
                  isActive
                    ? "bg-emerald-500 text-slate-950"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }
              `
            }
          >
            <item.icon size={20} />

            {sidebarOpen && (
              <span>{item.label}</span>
            )}
          </NavLink>
        ))}
      </nav>
    </motion.aside>
  );
}