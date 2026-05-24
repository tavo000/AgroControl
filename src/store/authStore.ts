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

const storedToken =
  localStorage.getItem("agrocontrol_token");

const storedUser =
  localStorage.getItem("agrocontrol_user");

export const useAuthStore =
  create<AuthState>((set) => ({
    user: storedUser
      ? JSON.parse(storedUser)
      : null,

    token: storedToken,

    isAuthenticated:
      Boolean(storedToken && storedUser),

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