import { Navigate } from "react-router-dom";

import { useAuthStore } from "../store/authStore";

interface Props {
  children: React.ReactNode;
}

export default function PrivateRoute({
  children,
}: Props) {
  const isAuthenticated =
    useAuthStore(
      (state) =>
        state.isAuthenticated,
    );

  if (!isAuthenticated) {
    return (
      <Navigate to="/login" />
    );
  }

  return <>{children}</>;
}