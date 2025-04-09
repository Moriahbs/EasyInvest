import React, { useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Box,
    Typography,
    CircularProgress,
} from "@mui/material";
import axios from "axios";
import { Startup } from "@/models/StartupModel.ts";
import config from "@/config.ts";
import StartupList from "./StartupList";

interface SmartSearchProps {
    isSearchOpen: boolean;
    handleCloseChat: () => void;
}

const SmartSearch: React.FC<SmartSearchProps> = ({ isSearchOpen, handleCloseChat }) => {
    const [userInput, setUserInput] = useState<string>("");
    const [filteredStartups, setFilteredStartups] = useState<Startup[]>([]);
    const [topMatches, setTopMatches] = useState<Startup[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [preferences, setPreferences] = useState<any>(null);

    const handleUserInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserInput(e.target.value);
    };

    const handleSendMessage = async () => {
        if (!userInput.trim()) return;
        setIsLoading(true);

        try {
            const response = await axios.post(`${config.SERVER_URL}/api/smartSearch/recommended`, {
                prompt: userInput,
            });
            setPreferences(response.data.preferences);
            setFilteredStartups(response.data.startups);
            setTopMatches(response.data.topMatches);
        } catch (error) {
            console.error("Error fetching investment recommendations:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isSearchOpen} onClose={handleCloseChat} maxWidth="md" fullWidth>
            <DialogTitle>AI Startup Investment Assistant</DialogTitle>
            <DialogContent>
                <Box sx={{ mb: 2 }}>
                    <Typography variant="body1">
                        Tell me about the tech startups you want to invest in (e.g., type of tech, funding stage, founded year, or valuation range).
                    </Typography>
                </Box>
                <TextField
                    fullWidth
                    label="Describe your investment preferences"
                    value={userInput}
                    onChange={handleUserInputChange}
                    disabled={isLoading}
                    multiline
                    rows={2}
                />
                {isLoading ? (
                    <Box sx={{ textAlign: "center", mt: 2 }}>
                        <CircularProgress />
                        <Typography variant="body2" color="textSecondary">
                            Thinking...
                        </Typography>
                    </Box>
                ) : (
                    <>
                        {preferences && (
                            <Box sx={{ mt: 2 }}>
                                <Typography variant="body2">
                                    Extracted Preferences:
                                    <br />Tags: {preferences.tags.join(", ") || "None"}
                                    <br />Funding Stages: {preferences.fundingStages.join(", ") || "Any"}
                                    <br />Founded Year: {preferences.minFoundedYear || preferences.maxFoundedYear
                                    ? `${preferences.minFoundedYear || "Any"} - ${preferences.maxFoundedYear || "Any"}`
                                    : "Any"}
                                    <br />Valuation: {preferences.minValuation || preferences.maxValuation
                                    ? `${preferences.minValuation || "Any"}M - ${preferences.maxValuation || "Any"}M`
                                    : "Any"}
                                </Typography>
                            </Box>
                        )}
                        <StartupList startups={filteredStartups} topMatches={topMatches} />
                    </>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCloseChat}>Close</Button>
                <Button onClick={handleSendMessage} disabled={isLoading || !userInput}>
                    Send
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default SmartSearch;

