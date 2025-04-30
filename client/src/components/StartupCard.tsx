import React, { useState } from "react";
import { Startup } from "@/models/StartupModel.ts";
import config from "@/config";
import { MapPin, DollarSign, Star, Trash2, Pencil } from "lucide-react";
import Cookies from "js-cookie";
import { decodeToken } from "@/utils/authUtils";

interface StartupCardProps {
  startup: Startup;
  isTopMatch?: boolean;
  handleDeleteStartup?: (startupId: string) => void;
  handleEditStartup?: (startup: Startup) => void;
}

const formatValuation = (value: number) => `₪ ${value.toLocaleString("he-IL")}`;

const getImageUrl = (imageSrc: string | undefined) => {
  if (imageSrc?.startsWith("https")) {
    return imageSrc;
  } else if (imageSrc) {
    return `${config.SERVER_URL}/${imageSrc}`;
  }
  return "/src/assets/default-image.png";
};

const StartupCard: React.FC<StartupCardProps> = ({
  startup,
  isTopMatch = false,
  handleDeleteStartup,
  handleEditStartup,
}) => {
  const [imgSrc, setImgSrc] = useState(getImageUrl(startup.image));

  const token = Cookies.get("Authorization") || "";
  const { userId } = decodeToken(token);

  return (
    <div className="relative max-w-sm w-full bg-white rounded-2xl shadow-lg overflow-hidden transition hover:shadow-xl border border-gray-100">
      {isTopMatch && (
        <div className="absolute top-2 left-2 bg-yellow-400 text-white px-2 py-1 text-xs font-bold rounded flex items-center gap-1">
          <Star className="w-4 h-4" />
          התאמה גבוהה
        </div>
      )}

      <img
        src={imgSrc}
        alt={startup.name}
        className="w-full h-56 object-cover"
        onError={() => setImgSrc("/src/assets/default-image.png")}
      />

      <div className="p-4 flex flex-col gap-2">
        <div className="flex justify-between">
          <h2 className="text-xl font-bold text-gray-800">{startup.name}</h2>
          {startup.owner?._id === userId && (
            <div className="flex items-center gap-0.5">
              <div
                className="p-1 rounded-full hover:bg-gray-200 cursor-pointer"
                onClick={() => handleEditStartup?.(startup)}
              >
                <Pencil className="h-3 w-3 text-blue-600" />
              </div>
              <div
                className="p-1 rounded-full hover:bg-gray-200 cursor-pointer"
                onClick={() => handleDeleteStartup?.(startup._id)}
              >
                <Trash2 className="h-3 w-3 text-red-600" />
              </div>
            </div>
          )}
        </div>

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

        <div className="flex flex-wrap gap-2 mt-2">
          {startup.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full"
            >
              {tag}
            </span>
          ))}
          {startup.tags.length > 3 && (
            <span className="text-xs text-gray-500">
              +{startup.tags.length - 3} נוספים
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default StartupCard;
