import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";

import "./index.css";

import "leaflet/dist/leaflet.css";

import { router } from "./routes";

import { startIotSimulation } from "./services/iotSimulator";

startIotSimulation();

ReactDOM.createRoot(
  document.getElementById("root")!
).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);