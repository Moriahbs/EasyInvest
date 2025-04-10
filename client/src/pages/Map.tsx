import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import { getAllStartups } from "@/actions/startupActions";
import { Startup } from "@/models/startupModel";
import { Skeleton } from "@/components/ui/skeleton";

export default function MapPage() {
  const [startups, setStartUps] = useState<Startup[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const res = await getAllStartups();
      setStartUps(res);
      setLoading(false);
    };

    fetchData();
  }, []);

  const FitBounds = ({ startups }: { startups: Startup[] }) => {
    const map = useMap();
    const latitudes = startups.map(startup => startup.latitude);
    const longitudes = startups.map(startup => startup.longitude);

    const minLat = Math.min(...latitudes);
    const maxLat = Math.max(...latitudes);
    const minLng = Math.min(...longitudes);
    const maxLng = Math.max(...longitudes);

    map.fitBounds([
      [minLat, minLng],
      [maxLat, maxLng]
    ]);

    return null;
  };

  return (
    <>
      {loading ? (
        <div style={{ height: "500px", width: "100%" }}>
          <Skeleton height="100%" />
        </div>
      ) : (
        <MapContainer
          center={[32.0853, 34.7818]} // Default initial center
          zoom={13}
          style={{ height: "500px", width: "100%" }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {startups.map((startup, index) => (
            <Marker key={index} position={[startup.latitude, startup.longitude]}>
              <Popup>
                <strong>{startup.name}</strong>
                <br />
                {startup.description}
              </Popup>
            </Marker>
          ))}
          {/* Fit the map bounds to all the markers */}
          <FitBounds startups={startups} />
        </MapContainer>
      )}
    </>
  );
}
