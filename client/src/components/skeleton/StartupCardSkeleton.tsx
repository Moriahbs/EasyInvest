import React from "react";

const StartupCardSkeleton: React.FC = () => {
  return (
    <div className="relative max-w-sm w-full bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 animate-pulse">
      <div className="w-full h-56 bg-gray-200" />

      <div className="p-4 flex flex-col gap-2">
        <div className="h-6 bg-gray-200 rounded w-3/4" />

        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-300 rounded-full" />
          <div className="h-4 bg-gray-200 rounded w-1/2" />
        </div>

        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-300 rounded-full" />
          <div className="h-4 bg-gray-200 rounded w-1/3" />
        </div>

        <div className="flex flex-wrap gap-2 mt-2">
          <div className="h-5 bg-gray-200 rounded-full w-16" />
          <div className="h-5 bg-gray-200 rounded-full w-12" />
          <div className="h-5 bg-gray-200 rounded-full w-14" />
        </div>
      </div>
    </div>
  );
};

export default StartupCardSkeleton;
