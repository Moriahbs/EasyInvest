import { Startup } from "@/models/StartupModel";
import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { useNavigate } from "react-router-dom";

interface MapProps {
  startups: Startup[];
}

const Map: React.FC<MapProps> = ({ startups }) => {
  const navigate = useNavigate();

  const FitBounds = ({ startups }: { startups: Startup[] }) => {
    const map = useMap();

    useEffect(() => {
      if (!map) return;

      if (startups.length === 0) {
        map.setView([31.0461, 34.8516], 7); 
      } else {
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
      }
    }, [map, startups]);

    return null;
  };

  return (
    <div className="w-full md:w-[65%]">
      <MapContainer
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {startups?.map((startup) => (
          <Marker
            key={startup._id}
            position={[startup.latitude, startup.longitude]}
          >
            <Popup>
              <div className="text-right direction-rtl">
                <strong className="text-lg font-bold text-blue-950">
                  {startup.name}
                </strong>
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
    </div>
  );
};

export default Map;
