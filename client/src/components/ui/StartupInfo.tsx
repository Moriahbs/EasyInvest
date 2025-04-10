import React from 'react';
import { Startup } from '@/models/StartupModel.ts';
import {
    Card,
    CardContent,
    Typography,
    Chip,
    Grid,
    Box,
    Button,
    Avatar,
} from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

interface StartupInfoProps {
    startup: Startup;
}

const StartupInfo: React.FC<StartupInfoProps> = ({ startup }) => {
    const valuationInShekels = startup.valuationLastRound.toLocaleString('he-IL', {
        style: 'currency',
        currency: 'ILS',
        maximumFractionDigits: 0,
    });

    return (
        <Card
            sx={{
                maxWidth: 800,
                borderRadius: '16px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                backgroundColor: '#f5faff',
                padding: 4,
                direction: 'rtl',
                fontFamily: "'Rubik', sans-serif",
            }}
        >
            <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, flexDirection: 'row-reverse', gap: 8 }}>
                    <Avatar
                        src="/path-to-logo.png" //TODO
                        sx={{
                            width: 120,
                            height: 120,
                            ml: 2,
                            backgroundColor: '#1a2a44',
                            color: '#fff',
                        }}
                    >
                        לוגו
                    </Avatar>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1a2a44' }}>
                        {startup.companyName}
                    </Typography>
                </Box>

                <Typography
                    variant="body1"
                    sx={{
                        color: '#1a2a44',
                        mb: 3,
                        textAlign: 'right',
                        direction: 'rtl',
                        fontSize: '1.1rem',
                    }}
                >
                    {startup.description}
                </Typography>

                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3, justifyContent: 'flex-start' }}>
                    {startup.tags.map((tag, index) => (
                        <Chip
                            key={index}
                            label={tag}
                            sx={{
                                backgroundColor: '#e3f2fd',
                                color: '#1976d2',
                                fontSize: '0.85rem',
                                fontWeight: 'medium',
                                marginLeft: 1,
                            }}
                        />
                    ))}
                </Box>

                <Grid
                    container
                    spacing={2}
                    sx={{
                        textAlign: 'center',
                        mb: 3,
                        justifyContent: 'space-between',
                    }}
                >
                    <Grid item xs={4}>
                        <Box
                            sx={{
                                backgroundColor: '#fff',
                                borderRadius: '8px',
                                p: 2,
                                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
                                width: '100%',
                                height: '100px',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <Typography variant="caption" sx={{ color: '#666', fontSize: '0.9rem' }}>
                                שווי בסיבוב האחרון
                            </Typography>
                            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1a2a44', fontSize: '1.2rem' }}>
                                {valuationInShekels}
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={4}>
                        <Box
                            sx={{
                                backgroundColor: '#fff',
                                borderRadius: '8px',
                                p: 2,
                                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
                                width: '100%',
                                height: '100px',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <Typography variant="caption" sx={{ color: '#666', fontSize: '0.9rem' }}>
                                שנת הקמה
                            </Typography>
                            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1a2a44', fontSize: '1.2rem' }}>
                                {startup.foundedYear}
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={4}>
                        <Box
                            sx={{
                                backgroundColor: '#fff',
                                borderRadius: '8px',
                                p: 2,
                                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
                                width: '100%',
                                height: '100px',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <Typography variant="caption" sx={{ color: '#666', fontSize: '0.9rem' }}>
                                שלב מימון
                            </Typography>
                            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1a2a44', fontSize: '1.2rem' }}>
                                {startup.fundingStage}
                            </Typography>
                        </Box>
                    </Grid>
                </Grid>

                <Box sx={{ display: 'flex', justifyContent: 'flex-start', mt: 3 }}>
                    <Button
                        variant="contained"
                        sx={{
                            backgroundColor: '#6b48ff',
                            color: '#fff',
                            borderRadius: '50px',
                            padding: '8px 16px',
                            textTransform: 'none',
                            fontWeight: 'medium',
                            fontSize: '1rem',
                            '&:hover': {
                                backgroundColor: '#5a3de6',
                            },
                        }}
                        startIcon={<ArrowForwardIcon />}
                    >
                        לפרטים נוספים
                    </Button>
                </Box>
            </CardContent>
        </Card>
    );
};

export default StartupInfo;