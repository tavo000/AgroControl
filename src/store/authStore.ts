import { create } from "zustand";

interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;

  login: (
    user: AuthUser,
    token: string,
  ) => void;

  logout: () => void;
}

export const useAuthStore =
  create<AuthState>((set) => ({
    user: null,
    token: null,
    isAuthenticated: false,

    login: (user, token) => {
      localStorage.setItem(
        "agrocontrol_token",
        token,
      );

      localStorage.setItem(
        "agrocontrol_user",
        JSON.stringify(user),
      );

      set({
        user,
        token,
        isAuthenticated: true,
      });
    },

    logout: () => {
      localStorage.removeItem(
        "agrocontrol_token",
      );

      localStorage.removeItem(
        "agrocontrol_user",
      );

      set({
        user: null,
        token: null,
        isAuthenticated: false,
      });
    },
  }));