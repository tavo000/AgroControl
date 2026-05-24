import Dashboard from "./pages/Dashboard";

import Login from "./pages/Login";

import { useAuthStore } from "./store/authStore";

export default function App() {
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