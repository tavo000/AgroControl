import {
  MapContainer,
  TileLayer,
  Popup,
  Polygon,
  Polyline,
  Marker,
  ZoomControl,
  useMap,
} from "react-leaflet";

import { useEffect, useRef, useState } from "react";

import {
  getCrops,
  getHarvests,
  getPlots,
  getOpenAlerts,
} from "../../services/machineService";

import MachineMarker from "./MachineMarker";
import AlertMarker from "./AlertMarker";

interface MapMachine {
  id: number;
  name: string;
  lat: number;
  lng: number;
  fuel: number;
  temperature: number;
  speed: number;
  active: boolean;
}

interface Plot {
  id: number;
  name: string;
  area?: number;
  crop?: string;
  status?: string;
  farm?: {
    name: string;
    location?: string;
  };
}

interface Crop {
  id: number;
  plotId: number;
  name: string;
  variety?: string;
  status?: string;
  campaign?: {
    name: string;
  };
}


interface Harvest {
  id: number;
  cropId: number;
  totalProduction: number;
  harvestedArea: number;
  yieldPerHectare: number;
  unit: string;
}

interface FarmMapProps {
  selectedMachineName?: string | null;
  onSelectMachine?: (machineName: string) => void;
}

interface OpenAlert {
  id: number;
  machineName: string;
  type: string;
  severity: string;
  message: string;
  createdAt: string;
}

const basePolygons: [number, number][][] = [
  [
    [-32.95, -61.3],
    [-32.96, -61.28],
    [-32.97, -61.29],
    [-32.96, -61.31],
  ],
  [
    [-32.945, -61.315],
    [-32.952, -61.302],
    [-32.961, -61.308],
    [-32.954, -61.323],
  ],
  [
    [-32.965, -61.275],
    [-32.972, -61.26],
    [-32.982, -61.268],
    [-32.975, -61.285],
  ],
];

function FocusMachineOnMap({
  machines,
  selectedMachineName,
}: {
  machines: MapMachine[];
  selectedMachineName?: string | null;
}) {
  const map = useMap();

  const initializedRef = useRef(false);

  useEffect(() => {
    if (!selectedMachineName) {
      initializedRef.current = false;
      return;
    }

    const machine = machines.find(
      (item) => item.name === selectedMachineName,
    );

    if (!machine) return;

    if (!initializedRef.current) {
      initializedRef.current = true;

      map.flyTo(
        [machine.lat, machine.lng],
        15,
        {
          duration: 1.2,
        },
      );

      return;
    }

    map.panTo(
      [machine.lat, machine.lng],
      {
        animate: true,
        duration: 0.6,
      },
    );
  }, [machines, selectedMachineName, map]);

  return null;
}

function getCropColor(cropName?: string) {
  if (!cropName) return "#64748b";

  const normalized =
    cropName.toLowerCase();

  if (normalized.includes("soja")) {
    return "#10b981";
  }

  if (normalized.includes("maíz")) {
    return "#f59e0b";
  }

  if (normalized.includes("maiz")) {
    return "#f59e0b";
  }

  if (normalized.includes("trigo")) {
    return "#eab308";
  }

  if (normalized.includes("girasol")) {
    return "#f97316";
  }

  return "#22c55e";
}

