import { Marker, Popup } from "react-leaflet";
import "../../styles/agrocontrol-map.css";

import L from "leaflet";

interface MachineMarkerProps {
  machine: {
    id: number;
    name: string;
    lat: number;
    lng: number;
    fuel: number;
    temperature: number;
    speed: number;
    active: boolean;
    updatedAt?: string;
  };
  isSelected?: boolean;
  onSelectMachine?: (machineName: string) => void;
}

function getConnectionStatus(
  machine: MachineMarkerProps["machine"],
) {
  if (!machine.active) {
    return {
      label: "Offline",
      color: "#64748b",
      className: "agrocontrol-machine-offline",
    };
  }

  if (!machine.updatedAt) {
    return {
      label: "Sin datos",
      color: "#f59e0b",
      className: "agrocontrol-machine-no-data",
};
  }

  const seconds =
    (Date.now() -
      new Date(machine.updatedAt).getTime()) /
    1000;

  if (seconds > 20) {
    return {
      label: "Sin señal",
      color: "#f97316",
      className: "agrocontrol-machine-no-signal",
      };
  }

  return {
    label: "Online",
    color: "#22c55e",
    className: "agrocontrol-machine-online",
};
}

function getMachineStatus(machine: MachineMarkerProps["machine"]) {
  if (!machine.active) {
    return {
      label: "Offline",
      color: "#64748b",
      bg: "#0f172a",
      icon: "⚫",
    };
  }

  if (machine.fuel < 20 || machine.temperature > 78) {
    return {
      label: "Alerta",
      color: "#ef4444",
      bg: "#450a0a",
      icon: "🔴",
    };
  }

  if (machine.speed > 38) {
    return {
      label: "Advertencia",
      color: "#facc15",
      bg: "#422006",
      icon: "🟡",
    };
  }

  return {
    label: "Operando",
    color: "#22c55e",
    bg: "#052e16",
    icon: "🟢",
  };
}

function createMachineIcon(
  machine: MachineMarkerProps["machine"],
  isSelected?: boolean,
) {
  const status = getMachineStatus(machine);
  const connection =
  getConnectionStatus(machine);

  const pulseClass = isSelected
    ? "agrocontrol-machine-pulse"
    : "";

  return L.divIcon({
    className: "",
    html: `
      <div
        class="agrocontrol-machine-icon ${connection.className} ${pulseClass}"
        style="
          width: 42px;
          height: 42px;
          border-radius: 999px;
          background: ${status.bg};
          border: 2px solid ${connection.color};
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: ${
            isSelected
              ? "0 0 28px rgba(34,197,94,.75)"
              : "0 10px 24px rgba(0,0,0,.35)"
          };
          color: white;
          font-size: 20px;
        "
      >
        🚜
      </div>
    `,
    iconSize: [42, 42],
    iconAnchor: [21, 21],
    popupAnchor: [0, -18],
  });
}

export default function MachineMarker({
  machine,
  isSelected = false,
  onSelectMachine,
}: MachineMarkerProps) {
  const status = getMachineStatus(machine);
  const connection =
  getConnectionStatus(machine);

  return (
    <Marker
      position={[machine.lat, machine.lng]}
      icon={createMachineIcon(machine, isSelected)}
      eventHandlers={{
        click: () => {
          onSelectMachine?.(machine.name);
        },
      }}
    >
      <Popup minWidth={320} maxWidth={340}>
        <div
          style={{
            width: "310px",
            fontFamily:
              "Inter, system-ui, sans-serif",
          }}
        >
          <div
  style={{
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    alignItems: "flex-end",
  }}
>
  <div
    style={{
      background: status.bg,
      color: status.color,
      padding: "6px 12px",
      borderRadius: "999px",
      fontSize: "11px",
      fontWeight: 700,
    }}
  >
    {status.icon} {status.label}
  </div>

  <div
    style={{
      background: connection.color,
      color: "#ffffff",
      padding: "4px 10px",
      borderRadius: "999px",
      fontSize: "10px",
      fontWeight: 700,
    }}
  >
    {connection.label}
  </div>
</div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "10px",
              marginBottom: "14px",
            }}
          >
            <div
              style={{
                background: "#f8fafc",
                borderRadius: "10px",
                padding: "10px",
              }}
            >
              <div
                style={{
                  fontSize: "11px",
                  color: "#64748b",
                }}
              >
                Combustible
              </div>

              <div
                style={{
                  fontSize: "22px",
                  fontWeight: 700,
                  color:
                    machine.fuel < 20
                      ? "#dc2626"
                      : "#16a34a",
                }}
              >
                {machine.fuel.toFixed(0)}%
              </div>
            </div>

            <div
              style={{
                background: "#f8fafc",
                borderRadius: "10px",
                padding: "10px",
              }}
            >
              <div
                style={{
                  fontSize: "11px",
                  color: "#64748b",
                }}
              >
                Temperatura
              </div>

              <div
                style={{
                  fontSize: "22px",
                  fontWeight: 700,
                  color:
                    machine.temperature > 78
                      ? "#dc2626"
                      : "#2563eb",
                }}
              >
                {machine.temperature.toFixed(0)}°C
              </div>
            </div>

            <div
              style={{
                background: "#f8fafc",
                borderRadius: "10px",
                padding: "10px",
              }}
            >
              <div
                style={{
                  fontSize: "11px",
                  color: "#64748b",
                }}
              >
                Velocidad
              </div>

              <div
                style={{
                  fontSize: "22px",
                  fontWeight: 700,
                  color: "#7c3aed",
                }}
              >
                {machine.speed.toFixed(0)}
              </div>

              <div
                style={{
                  fontSize: "11px",
                  color: "#64748b",
                }}
              >
                km/h
              </div>
            </div>

            <div
              style={{
                background: "#f8fafc",
                borderRadius: "10px",
                padding: "10px",
              }}
            >
              <div
                style={{
                  fontSize: "11px",
                  color: "#64748b",
                }}
              >
                Estado
              </div>

              <div
                style={{
                  fontSize: "18px",
                  fontWeight: 700,
                  color: machine.active
                    ? "#16a34a"
                    : "#64748b",
                }}
              >
                {machine.active
                  ? "Activa"
                  : "Detenida"}
              </div>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              gap: "8px",
            }}
          >
            <button
              type="button"
              onClick={() => {
                window.location.href = "/telemetry";
              }}
              style={{
                flex: 1,
                border: "none",
                borderRadius: "10px",
                padding: "10px",
                background: "#10b981",
                color: "#fff",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Telemetría
            </button>

            <button
              type="button"
              onClick={() => {
                window.location.href = "/machines";
              }}
              style={{
                flex: 1,
                border: "none",
                borderRadius: "10px",
                padding: "10px",
                background: "#0f172a",
                color: "#fff",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Ver máquina
            </button>
          </div>
        </div>
      </Popup>
    </Marker>
  );
}