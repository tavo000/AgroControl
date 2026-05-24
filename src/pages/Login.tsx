import { useState } from "react";

import { useNavigate } from "react-router-dom";

import { loginRequest } from "../services/authService";

import { useAuthStore } from "../store/authStore";

export default function Login() {
  const navigate = useNavigate();

  const login = useAuthStore(
    (state) => state.login,
  );

  const [email, setEmail] =
    useState("admin@agrocontrol.com");

  const [password, setPassword] =
    useState("123456");

  const [error, setError] =
    useState("");

  const handleSubmit = async (
    event: React.FormEvent,
  ) => {
    event.preventDefault();

    try {
      setError("");

      const data = await loginRequest({
        email,
        password,
      });

      login(
        data.user,
        data.access_token,
      );

      navigate("/dashboard", {
        replace: true,
      });
    } catch {
      setError(
        "Email o contraseña incorrectos",
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-6">
      <form
        onSubmit={handleSubmit}
        className="
          w-full
          max-w-md
          bg-slate-900
          border
          border-slate-800
          rounded-2xl
          p-8
          space-y-6
        "
      >
        <div>
          <h1 className="text-3xl font-bold text-white">
            AgroControl
          </h1>

          <p className="text-slate-400 mt-2">
            Iniciar sesión
          </p>
        </div>

        <div>
          <label className="text-sm text-slate-300">
            Email
          </label>

          <input
            value={email}
            onChange={(event) =>
              setEmail(event.target.value)
            }
            className="
              mt-2
              w-full
              rounded-xl
              bg-slate-950
              border
              border-slate-800
              px-4
              py-3
              text-white
              outline-none
              focus:border-emerald-500
            "
          />
        </div>

        <div>
          <label className="text-sm text-slate-300">
            Contraseña
          </label>

          <input
            type="password"
            value={password}
            onChange={(event) =>
              setPassword(event.target.value)
            }
            className="
              mt-2
              w-full
              rounded-xl
              bg-slate-950
              border
              border-slate-800
              px-4
              py-3
              text-white
              outline-none
              focus:border-emerald-500
            "
          />
        </div>

        {error && (
          <p className="text-sm text-red-400">
            {error}
          </p>
        )}

        <button
          type="submit"
          className="
            w-full
            rounded-xl
            bg-emerald-500
            hover:bg-emerald-400
            text-slate-950
            font-semibold
            py-3
            transition
          "
        >
          Entrar
        </button>
      </form>
    </div>
  );
}
