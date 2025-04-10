import React from "react";
import { List, Typography, Box } from "@mui/material";
import { Startup } from "@/models/StartupModel.ts";
import StartupCard from "./StartupCard";

interface StartupListProps {
    startups: Startup[];
    topMatches: Startup[];
}

const StartupList: React.FC<StartupListProps> = ({ startups, topMatches }) => {
    return (
        <Box sx={{ mt: 2 }}>
            {topMatches.length > 0 && (
                <>
                    <Typography variant="h6">
                        {topMatches.length === startups.length && startups.length <= 3
                            ? "Matching Startups:"
                            : "Top 3 Matches:"}
                    </Typography>
                    <List>
                        {topMatches.map((startup, index) => (
                            <StartupCard key={index} startup={startup} isTopMatch />
                        ))}
                    </List>
                </>
            )}
            {startups.length > topMatches.length && (
                <>
                    <Typography variant="h6">Other Matches:</Typography>
                    <List>
                        {startups
                            .filter((s) => !topMatches.some((top) => top.name === s.name))
                            .map((startup, index) => (
                                <StartupCard key={index} startup={startup} />
                            ))}
                    </List>
                </>
            )}
            {startups.length === 0 && (
                <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
                    No startups match your criteria yet.
                </Typography>
            )}
        </Box>
    );
};

export default StartupList;