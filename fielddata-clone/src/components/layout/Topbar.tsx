import {
  Bell,
  Search,
  Menu,
} from "lucide-react";

import { useUiStore } from "../../store/uiStore";

export default function Topbar() {
  const { toggleSidebar } = useUiStore();

  return (
    <header
      className="
        h-20
        border-b
        border-slate-800
        bg-slate-950
        px-6
        flex
        items-center
        justify-between
      "
    >
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="
            p-2
            rounded-lg
            hover:bg-slate-800
            transition
          "
        >
          <Menu size={22} />
        </button>

        <div
          className="
            flex
            items-center
            gap-3
            bg-slate-900
            px-4
            py-2
            rounded-xl
            w-96
          "
        >
          <Search size={18} />

          <input
            className="
              bg-transparent
              outline-none
              w-full
            "
            placeholder="Buscar..."
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          className="
            relative
            p-2
            rounded-lg
            hover:bg-slate-800
          "
        >
          <Bell />
        </button>

        <div
          className="
            w-10
            h-10
            rounded-full
            bg-emerald-500
          "
        />
      </div>
    </header>
  );
}