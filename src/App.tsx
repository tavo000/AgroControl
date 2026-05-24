import Dashboard from "./pages/Dashboard";

import PrivateRoute from "./routes/PrivateRoute";

export default function App() {
  return (
    <PrivateRoute>
      <Dashboard />
    </PrivateRoute>
  );
}