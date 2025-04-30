import React, { useState } from "react";
import { Startup } from "@/models/StartupModel.ts";
import StartupCard from "./StartupCard";
import StartupCardSkeleton from "./skeleton/StartupCardSkeleton";

interface StartupListProps {
  startups: Startup[];
  loading: boolean;
  handleDeleteStartup?: (startupId: string) => void;
  handleEditStartup?: (startup: Startup) => void;
}

const ITEMS_PER_PAGE = 4;

const StartupList: React.FC<StartupListProps> = ({
  startups,
  loading,
  handleDeleteStartup,
  handleEditStartup,
}) => {
  const [currentPage, setCurrentPage] = useState(0);

  const totalPages = Math.ceil(startups.length / ITEMS_PER_PAGE);

  const handlePrev = () => {
    if (currentPage > 0) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages - 1) setCurrentPage(currentPage + 1);
  };

  const visibleStartups = startups.slice(
    currentPage * ITEMS_PER_PAGE,
    (currentPage + 1) * ITEMS_PER_PAGE
  );

  return (
    <div className="w-full flex flex-col items-center gap-6 p-2">
      <h2 className="text-3xl font-bold text-gray-800 text-center">
        סטארטאפים רלוונטים עבורך
      </h2>

      <div
        className="overflow-y-auto w-full max-w-4xl px-2"
        style={{ height: "calc(100vh - 346px)" }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {loading
            ? Array.from({ length: 4 }).map((_, index) => (
                <StartupCardSkeleton key={index} />
              ))
            : visibleStartups.map((startup) => (
                <StartupCard
                  key={startup._id}
                  startup={startup}
                  handleEditStartup={handleEditStartup}
                  handleDeleteStartup={handleDeleteStartup}
                />
              ))}
          {!startups.length && <p>לא קיימים סטארטאפים</p>}
        </div>
      </div>

      {!loading && (
        <div className="flex items-center gap-4 mt-6 mb-2">
          <button
            onClick={handlePrev}
            disabled={currentPage === 0 || loading}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
          >
            הקודם
          </button>
          <span className="text-gray-700 font-medium">
            עמוד {currentPage + 1} מתוך {totalPages}
          </span>
          <button
            onClick={handleNext}
            disabled={currentPage >= totalPages - 1 || loading}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
          >
            הבא
          </button>
        </div>
      )}
    </div>
  );
};

export default StartupList;
