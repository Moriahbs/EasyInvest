import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { STARTUP_MOCK_DATA } from "@/models/StartupModel";

export default function MapPage() {
  const position = [32.0853, 34.7818]; // Tel Aviv coordinates

  return (
    <MapContainer center={position} zoom={13} style={{ height: "500px", width: "100%" }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {STARTUP_MOCK_DATA.map((startup, index) => (
        <Marker key={index} position={[startup.latitude, startup.longitude]}>
          <Popup>
            <strong>{startup.companyName}</strong><br />
            {startup.description}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}