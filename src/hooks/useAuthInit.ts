import { useEffect } from "react";

import { useAuthStore } from "../store/authStore";

export function useAuthInit() {
  const login = useAuthStore(
    (state) => state.login,
  );

  useEffect(() => {
    const token =
      localStorage.getItem(
        "agrocontrol_token",
      );

    const user =
      localStorage.getItem(
        "agrocontrol_user",
      );

    if (token && user) {
      login(
        JSON.parse(user),
        token,
      );
    }
  }, [login]);
}