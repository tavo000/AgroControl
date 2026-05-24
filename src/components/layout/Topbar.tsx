import {
  Bell,
  Search,
  Menu,
  LogOut,
} from "lucide-react";

import { useUiStore } from "../../store/uiStore";

import { useAuthStore } from "../../store/authStore";

export default function Topbar() {
  const { toggleSidebar } = useUiStore();

  const logout = useAuthStore(
    (state) => state.logout,
  );

  const user = useAuthStore(
    (state) => state.user,
  );

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

        <div className="text-right">
          <p className="text-sm font-semibold">
            {user?.name}
          </p>

          <p className="text-xs text-slate-400">
            {user?.role}
          </p>
        </div>

        <button
          onClick={logout}
          className="
            p-2
            rounded-lg
            bg-red-500
            hover:bg-red-400
            transition
          "
        >
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
}