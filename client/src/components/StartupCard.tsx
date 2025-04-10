import React from "react";
import { Startup } from "@/models/StartupModel.ts";
import config from "@/config";

interface StartupCardProps {
  startup: Startup;
  isTopMatch?: boolean;
}

const StartupCard: React.FC<StartupCardProps> = ({
  startup,
  isTopMatch = false,
}) => {
  return (
    <div className="max-w-sm bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="relative">
        <img
          src={startup.image ? config.SERVER_URL + "/" + startup.image : "/src/assets/default-image.png"} // Fallback image if none provided
          alt={startup.name}
          className="w-full h-64 object-cover"
        />
      </div>
      <div className="p-4">
        <h2 className="text-2xl font-bold text-gray-800">{startup.name}</h2>
        <p className="text-gray-600 text-sm mt-1">{startup.description}</p>
      </div>
    </div>
  );
};

export default StartupCard;
