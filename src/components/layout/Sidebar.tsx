import {
  LayoutDashboard,
  Tractor,
  Map,
  Bell,
  Settings,
  BarChart3,
} from "lucide-react";

import { motion } from "framer-motion";

import { useUiStore } from "../../store/uiStore";

const items = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Maquinaria",
    icon: Tractor,
  },
  {
    label: "Mapas",
    icon: Map,
  },
  {
    label: "Analítica",
    icon: BarChart3,
  },
  {
    label: "Alertas",
    icon: Bell,
  },
  {
    label: "Configuración",
    icon: Settings,
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
          <button
            key={item.label}
            className="
              w-full
              flex
              items-center
              gap-3
              px-4
              py-3
              rounded-xl
              hover:bg-slate-800
              transition
              mb-2
            "
          >
            <item.icon size={20} />

            {sidebarOpen && (
              <span>{item.label}</span>
            )}
          </button>
        ))}
      </nav>
    </motion.aside>
  );
}