import React from "react";
import { Box, Chip, ListItem, ListItemText, Typography } from "@mui/material";
import { Startup } from "@/models/StartupModel.ts";

interface StartupCardProps {
    startup: Startup;
    isTopMatch?: boolean;
}

const StartupCard: React.FC<StartupCardProps> = ({ startup, isTopMatch = false }) => {
    return (
        <ListItem alignItems="flex-start" sx={{ backgroundColor: isTopMatch ? "#f0f8ff" : "inherit" }}>
            <ListItemText
                primary={
                    <Typography variant="body1" fontWeight={isTopMatch ? "bold" : "normal"}>
                        {startup.companyName} {isTopMatch && "(Top Match)"}
                    </Typography>
                }
                secondary={
                    <>
                        <Typography component="span" variant="body2" color="textPrimary">
                            {startup.description}
                        </Typography>
                        <Box sx={{ mt: 1 }}>
                            <Chip label={`Funding: ${startup.fundingStage}`} size="small" color="primary" />
                            <Chip label={`Valuation: $${startup.valuationLastRound}M`} size="small" color="success" sx={{ ml: 1 }} />
                            <Chip label={`Location: ${startup.location}`} size="small" color="info" sx={{ ml: 1 }} />
                            {startup.tags.map((tag) => (
                                <Chip key={tag} label={tag} size="small" variant="outlined" sx={{ ml: 1 }} />
                            ))}
                        </Box>
                    </>
                }
            />
        </ListItem>
    );
};

export default StartupCard;