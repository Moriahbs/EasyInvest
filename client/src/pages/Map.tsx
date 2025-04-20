import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import { getAllStartups } from "@/actions/startupActions";
import { Startup } from "@/models/StartupModel";
import { Skeleton } from "@/components/ui/skeleton";
import StartupCard from "@/components/StartupCard";
import { useNavigate } from "react-router-dom";

export default function MapPage() {
  const [startups, setStartUps] = useState<Startup[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

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

    if (!map || !startups || startups.length === 0) return null;

    const latitudes = startups.map((startup) => startup.latitude);
    const longitudes = startups.map((startup) => startup.longitude);

    const minLat = Math.min(...latitudes);
    const maxLat = Math.max(...latitudes);
    const minLng = Math.min(...longitudes);
    const maxLng = Math.max(...longitudes);

    map.fitBounds([
      [minLat, minLng],
      [maxLat, maxLng],
    ]);

    return null;
  };

  return (
      <div className="flex gap-8 flex-wrap items-start p-4">
        <div className="flex-1">
          {loading ? (
              <div style={{ height: "500px", width: "100%" }}>
                <Skeleton />
              </div>
          ) : (
              <MapContainer
                  center={[32.0853, 34.7818]}
                  zoom={13}
                  style={{ height: "500px", width: "100%" }}
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                {startups.map((startup) => (
                    <Marker
                        key={startup.id}
                        position={[startup.latitude, startup.longitude]}
                    >
                      <Popup>
                        <div className="text-right direction-rtl">
                          <strong className="text-lg font-bold text-blue-950">{startup.name}</strong>
                          <br />
                          <p className="text-gray-700">{startup.description}</p>
                          <button
                              onClick={() => navigate(`/startup/${startup._id}`)}
                              className="mt-2 bg-purple-600 text-white rounded-full py-2 px-4 text-sm font-medium hover:bg-purple-700 transition"
                          >
                            לפרטים נוספים
                          </button>
                        </div>
                      </Popup>
                    </Marker>
                ))}
                <FitBounds startups={startups} />
              </MapContainer>
          )}
        </div>

        <div className="w-full sm:w-[48%] md:w-[30%]">
          {loading ? (
              <Skeleton />
          ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {startups.map((startup) => (
                    <div key={startup._id}>
                      <StartupCard startup={startup} />
                    </div>
                ))}
              </div>
          )}
        </div>
      </div>
  );
}