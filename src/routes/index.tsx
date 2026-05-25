import {
  createBrowserRouter,
  Navigate,
} from "react-router-dom";

import MainLayout from "../components/layout/MainLayout";

import Dashboard from "../pages/Dashboard";

import Alerts from "../pages/Alerts";

import Login from "../pages/Login";

import PrivateRoute from "./PrivateRoute";

export const router =
  createBrowserRouter([
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/",
      element: (
        <PrivateRoute>
          <MainLayout />
        </PrivateRoute>
      ),
      children: [
        {
          index: true,
          element: (
            <Navigate to="/dashboard" />
          ),
        },
        {
          path: "/dashboard",
          element: <Dashboard />,
        },
        {
          path: "/alerts",
          element: <Alerts />,
        },
      ],
    },
  ]);