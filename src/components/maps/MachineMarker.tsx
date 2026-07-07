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
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "14px",
            }}
          >
            <div>
              <div
                style={{
                  fontSize: "17px",
                  fontWeight: 700,
                  color: "#0f172a",
                }}
              >
                {machine.name}
              </div>

              <div
                style={{
                  fontSize: "12px",
                  color: "#64748b",
                }}
              >
                Unidad agrícola en operación
              </div>
            </div>

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