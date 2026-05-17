import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polygon,
} from "react-leaflet";

import { useIotStore } from "../../store/iotStore";

const polygon = [
  [-32.95, -61.3],
  [-32.96, -61.28],
  [-32.97, -61.29],
  [-32.96, -61.31],
];

export default function FarmMap() {
  const { machines } = useIotStore();

  return (
    <MapContainer
      center={[-32.95, -61.3]}
      zoom={13}
      style={{
        height: "100%",
        width: "100%",
        borderRadius: "16px",
      }}
    >
      <TileLayer
        attribution='&copy; OpenStreetMap'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {machines.map((machine) => (
        <Marker
          key={machine.id}
          position={[
            machine.lat,
            machine.lng,
          ]}
        >
          <Popup>
            <div>
              <strong>
                {machine.name}
              </strong>

              <p>
                Combustible:
                {" "}
                {machine.fuel.toFixed(0)}%
              </p>

              <p>
                Temp:
                {" "}
                {machine.temperature.toFixed(
                  0
                )}
                °C
              </p>

              <p>
                Velocidad:
                {" "}
                {machine.speed.toFixed(0)}
                km/h
              </p>
            </div>
          </Popup>
        </Marker>
      ))}

      <Polygon
        positions={polygon}
        pathOptions={{
          color: "#10b981",
        }}
      />
    </MapContainer>
  );
}