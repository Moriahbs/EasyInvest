import React from 'react';
import StartupInfo from '@/components/ui/StartupInfo.tsx';
import { STARTUP_MOCK_DATA } from '@/models/StartupModel.ts';
import { Box } from '@mui/material';

const ExampleStartupWrapperPage: React.FC = () => {
    const startup = STARTUP_MOCK_DATA[0];

    return (
        <Box
            sx={{
                minHeight: '100vh',
                backgroundColor: '#f0f0f0',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                padding: 2,
                direction: 'rtl',
                fontFamily: "'Rubik', sans-serif",
            }}
        >
            <StartupInfo startup={startup} />
        </Box>
    );
};

export default ExampleStartupWrapperPage;