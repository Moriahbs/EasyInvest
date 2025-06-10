import { Startup } from "@/models/StartupModel";
import { DollarSign, MapPin } from "lucide-react";
import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { useNavigate } from "react-router-dom";
import { formatValuation } from "./StartupCard";

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
      <MapContainer style={{ height: "100%", width: "100%" }}>
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
                <div className="flex mt-2">
                  <div className="flex items-center text-gray-600 text-sm gap-1">
                    <MapPin className="w-4 h-4 min-w-4 min-h-4 flex-shrink-0 text-blue-500" />
                    <span className="truncate max-w-[150px] block">
                      {startup.location}
                    </span>
                  </div>

                  <div className="flex items-center text-gray-600 text-sm gap-1">
                    <DollarSign className="w-4 h-4 text-green-600" />
                    <span>{formatValuation(startup.valuationLastRound)}</span>
                  </div>
                </div>
                <div dir="rtl" className="text-gray-700 mt-1 mb-2">
                  {startup.description}
                </div>
                <div className="w-full flex justify-center mt-5">
                  <button
                    onClick={() => navigate(`/startup/${startup._id}`)}
                    className="inline-block bg-blue-500 text-white text-sm font-semibold px-4 py-2 rounded-lg shadow hover:bg-blue-600 transition-colors"
                  >
                    לפרטים נוספים
                  </button>
                </div>
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
