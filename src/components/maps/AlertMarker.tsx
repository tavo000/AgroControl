import { Marker, Popup } from "react-leaflet";

import L from "leaflet";

interface AlertMarkerProps {
  alert: {
    id: number;
    machineName: string;
    type: string;
    severity: string;
    message: string;
    createdAt: string;
  };
  position: [number, number];
}

function getAlertStyle(severity: string) {
  if (severity === "CRITICAL") {
    return {
      label: "Crítica",
      color: "#ef4444",
      bg: "#450a0a",
      icon: "🚨",
    };
  }

  if (severity === "HIGH") {
    return {
      label: "Alta",
      color: "#f97316",
      bg: "#431407",
      icon: "⚠️",
    };
  }

  if (severity === "MEDIUM") {
    return {
      label: "Media",
      color: "#facc15",
      bg: "#422006",
      icon: "⚠",
    };
  }

  return {
    label: "Baja",
    color: "#38bdf8",
    bg: "#082f49",
    icon: "ℹ️",
  };
}

function createAlertIcon(severity: string) {
  const style = getAlertStyle(severity);

  return L.divIcon({
    className: "",
    html: `
      <div
        style="
          width: 34px;
          height: 34px;
          border-radius: 999px;
          background: ${style.bg};
          border: 2px solid ${style.color};
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 10px 24px rgba(0,0,0,.35);
          color: white;
          font-size: 17px;
          transform: translate(24px, -24px);
        "
      >
        ${style.icon}
      </div>
    `,
    iconSize: [34, 34],
    iconAnchor: [17, 17],
    popupAnchor: [24, -28],
  });
}

export default function AlertMarker({
  alert,
  position,
}: AlertMarkerProps) {
  const style = getAlertStyle(alert.severity);

  return (
    <Marker
      position={position}
      icon={createAlertIcon(alert.severity)}
    >
      <Popup minWidth={300} maxWidth={320}>
        <div
          style={{
            width: "290px",
            fontFamily:
              "Inter, system-ui, sans-serif",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "12px",
            }}
          >
            <div>
              <div
                style={{
                  fontSize: "16px",
                  fontWeight: 700,
                  color: "#0f172a",
                }}
              >
                Alerta operativa
              </div>

              <div
                style={{
                  fontSize: "12px",
                  color: "#64748b",
                }}
              >
                Evento detectado en maquinaria
              </div>
            </div>

            <div
              style={{
                background: style.bg,
                color: style.color,
                padding: "6px 10px",
                borderRadius: "999px",
                fontSize: "11px",
                fontWeight: 700,
              }}
            >
              {style.icon} {style.label}
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gap: "8px",
              fontSize: "13px",
              color: "#334155",
              marginBottom: "12px",
            }}
          >
            <div>
              <strong>Máquina:</strong>{" "}
              {alert.machineName}
            </div>

            <div>
              <strong>Tipo:</strong>{" "}
              {alert.type}
            </div>

            <div>
              <strong>Mensaje:</strong>{" "}
              {alert.message}
            </div>

            <div>
              <strong>Fecha:</strong>{" "}
              {new Date(alert.createdAt).toLocaleString(
                "es-AR",
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              window.location.href = "/alerts";
            }}
            style={{
              width: "100%",
              border: "none",
              borderRadius: "10px",
              padding: "10px",
              background: style.color,
              color: "#ffffff",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Ver alertas
          </button>
        </div>
      </Popup>
    </Marker>
  );
}