export default function FarmMap({
  selectedMachineName,
  onSelectMachine,
}: FarmMapProps) {

  const [animatedMachines, setAnimatedMachines] =
    useState<MapMachine[]>([]);

  const animationRef =
    useRef<number | null>(null);

  const [plots, setPlots] =
    useState<Plot[]>([]);

  const [crops, setCrops] =
    useState<Crop[]>([]);

  const [harvests, setHarvests] =
    useState<Harvest[]>([]);

    const [showMachines, setShowMachines] =
    useState(true);

  const [showPlots, setShowPlots] =
    useState(true);

  const [showCrops, setShowCrops] =
    useState(true);

  const [showRoutes, setShowRoutes] =
    useState(true);

  const [machineTrails, setMachineTrails] =
    useState<Record<number, [number, number][]>>({});

  const [openAlerts, setOpenAlerts] =
  useState<OpenAlert[]>([]);

  useEffect(() => {
    loadMapData();

    const interval = setInterval(() => {
      loadMachinesMap();
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const loadMapData = async () => {
    await Promise.all([
      loadMachinesMap(),
      loadAgriculturalData(),
      loadOpenAlerts(),
    ]);
  };

  const loadAgriculturalData = async () => {
    try {
      const [
        plotsData,
        cropsData,
        harvestsData,
      ] = await Promise.all([
        getPlots(),
        getCrops(),
        getHarvests(),
      ]);

      setPlots(plotsData);
      setCrops(cropsData);
      setHarvests(harvestsData);
    } catch (error) {
      console.error(error);
    }
  };

    const animateMachinePositions = (
    targetMachines: MapMachine[],
  ) => {
    if (animatedMachines.length === 0) {
      setAnimatedMachines(targetMachines);
      return;
    }

    if (animationRef.current) {
      window.clearInterval(animationRef.current);
    }

    const startMachines = animatedMachines;

    const steps = 20;
    let currentStep = 0;

    animationRef.current = window.setInterval(() => {
      currentStep += 1;

      const progress = currentStep / steps;

      const nextMachines = targetMachines.map(
        (targetMachine) => {
          const startMachine = startMachines.find(
            (item) => item.id === targetMachine.id,
          );

          if (!startMachine) {
            return targetMachine;
          }

          return {
            ...targetMachine,
            lat:
              startMachine.lat +
              (targetMachine.lat - startMachine.lat) *
                progress,
            lng:
              startMachine.lng +
              (targetMachine.lng - startMachine.lng) *
                progress,
          };
        },
      );

      setAnimatedMachines(nextMachines);

      if (currentStep >= steps) {
        window.clearInterval(animationRef.current!);
        animationRef.current = null;
        setAnimatedMachines(targetMachines);
      }
    }, 50);
  };

  const loadOpenAlerts = async () => {
  try {
    const alerts =
      await getOpenAlerts();

    setOpenAlerts(alerts);
  } catch (error) {
    console.error(error);
  }
};

  const loadMachinesMap = async () => {
    const token = localStorage.getItem(
      "agrocontrol_token",
    );

    const response = await fetch(
      "http://localhost:4000/machines/map",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!response.ok) return;

    const data = await response.json();

        animateMachinePositions(data);
        setMachineTrails((previousTrails) => {
      const nextTrails = {
        ...previousTrails,
      };

      data.forEach((machine: MapMachine) => {
  const currentTrail: [number, number][] =
    nextTrails[machine.id] || [];

  const nextPoint: [number, number] = [
    machine.lat,
    machine.lng,
  ];

  const updatedTrail: [number, number][] = [
    ...currentTrail,
    nextPoint,
  ];

  nextTrails[machine.id] =
    updatedTrail.slice(-20);
});

      return nextTrails;
    });
  };


  const visiblePlots =
    plots.length > 0
      ? plots
      : [
          {
            id: 0,
            name: "Lote demostración",
            area: 0,
            status: "Activo",
          },
        ];

  return (
  <div className="relative h-full w-full">
    <div className="mb-3 flex flex-wrap items-center gap-2 rounded-xl border border-slate-800 bg-slate-950 px-4 py-3">

  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
    Capas GIS
  </span>

  <label className="flex items-center gap-2 rounded-lg border border-slate-700 px-3 py-1 text-xs">
    <input
      type="checkbox"
      checked={showMachines}
      onChange={() =>
        setShowMachines(!showMachines)
      }
    />
    🚜 Maquinaria
  </label>

  <label className="flex items-center gap-2 rounded-lg border border-slate-700 px-3 py-1 text-xs">
    <input
      type="checkbox"
      checked={showPlots}
      onChange={() =>
        setShowPlots(!showPlots)
      }
    />
    🟩 Lotes
  </label>

  <label className="flex items-center gap-2 rounded-lg border border-slate-700 px-3 py-1 text-xs">
    <input
      type="checkbox"
      checked={showCrops}
      onChange={() =>
        setShowCrops(!showCrops)
      }
    />
    🌾 Cultivos
  </label>

    <label className="flex items-center gap-2 rounded-lg border border-slate-700 px-3 py-1 text-xs">
    <input
      type="checkbox"
      checked={showRoutes}
      onChange={() =>
        setShowRoutes(!showRoutes)
      }
    />
    🛣 Rutas
  </label>

</div>

<MapContainer
      center={[-32.95, -61.3]}
      zoom={13}
      zoomControl={false}
      style={{
        height: "100%",
        width: "100%",
        borderRadius: "16px",
      }}
    >
      <TileLayer
        attribution="&copy; OpenStreetMap"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <ZoomControl position="topright" />

      <FocusMachineOnMap
        machines={animatedMachines}
        selectedMachineName={selectedMachineName}
      />

            {showRoutes &&
        Object.entries(machineTrails).map(
          ([machineId, trail]) =>
            trail.length > 1 ? (
              <Polyline
                key={machineId}
                positions={trail}
                pathOptions={{
                  color: "#16a34a",
                  weight: 6,
                  opacity: 0.95,
            }}
              />
            ) : null,
        )}

              {openAlerts.map((alert) => {
        const relatedMachine =
          animatedMachines.find(
            (machine) =>
              machine.name === alert.machineName,
          );

        if (!relatedMachine) {
          return null;
        }

        const alertPosition: [number, number] = [
          relatedMachine.lat + 0.00022,
          relatedMachine.lng + 0.00018,
    ];

        return (
              <AlertMarker
                key={alert.id}
                alert={alert}
                position={alertPosition}
              />
              );
      })}


            {showPlots && visiblePlots.map((plot, index) => {
        const crop = crops.find(
          (item) => item.plotId === plot.id,
        );

        const harvest = crop
          ? harvests.find(
              (item) =>
                item.cropId === crop.id,
            )
          : undefined;

        const polygon =
          basePolygons[
            index % basePolygons.length
          ];

        const color = showCrops
          ? getCropColor(crop?.name || plot.crop)
          : "#64748b";

        return (
          <Polygon
            key={plot.id}
            positions={polygon}
            pathOptions={{
              color,
              weight: 3,
              fillOpacity: 0.28,
            }}
          >
            <Popup
              minWidth={240}
              maxWidth={260}
            >
              <div
                style={{
                  width: "240px",
                  fontFamily:
                    "Inter, system-ui, sans-serif",
                }}
              >
                <div
                  style={{
                    marginBottom: "10px",
                  }}
                >
                  <strong
                    style={{
                      display: "block",
                      fontSize: "15px",
                      color: "#111827",
                    }}
                  >
                    {plot.farm?.name ||
                      "Campo agrícola"}
                  </strong>

                  <span
                    style={{
                      fontSize: "12px",
                      color: "#6b7280",
                    }}
                  >
                    Lote productivo
                  </span>
                </div>

                <div
                  style={{
                    display: "grid",
                    gap: "6px",
                    fontSize: "13px",
                    color: "#374151",
                  }}
                >
                  <div>
                    <strong>Lote:</strong>{" "}
                    {plot.name ||
                      "Sin lote"}
                  </div>

                  <div>
                    <strong>Cultivo:</strong>{" "}
                    {crop?.name ||
                      plot.crop ||
                      "Sin cultivo"}
                  </div>

                  <div>
                    <strong>Campaña:</strong>{" "}
                    {crop?.campaign?.name ||
                      "Sin campaña"}
                  </div>

                  <div>
                    <strong>Superficie:</strong>{" "}
                    {plot.area || 0} ha
                  </div>

                  <div>
                    <strong>Producción:</strong>{" "}
                    {harvest
                      ? `${harvest.totalProduction.toFixed(
                          0,
                        )} tn`
                      : "Sin cosecha"}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    window.location.href =
                      "/telemetry";
                  }}
                  style={{
                    marginTop: "12px",
                    width: "100%",
                    border: "none",
                    borderRadius: "10px",
                    padding: "8px 10px",
                    background: "#10b981",
                    color: "#ffffff",
                    fontSize: "13px",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  Ver detalle
                </button>
              </div>
            </Popup>
          </Polygon>
        );
      })}

            {showMachines &&
            animatedMachines.map((machine) => (
            <MachineMarker
              key={machine.id}
              machine={machine}
              isSelected={
                selectedMachineName === machine.name
              }
               onSelectMachine={onSelectMachine}
            />
        ))}
    </MapContainer>
    </div>
  );
}