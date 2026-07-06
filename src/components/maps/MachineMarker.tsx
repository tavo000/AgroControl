import { Marker, Popup } from "react-leaflet";

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
) {
  const status = getMachineStatus(machine);

  return L.divIcon({
    className: "",
    html: `
      <div
        style="
          width: 42px;
          height: 42px;
          border-radius: 999px;
          background: ${status.bg};
          border: 2px solid ${status.color};
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 10px 24px rgba(0,0,0,.35);
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
}: MachineMarkerProps) {
  const status = getMachineStatus(machine);

  return (
    <Marker
      position={[machine.lat, machine.lng]}
      icon={createMachineIcon(machine)}
    >
      <Popup minWidth={260} maxWidth={300}>
        <div
          style={{
            width: "260px",
            fontFamily:
              "Inter, system-ui, sans-serif",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
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
              {machine.name}
            </strong>

            <span
              style={{
                borderRadius: "999px",
                padding: "4px 8px",
                fontSize: "11px",
                fontWeight: 700,
                color: status.color,
                background: status.bg,
              }}
            >
              {status.label}
            </span>
          </div>

          <div
            style={{
              display: "grid",
              gap: "7px",
              fontSize: "13px",
              color: "#374151",
            }}
          >
            <div>
              <strong>Combustible:</strong>{" "}
              {machine.fuel.toFixed(0)}%
            </div>

            <div>
              <strong>Temperatura:</strong>{" "}
              {machine.temperature.toFixed(0)}°C
            </div>

            <div>
              <strong>Velocidad:</strong>{" "}
              {machine.speed.toFixed(0)} km/h
            </div>

            <div>
              <strong>Estado:</strong>{" "}
              {machine.active
                ? "Activa"
                : "Inactiva"}
            </div>
          </div>

          <div
            style={{
              marginTop: "12px",
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "8px",
            }}
          >
            <button
              type="button"
              onClick={() => {
                window.location.href = "/telemetry";
              }}
              style={{
                border: "none",
                borderRadius: "10px",
                padding: "8px",
                background: "#10b981",
                color: "#ffffff",
                fontSize: "12px",
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
                border: "none",
                borderRadius: "10px",
                padding: "8px",
                background: "#0f172a",
                color: "#ffffff",
                fontSize: "12px",
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