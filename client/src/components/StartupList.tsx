import { Startup } from "@/models/StartupModel";
import StartupCard from "./StartupCard";

interface StartupListProps {
  startups: Startup[];
  topMatches: Startup[];
}

export default function StartupList({ startups, topMatches }: StartupListProps) {
  const otherResults = startups.filter(
    (s) => !topMatches.some((top) => top.name === s.name)
  );

  return (
    <div className="mt-8 space-y-10">
      {topMatches.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-1">
            {topMatches.length === startups.length && startups.length <= 3
              ? "התוצאות המתאימות ביותר:"
              : "3 התוצאות המתאימות ביותר:"}
          </h2>
          <div className="mt-4 space-y-4">
            {topMatches.map((startup, index) => (
              <StartupCard key={index} startup={startup} isTopMatch />
            ))}
          </div>
        </div>
      )}

      {otherResults.length > 0 && (
        <div>
          <h2 className="text-lg font-medium text-gray-700 border-b border-gray-100 pb-1">
            תוצאות נוספות:
          </h2>
          <div className="mt-4 space-y-4">
            {otherResults.map((startup, index) => (
              <StartupCard key={index} startup={startup} />
            ))}
          </div>
        </div>
      )}

      {startups.length === 0 && (
        <div className="text-center py-10 text-muted-foreground">
          <p className="text-sm">לא נמצאו סטרטאפים תואמים.</p>
        </div>
      )}
    </div>
  );
}
