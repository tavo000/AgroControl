import Dashboard from "./pages/Dashboard";

import Login from "./pages/Login";

import { useAuthStore } from "./store/authStore";

import { useAuthInit } from "./hooks/useAuthInit";

export default function App() {
  useAuthInit();

  const isAuthenticated =
    useAuthStore(
      (state: any) =>
        state.isAuthenticated,
    );

  if (!isAuthenticated) {
    return <Login />;
  }

  return <Dashboard />;
}