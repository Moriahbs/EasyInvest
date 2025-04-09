
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
import config from "@/config.ts";

interface TopicsChatProps {
    isChatOpen: boolean;
    handleCloseChat: () => void;
}

const TopicsChat: React.FC<TopicsChatProps> = ({ isChatOpen, handleCloseChat }) => {
    const [userInput, setUserInput] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [aiResponse, setAiResponse] = useState<any>(null);

    const handleUserInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserInput(e.target.value);
    };

    const handleSendMessage = async () => {
        if (!userInput.trim()) return;
        setIsLoading(true);

        try {
            const response = await axios.post(`${config.SERVER_URL}/api/topics`, {
                prompt: userInput,
            });

            setAiResponse(response.data.aiResponse);
        } catch (error) {
            console.error("Error fetching investment recommendations:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isChatOpen} onClose={handleCloseChat} maxWidth="md" fullWidth>
            <DialogTitle>AI Topics</DialogTitle>
            <DialogContent>
                <Box sx={{ mb: 2 }}>
                    <Typography variant="body1">
                        Want to know new topics?
                    </Typography>
                    <Typography variant="body1">
                        Suggested Topics:
                    </Typography>
                    <Typography variant="body1">
                        Cloud, Quantum, Mobility, Agtech, Creator Economy, DevOps
                    </Typography>
                </Box>
                <TextField
                    fullWidth
                    label="Ask to know new topic"
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
                        {aiResponse && (
                            <Box sx={{ mt: 2 }}>
                                <Typography variant="body2">
                                    {aiResponse}
                                </Typography>
                            </Box>
                        )}
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

export default TopicsChat;