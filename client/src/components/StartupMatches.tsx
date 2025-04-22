import { Startup } from "@/models/StartupModel.ts";
import StartupCard from "./StartupCard";

interface StartupMatchesProps {
  startups: Startup[];
  topMatches: Startup[];
}

export default function StartupMatches({ startups, topMatches }: StartupMatchesProps) {
  return (
    <div className="mt-5">
      {topMatches.length > 0 && (
        <>
          <p className="text-md">
            {topMatches.length === startups.length && startups.length <= 3
              ? "Matching Startups:"
              : "Top 3 Matches:"}
          </p>
          <div className="flex flex-col gap-4 mt-2">
            {topMatches.map((startup, index) => (
              <StartupCard key={index} startup={startup} isTopMatch />
            ))}
          </div>
        </>
      )}
      {startups.length > topMatches.length && (
        <>
          <p className="text-md mt-5">Other Matches:</p>
          <div className="flex flex-col gap-4 mt-2">
            {startups
              .filter((s) => !topMatches.some((top) => top.name === s.name))
              .map((startup, index) => (
                <StartupCard key={index} startup={startup} />
              ))}
          </div>
        </>
      )}
      {startups.length === 0 && (
        <p className="mt-2 text-muted-foreground">
          No startups match your criteria yet.
        </p>
      )}
    </div>
  );
}
